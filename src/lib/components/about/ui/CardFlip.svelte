<script lang="ts">
    interface Props {
        src: string;
        alt: string;
        src2: string;
        alt2: string;
    }

    let { src, alt, src2, alt2 }: Props = $props();

    let isFlipped = $state<boolean>(false);

    function toggleFlip() {
        isFlipped = !isFlipped;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleFlip();
        }
    }
</script>

<div class="flip-wrapper">
    <div class="card-container">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <section
            class="flip-card"
            class:flipped={isFlipped}
            onclick={toggleFlip}
            onkeydown={handleKeydown}
            aria-label="Flip card to see alternate view"
        >
            <article class="card-front">
                <img {src} {alt} loading="lazy" />
            </article>

            <article class="card-back">
                <img src={src2} alt={alt2} loading="lazy" />
            </article>
        </section>
    </div>
</div>

<style>
    .flip-wrapper {
        margin-inline: auto;
        display: flex;
        align-items: flex-start;
        justify-content: center;

        & .card-container {
            inline-size: 300px;
            block-size: 400px;
            perspective: 1000px;
            display: flex;
            justify-content: center;
            align-items: center;

            @media (width <= 600px) {
                object-fit: contain;
            }

            @media (hover: hover) {
                &:hover .flip-card {
                    transform: rotateY(180deg);
                }
            }

            & .flip-card {
                position: relative;
                inline-size: 100%;
                block-size: 100%;
                text-align: center;
                transition: transform 0.7s;
                transform-style: preserve-3d;
                cursor: pointer;
                border: none;
                background: transparent;
                padding: 0;
                margin: 0;
                display: block;
                box-sizing: border-box;

                &.flipped {
                    transform: rotateY(180deg);
                }

                &:focus {
                    outline: 2px solid var(--clr-light-500);
                    outline-offset: 2px;
                }

                & .card-front,
                & .card-back {
                    position: absolute;
                    inline-size: 100%;
                    block-size: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;

                    & img {
                        object-fit: cover;
                        inline-size: 100%;
                        block-size: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        filter: drop-shadow(0 0 0.25rem var(--clr-light-500));
                        border-radius: 10px;
                        aspect-ratio: 3 / 4;

                        @media (width <= 500px) {
                            inline-size: 85vw;
                            block-size: auto;
                            object-fit: contain;
                        }
                    }
                }

                & .card-front {
                    background-color: transparent;
                    box-shadow: none;
                    color: var(--white);
                    filter: brightness(150%);
                }

                & .card-back {
                    background-color: transparent;
                    box-shadow: none;
                    color: var(--white);
                    transform: rotateY(180deg);
                }
            }
        }
    }
</style>
