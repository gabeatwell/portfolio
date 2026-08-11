import {
    CapsuleGeometry,
    BufferGeometry,
    PointsMaterial,
    Points,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    CanvasTexture,
    BufferAttribute,
    AdditiveBlending,
    PointLight,
    Clock,
    TextureLoader,
    Texture,
} from 'three';
import type { Attachment } from 'svelte/attachments';

export const setupHeroCanvas: Attachment<HTMLCanvasElement> = (canvas) => {
    let animationFrameId: number | undefined;
    let renderer: WebGLRenderer | undefined;
    let geometry: CapsuleGeometry | undefined;
    let particlesGeometry: BufferGeometry | undefined;
    let material: PointsMaterial | undefined;
    let particlesMaterial: PointsMaterial | undefined;
    let star: Texture | undefined;
    let camera: PerspectiveCamera | undefined;
    let themeObserver: MutationObserver | undefined;
    let resizeListener: (() => void) | undefined;
    let mousemoveListener: ((event: MouseEvent) => void) | undefined;
    let visibilityListener: ((event: Event) => void) | undefined;
    let themeChangeListener: ((event: Event) => void) | undefined;
    const abortController = new AbortController();

    // helper function to convert CSS colors to RGB (strip alpha if present)
    const convertToRGB = (colorValue: string | null): string | null => {
        if (!colorValue) return null;
        try {
            const tempDiv = document.createElement('div');
            tempDiv.style.backgroundColor = colorValue;
            document.body.appendChild(tempDiv);
            const computedStyle = getComputedStyle(tempDiv);
            const computedColor = computedStyle.backgroundColor;
            document.body.removeChild(tempDiv);

            // if still not RGB, try with a canvas for better conversion
            if (
                computedColor.startsWith('oklab') ||
                computedColor === colorValue
            ) {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const ctx = canvas.getContext('2d');
                if (!ctx) return null;
                ctx.fillStyle = colorValue;
                ctx.fillRect(0, 0, 1, 1);
                const imageData = ctx.getImageData(0, 0, 1, 1);
                const rgb = imageData.data;
                return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            }

            // strip alpha from rgba to rgb for THREE.js compatibility
            const rgbaMatch = computedColor.match(
                /rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/,
            );
            if (rgbaMatch) {
                return `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
            }

            return computedColor;
        } catch (error) {
            console.error('Error converting color:', colorValue, error);
            return null;
        }
    };

    // color function
    function updateColors() {
        if (!material || !particlesMaterial) return;

        const bodyStyles = getComputedStyle(document.body);
        const htmlStyles = getComputedStyle(document.documentElement);
        const newStarColor = bodyStyles
            .getPropertyValue('--clr-pale-900')
            .trim();
        const grayColor = bodyStyles.getPropertyValue('--clr-gray-700').trim();

        // detect light mode
        const colorScheme =
            htmlStyles.colorScheme ||
            htmlStyles.getPropertyValue('color-scheme').trim();
        const isLightMode =
            colorScheme === 'light' || colorScheme.startsWith('light');

        let starConverted = null;
        let grayConverted = null;

        if (newStarColor && newStarColor.length > 0) {
            starConverted = convertToRGB(newStarColor);
        }
        if (grayColor && grayColor.length > 0) {
            grayConverted = convertToRGB(grayColor);
        }

        console.log('theme update', {
            isLightMode,
            grayColor,
            grayConverted,
            colorScheme,
        });

        const canvasElement = document.createElement('canvas');
        canvasElement.width = 64;
        canvasElement.height = 64;
        const ctx = canvasElement.getContext('2d');
        if (ctx) {
            ctx.fillStyle = starConverted || '#ff0000';
            ctx.beginPath();
            const spikes = 5;
            const outerRadius = 30;
            const innerRadius = 15;
            const centerX = 32;
            const centerY = 32;
            for (let i = 0; i < spikes * 2; i++) {
                const angle = (i * Math.PI) / spikes;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            star = new CanvasTexture(canvasElement);
            particlesMaterial.map = star!;
            particlesMaterial.alphaMap = null;
        } else {
            const textureLoader = new TextureLoader();
            star = textureLoader.load(
                'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/star.webp',
            );
            particlesMaterial.map = star!;
            particlesMaterial.alphaMap = null;
        }

        if (isLightMode) {
            material.color.set('#1a1a1a');
            material.size = 0.015;
        } else {
            const darkModeColor = '#f0f0f0';
            material.color.set(darkModeColor);
            material.size = 0.015;
        }

        particlesMaterial.color.set('#ffffff');
        material.needsUpdate = true;
        particlesMaterial.needsUpdate = true;
    }

    const deferInit = () => {
        if (!canvas) return;

        // scene
        const scene = new Scene();

        // objects
        geometry = new CapsuleGeometry(2, 0, 9, 20);

        particlesGeometry = new BufferGeometry();
        const isMobile = window.innerWidth <= 768;
        const particlesCount = isMobile ? 500 : 1000;
        const positionArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            positionArray[i] = (Math.random() - 0.5) * 5;
        }

        particlesGeometry.setAttribute(
            'position',
            new BufferAttribute(positionArray, 3),
        );

        material = new PointsMaterial({
            size: 0.015,
            color: '#c0c0c0',
        });

        particlesMaterial = new PointsMaterial({
            size: 0.04,
            transparent: true,
            alphaTest: 0.001,
            color: '#c0c0c0',
            blending: AdditiveBlending,
        });

        // Listen for theme changes
        themeObserver = new MutationObserver(updateColors);
        themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style', 'color-scheme'],
        });

        // listen for custom theme change events if your ThemeToggle dispatches them
        themeChangeListener = updateColors;
        document.addEventListener('theme-change', themeChangeListener, {
            signal: abortController.signal,
        });

        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        mediaQuery.addEventListener('change', updateColors, {
            signal: abortController.signal,
        });

        updateColors();

        // Mesh
        const sphere = new Points(geometry, material);
        const particlesMesh = new Points(particlesGeometry, particlesMaterial);
        scene.add(sphere, particlesMesh);

        // Lights
        const pointLight = new PointLight(0xffffff, 0.1);
        pointLight.position.set(2, 3, 4);
        scene.add(pointLight);

        /**
         * Sizes
         */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        resizeListener = () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            if (camera) {
                camera.aspect = sizes.width / sizes.height;
                camera.updateProjectionMatrix();
            }

            if (renderer) {
                renderer.setSize(sizes.width, sizes.height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }
        };
        window.addEventListener('resize', resizeListener, {
            signal: abortController.signal,
        });

        /**
         * Camera
         */
        // Base camera
        camera = new PerspectiveCamera(
            75,
            sizes.width / sizes.height,
            0.1,
            100,
        );
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 2;
        scene.add(camera);

        /**
         * Renderer
         */
        renderer = new WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: !isMobile,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Mouse
        mousemoveListener = animateParticles;
        document.addEventListener('mousemove', mousemoveListener, {
            signal: abortController.signal,
        });

        let mouseX = 0;
        let mouseY = 0;

        function animateParticles(event: MouseEvent) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        }

        /**
         * Animate
         */
        const clock = new Clock();
        let isAnimating = true;

        const tick = () => {
            if (!isAnimating) return;

            const elapsedTime = clock.getElapsedTime();

            sphere.rotation.y = -0.2 * elapsedTime;
            particlesMesh.rotation.y = -0.01 * elapsedTime;

            if (mouseX > 0) {
                particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.0000008);
                particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.0000008);
            }

            if (renderer && camera) {
                renderer.render(scene, camera);
            }

            animationFrameId = window.requestAnimationFrame(tick);
        };

        visibilityListener = () => {
            if (document.hidden) {
                isAnimating = false;
            } else {
                isAnimating = true;
                tick();
            }
        };

        document.addEventListener('visibilitychange', visibilityListener, {
            signal: abortController.signal,
        });

        tick();
    };

    // defer initialization
    if ('requestIdleCallback' in window) {
        requestIdleCallback(deferInit);
    } else {
        setTimeout(deferInit, 100);
    }

    return () => {
        if (animationFrameId) {
            window.cancelAnimationFrame(animationFrameId);
        }

        abortController.abort();

        if (themeObserver) {
            themeObserver.disconnect();
        }

        if (renderer) {
            renderer.dispose();
        }
        if (geometry) {
            geometry.dispose();
        }
        if (particlesGeometry) {
            particlesGeometry.dispose();
        }
        if (material) {
            material.dispose();
        }
        if (particlesMaterial) {
            particlesMaterial.dispose();
        }
        if (star) {
            star.dispose();
        }
    };
};
