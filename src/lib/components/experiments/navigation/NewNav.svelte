<script>
    let isOpen = $state(false);

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<section class="new-navigation" aria-label="navigation menu">
    <button
        class="main-button"
        onclick={toggle}
        aria-expanded={isOpen}
        aria-controls="sub-buttons"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            class="icon close-icon"
            class:visible={isOpen}
        >
            <title>Close</title>
            <line
                x1="160"
                y1="160"
                x2="480"
                y2="480"
                stroke="var(--clr-light-400)"
                stroke-width="75"
                stroke-linecap="round"
            />
            <line
                x1="480"
                y1="160"
                x2="160"
                y2="480"
                stroke="var(--clr-light-400)"
                stroke-width="75"
                stroke-linecap="round"
            />
        </svg>

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            class="icon menu-icon"
            class:visible={!isOpen}
        >
            <title>Menu</title>
            <path
                d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z"
            /></svg
        >
    </button>

    <div id="sub-buttons" class="sub-buttons" role="menu">
        <a href="/about">
            <button class="first-button sub-btn" aria-label="about">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <title>About</title>
                    <path
                        d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"
                        stroke="var(--clr-dark-500)"
                        stroke-width="15"
                    /></svg
                >
            </button></a
        >

        <a href="/projects">
            <button class="second-button sub-btn" aria-label="sales">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <title>Sales</title>
                    <path
                        d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 192C576 156.7 547.3 128 512 128L128 128zM320 224C373 224 416 267 416 320C416 373 373 416 320 416C267 416 224 373 224 320C224 267 267 224 320 224zM512 248C512 252.4 508.4 256.1 504 255.5C475 251.9 452.1 228.9 448.5 200C448 195.6 451.6 192 456 192L504 192C508.4 192 512 195.6 512 200L512 248zM128 392C128 387.6 131.6 383.9 136 384.5C165 388.1 187.9 411.1 191.5 440C192 444.4 188.4 448 184 448L136 448C131.6 448 128 444.4 128 440L128 392zM136 255.5C131.6 256 128 252.4 128 248L128 200C128 195.6 131.6 192 136 192L184 192C188.4 192 192.1 195.6 191.5 200C187.9 229 164.9 251.9 136 255.5zM504 384.5C508.4 384 512 387.6 512 392L512 440C512 444.4 508.4 448 504 448L456 448C451.6 448 447.9 444.4 448.5 440C452.1 411 475.1 388.1 504 384.5z"
                        stroke="var(--clr-dark-500)"
                        stroke-width="15"
                    /></svg
                >
            </button></a
        >

        <a href="/contact">
            <button class="third-button sub-btn" aria-label="share">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <title>Share</title>
                    <path
                        d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z"
                        stroke="var(--clr-dark-500)"
                        stroke-width="15"
                    /></svg
                >
            </button></a
        >

        <a href="/experiments" aria-label="go back">
            <button class="fourth-button sub-btn" aria-label="home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <title>Home</title>
                    <path
                        d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"
                        stroke="var(--clr-dark-500)"
                        stroke-width="15"
                    /></svg
                >
            </button></a
        >
    </div>
</section>

<style>
    .new-navigation {
        --radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        inline-size: 30em;
        block-size: 30em;

        & .main-button {
            position: relative;
            border-radius: var(--radius);
            inline-size: 3em;
            block-size: 3em;
            background-color: transparent;
            color: var(--clr-light-500);
            border: none;
            cursor: pointer;
            font-size: clamp(var(--h6), 1.3vw, var(--h3));
            transition: transform 0.3s ease-out;

            &:focus,
            &:focus-visible {
                border: none;
                outline: none;
                box-shadow: none;
            }

            &:hover {
                transform: scale(1.05);
            }

            & .icon {
                position: absolute;
                inset: 0;
                margin: auto;
                transition:
                    opacity 0.2s ease-out,
                    transform 0.2s ease-out;
                inline-size: 2em;
                block-size: 2em;
                opacity: 0;
                transform: scale(0.75);
                pointer-events: none;

                &.visible {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            & svg {
                inline-size: 2em;
                block-size: 2em;
            }
        }

        & .sub-buttons {
            position: absolute;
            inset: 50%;
            translate: -50% -50%;
            inline-size: 0;
            block-size: 0;
            transition: scale 0.5s ease-out;

            & a {
                transition-delay: calc((sibling-index() - 1) * 0.05s);
            }

            & .sub-btn {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: var(--radius);
                inline-size: 5em;
                block-size: 5em;
                border: none;
                cursor: pointer;
                opacity: 0;
                transform: scale(0);
                transition:
                    opacity 0.3s ease-out,
                    transform 0.3s ease-out;
                pointer-events: none;
            }
        }

        &:has(.main-button[aria-expanded='true']) .sub-btn {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
        }

        & .first-button {
            translate: 0 -5em;
            background: var(--clr-fail-500);
            color: var(--clr-light-500);

            & svg {
                &:hover {
                    transform: scale(1.3);
                }
            }
        }

        & .second-button {
            translate: 7em 0;
            background: var(--clr-purple-500);
            color: var(--clr-light-500);

            & svg {
                &:hover {
                    transform: scale(1.3);
                }
            }
        }

        & .third-button {
            translate: 0 5em;
            background: var(--clr-success-500);
            color: var(--clr-light-500);

            & svg {
                &:hover {
                    transform: scale(1.3);
                }
            }
        }

        & .fourth-button {
            translate: -7em 0;
            background: var(--clr-warning-500);
            color: var(--clr-light-500);

            & svg {
                &:hover {
                    transform: scale(1.3);
                }
            }
        }

        a {
            color: var(--clr-light-500);
        }
    }
</style>
