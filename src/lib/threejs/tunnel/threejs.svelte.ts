import type { Attachment } from 'svelte/attachments';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Mesh,
    Color,
    Vector3,
    Clock,
    BackSide,
    MeshStandardMaterial,
    PointLight,
    Quaternion,
    BufferAttribute,
    CylinderGeometry,
} from 'three';

export const setupTunnel: Attachment<HTMLCanvasElement> = (canvas) => {
    if (!canvas) return;

    let animationFrameId: number | undefined;

    const abortController = new AbortController();
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;
    const scene = new Scene();
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    const renderer = new WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
        powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // lights
    const pointLight = new PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    camera.position.z = 2;

    // tunnel geometry
    const tunnelLength = 100;
    const tunnelRadius = 0.75;
    const tunnelSide = 3;
    const tunnelGeometry = new CylinderGeometry(
        tunnelRadius,
        tunnelRadius,
        tunnelLength,
        tunnelSide,
        100,
        true,
    );
    tunnelGeometry.rotateX(Math.PI / 2);
    const tunnelMaterial = new MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
        side: BackSide,
    });
    const tunnelMesh = new Mesh(tunnelGeometry, tunnelMaterial);
    scene.add(tunnelMesh);

    // quaternion rotation for the tunnel
    const positionAttribute = tunnelGeometry.attributes.position;
    const count = positionAttribute.count;
    const q = new Quaternion();
    const twistAxis = new Vector3(0, 0, 1);
    let twistAmount = 0.15;
    const vertex = new Vector3();
    const tunnelColors = new Float32Array(count * 3);
    const color = new Color();
    const clock = new Clock();

    // color controls
    const BASE_HUE = 0.56;
    const HUE_SPREAD = 0.02;
    const SATURATION = 0;
    const LIGHTNESS = 0.086;

    for (let i = 0; i < count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        const angle = vertex.z * twistAmount;
        q.setFromAxisAngle(twistAxis, angle);
        vertex.applyQuaternion(q);
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);

        const hue = (BASE_HUE + vertex.z * HUE_SPREAD) % 1;
        color.setHSL(hue, SATURATION, LIGHTNESS);
        tunnelColors[i * 3 + 0] = color.r;
        tunnelColors[i * 3 + 1] = color.g;
        tunnelColors[i * 3 + 2] = color.b;
    }

    tunnelGeometry.setAttribute('color', new BufferAttribute(tunnelColors, 3));
    tunnelMaterial.vertexColors = true;

    let speed = prefersReducedMotion ? 0 : -0.005;

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize, {
        signal: abortController.signal,
    });

    function tick() {
        if (abortController.signal.aborted) return;

        const elapsedTime = clock.getElapsedTime();

        // update tunnel animation
        tunnelMesh.position.z += speed;
        tunnelMesh.position.z =
            ((tunnelMesh.position.z + tunnelLength / 2) % tunnelLength) -
            tunnelLength / 2;

        twistAmount = 0.15 + Math.sin(elapsedTime * 0.5) * 0.05;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(tick);
    }
    tick();

    return () => {
        abortController.abort();
        if (animationFrameId !== undefined)
            cancelAnimationFrame(animationFrameId);
        scene.remove(tunnelMesh, pointLight);
        tunnelGeometry.dispose();
        tunnelMaterial.dispose();
        renderer.renderLists.dispose();
        renderer.forceContextLoss();
        renderer.dispose();
    };
};
