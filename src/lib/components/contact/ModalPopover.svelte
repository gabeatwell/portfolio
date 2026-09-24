<script lang="ts">
    import A11yAnnouncer from '$lib/components/utils/A11yAnnouncer.svelte';
    import Image from '$lib/components/layout/Image.svelte';
    import '@fortawesome/fontawesome-free/css/all.css';

    let statusMessage = $state<string>('');
</script>

<A11yAnnouncer message={statusMessage} />

<button
    class="open-button"
    aria-label="Open contact information modal"
    popovertarget="modal"
    popovertargetaction="show"
>
    <span class="visually-hidden">Open contact information modal</span>

    <svg
        width="800px"
        height="800px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 12.0001H12.01M12 7.00012V9.00012M3.02832 10.0001L10.2246 14.8167C10.8661 15.2444 11.1869 15.4582 11.5336 15.5413C11.8399 15.6147 12.1593 15.6147 12.4657 15.5413C12.8124 15.4582 13.1332 15.2444 13.7747 14.8167L20.971 10.0001M10.2981 4.06892L4.49814 7.71139C3.95121 8.05487 3.67775 8.2266 3.4794 8.45876C3.30385 8.66424 3.17176 8.90317 3.09111 9.16112C3 9.45256 3 9.77548 3 10.4213V16.8001C3 17.9202 3 18.4803 3.21799 18.9081C3.40973 19.2844 3.71569 19.5904 4.09202 19.7821C4.51984 20.0001 5.0799 20.0001 6.2 20.0001H17.8C18.9201 20.0001 19.4802 20.0001 19.908 19.7821C20.2843 19.5904 20.5903 19.2844 20.782 18.9081C21 18.4803 21 17.9202 21 16.8001V10.4213C21 9.77548 21 9.45256 20.9089 9.16112C20.8282 8.90317 20.6962 8.66424 20.5206 8.45876C20.3223 8.2266 20.0488 8.05487 19.5019 7.71139L13.7019 4.06891C13.0846 3.68129 12.776 3.48747 12.4449 3.41192C12.152 3.34512 11.848 3.34512 11.5551 3.41192C11.224 3.48747 10.9154 3.68129 10.2981 4.06892Z"
            stroke="var(--clr-light-500)"
            fill="var(--clr-dark-500)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</button>

<div id="modal" class="contact-modal" aria-labelledby="modal-title" popover>
    <article class="modal-inner">
        <header>
            <h4 class="modal-title" id="modal-title">
                Please contact me for any work!
            </h4>
        </header>

        <div class="modal-image">
            <Image
                src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/newspaper.webp"
                alt="newspaper clipping for a frontend developer"
                width="500"
                aspectRatio="16/9"
            />
        </div>

        <p class="modal-description">
            If you need help with a website or if you have any questions, please
            feel free to contact me. I am always happy to help!
        </p>
    </article>

    <button
        class="close-button"
        aria-label="Close contact information modal"
        popovertarget="modal"
        popovertargetaction="hide"
    >
        <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8.00191 9.41621C7.61138 9.02569 7.61138 8.39252 8.00191 8.002C8.39243 7.61147 9.0256 7.61147 9.41612 8.002L12.0057 10.5916L14.5896 8.00771C14.9801 7.61719 15.6133 7.61719 16.0038 8.00771C16.3943 8.39824 16.3943 9.0314 16.0038 9.42193L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.004C15.6133 16.3945 14.9802 16.3945 14.5896 16.004L12.0057 13.42L9.42192 16.0038C9.03139 16.3943 8.39823 16.3943 8.00771 16.0038C7.61718 15.6133 7.61718 14.9801 8.00771 14.5896L10.5915 12.0058L8.00191 9.41621Z"
                fill="var(--clr-fail-500)"
                stroke="var(--clr-fail-500)"
                stroke-width="1.15"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"
                fill="var(--clr-fail-500)"
                stroke="var(--clr-fail-500)"
                stroke-width="1.15"
            />
        </svg>
    </button>
</div>

