import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    CubeTextureLoader,
    TextureLoader,
    Mesh,
    MeshStandardMaterial,
    WebGLRenderTarget,
    Vector3,
    ReinhardToneMapping,
    PCFShadowMap,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import type { Attachment } from 'svelte/attachments';

export const setupPostProcess: Attachment<HTMLCanvasElement> = (canvas) => {
    // debug
    const gui = new GUI();
    gui.close();

    const scene = new Scene();

    //  loaders
    const gltfLoader = new GLTFLoader();
    const cubeTextureLoader = new CubeTextureLoader();
    const textureLoader = new TextureLoader();

    const updateAllMaterials = () => {
        scene.traverse((child) => {
            if (
                child instanceof Mesh &&
                child.material instanceof MeshStandardMaterial
            ) {
                child.material.envMapIntensity = 2.5;
                child.material.needsUpdate = true;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    };

    //  environment mapping
    const environmentMap = cubeTextureLoader.load([
        '/threejayess/environmentMaps/1/px.webp',
        '/threejayess/environmentMaps/1/nx.webp',
        '/threejayess/environmentMaps/1/py.webp',
        '/threejayess/environmentMaps/1/ny.webp',
        '/threejayess/environmentMaps/1/pz.webp',
        '/threejayess/environmentMaps/1/nz.webp',
    ]);

    scene.background = environmentMap;
    scene.environment = environmentMap;

    gltfLoader.load('/threejayess/models/gadget.glb', (gltf) => {
        gltf.scene.scale.set(30, 30, 30);
        gltf.scene.position.set(0, -3, 0);
        gltf.scene.rotation.y = Math.PI * 0.75;
        scene.add(gltf.scene);

        updateAllMaterials();
    });

    const directionalLight = new DirectionalLight('#ffffff', 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
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
            // Update sizes
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            // Update camera
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            // Update renderer
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // update effectComposer
            effectComposer.setSize(sizes.width, sizes.height);
            effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.toneMapping = ReinhardToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /*
     * post processing
     */
    const renderTarget = new WebGLRenderTarget(800, 600, {
        samples: renderer.getPixelRatio() === 1 ? 2 : 0,
    });

    const effectComposer = new EffectComposer(renderer, renderTarget);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    effectComposer.setSize(sizes.width, sizes.height);

    // render and effect passes
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    const dotScreenPass = new DotScreenPass();
    dotScreenPass.enabled = false;
    effectComposer.addPass(dotScreenPass);

    const glitchPass = new GlitchPass();
    glitchPass.goWild = false;
    glitchPass.enabled = false;
    effectComposer.addPass(glitchPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.enabled = false;
    effectComposer.addPass(rgbShiftPass);

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    effectComposer.addPass(gammaCorrectionPass);

    const TintShader = {
        uniforms: {
            tDiffuse: { value: null },
            uTint: { value: null },
        },
        vertexShader: `
				varying vec2 vUv;

				void main()
				{
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

					vUv = uv;
				}
			`,
        fragmentShader: `
				uniform sampler2D tDiffuse;
				uniform vec3 uTint;

				varying vec2 vUv;

				void main()
				{
					vec4 color = texture2D(tDiffuse, vUv);
					color.rgb += uTint;

					gl_FragColor = color;
				}
			`,
    };
    const tintPass = new ShaderPass(TintShader);
    tintPass.material.uniforms.uTint.value = new Vector3();
    tintPass.enabled = false;
    effectComposer.addPass(tintPass);

    const DisplacementShader = {
        uniforms: {
            tDiffuse: { value: null },
            uNormalMap: { value: null },
            uDisplacementStrength: { value: 0.1 },
        },
        vertexShader: `
				varying vec2 vUv;

				void main()
				{
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

					vUv = uv;
				}
			`,
        fragmentShader: `
				uniform sampler2D tDiffuse;
				uniform sampler2D uNormalMap;
				uniform float uDisplacementStrength;

				varying vec2 vUv;

				void main()
				{
					vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
					vec2 newUv = vUv + normalColor.xy * uDisplacementStrength;
					vec4 color = texture2D(tDiffuse, newUv);

					vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
					float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
					color.rgb += lightness * 2.0;

					gl_FragColor = color;
				}
			`,
    };
    const displacementPass = new ShaderPass(DisplacementShader);
    displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
        'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/interfaceNormalMap.webp',
    );
    effectComposer.addPass(displacementPass);
    displacementPass.enabled = false;

    // smaa
    if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
        const smaaPass = new SMAAPass();
        effectComposer.addPass(smaaPass);
    }

    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = 'auto';
    gui.domElement.style.bottom = '0px';
    gui.domElement.style.left = '0px';

    // dot screen
    const dotScreenFolder = gui.addFolder('Dot Screen');
    dotScreenFolder.add(dotScreenPass, 'enabled').name('Enabled');
    dotScreenFolder
        .add((dotScreenPass.uniforms as any).scale, 'value', 0.1, 2, 0.1)
        .name('Scale');

    // glitch
    const glitchFolder = gui.addFolder('Glitch');
    glitchFolder.add(glitchPass, 'enabled').name('Enabled');
    glitchFolder.add(glitchPass, 'goWild').name('Go Wild');

    // displacement
    const displacementFolder = gui.addFolder('Displacement');
    displacementFolder.add(displacementPass, 'enabled').name('Enabled');
    displacementFolder
        .add(
            displacementPass.material.uniforms.uDisplacementStrength,
            'value',
            0,
            1,
            0.01,
        )
        .name('Strength');

    let animationId: number;

    const tick = () => {
        controls.update();

        renderer.render(scene, camera);
        effectComposer.render();

        animationId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
        console.log('Component unmounting');
        abortController.abort();
        if (animationId) window.cancelAnimationFrame(animationId);
        if (environmentMap) environmentMap.dispose();
        gui.destroy();
        effectComposer.dispose();
        renderPass.dispose();
        dotScreenPass.dispose();
        glitchPass.dispose();
        rgbShiftPass.dispose();
        gammaCorrectionPass.dispose();
    };
};
