<script lang="ts">
    import {
        playVid,
        pauseVid,
        stopVid,
        changeVol,
        togglePlay,
        handleKeydown,
        handleLoadedMetadata,
        handleTimeUpdate,
        handleSeek,
    } from './VideoPlayerLogic';

    interface Props {
        src: string;
        captions?: string;
        noControls?: boolean;
        isFaded?: boolean;
        width?: string;
    }

    let {
        src,
        captions,
        noControls = false,
        isFaded = false,
        width = '650px',
    }: Props = $props();
    let video: HTMLVideoElement;
    let duration = $state<number>(0);
    let currentTime = $state<number>(0);
    let maskStyle = $derived(
        isFaded
            ? '-webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 0) 100%); mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 0) 100%);'
            : '',
    );
    let playVidHandler = () => playVid(video);
    let pauseVidHandler = () => pauseVid(video);
    let stopVidHandler = () => {
        currentTime = stopVid(video, currentTime);
    };
    let changeVolHandler = (event: Event) => changeVol(event, video);
    let handleKeydownHandler = (event: KeyboardEvent) =>
        handleKeydown(event, video);
    let handleLoadedMetadataHandler = () => {
        duration = handleLoadedMetadata(video, duration);
    };
    let handleTimeUpdateHandler = () => {
        currentTime = handleTimeUpdate(video, currentTime);
    };
    let handleSeekHandler = (event: Event) => {
        currentTime = handleSeek(video, event, currentTime);
    };
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="video-wrapper"
    tabindex="0"
    onkeydown={handleKeydownHandler}
    aria-label="Press space to play or pause."
    role="application"
>
    <div class="video-frame">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video
            bind:this={video}
            class="video-element"
            autoplay
            loop
            muted
            onloadedmetadata={handleLoadedMetadataHandler}
            ontimeupdate={handleTimeUpdateHandler}
            style={maskStyle}
        >
            <source {src} type="video/mp4" />

            {#if captions}
                <track kind="captions" src={captions} default />
            {/if}
        </video>

        <!-- seek bar -->
        {#if duration > 0}
            <div class="seek-bar" class:no-controls={noControls}>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={currentTime}
                    oninput={handleSeekHandler}
                    aria-label="Seek video"
                />
            </div>
        {/if}

        <div class="controls" class:no-controls={noControls}>
            <button
                type="button"
                class="control-btn"
                aria-label="Play"
                onclick={playVidHandler}
            >
                <img
                    src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@assets-1/images/play.webp"
                    alt=""
                    loading="lazy"
                />
            </button>
            <button
                type="button"
                class="control-btn"
                aria-label="Pause"
                onclick={pauseVidHandler}
            >
                <img
                    src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@assets-1/images/pause.webp"
                    alt=""
                    loading="lazy"
                />
            </button>
            <button
                type="button"
                class="control-btn"
                aria-label="Stop"
                onclick={stopVidHandler}
            >
                <img
                    src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@assets-1/images/stop.webp"
                    alt=""
                    loading="lazy"
                />
            </button>

            <div class="volume">
                <img
                    src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@assets-1/images/volume.webp"
                    alt="volume"
                />

                <input
                    type="range"
                    step="0.05"
                    min="0"
                    max="1"
                    value="1"
                    oninput={changeVolHandler}
                    aria-label="Volume"
                />
            </div>
        </div>
    </div>
</div>

<style>
    .video-wrapper {
        display: flex;
        justify-content: center;
        margin-inline: auto;
        padding: 1rem;
        max-inline-size: 60rem;
        border-radius: var(--radius);

        & .video-frame {
            position: relative;
            inline-size: 100%;
            max-inline-size: 640px;
            background-color: #242424;
            border-radius: var(--radius);
            overflow: clip;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);

            & .video-element {
                display: block;
                inline-size: 100%;
                block-size: auto;
            }

            & .seek-bar {
                padding: 0.4rem 0.9rem 0.2rem;
                background: rgba(0, 0, 0, 0.7);

                &.no-controls {
                    display: none;
                }

                & input[type='range'] {
                    inline-size: 100%;
                }
            }
        }

        & .controls {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.6rem 0.9rem;
            background: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.9),
                rgba(0, 0, 0, 0.6)
            );

            &.no-controls {
                display: none;
            }

            & .control-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                inline-size: 2em;
                block-size: 2em;

                &:first-child {
                    inline-size: 1.5em;
                    scale: 1 1.75;
                }

                &:nth-child(2) {
                    scale: 1 1.75;
                }

                &:nth-child(3) {
                    scale: 1 1.75;
                }

                &:img {
                    inline-size: 1.5em;
                    block-size: 1.5em;
                    filter: invert(1);
                }

                &:focus-visible {
                    outline: 2px solid var(--clr-light-500);
                    outline-offset: 2px;
                }
            }

            & .volume {
                margin-left: auto;
                display: flex;
                align-items: center;
                gap: 0.5rem;

                & img {
                    inline-size: 1.2em;
                    block-size: 1.2em;
                    filter: invert(1);
                }

                & input[type='range'] {
                    inline-size: 120px;
                }
            }
        }

        & input[type='range'] {
            -webkit-appearance: none;
            appearance: none;
            background-color: transparent;

            &::-webkit-slider-runnable-track {
                background: var(--clr-dark-500);
            }
            &::-moz-range-track {
                background: var(--clr-dark-500);
            }
            &::-ms-track {
                background: var(--clr-dark-500);
                border-color: transparent;
                color: transparent;
            }
            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                background: var(--clr-light-500);
                border: 2px solid #000;
                cursor: pointer;
            }
            &::-moz-range-thumb {
                background: var(--clr-light-500);
                border: 2px solid #000;
                cursor: pointer;
            }
            &::-ms-thumb {
                background: var(--clr-light-500);
                border: 2px solid #000;
                cursor: pointer;
            }
            &::-moz-range-progress {
                background: var(--clr-blue-500);
            }
        }
    }
</style>
