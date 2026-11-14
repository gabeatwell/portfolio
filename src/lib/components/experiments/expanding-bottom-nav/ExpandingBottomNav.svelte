<script lang="ts">
    import { gsap } from '#lib/data/gsap.js';
    import type { Attachment } from 'svelte/attachments';

    interface NavItem {
        label: string;
        href: string;
    }

    interface Props {
        items?: NavItem[];
    }

    let {
        items = [
            { label: 'Home', href: '/' },
            { label: 'Work', href: '/projects' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
        ],
    }: Props = $props();

    const CLOSED_SIZE = 60;
    const OPEN_RADIUS = 26;
    const MAX_WIDTH = 340;
    const VIEWPORT_GAP = 24;
    /** Open menu aspect ratio, width : height. */
    const ASPECT = 9 / 16;

    let isOpen = $state(false);
    let toggleEl: HTMLButtonElement | undefined;
    let shellEl: HTMLElement | undefined;
    let tl: gsap.core.Timeline | null = null;
    let ctx: gsap.Context | null = null;

    function getOpenSize() {
        const availableHeight = window.innerHeight - VIEWPORT_GAP * 2;
        const width = Math.min(
            window.innerWidth * 0.92,
            MAX_WIDTH,
            availableHeight * ASPECT,
        );

        return { width, height: width / ASPECT };
    }

    function buildTimeline() {
        const node = shellEl;
        if (!node) return;

        ctx?.revert();
        tl?.kill();
        tl = null;

        const links = Array.from(
            node.querySelectorAll<HTMLElement>('.nav-link'),
        );
        const eyebrow = node.querySelector<HTMLElement>('.nav-eyebrow');
        const line1 = node.querySelector<HTMLElement>('.nav-line-1');
        const line2 = node.querySelector<HTMLElement>('.nav-line-2');
        const line3 = node.querySelector<HTMLElement>('.nav-line-3');
        const reveals = [eyebrow, ...links].filter(
            (el): el is HTMLElement => el !== null,
        );

        const { width, height } = getOpenSize();
        const reduce = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        const speed = reduce ? 0 : 1;

        ctx = gsap.context(() => {
            gsap.set(node, {
                width: CLOSED_SIZE,
                height: CLOSED_SIZE,
                borderRadius: CLOSED_SIZE / 2,
            });
            gsap.set(reveals, { autoAlpha: 0, y: 18 });
            gsap.set([line1, line2, line3], {
                y: 0,
                rotation: 0,
                autoAlpha: 1,
                scaleX: 1,
            });

            tl = gsap.timeline({ paused: true });

            // 1. Widen the pill into the menu's full width.
            tl.to(
                node,
                {
                    width,
                    borderRadius: OPEN_RADIUS,
                    duration: 0.4 * speed,
                    ease: 'power3.out',
                },
                0,
            )
                .to(
                    line1,
                    {
                        y: 7,
                        rotation: 45,
                        duration: 0.36 * speed,
                        ease: 'power2.inOut',
                    },
                    0,
                )
                .to(
                    line2,
                    {
                        autoAlpha: 0,
                        scaleX: 0.2,
                        duration: 0.18 * speed,
                    },
                    0,
                )
                .to(
                    line3,
                    {
                        y: -7,
                        rotation: -45,
                        duration: 0.36 * speed,
                        ease: 'power2.inOut',
                    },
                    0,
                )
                // 2. Drop the panel down until the shell reaches 9:16.
                .to(
                    node,
                    {
                        height,
                        duration: 0.52 * speed,
                        ease: 'power3.inOut',
                    },
                    0.32 * speed,
                )
                // 3. Reveal the links once the panel has room.
                .to(
                    reveals,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.38 * speed,
                        stagger: 0.055 * speed,
                        ease: 'power2.out',
                    },
                    0.6 * speed,
                );
        }, node);
    }

    const menuAnimation: Attachment<HTMLElement> = (node) => {
        shellEl = node;
        buildTimeline();

        const ac = new AbortController();
        let frame = 0;

        const onResize = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                if (!isOpen) {
                    // Drop the stale timeline; it is rebuilt on next open.
                    ctx?.revert();
                    ctx = null;
                    tl = null;
                    return;
                }

                buildTimeline();
                tl?.progress(1);
            });
        };

        window.addEventListener('resize', onResize, { signal: ac.signal });

        return () => {
            cancelAnimationFrame(frame);
            ac.abort();
            tl?.kill();
            ctx?.revert();
            tl = null;
            ctx = null;
            shellEl = undefined;
        };
    };

    function open() {
        if (!tl) buildTimeline();
        isOpen = true;
        tl?.play();
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        tl?.reverse();
    }

    function toggle() {
        if (isOpen) close();
        else open();
    }

    function handleLinkClick() {
        close();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== 'Escape' || !isOpen) return;
        close();
        toggleEl?.focus();
    }

    function handleWindowPointerDown(event: PointerEvent) {
        if (!isOpen) return;
        if (event.target instanceof Node && shellEl?.contains(event.target)) {
            return;
        }
        close();
    }
</script>

<svelte:window
    onkeydown={handleKeydown}
    onpointerdown={handleWindowPointerDown}
/>

