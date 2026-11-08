import {
    AmbientLight,
    Group,
    Matrix4,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer,
} from 'three';
import {
    FontLoader,
    type Font,
} from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Attachment } from 'svelte/attachments';

const FONT_URL = '/fonts/Podkova_Regular.json';

export function setupTitleText(opts?: {
    text?: string;
}): Attachment<HTMLCanvasElement> {
    const text = opts?.text ?? 'Examples';

    return (canvas) => {
        let renderer: WebGLRenderer | undefined;
        let geometry: TextGeometry | undefined;
        let material: MeshStandardMaterial[] | undefined;
        let disposed = false;

        const scene = new Scene();
        const camera = new PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.set(0, 0, 8);

        scene.add(new AmbientLight(0xffffff, 1.2));
        const light = new PointLight(0xffffff, 60);
        light.position.set(2, 3, 6);
        scene.add(light);

        const group = new Group();
        scene.add(group);

        renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const setSize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            if (!w || !h || !renderer) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
        };
        setSize();

        const isSmall = canvas.clientWidth < 670;

        new FontLoader().load(FONT_URL, (font: Font) => {
            if (disposed) return;

            geometry = new TextGeometry(text, {
                font,
                size: 1,
                depth: 0.3, // `height` renamed to `depth` in three 0.16x
                curveSegments: isSmall ? 4 : 10,
                bevelEnabled: true,
                bevelThickness: 0.04,
                bevelSize: 0.03,
                bevelSegments: isSmall ? 2 : 4,
            });

            const shear = new Matrix4().set(
                1,
                0.25,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
            );
            geometry.applyMatrix4(shear);

            geometry.computeBoundingBox();
            const bb = geometry.boundingBox;
            if (!bb) return;

            geometry.translate(
                -(bb.max.x + bb.min.x) / 2,
                -(bb.max.y + bb.min.y) / 2,
                -(bb.max.z + bb.min.z) / 2,
            );
            const worldWidth = bb.max.x - bb.min.x;
            const worldHeight = bb.max.y - bb.min.y;

            const visH =
                2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
            const visW = visH * camera.aspect;

            group.scale.setScalar(
                Math.min(
                    (visW * 0.85) / worldWidth,
                    (visH * 0.7) / worldHeight,
                ),
            );

            const faceMat = new MeshStandardMaterial({
                color: 0x4a90e2, // front/back faces
                metalness: 0.4,
                roughness: 0.35,
            });
            const sideMat = new MeshStandardMaterial({
                color: 0x424242, // extruded sides + bevel
                metalness: 0.6,
                roughness: 0.25,
            });

            material = [faceMat, sideMat];

            group.add(new Mesh(geometry, material));
            setSize();
        });

        const ro = new ResizeObserver(setSize);
        ro.observe(canvas);

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        let t = 0;
        renderer.setAnimationLoop(() => {
            if (!reduce.matches) {
                t += 0.016;
                group.position.y = Math.sin(t) * 0.05;
            }
            renderer!.render(scene, camera);
        });

        return () => {
            disposed = true;
            ro.disconnect();
            renderer?.setAnimationLoop(null);
            geometry?.dispose();
            material?.forEach((m) => m.dispose());
            renderer?.dispose();
        };
    };
}
