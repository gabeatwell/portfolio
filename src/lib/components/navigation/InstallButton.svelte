<script lang="ts">
    import '@fortawesome/fontawesome-free/css/all.css';
    import A11yAnnouncer from '$lib/components/utils/A11yAnnouncer.svelte';
    import { useSound } from '$lib/data/stores/sounds/uiSounds.svelte';
    import { InstallButtonController } from './install-button.svelte';

    const install = new InstallButtonController();

    const { playSoundAsync: playHoverSound } = useSound(
        '/sounds/foley-bubble.wav',
    );

    async function handleUiSound() {
        await playHoverSound();
    }
</script>

<A11yAnnouncer message={install.installStatus} />

{#if install.isIOS}
    {#if !install.shareClicked}
        <button
            aria-label="Share this app"
            onclick={install.shareApp}
            onmouseenter={handleUiSound}
        >
            <i class="fa-solid fa-share-from-square"></i>

            <span class="desc">install</span>
        </button>install.
    {/if}
    {#if install.shareFallback}
        <div class="apple-instructions">
            <p><u>On iOS:</u></p>

            <p>
                open the Safari browser. Tap the Share icon
                <span>
                    (<svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        id="Apple-Share-Icon"
                        height="21"
                        width="21"
                        class="share-icon"
                    >
                        <title>iOS Share Icon</title>
                        <path
                            fill="var(--clr-light-500)"
                            d="M5.5 23c-0.4 0 -0.75 -0.15 -1.05 -0.45 -0.3 -0.3 -0.45 -0.65 -0.45 -1.05V8.775c0 -0.4 0.15 -0.75 0.45 -1.05 0.3 -0.3 0.65 -0.45 1.05 -0.45h4.225v1.5H5.5V21.5h13V8.775h-4.275v-1.5H18.5c0.4 0 0.75 0.15 1.05 0.45 0.3 0.3 0.45 0.65 0.45 1.05V21.5c0 0.4 -0.15 0.75 -0.45 1.05 -0.3 0.3 -0.65 0.45 -1.05 0.45H5.5Zm5.725 -7.675V3.9l-2.2 2.2 -1.075 -1.075L11.975 1 16 5.025l-1.075 1.075 -2.2 -2.2v11.425h-1.5Z"
                            stroke="var(--clr-blue-350)"
                            stroke-width=".8"
                        ></path>
                    </svg>)
                </span>
                in Safari's toolbar and choose <b>'Add to Home Screen'</b> to install
                this app.
            </p>

            <p><u>On iMac:</u></p>

            <p>
                Do the same process but choose <b>'Add to Dock'</b> to install this
                app.
            </p>

            <button data-close-button onclick={install.closeFallback}
                >Close</button
            >
        </div>
    {/if}
{:else}
    <button
        aria-label="Install this app as a PWA"
        onclick={install.installApp}
        onmouseenter={handleUiSound}
        hidden={!install.isInstallable}
    >
        <i class="fa-solid fa-file-arrow-down"></i>
        <span class="desc">install</span>
    </button>
{/if}

<style>
    button {
        width: fit-content;
        margin-inline: auto;
        font-family: var(--bronova);
        font-size: clamp(var(--sm), 2vw, var(--h4));
        font-weight: 700;
        background-color: var(--clr-light-500);
        color: var(--clr-dark-500);
        outline: 3px solid var(--clr-dark-500);
        outline-offset: -7px;
        border: 1px solid var(--clr-dark-500);
        border-radius: var(--radius);
        transition:
            300ms,
            scale 0.15s ease-out;
        cursor: pointer;
        pointer-events: auto;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        position: fixed;
        bottom: 1em;
        right: 1em;
        opacity: 1;
        view-transition-name: installbtn;

        @media (width <= 768px) {
            bottom: 2.5em;
        }

        &:focus-visible {
            outline: 1px solid var(--clr-light-500);
            background: transparent;
            color: var(--clr-light-500);
        }

        &:hover {
            opacity: 0.95;
            outline-offset: 0px;
        }

        &:active {
            scale: 0.95;
        }

        & i {
            font-size: clamp(var(--h6), 1.5vw, var(--h4));
            color: var(--clr-dark-500);
            align-items: center;
            cursor: pointer;
        }
        & .desc {
            font-size: clamp(var(--h6), 1.5vw, var(--h4));
            font-weight: 900;
            margin-top: 0.5rem;
            cursor: pointer;
        }

        @media (width >= 750px) {
            bottom: 1em;
            right: 2em;
        }

        @media (width <= 500px) {
            margin: 1em;
        }
    }

    .apple-instructions {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        anchor-name: --instructions;
        inline-size: fit-content;
        min-inline-size: 75vw;

        background: var(--clr-dark-500);
        color: var(--clr-light-500);
        padding: 1em;
        border: 1px solid var(--clr-light-500);
        border-radius: var(--radius);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideUp 0.5s ease-out forwards;

        & p {
            font-size: clamp(var(--sm), 1.2vw, var(--h6));
            margin-bottom: 0.5em;

            &:nth-of-type(1),
            &:nth-of-type(3) {
                font-family: var(--bronova-bold);
            }

            & b {
                font-weight: 900;
                color: var(--clr-blue-350);
            }

            & .share-icon {
                display: inline-block;
                width: clamp(var(--h6), 1.2vw, var(--h4));
                height: auto;
                vertical-align: middle;
                max-width: 100%;
                max-height: 100%;
            }
        }
    }

    [data-close-button] {
        position: absolute;
        position-anchor: --instructions;
        bottom: calc(anchor(bottom) + 0.05em);
        left: calc(anchor(right) + 0.05em);
        margin-left: 1em;

        background-color: var(--clr-dark-500);
        color: var(--clr-light-500);
        padding: 0.5em 1em;

        border: 1px solid var(--clr-light-500);
        margin-top: 0;
        cursor: pointer;
        font-family: var(--bronova-bold);
        font-size: clamp(var(--sm), 1.2vw, var(--h6));
    }

    @keyframes slideUp {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
