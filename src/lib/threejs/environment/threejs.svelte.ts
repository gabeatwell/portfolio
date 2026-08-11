import type { Attachment } from 'svelte/attachments';
import { browser } from '$app/environment';
import {
    CubeTextureLoader,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2,
    Vector3,
    Plane,
    Raycaster,
    Group,
    CylinderGeometry,
    MeshStandardMaterial,
    Mesh,
    MathUtils,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export const setupEnvironment: Attachment<HTMLCanvasElement> = (canvas) => {
    let gui: GUI | undefined;

    if (!browser) return;

    gui = new GUI();
    gui.close();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = 'auto';
    gui.domElement.style.bottom = '0';
    gui.domElement.style.left = '0';

    const gltfLoader = new GLTFLoader();
    const cubeTextureLoader = new CubeTextureLoader();

    const scene = new Scene();

    /*
     * environment maps
     */
    const environmentMap = cubeTextureLoader.load([
        '/threejayess/environmentMaps/0/px.webp',
        '/threejayess/environmentMaps/0/nx.webp',
        '/threejayess/environmentMaps/0/py.webp',
        '/threejayess/environmentMaps/0/ny.webp',
        '/threejayess/environmentMaps/0/pz.webp',
        '/threejayess/environmentMaps/0/nz.webp',
    ]);
    scene.environment = environmentMap;
    scene.background = environmentMap;
    (scene as any).environmentIntensity = 3;

    gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001);
    gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001);

    let sizes = $state({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    let isMobile = $derived(sizes.width < 768);

    const camera = new PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100,
    );
    camera.position.set(5, 6, 5);
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.target.y = 3.5;
    controls.enableDamping = true;

    const renderer = new WebGLRenderer({
        canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // mouse tracking
    let mouse = $state({ x: 0, y: 0 });
    const raycaster = new Raycaster();
    const mouseVector = new Vector2();
    const plane = new Plane(new Vector3(0, 1, 0), -1.5);
    const intersection = new Vector3();

    const abortController = new AbortController();

    window.addEventListener(
        'mousemove',
        (event) => {
            if (isMobile) return;
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouseVector.set(mouse.x, mouse.y);
        },
        { signal: abortController.signal },
    );
    window.addEventListener(
        'click',
        (event) => {
            if (!isMobile) return;
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouseVector.set(mouse.x, mouse.y);
        },
        { signal: abortController.signal },
    );
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

    let gltfScene: Group | null = null;

    gltfLoader.load('/threejayess/models/waternoose.glb', (gltf) => {
        gltf.scene.scale.set(1.5, 1.5, 1.5);
        gltf.scene.position.set(0, 1.5, 0);
        gltfScene = gltf.scene;
        scene.add(gltf.scene);

        /*
         * Top hat
         */
        const hatGroup = new Group();

        // hat brim
        const brimGeometry = new CylinderGeometry(0.15, 0.15, 0.02, 16);
        const brimMaterial = new MeshStandardMaterial({ color: 0x000000 });
        const brim = new Mesh(brimGeometry, brimMaterial);
        brim.position.y = -0.05;
        hatGroup.add(brim);

        // white stripe
        const stripeGeometry = new CylinderGeometry(0.117, 0.11, 0.05, 16);
        const stripeMaterial = new MeshStandardMaterial({
            color: 0xffffff,
        });
        const stripe = new Mesh(stripeGeometry, stripeMaterial);
        stripe.position.y = 0;
        hatGroup.add(stripe);

        // hat crown
        const crownGeometry = new CylinderGeometry(0.1, 0.12, 0.2, 16);
        const crownMaterial = new MeshStandardMaterial({ color: 0x000000 });
        const crown = new Mesh(crownGeometry, crownMaterial);
        crown.position.y = 0.05;
        hatGroup.add(crown);

        // rotate hat to match hand angle
        hatGroup.position.set(0.05, 0.1, 0); // Adjust based on hand position
        hatGroup.rotation.z = Math.PI / 6;

        // add hat to hand
        const rightHand = gltf.scene.getObjectByName('Bip01_R_Hand_065');
        if (rightHand) {
            rightHand.add(hatGroup);

            hatGroup.position.set(-0.2, 1.5, 0);
            gltf.scene.add(hatGroup);
        }
    });

    let animationId: number;

    const tick = () => {
        controls.update();

        // follow cursor
        if (gltfScene) {
            raycaster.setFromCamera(mouseVector, camera);
            const intersects = raycaster.ray.intersectPlane(
                plane,
                intersection,
            );

            if (intersects) {
                gltfScene.position.x = MathUtils.lerp(
                    gltfScene.position.x,
                    intersection.x,
                    0.1,
                );
                gltfScene.position.z = MathUtils.lerp(
                    gltfScene.position.z,
                    intersection.z,
                    0.1,
                );
            }

            // model rotation to face the camera
            const direction = new Vector3(
                camera.position.x - gltfScene.position.x,
                0,
                camera.position.z - gltfScene.position.z,
            ).normalize();
            const angle = Math.atan2(direction.x, direction.z);
            gltfScene.rotation.y = angle;
        }

        renderer.render(scene, camera);

        animationId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
        if (animationId) window.cancelAnimationFrame(animationId);
        abortController.abort();
        controls.dispose();
        renderer.dispose();
        if (gui) gui.destroy();
        if (environmentMap) environmentMap.dispose();

        // dispose GLTF scene
        if (gltfScene) {
            gltfScene.traverse((child) => {
                if (child instanceof Mesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat) => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            scene.remove(gltfScene);
        }

        // clear scene
        while (scene.children.length > 0) {
            const child = scene.children[0];
            if (child instanceof Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
            scene.remove(child);
        }
    };
};
