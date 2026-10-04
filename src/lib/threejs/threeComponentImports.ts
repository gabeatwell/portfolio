export interface ComponentEntry {
    import: () => Promise<{ default: any }>;
    githubPath: string;
}

export const componentImportMap: Record<string, ComponentEntry> = {
    PictureParticles: {
        import: () => import('#lib/threejs/cursor/CursorImage.svelte'),
        githubPath: 'src/lib/threejs/cursor/CursorImage.svelte',
    },
    HeroCanvas: {
        import: () => import('#lib/threejs/hero/HeroCanvas.svelte'),
        githubPath: 'src/lib/threejs/hero/HeroCanvas.svelte',
    },
    Environment: {
        import: () => import('#lib/threejs/environment/Environment.svelte'),
        githubPath: 'src/lib/threejs/environment/Environment.svelte',
    },
    PostProcess: {
        import: () => import('#lib/threejs/post-processing/PostProcess.svelte'),
        githubPath: 'src/lib/threejs/post-processing/PostProcess.svelte',
    },
    Loader: {
        import: () => import('#lib/threejs/loader/Loader.svelte'),
        githubPath: 'src/lib/threejs/loader/Loader.svelte',
    },
    slaynet: {
        import: () => import('#lib/threejs/slaynet/Slaynet.svelte'),
        githubPath: 'src/lib/threejs/slaynet/Slaynet.svelte',
    },
    killgrid: {
        import: () => import('#lib/threejs/killgrid/Killgrid.svelte'),
        githubPath: 'src/lib/threejs/killgrid/Killgrid.svelte',
    },
    Carousel: {
        import: () =>
            import('#lib/threejs/image-carousel/ImageCarousel.svelte'),
        githubPath: 'src/lib/threejs/image-carousel/ImageCarousel.svelte',
    },
};
