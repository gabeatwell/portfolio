import {
    AmbientLight,
    BoxGeometry,
    BufferGeometry,
    Color,
    ConeGeometry,
    DirectionalLight,
    Float32BufferAttribute,
    Group,
    IcosahedronGeometry,
    Mesh,
    MeshStandardMaterial,
    OctahedronGeometry,
    PerspectiveCamera,
    PointLight,
    Points,
    PointsMaterial,
    Scene,
    SphereGeometry,
    TorusGeometry,
    WebGLRenderer,
} from 'three';
import type { Attachment } from 'svelte/attachments';
import { gsap } from '#lib/data/gsap';

type ScrollyIntroOptions = { oncomplete?: () => void };

const PALETTE = [0x4a90e2, 0xffd66b, 0x7b5cff, 0x57c184, 0xff9b7a, 0x4de1e1];

interface OrbitSpec {
    geometry: () => BufferGeometry;
    color: number;
    radius: number;
    height: number;
}

// one primitive per "example" - factories so every mount owns its geometry
const ORBITS: OrbitSpec[] = [
    {
        geometry: () => new IcosahedronGeometry(0.94, 0),
        color: PALETTE[0],
        radius: 1.5,
        height: 0.48,
    },
    {
        geometry: () => new BoxGeometry(1.16, 0.46, 0.46),
        color: PALETTE[1],
        radius: 1.8,
        height: -0.02,
    },
    {
        geometry: () => new TorusGeometry(0.87, 0.24, 12, 40),
        color: PALETTE[2],
        radius: 2.1,
        height: 0.34,
    },
    {
        geometry: () => new OctahedronGeometry(0.726, 0),
        color: PALETTE[3],
        radius: 2.4,
        height: -0.13,
    },
    {
        geometry: () => new ConeGeometry(0.728, 0.54, 5),
        color: PALETTE[4],
        radius: 2.7,
        height: 0.64,
    },
    {
        geometry: () => new SphereGeometry(1.25, 24, 16),
        color: PALETTE[5],
        radius: 3.0,
        height: -0.008,
    },
];

export const setupScrollyIntro =
    (options: ScrollyIntroOptions = {}): Attachment<HTMLCanvasElement> =>
    (canvas) =>
        initScrollyIntro(canvas, options);

function initScrollyIntro(
    canvas: HTMLCanvasElement,
    { oncomplete }: ScrollyIntroOptions,
) {
    const section = canvas.closest('.scrolly');
    if (!section) return () => {};

    let disposed = false;
    // pushed back on narrow viewports so the whole orbit stays in frame
    let fit = 1;

    const scene = new Scene();
    const camera = new PerspectiveCamera(55, 1, 0.1, 100);

    const renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // lights
    scene.add(new AmbientLight(0xffffff, 0.55));

    const key = new DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 6);
    scene.add(key);

    const rim = new PointLight(PALETTE[2], 40);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    // the thing everything orbits
    const coreGeometry = new IcosahedronGeometry(0.45, 1);
    const coreMaterial = new MeshStandardMaterial({
        color: 0xffffff,
        emissive: new Color(PALETTE[0]),
        emissiveIntensity: 0.35,
        metalness: 0.6,
        roughness: 0.15,
        flatShading: true,
    });
    const core = new Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // orbiting primitives
    const spacing = 1.0;
    const orbit = new Group();
    scene.add(orbit);

    const orbits = ORBITS.map((spec, i) => {
        const geometry = spec.geometry();
        const material = new MeshStandardMaterial({
            color: spec.color,
            metalness: 0.35,
            roughness: 0.35,
            flatShading: true,
        });
        const mesh = new Mesh(geometry, material);
        const angle = (i / ORBITS.length) * Math.PI * 2;
        const core_gap = 0.2;
        const radius = spec.radius * (spacing + core_gap);

        mesh.position.set(
            Math.cos(angle) * radius,
            spec.height * spacing,
            Math.sin(angle) * radius,
        );
        mesh.scale.setScalar(0);
        orbit.add(mesh);
        return { mesh, geometry, material };
    });

    // starfield
    const starCount = 320;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        const r = (7 + Math.random() * 9) * spacing;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = r * Math.cos(phi);
        starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeometry = new BufferGeometry();
    starGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(starPositions, 3),
    );
    const starMaterial = new PointsMaterial({
        color: 0xffffff,
        size: 0.06,
        transparent: true,
        opacity: 0,
        depthWrite: false,
    });
    scene.add(new Points(starGeometry, starMaterial));

    // the only thing gsap touches for the camera; `fit` is applied per frame
    const view = { z: 9.5 * spacing, y: 0.5 * spacing };

    const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onLeave: () => oncomplete?.(),
        },
    });

    // camera drifts in over the whole sequence
    tl.to(
        view,
        { z: 6.4 * spacing, y: 1.4 * spacing, duration: 1, ease: 'none' },
        0,
    );

    // core settles, then keeps turning
    tl.fromTo(
        core.scale,
        { x: 0.6, y: 0.6, z: 0.6 },
        { x: 1, y: 1, z: 1, duration: 0.4 },
        0,
    );
    tl.to(
        core.rotation,
        { y: Math.PI * 1.5, x: Math.PI * 0.25, duration: 1, ease: 'none' },
        0,
    );

    // the system tilts toward the viewer as the ring turns
    tl.fromTo(
        orbit.rotation,
        { x: -0.55, z: -0.18 },
        { x: -0.35, z: 0.12, duration: 1 },
        0,
    );
    tl.to(orbit.rotation, { y: Math.PI * 0.6, duration: 1, ease: 'none' }, 0);

    // each primitive pops in, staggered, and spins as it goes
    orbits.forEach(({ mesh }, i) => {
        tl.to(
            mesh.scale,
            { x: 1, y: 1, z: 1, duration: 0.4, ease: 'back.out(2.4)' },
            0.08 + i * 0.1,
        );
        tl.to(mesh.rotation, { y: Math.PI * 2, duration: 1, ease: 'none' }, 0);
    });

    // stars bloom in behind everything
    tl.to(starMaterial, { opacity: 0.85, duration: 0.7 }, 0.25);

    const setSize = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        fit = camera.aspect < 1 ? Math.min(1 / camera.aspect, 1.8) : 1;
    };
    setSize();
    window.addEventListener('resize', setSize);

    renderer.setAnimationLoop(() => {
        camera.position.set(0, view.y, view.z * fit);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    });

    // reduced motion
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
        tl.scrollTrigger?.disable(false, false);
        // jump straight to the composed end state
        tl.progress(1);

        const skip = requestAnimationFrame(() => {
            if (!disposed) oncomplete?.();
        });

        return () => {
            cancelAnimationFrame(skip);
            tl.progress(0);
            tl.scrollTrigger?.enable(false, false);
        };
    });

    // cleanup
    return () => {
        disposed = true;
        mm.revert();
        tl.scrollTrigger?.kill();
        tl.kill();

        window.removeEventListener('resize', setSize);
        renderer.setAnimationLoop(null);

        coreGeometry.dispose();
        coreMaterial.dispose();
        orbits.forEach(({ geometry, material }) => {
            geometry.dispose();
            material.dispose();
        });
        starGeometry.dispose();
        starMaterial.dispose();
        renderer.dispose();
    };
}
