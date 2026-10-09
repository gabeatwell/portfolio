<script lang="ts">
    import { browser } from '$app/env';
    import { tick } from 'svelte';

    type Slug = 'contact' | 'learn' | 'projects';

    let opened = $state<Slug | null>(null);
    let active = $state<Slug | null>(null);
    let animating = $state(false);

    async function runTransition(update: () => void) {
        if (!browser || !document.startViewTransition) {
            update();
            return;
        }

        animating = true;
        try {
            const transition = document.startViewTransition(async () => {
                update();
                await tick(); // flush Svelte DOM before new snapshot
            });
            await transition.finished;
        } finally {
            animating = false;
        }
    }

    async function toggle(slug: Slug) {
        const isClosing = opened === slug;

        active = slug;
        await tick();

        await runTransition(() => {
            opened = isClosing ? null : slug;
        });

        // 4. Clean up only after the animation is fully done
        if (isClosing) active = null;
    }

    async function close() {
        if (!opened) return;
        active = opened;
        await tick();
        await runTransition(() => {
            opened = null;
        });
        active = null;
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && opened) close();
    }

    $effect(() => {
        if (!browser || !opened) return;
        const root = document.documentElement;
        const previous = root.style.overflow;
        root.style.overflow = 'hidden';
        return () => {
            root.style.overflow = previous;
        };
    });

    if (typeof document !== 'undefined') {
        console.log(
            'startViewTransition?',
            typeof document.startViewTransition,
        );
    }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="bento-wrapper">
    <article data-bento-article>
        <section>
            <div class="bento-grid">
                <div
                    class="bento-item"
                    data-position-left
                    class:expanded={opened === 'contact'}
                    style:view-transition-name={active === 'contact'
                        ? 'bento-dive'
                        : undefined}
                >
                    <button
                        type="button"
                        class="bento-link"
                        aria-expanded={opened === 'contact'}
                        onclick={() => toggle('contact')}
                    >
                        <div class="bento-icons">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="var(--clr-blue-500)"
                                viewBox="0 0 256 256"
                                class="contact-bubble"
                                ><path
                                    d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"
                                ></path></svg
                            >
                        </div>

                        <h2>contact</h2>

                        <p>Feel free to contact me about anything!</p>
                    </button>

                    {#if opened === 'contact'}
                        <div class="bento-menu" class:quiet={animating}>
                            <p>
                                Open to freelance work, collaborations and
                                interesting conversations about the web.
                            </p>
                            <a href="/contact" class="menu-cta"
                                >open contact page</a
                            >
                        </div>
                        <button
                            type="button"
                            class="menu-close"
                            aria-label="Close contact details"
                            onclick={() => close()}
                            ><svg
                                width="800px"
                                height="800px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.00191 9.41621C7.61138 9.02569 7.61138 8.39252 8.00191 8.002C8.39243 7.61147 9.0256 7.61147 9.41612 8.002L12.0057 10.5916L14.5896 8.00771C14.9801 7.61719 15.6133 7.61719 16.0038 8.00771C16.3943 8.39824 16.3943 9.0314 16.0038 9.42193L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.004C15.6133 16.3945 14.9802 16.3945 14.5896 16.004L12.0057 13.42L9.42192 16.0038C9.03139 16.3943 8.39823 16.3943 8.00771 16.0038C7.61718 15.6133 7.61718 14.9801 8.00771 14.5896L10.5915 12.0058L8.00191 9.41621Z"
                                    fill="var(--clr-fail-500)"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"
                                    fill="var(--clr-fail-500)"
                                />
                            </svg></button
                        >
                    {/if}
                </div>

                <div
                    class="bento-item"
                    data-position-right
                    class:expanded={opened === 'learn'}
                    style:view-transition-name={active === 'learn'
                        ? 'bento-dive'
                        : undefined}
                >
                    <div data-position-center>
                        <button
                            type="button"
                            class="bento-link"
                            aria-expanded={opened === 'learn'}
                            onclick={() => toggle('learn')}
                        >
                            <div class="bento-icons">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="var(--clr-warning-500)"
                                    viewBox="0 0 256 256"
                                    class="lightbulb"
                                    ><path
                                        d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z"
                                    ></path></svg
                                >

                                <div class="space"></div>
                            </div>

                            <h2>learn</h2>

                            <p>If you'd like to learn about web technologies</p>
                        </button>
                    </div>

                    {#if opened === 'learn'}
                        <div class="bento-menu" class:quiet={animating}>
                            <p>
                                Written breakdowns of the techniques behind
                                every experiment on this site — GSAP, Three.js,
                                Svelte 5 and more.
                            </p>
                            <a href="/learn" class="menu-cta">browse lessons</a>
                        </div>
                        <button
                            type="button"
                            class="menu-close"
                            aria-label="Close learn details"
                            onclick={() => close()}
                            ><svg
                                width="800px"
                                height="800px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.00191 9.41621C7.61138 9.02569 7.61138 8.39252 8.00191 8.002C8.39243 7.61147 9.0256 7.61147 9.41612 8.002L12.0057 10.5916L14.5896 8.00771C14.9801 7.61719 15.6133 7.61719 16.0038 8.00771C16.3943 8.39824 16.3943 9.0314 16.0038 9.42193L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.004C15.6133 16.3945 14.9802 16.3945 14.5896 16.004L12.0057 13.42L9.42192 16.0038C9.03139 16.3943 8.39823 16.3943 8.00771 16.0038C7.61718 15.6133 7.61718 14.9801 8.00771 14.5896L10.5915 12.0058L8.00191 9.41621Z"
                                    fill="var(--clr-fail-500)"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"
                                    fill="var(--clr-fail-500)"
                                />
                            </svg></button
                        >
                    {/if}
                </div>

                <div
                    class="bento-item"
                    data-position-left
                    class:expanded={opened === 'projects'}
                    style:view-transition-name={active === 'projects'
                        ? 'bento-dive'
                        : undefined}
                >
                    <button
                        type="button"
                        class="bento-link"
                        aria-expanded={opened === 'projects'}
                        onclick={() => toggle('projects')}
                    >
                        <h2>projects</h2>

                        <div class="bento-icons">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="var(--clr-success-500)"
                                viewBox="0 0 256 256"
                                class="suitcase"
                                ><path
                                    d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM40,112H216v48H40ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72V96H40V72Zm0,128H40V176H216v24Z"
                                ></path></svg
                            >
                        </div>
                    </button>

                    {#if opened === 'projects'}
                        <div class="bento-menu" class:quiet={animating}>
                            <p>
                                Shipped work and in-progress experiments, each
                                with a write-up of how it was built.
                            </p>
                            <a href="/projects" class="menu-cta"
                                >see all projects</a
                            >
                        </div>
                        <button
                            type="button"
                            class="menu-close"
                            aria-label="Close project details"
                            onclick={() => close()}
                            ><svg
                                width="800px"
                                height="800px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.00191 9.41621C7.61138 9.02569 7.61138 8.39252 8.00191 8.002C8.39243 7.61147 9.0256 7.61147 9.41612 8.002L12.0057 10.5916L14.5896 8.00771C14.9801 7.61719 15.6133 7.61719 16.0038 8.00771C16.3943 8.39824 16.3943 9.0314 16.0038 9.42193L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.004C15.6133 16.3945 14.9802 16.3945 14.5896 16.004L12.0057 13.42L9.42192 16.0038C9.03139 16.3943 8.39823 16.3943 8.00771 16.0038C7.61718 15.6133 7.61718 14.9801 8.00771 14.5896L10.5915 12.0058L8.00191 9.41621Z"
                                    fill="var(--clr-fail-500)"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"
                                    fill="var(--clr-fail-500)"
                                />
                            </svg></button
                        >
                    {/if}
                </div>
            </div>
        </section>
    </article>
</div>

<style>
    :root {
        --space: 1rem;
        --surface-1: transparent;
        --surface-2: var(--clr-dark-500);
        --gradient: radial-gradient(var(--clr-gray-700), var(--dark) 88%);
    }

    * {
        box-sizing: border-box;
    }

    .bento-wrapper {
        margin: 0;

        & .bento-link {
            padding: var(--space);
            margin: 0;
            cursor: pointer;
            inline-size: fit-content;
            block-size: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            text-decoration: none;
            color: inherit;
            font-family: inherit;
            background: transparent;
            border: 0;
            text-align: center;

            &:focus,
            &:focus-visible {
                outline: 2px solid var(--clr-light-500);
                outline-offset: 2px;
                box-shadow: none;
            }

            &:active {
                scale: 0.95;
            }
        }

        & article[data-bento-article] {
            line-height: 1.4;
            margin: 0;

            padding-inline: var(--space);
            background-color: transparent;
            box-shadow: none;

            & section {
                margin-inline: auto;
                inline-size: min(1000px, 100%);
            }

            & .bento-grid {
                display: grid;
                gap: var(--space);
                grid-template-columns: 1fr;
                grid-template-areas:
                    'item-one'
                    'item-two'
                    'item-three';
                position: relative;

                @media (width >= 768px) {
                    grid-template-columns: repeat(2, 1fr);
                    grid-template-areas:
                        'item-one item-two'
                        'item-three item-three';
                }

                @media (width >= 50rem) {
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-areas:
                        'item-one item-one item-two'
                        'item-three item-three item-two';
                }

                @media (width <= 500px) {
                    margin-top: 5em;
                }

                & .bento-item {
                    inline-size: 100%;
                    background-color: var(--surface-2);
                    background-image: var(--gradient);
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding-block-end: 1em;
                    border: 2px solid var(--clr-light-500);
                    border-radius: var(--radius);
                    transition:
                        border 1s ease-out,
                        box-shadow 1s ease-out,
                        transform 0.25s ease-out;

                    &[style*='view-transition-name'] {
                        transition: none;
                    }
                    &[data-position-left] {
                        box-shadow: 7px 7px 0 var(--clr-light-500);
                    }
                    &[data-position-right] {
                        box-shadow: -7px 7px 0 var(--clr-light-500);
                    }

                    &:not(:hover) {
                        opacity: 0.9;
                    }

                    & .bento-icons {
                        scale: 0.7;

                        & .contact-bubble {
                            inline-size: clamp(9.5em, 15vw, 15em);
                            block-size: clamp(9.5em, 15vw, 15em);
                        }

                        & .suitcase {
                            inline-size: clamp(9.5em, 15vw, 15em);
                            block-size: clamp(9.5em, 15vw, 15em);
                        }

                        & .lightbulb {
                            transform: scaleY(1.9);
                            inline-size: clamp(9.5em, 15vw, 15em);
                            block-size: clamp(9.5em, 15vw, 15em);

                            @media (width <= 990px) {
                                transform: scaleY(1.5);
                            }
                            @media (width <= 768px) {
                                transform: scaleY(1.2);
                            }
                            @media (width <= 500px) {
                                transform: scaleY(1);
                            }
                        }

                        & .space {
                            block-size: 5em;

                            @media (width <= 768px) {
                                block-size: 0;
                            }
                        }
                    }

                    & [data-position-center] {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        inline-size: 100%;
                    }

                    & .bento-link {
                        text-decoration: none;

                        &:focus,
                        &:focus-within {
                            outline: 1px solid var(--clr-light-500);
                            background: transparent;
                            box-shadow: none;
                        }
                    }

                    & h2 {
                        font-family: var(--bronova-bold);
                        font-size: clamp(var(--h4), 3vw, var(--h2));
                        font-weight: 900;
                        letter-spacing: -1px;
                        margin-bottom: 1rem;
                        text-transform: uppercase;
                        transition: border-bottom 0.5s ease;
                        inline-size: fit-content;
                        margin-inline: auto;
                        pointer-events: none;
                        color: var(--clr-light-500);

                        &:nth-child(2) {
                            margin-top: 0.5em;
                        }
                    }

                    & p {
                        font-family: var(--bronova);
                        font-size: clamp(var(--sm), 1.25vw, var(--h6));
                        font-weight: 300;
                        color: var(--clr-light-500);
                        text-align: center;
                        padding-inline: 0.75em;
                        margin-bottom: 0;
                        letter-spacing: 0px;
                        pointer-events: none;

                        &:nth-child(2) {
                            line-height: 1.5;
                        }
                    }

                    /* bento-menu & expanded */
                    & .bento-menu {
                        inline-size: min(42rem, 100%);
                        block-size: auto;
                        margin-inline: auto;
                        margin-block: 1.5rem 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1.25rem;
                        animation: dive-reveal 0.45s
                            cubic-bezier(0.22, 1, 0.36, 1) both;

                        & p {
                            font-size: clamp(var(--sm), 1.4vw, var(--h6));
                            line-height: 1.7;
                            max-inline-size: 60ch;
                            pointer-events: auto;
                            text-align: left;
                            color: var(--clr-gray-700);
                        }

                        &.quiet {
                            animation: none;
                        }
                    }

                    & .menu-cta {
                        font-family: var(--bronova-bold);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-size: var(--sm);
                        color: var(--clr-light-500);
                        text-decoration: none;
                        padding: 0.75em 1.5em;
                        border: 2px solid var(--clr-light-500);
                        border-radius: var(--radius);
                        transition:
                            background-color 0.25s ease-out,
                            color 0.25s ease-out;

                        &:hover,
                        &:focus-visible {
                            background-color: var(--clr-light-500);
                            color: var(--clr-dark-500);
                        }

                        &:focus-visible {
                            outline: 2px solid var(--clr-light-500);
                            outline-offset: 3px;
                        }
                    }

                    & .menu-close {
                        position: absolute;
                        inset-block-start: 5em;
                        inset-inline-end: 1rem;
                        inline-size: fit-content;
                        z-index: 2;
                        font-family: var(--bronova-bold);
                        text-transform: uppercase;

                        background: transparent;
                        border: none;
                        color: var(--clr-fail-500);
                        font-family: var(--bronova-bold);
                        font-size: clamp(var(--h5), 1.5vw, var(--h3));
                        font-weight: 700;
                        cursor: pointer;

                        @media (width <=768px) {
                            inset-inline-end: 0.25rem;
                        }

                        & svg {
                            inline-size: clamp(1.5em, 3vw, 2.5rem);
                            block-size: clamp(1.5em, 3vw, 2.5rem);
                        }

                        &:active {
                            scale: 0.95;
                        }

                        &:hover,
                        &:focus-visible {
                            opacity: 0.9;
                        }

                        &:focus-visible {
                            outline: 2px solid var(--clr-light-500);
                        }
                    }

                    &.expanded {
                        position: fixed;
                        inset-block: 2vh;
                        inset-inline: max(2vw, calc(50% - 45rem));
                        inline-size: min(45rem, calc(100% - 4vw));
                        margin-inline: auto;
                        margin-top: 2em;
                        z-index: 60;
                        overflow-y: auto;
                        justify-content: flex-start;
                        padding-block: 3rem 3rem;
                        opacity: 1;
                        transform: none;
                        border-radius: var(--radius);
                        box-shadow:
                            0 0 0 1px var(--clr-light-500),
                            0 0 0 100vmax oklch(0% 0 0 / 0.7);

                        @media (width <=768px) {
                            inset-inline: min(2vw, calc(50% - 0rem));
                        }

                        & .bento-link {
                            inline-size: fit-content;
                            cursor: zoom-out;
                        }

                        & .bento-icons {
                            scale: 0.85;
                        }
                    }

                    &:hover:not(.expanded) {
                        transform: scale(0.99);
                    }

                    &:not(:hover) {
                        transition:
                            border 1s ease-out,
                            box-shadow 1s ease-out,
                            transform 0.25s ease-out;
                    }

                    &:nth-child(1) {
                        grid-area: item-one;
                    }

                    &:nth-child(2) {
                        grid-area: item-two;
                    }

                    &:nth-child(3) {
                        grid-area: item-three;
                    }

                    &:last-child {
                        margin-bottom: 2.3rem;
                    }
                }
            }
        }
    }

    @keyframes dive-reveal {
        from {
            opacity: 0;
            transform: translateY(1.5rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    :global(::view-transition-group(bento-dive)) {
        animation-duration: 0.45s;
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }

    /* content crossfade inside the morphing tile */
    :global(::view-transition-old(bento-dive)),
    :global(::view-transition-new(bento-dive)) {
        animation-duration: 0.45s;
    }

    /* the rest of the page should NOT crossfade — kills the ghosting */
    :global(::view-transition-old(root)),
    :global(::view-transition-new(root)) {
        animation-duration: 0s;
    }

    @keyframes menu-in {
        from {
            opacity: 0;
            translate: 0 1.5rem;
        }
    }
    @keyframes menu-out {
        to {
            opacity: 0;
            translate: 0 1.5rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .bento-item .bento-menu {
            animation: none;
        }

        :global(::view-transition-group(bento-dive)) {
            animation: none;
        }
    }
</style>
