<script lang="ts">
    import HorizontalStretch from './HorizontalStretch.svelte';

    interface Props {
        firstWord: string;
        secondWord?: string;
        contentTitle?: string;
        firstMessage?: string;
        secondMessage?: string;
        titleLetters?: string[];
    }

    let {
        firstWord,
        secondWord,
        firstMessage,
        secondMessage,
        titleLetters = [],
    }: Props = $props();

    // to use this component:
    // <VerticalStretch titleLetters={['G', 'A', 'B', 'E']} firstWord="..." secondWord="..." firstMessage="..." secondMessage="..." />
</script>

<div class="vertical-wrapper">
    <div class="vertical-stretch-bg">
        <span>{firstWord}</span>
        <span>{secondWord}</span>
    </div>

    <div class="vertical-content">
        <div class="content-title">
            <HorizontalStretch letters={titleLetters} />
        </div>

        <p class="content-message">{firstMessage}</p>

        <p class="content-message">{secondMessage}</p>
    </div>
</div>

<style>
    .vertical-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        inline-size: 100vw;
        block-size: 100vh;
        position: relative;
        overflow: hidden;
        user-select: none;

        & .vertical-stretch-bg {
            position: absolute;
            top: 0;
            left: 0;

            font-family: var(--bronova-bold);
            font-size: 7vw;
            font-weight: 900;
            color: var(--clr-light-500-fade);
            text-transform: uppercase;
            letter-spacing: 1px;
            line-height: 0.6;
            user-select: none;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: perspective(1200px) rotateX(6deg);
            padding-top: 1.5em;
            opacity: 0.15;
            pointer-events: none;
            z-index: 0;
            inline-size: 100vw;
            block-size: 100vh;

            & span {
                position: relative;
                display: inline-block;
                padding: 0;
                margin: 0;
                font-family: var(--mono);
                transform: scaleX(2.75) scaleY(11.75);
                text-shadow: 13px -1px 0 var(--clr-dark-500-fade);

                &:first-of-type {
                    margin-right: 1em;
                }

                @media (width <= 768px) {
                    transform: scaleY(5);
                }
            }
        }
    }

    .vertical-content {
        z-index: 1;
        position: relative;

        & .content-title {
            anchor-name: --title;
            font-family: var(--ultra);
            color: var(--clr-blue-500-fade);
        }

        & .content-message {
            font-family: var(--bronova);
            font-size: clamp(var(--h5), 1.5vw, var(--lg));
            color: var(--clr-light-500);

            &:first-of-type {
                position: absolute;
                position-anchor: --title;
                top: calc(anchor(bottom) + 1.5em);
                left: calc(anchor(left) - 5em);
                anchor-name: --firstSpan;
            }

            &:last-of-type {
                position: absolute;
                position-anchor: --firstSpan;
                top: calc(anchor(bottom) + 1.5em);
                right: calc(anchor(right) - 15em);
            }
        }
    }

    @media (width <= 767px) {
        .vertical-wrapper {
            inline-size: 100%;
            block-size: auto;
            min-block-size: 100svh;
            padding-inline: var(--space-md);
            padding-block: var(--space-xl);

            & .vertical-stretch-bg {
                inline-size: 100%;
                block-size: 100%;
                font-size: 12vw;

                & span {
                    transform: scaleX(1.4) scaleY(4.5);
                }
            }
        }

        .vertical-content {
            inline-size: 100%;
            display: grid;
            justify-items: center;
            gap: var(--space-sm);
            text-align: center;

            & .content-message {
                &:first-of-type,
                &:last-of-type {
                    position: static;
                    margin: 0;
                }
            }
        }
    }

    @media (width >= 768px) and (width <= 1023px) {
        .vertical-content .content-message {
            &:first-of-type {
                left: calc(anchor(left) - 2em);
            }

            &:last-of-type {
                right: auto;
                left: calc(anchor(left) + 2em);
            }
        }
    }

    @keyframes expandLine {
        0% {
            transform: scaleX(0.2);
            opacity: 0.2;
        }
        50% {
            transform: scaleX(1.25);
            opacity: 0.95;
        }
        100% {
            transform: scaleX(0.2);
            opacity: 0.2;
        }
    }

    @keyframes radiate {
        0% {
            transform: rotate(-12deg) scaleX(0.7);
        }
        100% {
            transform: rotate(12deg) scaleX(1.3);
        }
    }
</style>
