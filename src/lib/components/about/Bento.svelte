<script lang="ts">
    import Image from '$lib/components/layout/Image.svelte';
</script>

<div class="bento-wrapper">
    <article data-bento-article>
        <section>
            <div class="bento-grid">
                <div class="bento-item" data-position-left>
                    <a
                        href="/contact"
                        class="bento-link"
                        aria-label="Navigate to contact page"
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
                    </a>
                </div>

                <div class="bento-item" data-position-right>
                    <div data-position-center>
                        <a
                            href="/learn"
                            class="bento-link"
                            aria-label="Navigate to learn page"
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
                        </a>
                    </div>
                </div>

                <div class="bento-item" data-position-left>
                    <a
                        href="/projects"
                        class="bento-link"
                        aria-label="Navigate to projects page"
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
                    </a>
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

                    &:hover {
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
</style>
