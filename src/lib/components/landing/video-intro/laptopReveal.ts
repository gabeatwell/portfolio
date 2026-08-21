import { gsap } from '$lib/data/gsap';
import {
    AmbientLight,
    Box3,
    Color,
    DirectionalLight,
    Group,
    Mesh,
    PerspectiveCamera,
    Scene,
    SRGBColorSpace,
    Vector3,
    WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
    CSS3DRenderer,
    CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';

export function laptopScene(node: HTMLElement, onComplete: () => void) {
    const screenContent = node.querySelector('.screen-content') as HTMLElement;

    if (!screenContent) {
        console.error('No .screen-content found');
        return;
    }

    // three.js
    const scene = new Scene();
    scene.background = new Color(0xf0f0f0);

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
    renderer.domElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        contextLost = true;
        cancelAnimationFrame(rafId);
    });

    renderer.setSize(node.clientWidth, node.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    node.appendChild(renderer.domElement);

    // CSS3D for the real HTML content on the screen
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(node.clientWidth, node.clientHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0';
    cssRenderer.domElement.style.left = '0';
    cssRenderer.domElement.style.pointerEvents = 'none';
    node.appendChild(cssRenderer.domElement);

    // lights
    const ambient = new AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 8, 6);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
        'https://www.gstatic.com/draco/versioned/decoders/1.5.7/',
    );

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let ctx: gsap.Context;
    let cssObject: CSS3DObject;
    let laptop!: Group;

    let scale = 0.0029;

    function getModelScale() {
        const baseWidth = 1920;
        return Math.max(0.5, window.innerWidth / baseWidth);
    }

    loader.load('/threejayess/models/laptop.glb', (gltf) => {
        laptop = gltf.scene;
        scene.add(laptop);
        laptop.scale.setScalar(getModelScale());

        let screen: Mesh | undefined;

        laptop.traverse((obj) => {
            if ((obj as Mesh).isMesh && obj.id === 25) {
                screen = obj as Mesh;
            }
        });

        cssObject = new CSS3DObject(screenContent);

        if (screen) {
            screen.visible = false;
            screen.updateWorldMatrix(true, false);

            const box = new Box3().setFromObject(screen);
            const center = box.getCenter(new Vector3());
            const size = box.getSize(new Vector3());

            scale = Math.max(size.x / 1280, size.y / 800);

            cssObject.position.copy(center);
            cssObject.lookAt(camera.position);
            cssObject.translateZ(0.001);

            cssObject.scale.set(scale, scale, 0.001);
        }

        scene.add(cssObject);

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
                    scrub: 0.7,
                    pin: true,
                    anticipatePin: 1,
                    onLeave: () => {
                        gsap.set(node, {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 100,
                        });

                        onComplete();
                    },
                },
            });

            // zoom
            tl.to(
                camera.position,
                {
                    z: 3.2,
                    y: 1.4,
                    x: 0,
                    ease: 'power2.inOut',
                    duration: 0.35,
                },
                '-=0.15',
            );
        }, node);
    }

    // render loop
    let rafId = 0;
    function animate() {
        if (contextLost) return;
        rafId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
        cssRenderer.render(scene, camera);
    }
    animate();

    // resize
    function onResize() {
        const width = node.clientWidth;
        const height = node.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        cssRenderer.setSize(width, height);

        laptop.scale.setScalar(getModelScale());
    }
    window.addEventListener('resize', onResize);

    // cleanup
    return () => {
        window.removeEventListener('resize', onResize);
        ctx?.revert();
        renderer.dispose();
        renderer.forceContextLoss(); // ← add this
        renderer.domElement.remove();
    };
}
