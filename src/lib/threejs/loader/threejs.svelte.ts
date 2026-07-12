import {
    LoadingManager,
    Group,
    CubeTexture,
    CubeTextureLoader,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    Vector3,
    ReinhardToneMapping,
    PCFSoftShadowMap,
    Mesh,
    MeshStandardMaterial,
    SRGBColorSpace,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from '$lib/data/gsap';

export function setupLoader(canvas: HTMLCanvasElement) {
    let _loadingComplete = $state<boolean>(false);

    /**
     * Loaders
     */
    const loadingBarElement = document.querySelector(
        '.loading-bar',
    ) as HTMLElement;
    const loadingManager = new LoadingManager(
        // loaded
        () => {
            gsap.delayedCall(0.5, () => {
                document.body.classList.add('loading-complete');
                loadingBarElement.style.transform = 'translateX(100%)';

                gsap.delayedCall(0.5, () => {
                    loadingBarElement.style.display = 'none';
                    _loadingComplete = true;
                });
            });
        },
        // progress
        (itemUrl, itemsLoaded, itemsTotal) => {
            const progressRatio = itemsLoaded / itemsTotal;
            loadingBarElement.style.transform = `scaleX(${progressRatio})`;
        },
    );
    const gltfLoader = new GLTFLoader(loadingManager);
    const cubeTextureLoader = new CubeTextureLoader(loadingManager);

    const debugObject: { envMapIntensity: number } = {
        envMapIntensity: 2.5,
    };

    if (!canvas) {
        throw new Error('Canvas element not found');
    }

    const scene = new Scene();

    // cleanup references
    let model = $state<Group | null>(null);
    let environmentMap = $state<CubeTexture | null>(null);

    const updateAllMaterials = () => {
        scene.traverse((child) => {
            if (
                child instanceof Mesh &&
                child.material instanceof MeshStandardMaterial
            ) {
                // child.material.envMap = environmentMap;
                child.material.envMapIntensity = debugObject.envMapIntensity;
                child.material.needsUpdate = true;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    };

    const envMap = cubeTextureLoader.load(
        [
            '/threejayess/environmentMaps/2/px.webp',
            '/threejayess/environmentMaps/2/nx.webp',
            '/threejayess/environmentMaps/2/py.webp',
            '/threejayess/environmentMaps/2/ny.webp',
            '/threejayess/environmentMaps/2/pz.webp',
            '/threejayess/environmentMaps/2/nz.webp',
        ],
        () => {
            // success — textures loaded
            envMap.colorSpace = SRGBColorSpace;
            scene.background = envMap;
            scene.environment = envMap;
        },
        undefined,
        () => console.warn('Failed to load environment map'),
    );

    environmentMap = envMap;

    gltfLoader.load('/threejayess/models/shark.glb', (gltf) => {
        gltf.scene.scale.set(0.5, 0.5, 0.25);
        gltf.scene.position.set(0, 0.1, 0);
        gltf.scene.rotation.y = Math.PI * -0.3;
        scene.add(gltf.scene);

        updateAllMaterials();
    });

    const points = [
        {
            position: new Vector3(1.05, 0.3, -0.195),
            element: document.querySelector('.point-0') as HTMLElement,
        },
    ];

    const directionalLight = new DirectionalLight('#ffffff', 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(0.25, 3, -2.25);
    scene.add(directionalLight);

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const abortController = new AbortController();

    window.addEventListener(
        'resize',
        () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        },
        { signal: abortController.signal },
    );

    const camera = new PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100,
    );
    camera.position.set(4, 1, -4);
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const renderer = new WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });
    renderer.toneMapping = ReinhardToneMapping;
    renderer.toneMappingExposure = 3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let animationId: number;

    const tick = () => {
        controls.update();

        // go through each point
        for (const point of points) {
            const screenPosition = point.position.clone();
            screenPosition.project(camera);

            let translateX = screenPosition.x * sizes.width * 0.5;
            let translateY = -screenPosition.y * sizes.height * 0.5;

            point.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }

        renderer.render(scene, camera);

        animationId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
        abortController.abort();

        gsap.killTweensOf('*');

        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        if (model) {
            model.traverse((child) => {
                if (child instanceof Mesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat) => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }

        if (environmentMap) {
            environmentMap.dispose();
        }

        controls.dispose();
        renderer.dispose();
        scene.clear();
    };
}
