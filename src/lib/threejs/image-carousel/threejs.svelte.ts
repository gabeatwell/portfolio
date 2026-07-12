import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from '$lib/data/gsap';
import {
    Color,
    DoubleSide,
    Group,
    Mesh,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    SRGBColorSpace,
    TextureLoader,
    Uniform,
    UniformsUtils,
    Vector2,
    WebGLRenderer,
} from 'three';

// parameters — kept at module level so they're easy to tweak
const parameters = {
    WIDTH: 7,
    HEIGHT: 5,
    CORNER_RADIUS: 0.1,
    BACK_SIDE_COLOR: '#c9c9c5',
    RADIUS: 8,
    CURVATURE: 0.07,
    IMAGES: [
        'https://images.pexels.com/photos/38069595/pexels-photo-38069595.jpeg',
        'https://images.pexels.com/photos/38237785/pexels-photo-38237785.jpeg',
        'https://images.pexels.com/photos/38135743/pexels-photo-38135743.jpeg',
        'https://images.pexels.com/photos/38245149/pexels-photo-38245149.jpeg',
        'https://images.pexels.com/photos/37883327/pexels-photo-37883327.jpeg',
        'https://images.pexels.com/photos/38062747/pexels-photo-38062747.jpeg',
        // ... add more images
    ],
    INITIAL_ANIMATION: true,
    CAMERA_RIG: true,
};

export function initCarousel(canvas: HTMLCanvasElement): () => void {
    // --- sizes ---
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
    };

    // --- renderer ---
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);

    // --- scene setup ---
    const textureLoader = new TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    const mouse = new Vector2();
    const target = new Vector2(0, 0);
    const cameraRig = new Group();
    const grp = new Group();

    const scene = new Scene();
    const camera = new PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        1000,
    );
    camera.position.set(0, 4, 16);
    cameraRig.add(camera);
    scene.add(cameraRig);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 2;

    // --- shader material ---
    const material = new ShaderMaterial({
        uniforms: {
            uTexture: new Uniform(null),
            uCurvature: new Uniform(parameters.CURVATURE),
            u_radius: new Uniform(parameters.CORNER_RADIUS),
            uBackSideColor: new Uniform(new Color(parameters.BACK_SIDE_COLOR)),
        },
        vertexShader: `
    uniform float uCurvature;
    varying vec2 vUv;
    void main(){
      vec3 newPos = position;
      newPos.z -= newPos.x * newPos.x * uCurvature;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      vUv = uv;
    }`,
        fragmentShader: `
    uniform sampler2D uTexture;
    uniform vec3 uBackSideColor;
    uniform float u_radius;
    varying vec2 vUv;
    float roundedRectSDF(vec2 pt, vec2 size, float radius) {
      vec2 q = abs(pt - 0.5 * size) - (size * 0.5 - vec2(radius));
      return length(max(q, 0.0)) - radius;
    }
    void main(){
      vec2 size = vec2(1.0);
      float sdf = roundedRectSDF(vUv, size, u_radius);
      float edge = fwidth(sdf);
      float mask = smoothstep(0.0, edge, -sdf);
      vec4 color = vec4(uBackSideColor, 1.0);
      if(gl_FrontFacing){
        color = texture2D(uTexture, vUv);
      }
      gl_FragColor = color * mask;
      #include <colorspace_fragment>
    }`,
        transparent: true,
        side: DoubleSide,
        alphaToCoverage: true,
    });

    // --- geometry ---
    const geometry = new PlaneGeometry(
        parameters.WIDTH,
        parameters.HEIGHT,
        8,
        1,
    );

    // --- textures ---
    const textures = parameters.IMAGES.map((img) => {
        const tex = textureLoader.load(img);
        tex.colorSpace = SRGBColorSpace;
        return tex;
    });

    // --- layout ---
    const points = generateCirclePoints3D(
        parameters.IMAGES.length,
        parameters.RADIUS,
        0,
        0,
    );

    for (let i = 0; i < points.length; i++) {
        const mat = material.clone();
        mat.uniforms = UniformsUtils.clone(material.uniforms);
        mat.uniforms.uTexture.value = textures[i];

        const imagePlane = new Mesh(geometry, mat);
        imagePlane.rotation.y = points[i].rotation + Math.PI;
        imagePlane.position.set(points[i].x, 0, points[i].z);
        grp.add(imagePlane);
    }

    scene.add(grp);

    // --- event listeners (tracked for cleanup) ---
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Grab cursor
    document.body.style.cursor = 'grab';
    window.addEventListener(
        'pointerdown',
        () => {
            document.body.style.cursor = 'grabbing';
        },
        { signal },
    );
    window.addEventListener(
        'pointerup',
        () => {
            document.body.style.cursor = 'grab';
        },
        { signal },
    );

    // Mouse move for camera rig
    if (parameters.CAMERA_RIG) {
        window.addEventListener(
            'mousemove',
            (event) => {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            },
            { signal },
        );
    }

    // Resize
    window.addEventListener(
        'resize',
        () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(sizes.pixelRatio);
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
        },
        { signal },
    );

    // --- initial animation ---
    if (parameters.INITIAL_ANIMATION) {
        gsap.to(grp.rotation, {
            duration: 3,
            y: Math.PI * 2,
            ease: 'elastic.out',
        });
    }

    // --- animation loop ---
    let lastTime = performance.now();
    renderer.setAnimationLoop(() => {
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1); // cap at 100ms to avoid jumps
        lastTime = now;

        if (parameters.CAMERA_RIG) {
            const damping = 1 - Math.pow(1 - 0.05, delta * 60);
            target.x += (mouse.x - target.x) * damping;
            cameraRig.rotation.set(0, target.x * 0.25, 0);
        }

        controls.update();
        renderer.render(scene, camera);
    });

    // --- cleanup ---
    return () => {
        abortController.abort(); // removes all signal-tracked listeners
        renderer.setAnimationLoop(null); // stops the animation loop
        renderer.dispose(); // frees GPU resources
        document.body.style.cursor = ''; // reset cursor
    };
}

function generateCirclePoints3D(
    n: number,
    r: number,
    cx: number,
    cz: number,
): { x: number; z: number; rotation: number }[] {
    const points: { x: number; z: number; rotation: number }[] = [];
    const angleStep = (2 * Math.PI) / n;

    for (let i = 0; i < n; i++) {
        const angle = i * angleStep + Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const z = cz + r * Math.sin(angle);

        const dx = cx - x;
        const dz = cz - z;
        const rotation = Math.atan2(dx, dz);

        points.push({ x, z, rotation });
    }

    return points;
}
