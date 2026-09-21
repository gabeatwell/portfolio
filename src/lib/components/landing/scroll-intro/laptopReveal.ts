import { gsap } from '$lib/data/gsap';
import {
    AmbientLight,
    Box3,
    DirectionalLight,
    DoubleSide,
    Fog,
    Group,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    SRGBColorSpace,
    TextureLoader,
    Vector3,
    WebGLRenderer,
    IcosahedronGeometry,
    OctahedronGeometry,
    TetrahedronGeometry,
    MeshStandardMaterial,
    Sphere,
    Color,
    Vector2,
    BackSide,
    RectAreaLight,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init();

export function laptopScene(
    node: HTMLElement,
    onComplete: () => void,
    imageUrl: string,
) {
    const controller = new AbortController();
    const isMobile = window.matchMedia('(max-width: 768px)');

    let laptop!: Group;
    let laptopTopY = 0;
    let exclusion = { center: new Vector3(), radius: 0 };

    // three.js
    const scene = new Scene();
    scene.background = null;
    scene.fog = new Fog(0x1d1d1d, 6, 15);

    const camera = new PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        100,
    );
    camera.position.set(0, 1.8, 7);

    let renderer: WebGLRenderer;
    try {
        renderer = new WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
        console.error('WebGL not supported', e);
        return;
    }

    let contextLost = false;
    renderer.domElement.addEventListener(
        'webglcontextlost',
        (e) => {
            e.preventDefault();
            contextLost = true;
            cancelAnimationFrame(rafId);
        },
        { signal: controller.signal },
    );

    renderer.domElement.addEventListener(
        'webglcontextrestored',
        () => {
            contextLost = false;
            renderer.setSize(node.clientWidth, node.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            animate();
        },
        { signal: controller.signal },
    );

    renderer.setSize(node.clientWidth, node.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    node.appendChild(renderer.domElement);

    renderer.domElement.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
    `;

    const vignette = document.createElement('div');
    vignette.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        box-shadow: inset 0 0 120px 40px rgba(0, 0, 0, 0.75);
        z-index: 2;
    `;
    node.appendChild(vignette);

    // content as a WebGL texture (no CSS3D needed for a static image)
    const screenTexture = new TextureLoader().load(imageUrl);
    screenTexture.colorSpace = SRGBColorSpace;
    screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // lights
    const ambient = new AmbientLight(0xffffff, 0.12);
    scene.add(ambient);
    const dirLight = new DirectionalLight(0xffffff, 0.25);
    dirLight.position.set(5, 8, 6);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // background shapes
    const shapes: Mesh[] = [];
    const mouse = new Vector2(0, 0);
    const shapeGeos = [
        new IcosahedronGeometry(0.55, 1),
        new OctahedronGeometry(0.5),
        new TetrahedronGeometry(0.6),
        new IcosahedronGeometry(0.4, 0),
    ];
    const outlineMat = new MeshBasicMaterial({
        color: 0x000000,
        side: BackSide,
    });

    shapeGeos.forEach((geo, i) => {
        const mat = new MeshStandardMaterial({
            color: new Color('#60bbcc'),
            roughness: 0.45,
            metalness: 0.15,
            transparent: true,
            opacity: 0.82,
        });
        const mesh = new Mesh(geo, mat);

        // random size
        const scale = 0.55 + Math.random() * 0.9;
        mesh.scale.setScalar(scale);

        geo.computeBoundingSphere();
        const thickness = 0.04;
        const radius = (geo.boundingSphere?.radius ?? 0.6) * scale;

        // inverted-hull outline — after radius exists
        const hull = new Mesh(geo, outlineMat);
        hull.scale.setScalar(1 + thickness / radius);
        mesh.add(hull);

        mesh.userData = {
            basePos: mesh.position.clone(),
            velocity: new Vector3(),
            radius,
        };

        scene.add(mesh);
        shapes.push(mesh);
    });

    // model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
        'https://www.gstatic.com/draco/versioned/decoders/1.5.7/',
    );

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let ctx: gsap.Context;

    function getModelScale() {
        const baseWidth = 1920;
        return Math.max(0.5, window.innerWidth / baseWidth);
    }

    function applyScale() {
        if (!laptop) return;

        const s = getModelScale();
        laptop.scale.setScalar(s);

        if (isMobile.matches) {
            laptop.position.y = laptopTopY * (0.55 - s);
            laptop.position.z = 1.2;
        } else {
            laptop.position.y = laptopTopY * (0.95 - s);
            laptop.position.z = 0;
        }

        updateExclusion();
    }

    function updateExclusion() {
        if (!laptop) return;
        const s = new Box3()
            .setFromObject(laptop)
            .getBoundingSphere(new Sphere());
        exclusion.center.copy(s.center);
        exclusion.radius = s.radius * 1.08;
    }

    function screenBounds(z: number, camZ: number, camY: number) {
        const dist = camZ - z;
        const h = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * dist;
        const w = h * camera.aspect;
        return {
            minX: -w / 2,
            maxX: w / 2,
            minY: camY - h / 2,
            maxY: camY + h / 2,
        };
    }

    function randomSpot(z: number, margin: number, camZ: number, camY: number) {
        const b = screenBounds(z, camZ, camY);
        const min = exclusion.radius + margin;
        for (let i = 0; i < 24; i++) {
            const p = new Vector3(
                b.minX + Math.random() * (b.maxX - b.minX),
                b.minY + Math.random() * (b.maxY - b.minY),
                z,
            );
            if (p.distanceTo(exclusion.center) > min) return p;
        }
        // fallback: any direction just outside the sphere
        const dir = new Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            0,
        ).normalize();
        return exclusion.center.clone().addScaledVector(dir, min + 0.1);
    }

    function findScreenMesh(root: Group): Mesh | undefined {
        let best: Mesh | undefined;
        let bestScore = Infinity;

        root.traverse((obj) => {
            if (!(obj as Mesh).isMesh) return;
            const mesh = obj as Mesh;

            const box = new Box3().setFromObject(mesh);
            const size = box.getSize(new Vector3());
            const dims = [size.x, size.y, size.z].sort((a, b) => b - a);
            const [longest, middle, shortest] = dims;

            // must be a flat plane (one dimension much smaller)
            if (middle <= 0 || shortest / middle > 0.15) return;

            const aspect = longest / middle;
            const score = Math.abs(aspect - 1280 / 800);
            if (score < bestScore) {
                bestScore = score;
                best = mesh;
            }
        });

        return best;
    }

    let screenLight: RectAreaLight | undefined;

    loader.load('/threejayess/models/laptop.glb', (gltf) => {
        laptop = gltf.scene;
        scene.add(laptop);

        const box = new Box3().setFromObject(laptop);
        laptopTopY = box.max.y;
        applyScale();

        // scatter shapes
        shapes.forEach((mesh) => {
            const z = -1.5 + Math.random() * 2.5;
            mesh.position.copy(
                randomSpot(z, mesh.userData.radius + 0.15, 7, 1.8),
            );
            mesh.userData.basePos.copy(mesh.position);
        });

        const screen = findScreenMesh(laptop);
        if (screen) {
            screen.material = new MeshBasicMaterial({
                map: screenTexture,
                side: DoubleSide,
            });

            // light
            const screenBox = new Box3().setFromObject(screen);
            const size = screenBox.getSize(new Vector3());
            const worldScale = screen.getWorldScale(new Vector3());

            const rect = new RectAreaLight(
                0xcfe0ff,
                8, // RectAreaLight intensity is in nits — expect to tune 2–50
                size.x / worldScale.x,
                size.y / worldScale.y,
            );
            screen.add(rect);
            rect.lookAt(camera.position); // aim out of the panel at rest

            screenLight = rect;
        } else {
            console.warn('LaptopIntro: screen mesh not found');
        }

        setupAnimation();
    });

    // gsap
    function setupAnimation() {
        ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: node,
                    start: 'top top',
                    end: '+=400%',
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    onLeave: () => {
                        onComplete();
                    },
                },
            });

            // zoom
            tl.to(
                camera.position,
                {
                    z: 5,
                    y: 1.4,
                    x: 0,
                    ease: 'power2.inOut',
                    duration: 0.35,
                },
                '-=0.15',
            );

            // rotate
            tl.to(
                laptop.rotation,
                {
                    x: -Math.PI * 2,
                    y: Math.PI * 2,
                    ease: 'power2.inOut',
                    duration: 1,
                },
                0,
            );

            // slow movement during the scroll
            shapes.forEach((mesh, i) => {
                const z = -1.5 + Math.random() * 2.5;
                const target = randomSpot(
                    z,
                    mesh.userData.radius + 0.15,
                    5,
                    1.4,
                );

                tl.to(
                    mesh.position,
                    {
                        x: target.x, // ← not finalX
                        y: target.y, // ← not finalY
                        z: target.z,
                        ease: 'power2.inOut',
                        duration: 1,
                    },
                    0.25 + i * 0.07,
                );
            });

            if (screenLight) {
                gsap.to(screenLight, {
                    intensity: 15,
                    duration: 2,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut',
                });
            }
        }, node);
    }

    function updateShapes() {
        const vector = new Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const dist = (0 - camera.position.z) / dir.z;
        const mouseWorld = camera.position
            .clone()
            .add(dir.multiplyScalar(dist));

        shapes.forEach((mesh) => {
            const data = mesh.userData;
            const toMouse = mouseWorld.clone().sub(mesh.position);
            const d = toMouse.length();

            let force = 0;
            if (d > 2.8) force = 0.0007;
            else if (d < 1.15) force = -0.0022; // soft repulsion

            if (force !== 0) {
                data.velocity.add(toMouse.normalize().multiplyScalar(force));
            }

            // Heavy damping = slow, weighty movement (anti-floaty)
            data.velocity.multiplyScalar(0.91);
            mesh.position.add(data.velocity);
            mesh.rotation.x += data.velocity.y * 0.25;
            mesh.rotation.y += data.velocity.x * 0.25;

            // keep outside of laptop bounding box
            const out = mesh.position.clone().sub(exclusion.center);
            const outDist = out.length();
            const minD = exclusion.radius + (data.radius ?? 0) + 0.15;

            if (outDist < minD) {
                if (outDist < 1e-4) out.set(1, 0, 0);
                else out.normalize();
                mesh.position.copy(exclusion.center).addScaledVector(out, minD);
                const inward = data.velocity.dot(out);
                if (inward < 0) data.velocity.addScaledVector(out, -inward);
            }
        });
    }

    // render loop
    let rafId = 0;
    function animate() {
        if (contextLost) return;
        rafId = requestAnimationFrame(animate);

        updateShapes();
        renderer.render(scene, camera);
    }
    controller.signal.addEventListener('abort', () => {
        cancelAnimationFrame(rafId);
    });
    animate();

    // resize
    function onResize() {
        const width = node.clientWidth;
        const height = node.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        if (laptop) {
            applyScale();
        }
    }
    window.addEventListener('resize', onResize, { signal: controller.signal });

    // mobile spacing
    function updateMobileCamera() {
        if (isMobile.matches) {
            camera.position.y = 1.3;
        } else {
            camera.position.y = 1.7;
        }
        camera.updateProjectionMatrix();
    }
    updateMobileCamera();
    isMobile.addEventListener('change', updateMobileCamera, {
        signal: controller.signal,
    });

    // mouse event listener
    function onPointerMove(e: PointerEvent) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener('pointermove', onPointerMove, {
        signal: controller.signal,
    });

    // cleanup
    return () => {
        controller.abort();
        ctx?.revert();
        cancelAnimationFrame(rafId);

        shapeGeos.forEach((g) => g.dispose());
        shapes.forEach((m) => (m.material as MeshStandardMaterial).dispose());
        outlineMat.dispose();
        screenTexture.dispose();
        laptop?.traverse((obj) => {
            const mesh = obj as Mesh;
            if (mesh.isMesh) {
                mesh.geometry.dispose();
                const mats = Array.isArray(mesh.material)
                    ? mesh.material
                    : [mesh.material];
                mats.forEach((m) => m.dispose());
            }
        });
        dracoLoader.dispose();
        renderer.dispose();
        renderer.forceContextLoss(); // ← add this
        renderer.domElement.remove();
    };
}
