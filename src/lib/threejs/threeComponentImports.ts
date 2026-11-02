const CDN_IMAGES =
    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images';
const MODEL_BASE = '/threejayess/models';

/** Cube-map faces for the environment-mapping demos. */
function environmentMap(index: number): string[] {
    return ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(
        (face) => `/threejayess/environmentMaps/${index}/${face}.webp`,
    );
}

/** `killgrid`'s models can't be decompressed without DRACOLoader's decoder. */
const DRACO_DECODER = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

export interface ComponentEntry {
    import: () => Promise<{ default: any }>;
    githubPath: string;
    /**
     * URLs the component fetches while running. Heavy assets (`.glb`, env
     * maps, `/threejayess/` media) are only cached after a first online visit,
     * so `OfflineAssetGuard` uses this list to tell whether it can mount the
     * scene without a connection.
     */
    assets: string[];
}

export const componentImportMap: Record<string, ComponentEntry> = {
    PictureParticles: {
        import: () => import('#lib/threejs/cursor/CursorImage.svelte'),
        githubPath: 'src/lib/threejs/cursor/CursorImage.svelte',
        assets: ['/threejayess/glow.webp', '/threejayess/gabe2.webp'],
    },
    HeroCanvas: {
        import: () => import('#lib/threejs/hero/HeroCanvas.svelte'),
        githubPath: 'src/lib/threejs/hero/HeroCanvas.svelte',
        // precached with the other CDN images, so available offline
        assets: [`${CDN_IMAGES}/star.webp`],
    },
    Environment: {
        import: () => import('#lib/threejs/environment/Environment.svelte'),
        githubPath: 'src/lib/threejs/environment/Environment.svelte',
        assets: [...environmentMap(0), `${MODEL_BASE}/waternoose.glb`],
    },
    PostProcess: {
        import: () => import('#lib/threejs/post-processing/PostProcess.svelte'),
        githubPath: 'src/lib/threejs/post-processing/PostProcess.svelte',
        assets: [...environmentMap(1), `${MODEL_BASE}/gadget.glb`],
    },
    Loader: {
        import: () => import('#lib/threejs/loader/Loader.svelte'),
        githubPath: 'src/lib/threejs/loader/Loader.svelte',
        assets: [...environmentMap(2), `${MODEL_BASE}/shark.glb`],
    },
    killgrid: {
        import: () => import('#lib/threejs/killgrid/Killgrid.svelte'),
        githubPath: 'src/lib/threejs/killgrid/Killgrid.svelte',
        assets: [
            `${MODEL_BASE}/minecraft_avatar.glb`,
            `${MODEL_BASE}/bob_the_tomato_2000.glb`,
            `${MODEL_BASE}/convenience-store-01.glb`,
            `${MODEL_BASE}/apartment-block-01.glb`,
            `${MODEL_BASE}/ray_gun.glb`,
            `${DRACO_DECODER}draco_wasm_wrapper.js`,
            `${DRACO_DECODER}draco_decoder.wasm`,
            `${CDN_IMAGES}/asphalt-texture.webp`,
        ],
    },
    Carousel: {
        import: () =>
            import('#lib/threejs/image-carousel/ImageCarousel.svelte'),
        githubPath: 'src/lib/threejs/image-carousel/ImageCarousel.svelte',
        assets: [
            'steer',
            'butterfly',
            'magazine-face',
            'mountains',
            'woman-model',
            'chairs',
        ].map((name) => `${CDN_IMAGES}/${name}.avif`),
    },
};
