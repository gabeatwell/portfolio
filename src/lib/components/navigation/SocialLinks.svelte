<script lang="ts">
    import { page } from '$app/state';
    import { useSound } from '$lib/data/stores/sounds/uiSounds.svelte';
    import { selectedThreeComponent } from '$lib/data/stores/threejsComponent';
    import { componentImportMap } from '$lib/data/threeComponentImports';

    const { playSoundAsync: playHoverSound } = useSound(
        '/sounds/ui_bubble.wav',
    );
    const REPO_URL = 'https://www.github.com/gabeatwell/portfolio';
    const githubUrl = $derived.by(() => {
        const path = page.url.pathname;

        if (path === '/')
            return `${REPO_URL}/tree/main/src/routes/+page.svelte`;

        // handle blog posts:: /threejs-blog/3 -> src/content/posts/3.md
        const blogMatch = path.match(/^\/threejs-blog\/(\d+)$/);
        if (blogMatch) {
            return `${REPO_URL}/tree/main/src/content/posts/${blogMatch[1]}.md`;
        }

        // handle three.js with selected component
        if (path.includes('three-components')) {
            const component =
                page.url.searchParams.get('component') ??
                $selectedThreeComponent;

            if (component && component !== 'Select') {
                const entry = componentImportMap[component];

                if (entry) {
                    return `${REPO_URL}/tree/main/${entry.githubPath}`;
                }
            }

            return `${REPO_URL}/tree/main/src/routes/threejs-blog/three-components/+page.svelte`;
        }

        // handle multi-segment routes
        const segments = path.split('/').filter(Boolean);
        if (segments.length >= 2) {
            return `${REPO_URL}/tree/main/src/routes/${segments.join('/')}/+page.svelte`;
        }

        return `${REPO_URL}/tree/main/src/routes/${segments}/+page.svelte`;
    });
</script>

<nav class="footer" aria-label="Social media links">
    <a
        class="social-link yellow"
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source code for this page on Github (in a new tab)"
        onclick={playHoverSound}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-20 0 596 512"
            style="width: 1em;"
        >
            <title>GitHub</title>
            <path
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
            />
        </svg>
    </a>

    <a
        class="social-link"
        href="https://codepen.io/gabrielatwell"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Gabriel's CodePen profile (opens in new tab)"
        onclick={playHoverSound}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-10 -5 552 545"
            style="width: 1em;"
        >
            <title>CodePen</title>
            <path
                d="M502.3 159.7l-234-156c-8-4.9-16.5-5-24.6 0l-234 156C3.7 163.7 0 170.8 0 178v156c0 7.1 3.7 14.3 9.7 18.3l234 156c8 4.9 16.5 5 24.6 0l234-156c6-4 9.7-11.1 9.7-18.3V178c0-7.1-3.7-14.3-9.7-18.3zM278 63.1l172.3 114.9-76.9 51.4L278 165.7V63.1zm-44 0v102.6l-95.4 63.7-76.9-51.4L234 63.1zM44 219.1l55.1 36.9L44 292.8v-73.7zm190 229.7L61.7 334l76.9-51.4L234 346.3v102.6zm22-140.9l-77.7-52 77.7-52 77.7 52-77.7 52zm22 140.9V346.3l95.4-63.7 76.9 51.4L278 448.8zm190-156l-55.1-36.9L468 219.1v73.7z"
            />
        </svg>
    </a>

    <a
        class="social-link"
        href="https://www.linkedin.com/in/gabrielatwell/"
        rel="noopener noreferrer"
        target="_blank"
        aria-label="linkedin link"
        onclick={playHoverSound}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-20 0 548 512"
            style="width: 1em;"
        >
            <title>LinkedIn</title>
            <path
                d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
            />
        </svg>
    </a>

    <a
        href="https://www.behance.net/gabrielatwell702"
        class="social-link"
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Visit Gabriel's Behance profile"
        onclick={playHoverSound}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-10 0 650 650"
            style="width: 1em;"
        >
            <title>Behance</title>
            <path
                d="M264 301.2C295.8 286 312.4 263 312.4 227.2C312.4 156.6 259.8 139.4 199.1 139.4L32 139.4L32 493.8L203.8 493.8C268.2 493.8 328.7 462.9 328.7 390.9C328.7 346.4 307.6 313.5 264 301.2zM109.9 199.9L183 199.9C211.1 199.9 236.4 207.8 236.4 240.4C236.4 270.5 216.7 282.6 188.9 282.6L109.9 282.6L109.9 199.9zM193.2 433.6L109.9 433.6L109.9 336L194.8 336C229.1 336 250.8 350.3 250.8 386.6C250.8 422.4 224.9 433.6 193.2 433.6zM551.7 192.9L408 192.9L408 158L551.7 158L551.7 192.9zM608 369.2C608 293.3 563.6 230 483.1 230C404.9 230 351.8 288.8 351.8 365.8C351.8 445.7 402.1 500.5 483.1 500.5C544.4 500.5 584.1 472.9 603.2 414.2L541 414.2C534.3 436.1 506.7 447.7 485.3 447.7C444 447.7 422.3 423.5 422.3 382.4L607.4 382.4C607.7 378.2 608 373.7 608 369.2zM422.4 338C424.7 304.3 447.1 283.2 480.9 283.2C516.3 283.2 534.1 304 537.1 338L422.4 338z"
            /></svg
        >
    </a>
</nav>

<style>
    .footer {
        display: flex;
        justify-content: space-evenly;
        gap: 5rem;
        padding: 1rem;
        margin-top: 2.65rem;

        @media (width <= 990px) {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            gap: 1.65rem;
            margin-top: 0;
        }

        & .social-link {
            font-size: clamp(var(--h1), 4vw, var(--xxl));
            font-weight: 900;
            transition:
                color 0.5s ease,
                opacity 0.5s ease,
                scale 0.15s ease-out;
            cursor: pointer;
            opacity: 1;
            position: relative;
            z-index: 200;
            pointer-events: all;
            background-color: transparent;

            &:focus {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
                box-shadow: none;
            }

            &:active {
                scale: 0.95;
            }

            & svg {
                cursor: pointer;

                & path {
                    fill: var(--clr-dark-500);
                    stroke: var(--clr-light-500);
                    stroke-width: 0.2em;

                    &:not(:hover) {
                        opacity: 0.9;
                    }
                }
            }
        }
    }
</style>
