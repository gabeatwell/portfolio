import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
    Camera,
    Color,
    DepthTexture,
    HalfFloatType,
    MeshNormalMaterial,
    RGBAFormat,
    Scene,
    UnsignedShortType,
    Vector2,
    WebGLRenderer,
    WebGLRenderTarget,
    type ColorRepresentation,
} from 'three';

const comicOutlineShader = {
    name: 'ComicOutlineShader',
    uniforms: {
        tColor: { value: null },
        tDepth: { value: null },
        tNormal: { value: null },
        resolution: { value: new Vector2() },
        edgeStrength: { value: 2.8 },
        depthThreshold: { value: 0.04 },
        normalThreshold: { value: 0.45 },
        outlineColor: { value: new Color(0x000000) },
    },
    vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: /* glsl */ `
    uniform sampler2D tColor;
    uniform sampler2D tDepth;
    uniform sampler2D tNormal;
    uniform vec2 resolution;
    uniform float edgeStrength;
    uniform float depthThreshold;
    uniform float normalThreshold;
    uniform vec3 outlineColor;
    varying vec2 vUv;

    float getDepth(vec2 uv) {
      return texture2D(tDepth, uv).r;
    }

    vec3 getNormal(vec2 uv) {
      return texture2D(tNormal, uv).xyz * 2.0 - 1.0;
    }

    float sobelDepth(vec2 uv) {
      vec2 texel = 1.0 / resolution;
      float tl = getDepth(uv + texel * vec2(-1., 1.));
      float t  = getDepth(uv + texel * vec2( 0., 1.));
      float tr = getDepth(uv + texel * vec2( 1., 1.));
      float l  = getDepth(uv + texel * vec2(-1., 0.));
      float r  = getDepth(uv + texel * vec2( 1., 0.));
      float bl = getDepth(uv + texel * vec2(-1.,-1.));
      float b  = getDepth(uv + texel * vec2( 0.,-1.));
      float br = getDepth(uv + texel * vec2( 1.,-1.));

      float gx = -tl - 2.*l - bl + tr + 2.*r + br;
      float gy = -tl - 2.*t - tr + bl + 2.*b + br;
      return sqrt(gx*gx + gy*gy);
    }

    float normalEdge(vec2 uv) {
      vec2 texel = 1.0 / resolution;
      vec3 n  = getNormal(uv);
      float d1 = 1.0 - dot(n, getNormal(uv + vec2(texel.x, 0.)));
      float d2 = 1.0 - dot(n, getNormal(uv - vec2(texel.x, 0.)));
      float d3 = 1.0 - dot(n, getNormal(uv + vec2(0., texel.y)));
      float d4 = 1.0 - dot(n, getNormal(uv - vec2(0., texel.y)));
      return max(max(d1, d2), max(d3, d4));
    }

    void main() {
      vec4 color = texture2D(tColor, vUv);

      float depthEdge = smoothstep(depthThreshold, depthThreshold * 2.0, sobelDepth(vUv));
      float nEdge     = smoothstep(normalThreshold, normalThreshold + 0.15, normalEdge(vUv));

      float edge = clamp(max(depthEdge, nEdge) * edgeStrength, 0.0, 1.0);
      color.rgb = mix(color.rgb, outlineColor, edge);

      gl_FragColor = color;
    }
  `,
};

export interface ComicStyleOptions {
    edgeStrength?: number;
    depthThreshold?: number;
    normalThreshold?: number;
    outlineColor?: ColorRepresentation;
}

export function createComicStyle(
    renderer: WebGLRenderer,
    scene: Scene,
    camera: Camera,
    options: ComicStyleOptions = {},
) {
    const size = new Vector2();
    renderer.getSize(size);

    //   render targets

    const colorTarget = new WebGLRenderTarget(size.x, size.y, {
        type: HalfFloatType,
        format: RGBAFormat,
        depthBuffer: true,
    });
    const depthTex = new DepthTexture(size.x, size.y);
    depthTex.type = UnsignedShortType;
    colorTarget.depthTexture = depthTex;

    const normalTarget = new WebGLRenderTarget(size.x, size.y, {
        type: HalfFloatType,
        format: RGBAFormat,
    });

    const normalMaterial = new MeshNormalMaterial();

    // composer
    const composer = new EffectComposer(renderer);
    const outlinePass = new ShaderPass(comicOutlineShader);
    const outputPass = new OutputPass();

    // apply options
    if (options.edgeStrength !== undefined)
        outlinePass.uniforms.edgeStrength.value = options.edgeStrength;
    if (options.depthThreshold !== undefined)
        outlinePass.uniforms.depthThreshold.value = options.depthThreshold;
    if (options.normalThreshold !== undefined)
        outlinePass.uniforms.normalThreshold.value = options.normalThreshold;
    if (options.outlineColor !== undefined)
        outlinePass.uniforms.outlineColor.value.set(options.outlineColor);

    outlinePass.uniforms.resolution.value.copy(size);

    composer.addPass(outlinePass);
    composer.addPass(outputPass);

    // --public methods--
    function render() {
        // 1. Normals
        scene.overrideMaterial = normalMaterial;
        renderer.setRenderTarget(normalTarget);
        renderer.clear();
        renderer.render(scene, camera);
        scene.overrideMaterial = null;

        // 2. Color + Depth
        renderer.setRenderTarget(colorTarget);
        renderer.clear();
        renderer.render(scene, camera);

        // 3. Feed textures
        outlinePass.uniforms.tColor.value = colorTarget.texture;
        outlinePass.uniforms.tDepth.value = colorTarget.depthTexture;
        outlinePass.uniforms.tNormal.value = normalTarget.texture;

        // 4. Final output
        renderer.setRenderTarget(null);
        composer.render();
    }

    function setSize(width: number, height: number) {
        colorTarget.setSize(width, height);
        normalTarget.setSize(width, height);
        depthTex.image.width = width;
        depthTex.image.height = height;
        outlinePass.uniforms.resolution.value.set(width, height);
        composer.setSize(width, height);
    }

    function dispose() {
        colorTarget.dispose();
        normalTarget.dispose();
        depthTex.dispose();
        normalMaterial.dispose();
        composer.dispose();
    }

    // live tuning
    function setParams(params: ComicStyleOptions) {
        if (params.edgeStrength !== undefined)
            outlinePass.uniforms.edgeStrength.value = params.edgeStrength;
        if (params.depthThreshold !== undefined)
            outlinePass.uniforms.depthThreshold.value = params.depthThreshold;
        if (params.normalThreshold !== undefined)
            outlinePass.uniforms.normalThreshold.value = params.normalThreshold;
        if (params.outlineColor !== undefined)
            outlinePass.uniforms.outlineColor.value.set(params.outlineColor);
    }

    return {
        render,
        setSize,
        dispose,
        setParams,
        composer,
        outlinePass,
    };
}
