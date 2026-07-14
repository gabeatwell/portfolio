<script lang="ts">
    interface Props {
        title: string;
        videoSrc: string;
    }

    let { title, videoSrc }: Props = $props();

    const videoId = `video-popover-${Math.random().toString(36).slice(2, 11)}`;
    let videoPopoverElement: HTMLElement | null = $state(null);

    function openVideoPopover() {
        setTimeout(() => {
            const el = videoPopoverElement;
            if (!el) {
                console.error('Popover element not found!');
                return;
            }

            // Check if Popover API is supported
            if (typeof el.showPopover === 'function') {
                if (!document.startViewTransition) {
                    el.showPopover();
                    return;
                }

                document.startViewTransition(() => {
                    el.showPopover();
                });
            } else {
                // Fallback for unsupported browsers: manually show/hide via CSS classes
                console.warn('Popover API not supported. Using fallback.');
                el.style.display = 'block';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        }, 0);
    }

    function closeVideoPopover() {
        const el = videoPopoverElement;
        if (!el) return;

        if (typeof el.hidePopover === 'function') {
            if (!document.startViewTransition) {
                el.hidePopover();
                return;
            }

            document.startViewTransition(() => {
                el.hidePopover();
            });
        } else {
            // Fallback: manually hide
            el.style.opacity = '0';
            el.style.transform = 'translateY(-5rem)';
            el.style.display = 'none';
        }
    }
</script>

<section class="video-popover" aria-label="pwa video tutorial">
    <button class="open-popover" type="button" onclick={openVideoPopover}>
        {title}
    </button>

    <div
        id={videoId}
        popover="auto"
        bind:this={videoPopoverElement}
        data-video-popover
    >
        <div class="video-wrapper">
            <div class="responsive-iframe">
                <iframe
                    src={videoSrc}
                    {title}
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
                    allowfullscreen
                    aria-label={title}
                ></iframe>
            </div>
        </div>
    </div>
</section>

<style>
    .video-popover {
        display: inline-block;

        .open-popover {
            background-color: transparent;
            filter: brightness(1);
            color: var(--clr-green-500);
            inline-size: fit-content;
            font-family: var(--bronova);
            font-size: clamp(var(--h6), 1.5vw, var(--h4));
            font-weight: 600;
            margin: 0;
            padding: 0;
            border: none;
            cursor: pointer;
            min-block-size: 44px;
            min-inline-size: 44px;
            transition: scale 0.15s ease-out;

            &:not(:hover) {
                opacity: 0.85;
            }

            &:active {
                scale: 0.925;
            }

            &:focus {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
            }
        }

        & [popover][data-video-popover] {
            inline-size: min(95%, 900px);
            max-block-size: 90vh;
            padding: 1rem 0;
            margin-inline: auto;
            margin-block: auto;
            position: fixed;
            inset: 0;
            overflow: clip;
            color: var(--clr-light-500);

            @media (width <= 768px) {
                inline-size: 95%;
                max-block-size: 50vh;
            }

            @media (width <= 500px) {
                inline-size: 98%;
                max-block-size: 40vh;
                padding-top: 3rem;
            }
        }
    }

    .video-wrapper {
        inline-size: 100%;
        max-inline-size: 800px;
        margin-inline: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        block-size: clamp(40vh, 75vh, 80vh);

        @media (width <= 768px) {
            align-items: start;
        }

        & .responsive-iframe {
            position: relative;
            inline-size: 100%;
            max-inline-size: 100%;
            block-size: 0;
            padding-bottom: 56.25%;
            overflow: clip;
            border: 2px solid var(--dark-gray);
            border-radius: var(--radius);

            & iframe {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
            }
        }
    }

    [popover] {
        border: 3px solid var(--clr-gray-700);
        border-radius: 0.5rem;
        box-shadow: var(--blackest) 0px 20px 25px -5px;
        display: none;
        opacity: 0;
        transform: translateY(2rem);
        transform-origin: center center;

        position: fixed;
        inset-inline: 0;
        margin-inline: auto;
        top: 5em;
        inline-size: 80%;

        /* close state */
        display: none;
        opacity: 0;
        transform: translateY(2rem);
        scale: 0;
        overlay: none;

        transition:
            opacity 0.5s allow-discrete,
            transform 0.5s allow-discrete,
            display 0.5s allow-discrete,
            scale 0.5s allow-discrete,
            overlay 0.5s allow-discrete;
    }

    /* open state */
    [popover]:popover-open {
        display: block;
        opacity: 1;
        scale: 1;
        transform: translateY(0);
        overlay: auto;
    }

    /* entry animation */
    @starting-style {
        [popover]:popover-open {
            opacity: 0;
            scale: 0;
            transform: translateY(2rem);
        }
    }

    /* backdrop */
    [popover]::backdrop {
        background-color: rgb(0 0 0 / 0%);
        transition:
            display 0.5s allow-discrete,
            overlay 0.5s allow-discrete,
            background-color 0.5s;
    }

    [popover]:popover-open::backdrop {
        background-color: rgb(0 0 0 / 50%);
        backdrop-filter: blur(4px);
    }

    @starting-style {
        [popover]:popover-open::backdrop {
            background-color: rgb(0 0 0 / 0%);
        }
    }

    /* title transition */
    ::view-transition-group(video-title) {
        animation-duration: 0.5s;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    ::view-transition-old(video-title),
    ::view-transition-new(video-title) {
        mix-blend-mode: normal;
    }
</style>
