import type { Component } from 'svelte';

export interface Experiment {
    id: number;
    slug: string;
    /** Repo-relative path used by the footer's GitHub link. */
    githubPath: string;
    load: () => Promise<{ default: Component<any> }>;
    props?: Record<string, any>;
}

export const experiments: Record<number, Experiment> = {
    1: {
        id: 1,
        slug: 'headshot-hero',
        githubPath:
            'src/lib/components/landing/hero-section/HeadshotHero.svelte',
        load: () =>
            import('#lib/components/landing/hero-section/HeadshotHero.svelte'),
        props: {
            title: 'gabe atwell',
            cta: 'Creations',
            bgImage:
                'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@assets-1/images/headshot-noBG_a.webp',
            text: 'I am a frontend developer who loves to create beautiful and functional websites. This website showcases my skills with some projects that I created. If you have any questions, feel free to contact me.. I look forward to hearing from you so we can discuss your goals for your online needs!',
            link: '/contact',
        },
    },
    2: {
        id: 2,
        slug: 'hero-video',
        githubPath:
            'src/lib/components/experiments/hero-video/HeroVideo.svelte',
        load: () =>
            import('#lib/components/experiments/hero-video/HeroVideo.svelte'),
        props: {
            videoSrc: '/videos/Street-Video.mp4',
            title: 'component test',
            subtitle:
                'This is a subtitle for the hero section. It can be a bit longer to provide more context about the content.',
            ctaText: 'Learn More',
        },
    },
    3: {
        id: 3,
        slug: 'vertical-stretch',
        githubPath:
            'src/lib/components/experiments/stretch/VerticalStretch.svelte',
        load: () =>
            import('#lib/components/experiments/stretch/VerticalStretch.svelte'),
        props: {
            firstWord: 'testing',
            titleLetters: ['m', 'a', 'g', 'i', 'c'],
            firstMessage: "i'm testing out some",
            secondMessage: 'new layout stuff',
        },
    },
    4: {
        id: 4,
        slug: 'mobile-video',
        githubPath:
            'src/lib/components/experiments/hero-video/MobileVideoFrame.svelte',
        load: () =>
            import('#lib/components/experiments/hero-video/MobileVideoFrame.svelte'),
        props: {
            videoSrc: '/videos/Waves-Crashing.mp4',
            videos: [
                '/videos/Waves-Crashing.mp4',
                '/videos/Street-Video.mp4',
                '/videos/Web-Code.mp4',
                '/videos/Html-Code.mp4',
            ],
            firstTitle: 'mobile',
            secondTitle: 'video',
        },
    },
    5: {
        id: 5,
        slug: 'new-nav',
        githubPath: 'src/lib/components/experiments/navigation/NewNav.svelte',
        load: () =>
            import('#lib/components/experiments/navigation/NewNav.svelte'),
    },
    6: {
        id: 6,
        slug: 'image-zoom',
        githubPath:
            'src/lib/components/experiments/image-zoom/ImageZoom.svelte',
        load: () =>
            import('#lib/components/experiments/image-zoom/ImageZoom.svelte'),
    },
    7: {
        id: 7,
        slug: 'vertical-text',
        githubPath:
            'src/lib/components/experiments/vertical-text/VerticalText.svelte',
        load: () =>
            import('#lib/components/experiments/vertical-text/VerticalText.svelte'),
    },
    8: {
        id: 8,
        slug: 'dialog-vt',
        githubPath: 'src/lib/components/experiments/DialogVT.svelte',
        load: () => import('#lib/components/experiments/DialogVT.svelte'),
    },
    9: {
        id: 9,
        slug: 'expanding-bottom-nav',
        githubPath:
            'src/lib/components/experiments/expanding-bottom-nav/ExpandingBottomNav.svelte',
        load: () =>
            import('#lib/components/experiments/expanding-bottom-nav/ExpandingBottomNav.svelte'),
    },
};

export const experimentIds = Object.keys(experiments)
    .map(Number)
    .sort((a, b) => a - b);

export const experimentBySlug = Object.fromEntries(
    Object.values(experiments).map((experiment) => [
        experiment.slug,
        experiment,
    ]),
) as Record<string, Experiment>;