<nav class="top-nav" aria-label="Main navigation">
    <div class="nav-shell" class:is-open={isOpen} {@attach menuAnimation}>
        <button
            class="nav-toggle"
            type="button"
            bind:this={toggleEl}
            onclick={toggle}
            aria-expanded={isOpen}
            aria-controls="expanding-nav-panel"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
            <span class="nav-burger" aria-hidden="true">
                <span class="nav-line nav-line-1"></span>
                <span class="nav-line nav-line-2"></span>
                <span class="nav-line nav-line-3"></span>
            </span>
        </button>

        <div id="expanding-nav-panel" class="nav-panel" inert={!isOpen}>
            <p class="nav-eyebrow">Navigate</p>

            <ul class="nav-list">
                {#each items as item, i (item.href)}
                    <li>
                        <a
                            class="nav-link"
                            href={item.href}
                            onclick={handleLinkClick}
                        >
                            <span class="nav-index"
                                >{String(i + 1).padStart(2, '0')}</span
                            >
                            <span class="nav-label">{item.label}</span>
                            <span class="nav-arrow" aria-hidden="true">↗</span>
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</nav>

<style>
    .top-nav {
        position: fixed;
        inset-block-start: 10em;
        inset-inline-start: 50%;
        translate: -50% 0;
        z-index: 120;
        display: flex;
        justify-content: center;
        pointer-events: none;

        @media (width <= 767px) {
            inset-block-start: 5em;
        }
    }

    .nav-shell {
        position: relative;
        display: flex;
        flex-direction: column;
        inline-size: 60px;
        block-size: 60px;
        overflow: hidden;
        pointer-events: auto;
        border: 1px solid
            color-mix(in oklch, var(--clr-light-500) 14%, transparent);
        border-radius: 999px;
        background:
            radial-gradient(
                120% 90% at 50% 100%,
                color-mix(in oklch, var(--accent) 14%, transparent),
                transparent 72%
            ),
            var(--clr-dark-500);
        box-shadow:
            0 18px 44px rgb(0 0 0 / 0.35),
            inset 0 0 0 1px rgb(255 255 255 / 0.04);
        will-change: width, height;
    }

    .nav-toggle {
        position: relative;
        z-index: 1;
        display: grid;
        flex: 0 0 60px;
        place-items: center;
        inline-size: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--clr-light-500);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;

        &:focus-visible,
        &:focus {
            outline: 1px solid var(--clr-light-500);
            outline-offset: -10px;
            border-radius: 999px;
            box-shadow: none;
        }

        .nav-burger {
            position: relative;
            display: block;
            inline-size: 22px;
            block-size: 16px;

            .nav-line {
                position: absolute;
                inset-inline: 0;
                block-size: 2px;
                border-radius: 2px;
                background: currentColor;
                transform-origin: center;
            }

            .nav-line-1 {
                inset-block-start: 0;
            }

            .nav-line-2 {
                inset-block-start: 7px;
            }

            .nav-line-3 {
                inset-block-start: 14px;
            }
        }
    }

    .nav-panel {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-block-size: 0;
        gap: clamp(0.5rem, 2vh, 1rem);
        padding: clamp(0.5rem, 2vh, 1rem) clamp(1.15rem, 5vw, 1.6rem)
            clamp(1.25rem, 5vh, 2rem);
        overflow: hidden;
        pointer-events: none;

        .nav-shell.is-open & {
            pointer-events: auto;
        }
    }

    .nav-eyebrow {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin: 0;
        color: var(--clr-light-500-fade);
        font-family: var(--serif);
        font-size: 0.68rem;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        white-space: nowrap;

        &::after {
            content: '';
            flex: 1;
            block-size: 1px;
            background: color-mix(
                in oklch,
                var(--clr-light-500) 18%,
                transparent
            );
        }
    }

    .nav-list {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-evenly;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .nav-link {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: baseline;
        gap: 0.7rem;
        padding-block: clamp(0.35rem, 1.2vh, 0.65rem);
        color: var(--clr-light-500-fade);
        text-decoration: none;
        white-space: nowrap;
        border-block-end: 1px solid
            color-mix(in oklch, var(--clr-light-500) 12%, transparent);

        &:focus-visible {
            outline: 2px solid var(--clr-light-500);
            outline-offset: 4px;
            border-radius: 6px;
        }
    }

    .nav-list li:last-child .nav-link {
        border-block-end: 0;
    }

    .nav-index {
        font-family: var(--mono);
        font-size: 0.62rem;
        color: var(--clr-light-500-fade);
    }

    .nav-label {
        font-family: var(--bronova-bold);
        font-size: clamp(1.55rem, 6.5vw, 2.15rem);
        font-weight: 500;
        line-height: 1.05;
        letter-spacing: -0.02em;
        transition: transform 0.25s ease;
    }

    .nav-arrow {
        font-size: 0.9rem;
        color: var(--clr-light-500-fade);
        opacity: 0;
        translate: -4px 4px;
        transition:
            opacity 0.2s ease,
            translate 0.2s ease;
    }

    .nav-link:hover .nav-label {
        transform: translateX(0.2rem);
    }

    .nav-link:hover .nav-arrow {
        opacity: 1;
        translate: 0 0;
    }

    @media (prefers-reduced-motion: reduce) {
        .nav-label,
        .nav-arrow {
            transition: none;
        }
    }
</style>
