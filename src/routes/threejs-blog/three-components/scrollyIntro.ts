import {
    AmbientLight,
    Color,
    Group,
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
import { gsap } from '#lib/data/gsap';

const FONT_URL =
    'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/fonts/helvetiker_bold.typeface.json';

export const setupScrollyIntro: Attachment<HTMLCanvasElement> = (canvas) => {
    const section = canvas.closest('.scrolly');
    if (!section) return () => {};

    let geometry: TextGeometry | undefined;
    let material: MeshStandardMaterial | undefined;
    let disposed = false;

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    scene.add(new AmbientLight(0xffffff, 1.1));
    const light = new PointLight(0xffffff, 80);
    light.position.set(2, 3, 6);
    scene.add(light);

    const textGroup = new Group();
    scene.add(textGroup);

    const renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const colorA = new Color(0x44aaff);
    const colorB = new Color(0xff44aa);
    const tmp = new Color();

    // the only thing gsap touches
    const state = { camZ: 8, rotY: 0, mix: 0 };

    new FontLoader().load(FONT_URL, (font: Font) => {
        if (disposed) return;

        geometry = new TextGeometry('SCROLL', {
            font,
            size: 1.1,
            depth: 0.4,
            curveSegments: 8,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.03,
            bevelSegments: 4,
        });
        geometry.computeBoundingBox();
        const bb = geometry.boundingBox!;
        // center on origin so rotation spins in place
        geometry.translate(
            -(bb.max.x + bb.min.x) / 2,
            -(bb.max.y + bb.min.y) / 2,
            -(bb.max.z + bb.min.z) / 2,
        );

        material = new MeshStandardMaterial({
            color: colorA.clone(),
            metalness: 0.4,
            roughness: 0.35,
        });
        textGroup.add(new Mesh(geometry, material));
    });

    const tween = gsap.to(state, {
        camZ: 2,
        rotY: Math.PI * 2,
        mix: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
        },
    });

    const setSize = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    };
    setSize();
    window.addEventListener('resize', setSize);

    renderer.setAnimationLoop(() => {
        camera.position.z = state.camZ;
        textGroup.rotation.y = state.rotY;
        if (material)
            material.color.copy(tmp.lerpColors(colorA, colorB, state.mix));
        renderer.render(scene, camera);
    });

    // reduced motion
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
        tween.scrollTrigger?.disable(false, false);
        Object.assign(state, { camZ: 4, royY: 0, mix: 0.5 });
        return () => tween.scrollTrigger?.enable(false, false);
    });

    // cleanup
    return () => {
        disposed = true;
        mm.revert();
        tween.scrollTrigger?.kill();
        tween.kill();

        window.removeEventListener('resize', setSize);
        renderer.setAnimationLoop(null);
        geometry?.dispose();
        material?.dispose();
        renderer.dispose();
    };
};
