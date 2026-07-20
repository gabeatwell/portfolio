<script lang="ts">
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';

    let { sideBar = true } = $props();
    let isOpen = $state(false);

    const breakpoints = getBreakpoints();
</script>

{#if sideBar && !breakpoints.isMobile}
    <button
        class="toggle-button"
        class:open={isOpen}
        onclick={() => (isOpen = !isOpen)}
        aria-label="toggle sidebar"
    >
        <svg
            class="arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <title>open menu</title>
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    </button>

    <aside class="side-bar" class:open={isOpen}>
        <!-- desktop toc -->
        <article class="table-of-contents">
            <div class="css">
                <dl>
                    <dt>CSS</dt>

                    <dd>
                        <a href="#transitions" onclick={() => (isOpen = false)}
                            >Transitions</a
                        >
                    </dd>
                    <dd>
                        <a href="#animations" onclick={() => (isOpen = false)}
                            >Animations</a
                        >
                    </dd>
                    <dd>
                        <a href="#interpolate" onclick={() => (isOpen = false)}
                            >Interpolate</a
                        >
                    </dd>
                    <dd>
                        <a href="#calc" onclick={() => (isOpen = false)}
                            >Calc-Size</a
                        >
                    </dd>
                    <dd>
                        <a href="#details" onclick={() => (isOpen = false)}
                            >Details</a
                        >
                    </dd>
                    <dd>
                        <a href="#view" onclick={() => (isOpen = false)}
                            >View Transitions</a
                        >
                    </dd>
                    <dd>
                        <a href="#anchor" onclick={() => (isOpen = false)}
                            >Anchor Positions</a
                        >
                    </dd>
                </dl>
            </div>

            <div class="gsap">
                <dl>
                    <dt>GSAP</dt>

                    <dd>
                        <a href="#tweens" onclick={() => (isOpen = false)}
                            >Tweens</a
                        >
                    </dd>
                    <dd>
                        <a href="#staggers" onclick={() => (isOpen = false)}
                            >Staggers</a
                        >
                    </dd>
                    <dd>
                        <a href="#timelines" onclick={() => (isOpen = false)}
                            >Timelines</a
                        >
                    </dd>
                    <dd>
                        <a href="#percentage" onclick={() => (isOpen = false)}
                            >Keyframes</a
                        >
                    </dd>
                    <dd>
                        <a href="#position" onclick={() => (isOpen = false)}
                            >Positioning</a
                        >
                    </dd>
                    <dd>
                        <a href="#fouc" onclick={() => (isOpen = false)}
                            >F.O.U.C.</a
                        >
                    </dd>
                    <dd>
                        <a
                            href="#scrolltrigger"
                            onclick={() => (isOpen = false)}>ScrollTrigger</a
                        >
                    </dd>
                    <dd>
                        <a href="#morphsvg" onclick={() => (isOpen = false)}
                            >MorphSVG</a
                        >
                    </dd>
                </dl>
            </div>
        </article>
    </aside>
{:else}
    <!-- mobile toc -->
    <article class="table-of-contents">
        <div class="css">
            <dl>
                <dt>CSS</dt>

                <dd><a href="#transitions">Transitions</a></dd>
                <dd><a href="#animations">Animations</a></dd>
                <dd><a href="#interpolate">Interpolate</a></dd>
                <dd><a href="#calc">Calc-Size</a></dd>
                <dd><a href="#details">Details</a></dd>
                <dd><a href="#view">View Transitions</a></dd>
                <dd><a href="#anchor">Anchor Positions</a></dd>
            </dl>
        </div>

        <div class="gsap">
            <dl>
                <dt>GSAP</dt>

                <dd><a href="#tweens">Tweens</a></dd>
                <dd><a href="#staggers">Staggers</a></dd>
                <dd><a href="#timelines">Timelines</a></dd>
                <dd><a href="#percentage">Keyframes</a></dd>
                <dd><a href="#position">Positioning</a></dd>
                <dd><a href="#fouc">F.O.U.C.</a></dd>
                <dd><a href="#scrolltrigger">ScrollTrigger</a></dd>
                <dd><a href="#morphsvg">MorphSVG</a></dd>
            </dl>
        </div>
    </article>
{/if}

<style>
    .table-of-contents {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        background: transparent;
        height: fit-content;
        box-shadow: none;
        padding-bottom: 6em;
        margin: 0;
        padding: 0;

        @media (width <= 1200px) {
            padding-bottom: 2em;
        }

        @media (width <= 768px) {
            grid-template-columns: 1fr;
        }

        @media (width <= 500px) {
            padding-bottom: 2em;
        }

        & dt {
            display: block;
            color: var(--clr-gray-600);
            font-family: var(--bronova-bold);
            font-size: clamp(var(--h6), 3vw, var(--h4));
            letter-spacing: 3px;
            margin-bottom: 1rem;
        }

        & .css,
        & .gsap {
            margin: 1em;

            & dl {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                & dd {
                    font-size: clamp(var(--sm), 2vw, var(--h6));
                    font-weight: 600;
                    text-wrap: balance;

                    & a {
                        color: var(--clr-blue-350);

                        &:visited {
                            color: var(--clr-gray-700);
                        }
                    }
                }
            }
        }
    }

    .toggle-button {
        position: fixed;
        top: 0;
        left: 0.25em;
        z-index: 100;
        background: transparent;
        border: none;
        box-shadow: none;
        cursor: pointer;
        inline-size: 2em;
        block-size: 2em;
        color: var(--clr-light-400);
        font-size: clamp(var(--h5), 4.5vw, var(--h1));
        transition: transform 0.3s ease-out;
        rotate: 180deg;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;

        @media (width <= 1465px) {
            top: 2em;
        }

        @media (width <= 1150px) {
            top: 2.5em;
        }

        @media (width <= 1080px) {
            top: 3em;
        }

        @media (width <= 990px) {
            top: 3em;
        }

        @media (width <= 768px) {
            display: none;
        }

        & svg {
            inline-size: clamp(2em, 5vw, 4em);
            block-size: clamp(2em, 5vw, 4em);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .arrow {
        inline-size: 100%;
        block-size: 100%;
        transition: rotate 0.3s ease-out;
    }

    .toggle-button.open .arrow {
        rotate: 180deg;
    }

    .side-bar {
        position: fixed;
        top: 0;
        left: 0;
        block-size: 100vh;
        inline-size: clamp(200px, 20vw, 300px);
        background: linear-gradient(
            to right,
            var(--clr-gray-900) 95%,
            transparent
        );
        z-index: 99;
        transform: translateX(-110%);
        transition: transform 0.3s ease-out;
        opacity: 1;

        display: flex;
        justify-content: center;
        align-items: center;

        @media (width <= 768px) {
            inline-size: 75vw;
        }

        &.open {
            transform: translateX(0);
        }

        & .table-of-contents {
            grid-template-columns: 1fr;
            padding-top: 10em;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            & .css,
            & .gsap {
                margin: 0;

                & dt {
                    color: var(--clr-light-500);
                    font-size: clamp(var(--h6), 1.5vw, var(--h4));
                    font-weight: 200;
                    margin: 0 0 0.2em 0;
                    text-align: center;
                    opacity: 0.5;
                }

                & dd {
                    text-align: center;
                    font-size: clamp(var(--xs), 1.2vw, var(--sm));

                    & a {
                        font-family: var(--bronova);
                        font-weight: 200;

                        &:visited {
                            color: var(--clr-light-500);
                        }
                    }
                }
            }

            & dl {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