<style>
    :root {
        --modal-transition:
            opacity 0.3s ease-out, visibility 0.5s ease-out,
            transform 0.75s ease-out;
        --modal-transition-mobile:
            opacity 0.65s ease-out, visibility 0.75s ease-out,
            transform 1.5s ease-out;
    }

    .contact-modal {
        inline-size: 100vw;
        block-size: 70vh;
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transform: scale(0.97);
        transition: var(--modal-transition);
        background: none;
        z-index: 50;
        overflow: clip;
        border: none;

        &:popover-open {
            opacity: 1;
            visibility: visible;
            transform: scale(1);

            animation: heartbeat 0.8s ease;
        }

        &::backdrop {
            background-color: var(--clr-dark-500);
            background: transparent;
            backdrop-filter: blur(10px);
            box-shadow: none;
        }

        @media (width >= 320px) {
            inline-size: 93%;
            block-size: 85%;
            margin-inline: auto;
        }

        @media (width <= 768px) {
            max-inline-size: 95vw;
            display: block;
            inline-size: 100%;
            padding: 1rem;
            transition: var(--modal-transition-mobile);
            margin-top: 2em;
        }

        & .modal-inner {
            inline-size: 100%;
            max-inline-size: 50vw;
            block-size: 76vh;
            border: 2px solid var(--clr-gray-700);
            border-radius: 1rem;
            background: var(--clr-dark-500);
            margin-top: 10em;
            overflow: clip;

            anchor-name: --inner-anchor;

            @media (width <= 1500px) {
                overflow-y: auto;
            }

            @media (width <= 768px) {
                max-inline-size: 90vh;
                min-block-size: 40vh;
                padding: 2em 1em;
            }

            @media (width <= 500px) {
                padding: 3em 1em 0 1rem;
                margin-top: 0;
            }

            & header {
                background: transparent;
                border-bottom: none;
                padding-bottom: 0;

                & .modal-title {
                    font-family: var(--mono);
                    font-size: clamp(var(--h5), 3vw, var(--h2));
                    font-weight: 800;
                    line-height: 1;
                    color: var(--clr-blue-500);
                    margin: -0.5rem 0 -2rem 0;
                    letter-spacing: -1px;
                    text-wrap: pretty;

                    @media (width >= 1024px) {
                        line-height: 0.95;
                    }

                    @media (width >= 1100px) {
                        padding: 0.5rem;
                    }

                    @media (width <= 768px) {
                        margin-top: 1.5em;
                    }
                }
            }

            & .modal-description {
                font-family: var(--bronova);
                font-size: clamp(var(--h6), 1.25vw, var(--h4));
                font-weight: 300;
                color: oklch(from var(--clr-light-500) 0.65 c h);
                background: transparent;
                hyphens: auto;
                text-wrap: no-wrap;
                letter-spacing: 0px;
                margin-top: 1em;
                max-inline-size: 100%;
                word-break: break-word;
                overflow-wrap: break-word;
                white-space: normal;
                padding-bottom: 0;

                @media (width >= 1024px) {
                    line-height: 1.75;
                    margin-inline: auto;
                }
            }
        }

        & .modal-image {
            inline-size: fit-content;
            margin-inline: auto;
            filter: drop-shadow(
                    -3px -3px 0px oklch(from var(--clr-gray-700) 0.45 c h)
                )
                drop-shadow(
                    3px 3px 0px oklch(from var(--clr-gray-700) 0.45 c h)
                );

            @media (width >= 1024px) {
                margin-block: 1rem;
            }
        }
    }

    .close-button {
        position: absolute;
        position-anchor: --inner-anchor;
        inset-block-start: calc(anchor(top) + 0.05em);
        inset-inline-end: calc(anchor(end) + 0.2em);

        display: flex;

        max-inline-size: 3.75rem;
        max-block-size: 3.75rem;
        inline-size: 100%;
        block-size: 100%;
        min-inline-size: 2rem;
        min-block-size: 2rem;

        font-size: clamp(var(--h2), 4vw, var(--xl));
        font-weight: 800;
        background-color: transparent;
        box-shadow: none;
        outline: none;
        border: none;
        border-radius: 15px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 0.75rem;
        color: var(--clr-light-500);
        transition: scale 0.15s ease-out;

        &:hover {
            animation: wiggle 1s ease-out infinite;
        }

        &:active {
            scale: 0.955;
        }

        &:focus-visible {
            outline: 1px solid var(--clr-light-500);
            background: transparent;
        }

        & svg {
            width: 3rem;
            height: 3rem;
            flex-shrink: 0;
        }
    }

    .open-button {
        display: block;
        font-size: clamp(var(--h2), 4vw, var(--xl));
        font-weight: 800;
        background-color: transparent;
        box-shadow: none;
        width: fit-content;
        outline: none;
        border: none;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-inline: auto;
        cursor: pointer;
        transition: scale 0.15s ease-out;

        &:focus-visible {
            outline: 1px solid var(--clr-light-500);
        }

        &:hover {
            animation: wiggle 1s ease-out infinite;
        }

        &:active {
            scale: 0.95;
        }

        & svg {
            cursor: pointer;
            stroke-width: calc(5px + 1vw);
            width: clamp(1.5em, 4vw, 5em);
            height: clamp(1.5em, 4vw, 5em);

            &:focus-visible {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
            }

            @media (width <= 768px) {
                stroke-width: calc(5px + 5vw);
                margin-bottom: 0.8rem;
            }

            & path {
                stroke: var(--clr-blue-350);
                stroke-width: 1.5;
            }
        }
    }

    @keyframes wiggle {
        0% {
            rotate: 0deg;
            translate: 0 0;
        }
        25% {
            rotate: -2deg;
            translate: -5px 0;
        }
        80% {
            rotate: 2deg;
            translate: 5px 0;
        }
    }

    @keyframes heartbeat {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.15);
        }
        75% {
            transform: scale(1);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
