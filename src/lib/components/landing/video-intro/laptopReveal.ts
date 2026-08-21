import { gsap } from '$lib/data/gsap';
import {
    AmbientLight,
    Box3,
    Color,
    DirectionalLight,
    DoubleSide,
    Group,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    SRGBColorSpace,
    TextureLoader,
    Vector3,
    WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export function laptopScene(
    node: HTMLElement,
    onComplete: () => void,
    imageUrl: string,
) {
    // three.js
    const scene = new Scene();
    scene.background = new Color(0x1d1d1d);

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

    renderer.domElement.addEventListener('webglcontextrestored', () => {
        contextLost = false;
        // Three.js re-uploads programs/textures automatically on the next render
        renderer.setSize(node.clientWidth, node.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        animate();
    });

    renderer.setSize(node.clientWidth, node.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    node.appendChild(renderer.domElement);

    // Screen content as a WebGL texture (no CSS3D needed for a static image)
    const screenTexture = new TextureLoader().load(imageUrl);
    screenTexture.colorSpace = SRGBColorSpace;
    screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

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
    let laptop!: Group;

    function getModelScale() {
        const baseWidth = 1920;
        return Math.max(0.5, window.innerWidth / baseWidth);
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

    loader.load('/threejayess/models/laptop.glb', (gltf) => {
        laptop = gltf.scene;
        scene.add(laptop);
        laptop.scale.setScalar(getModelScale());

        const screen = findScreenMesh(laptop);
        if (screen) {
            screen.material = new MeshBasicMaterial({
                map: screenTexture,
                side: DoubleSide,
            });
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
    }
    animate();

    // resize
    function onResize() {
        const width = node.clientWidth;
        const height = node.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        if (laptop) {
            laptop.scale.setScalar(getModelScale());
        }
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
