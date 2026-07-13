<script lang="ts">
    import { gsap, MorphSVGPlugin } from '$lib/data/gsap';

    $effect(() => {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            MorphSVGPlugin.convertToPath(
                '#sourceSVG rect, #sourceSVG circle, #sourceSVG polygon',
            );

            gsap.set('#square1, #G', { transformOrigin: 'center center' });
            gsap.set('#circle, #A', { transformOrigin: 'center center' });
            gsap.set('#triangle, #B', { transformOrigin: 'center center' });
            gsap.set('#square2, #E', { transformOrigin: 'center center' });

            const tl = gsap.timeline({
                defaults: {
                    duration: 3,
                    ease: 'power2.out',
                },

                delay: 3,
            });

            tl.to('#square1', { morphSVG: '#G' })
                .to('#circle', { morphSVG: '#A' }, 0)
                .to('#triangle', { morphSVG: '#B' }, 0)
                .to('#square2', { morphSVG: '#E' }, 0);

            return () => {
                tl.kill();
            };
        });
    });
</script>

<section class="morph-title">
    <svg
        id="sourceSVG"
        viewBox="0 0 450 100"
        preserveAspectRatio="xMidYMid meet"
    >
        <title>Gabe</title>
        <rect
            id="square1"
            x="0"
            y="0"
            width="80"
            height="80"
            fill="var(--clr-dark-500)"
            stroke="var(--clr-light-500)"
            stroke-width="2"
        />
        <circle
            id="circle"
            cx="140"
            cy="40"
            r="40"
            fill="var(--clr-gray-700)"
            stroke="var(--clr-light-500)"
            stroke-width="2"
        />
        <polygon
            id="triangle"
            points="200,80 280,80 240,0"
            fill="var(--clr-dark-500)"
            stroke="var(--clr-light-500)"
            stroke-width="2"
        />
        <rect
            id="square2"
            x="300"
            y="0"
            width="80"
            height="80"
            fill="var(--clr-dark-500)"
            stroke="var(--clr-light-500)"
            stroke-width="2"
        />
    </svg>

    <svg
        id="targetSVG"
        viewBox="0 0 450 100"
        preserveAspectRatio="xMidYMid meet"
    >
        <title>Gabe</title>
        <!-- Letter G positioned to match square1 (0-80 area) -->
        <path
            id="G"
            d="M0.375 47.1875C0.375 32.8125 4.125 21.3958 11.625 12.9375C19.125 4.47917 29.75 0.25 43.5 0.25C51.7917 0.25 58.2917 1.3125 63 3.4375C67.75 5.5625 71.9167 8.85417 75.5 13.3125C77.6667 16.0208 77.6042 18.125 75.3125 19.625L68.1875 24.25C66.1042 25.625 63.875 25.0208 61.5 22.4375C59.5417 20.3125 57.0625 18.5417 54.0625 17.125C51.0625 15.7083 47.75 15 44.125 15C35.375 15 29.1458 17.7708 25.4375 23.3125C21.7292 28.8125 19.875 36.7708 19.875 47.1875C19.875 57.6042 21.7292 65.5833 25.4375 71.125C29.1458 76.625 35.375 79.375 44.125 79.375C48.375 79.375 52.0417 78.9583 55.125 78.125C58.2083 77.25 61.125 75.6875 63.875 73.4375V62.25H50.3125C47.1875 62.25 45.625 60.8958 45.625 58.1875V50.8125C45.625 48.1042 47.1875 46.75 50.3125 46.75H77.4375C80.5625 46.75 82.125 48.1042 82.125 50.8125V82.5625C76.2917 86.8542 70.3958 89.8542 64.4375 91.5625C58.5208 93.2708 51.5417 94.125 43.5 94.125C29.9583 94.125 19.375 89.8958 11.75 81.4375C4.16667 72.9792 0.375 61.5625 0.375 47.1875Z"
        />
        />
        <!-- Letter A positioned with better spacing (110-189 area) -->
        <path
            id="A"
            d="M110.1875 90C107.1875 90 106.2083 88.625 107.25 85.875L137.875 5.4375C139.167 2.0625 141.125 0.375 143.75 0.375H152.5C155.125 0.375 157.083 2.0625 158.375 5.4375L189 85.875C190.042 88.625 189.063 90 186.063 90H176.125C173.375 90 171.458 88.5625 170.375 85.6875L164 68.875H132.25L125.875 85.6875C124.792 88.5625 122.875 90 120.125 90H110.1875ZM138.063 53.375H158.188L150.5 33.5C149.583 31.1667 149.021 29.4792 148.813 28.4375C148.646 27.3542 148.458 25.7708 148.25 23.6875H148C147.792 25.7708 147.583 27.3542 147.375 28.4375C147.208 29.4792 146.667 31.1667 145.75 33.5L138.063 53.375Z"
        />
        <!-- Letter B positioned with consistent spacing (217-297 area) -->
        <path
            id="B"
            d="M222 90C218.667 90 217 88.4375 217 85.3125V5.0625C217 1.9375 218.667 0.375 222 0.375H243.25C259.25 0.375 270.042 2.35417 275.625 6.3125C281.25 10.2292 284.063 16.2708 284.063 24.4375C284.063 30.1458 281.958 34.5625 277.75 37.6875C273.583 40.8125 269.542 42.625 265.625 43.125V43.3125C269.417 43.5625 273.875 45.4792 279 49.0625C284.125 52.6458 286.688 57.7083 286.688 64.25C286.688 71.9167 283.563 78.125 277.313 82.875C271.063 87.625 260.75 90 246.375 90H222ZM235.25 74.75H244.375C253.208 74.75 259.208 73.9792 262.375 72.4375C265.583 70.8958 267.188 67.7708 267.188 63.0625C267.188 58.6458 265.333 55.6042 261.625 53.9375C257.958 52.2292 252.208 51.375 244.375 51.375H235.25V74.75ZM235.25 36.625H243.438C248.813 36.625 253.833 35.6875 258.5 33.8125C263.208 31.9375 265.563 29.0208 265.563 25.0625C265.563 21.9792 264.25 19.6458 261.625 18.0625C259.042 16.4375 252.979 15.625 243.438 15.625H235.25V36.625Z"
        />
        <!-- Letter E positioned with consistent spacing (325-405 area) -->
        <path
            id="E"
            d="M329.375 90C326.458 90 325 88.4375 325 85.3125V5.0625C325 1.9375 326.458 0.375 329.375 0.375H383C386.125 0.375 387.688 1.72917 387.688 4.4375V11.8125C387.688 14.5208 386.125 15.875 383 15.875H343.25V35.75H379.688C382.813 35.75 384.375 37.1042 384.375 39.8125V47.1875C384.375 49.8958 382.813 51.25 379.688 51.25H343.25V74.5H385C388.125 74.5 389.688 75.8542 389.688 78.5625V85.9375C389.688 88.6458 388.125 90 385 90H329.375Z"
        />
    </svg>
</section>

<style>
    .morph-title {
        display: flex;
        justify-content: center;
        align-items: center;
        inline-size: fit-content;
        padding: 1rem;
        padding-top: 5em;
        margin-inline-start: 2em;
        z-index: 5;

        @media (width <= 768px) {
            padding: 0.5rem;
            scale: 0.8;
            margin-inline-start: 1em;
        }

        & svg {
            inline-size: 100%;
            block-size: auto;
            max-inline-size: min(90vw, 25em);
            min-inline-size: 520px;
            margin: 0;
            padding: 0;
            fill: var(--clr-light-500);

            @media (width >= 1200px) {
                max-inline-size: 30em;
            }

            @media (width <= 500px) {
                max-inline-size: 95vw;
                min-inline-size: 280px;
            }
        }

        & #targetSVG {
            display: none;
        }
    }
</style>
