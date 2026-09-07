<script lang="ts">
    import { blur } from 'svelte/transition';
    interface Props {
        title: string;
        desc: string;
        button: string;
        src: string;
        alt: string;
        href: string;
    }

    let { title, desc, button, src, alt, href }: Props = $props();
</script>

<section class="card">
    <img class="card-image" {src} {alt} loading="lazy" />

    <h2 class="card-title">{title}</h2>

    <p class="card-description">{desc}</p>

    <a {href} class="card-button">{button}</a>
</section>

<style>
    .card {
        inline-size: fit-content;
        block-size: fit-content;
        background-color: var(--clr-dark-400);
        border-radius: 8px;
        border: 2px solid var(--clr-light-500);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: clip;
        transition: all 0.3s ease-out;
        padding-block: calc(var(--space-md) - 0.2rem);
        padding-inline: calc(var(--space-md) + 0.8rem);
        margin: 0;

        &:hover {
            box-shadow: 0 0 2em var(--clr-gray-700);
        }

        .card-image {
            inline-size: fit-content;
            block-size: fit-content;
            object-fit: contain;
            border-radius: 0 0 8px 8px;
            display: grid;
            place-self: center;
            margin-inline: auto;
            padding-block: calc(var(--space-md) - 0.2rem);

            @media (width <= 768px) {
                padding: 0;
            }
        }

        .card-title {
            font-family: var(--ultra);
            font-size: clamp(var(--h3), 2vw, var(--xxl));
            font-weight: 800;
            letter-spacing: -1px;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            color: var(--clr-dark-500);
            line-height: 1.2;
            text-shadow:
                0 0 1px var(--clr-dark-500),
                -2px -2px 0 var(--clr-gray-700),
                2px -2px 0 var(--clr-gray-700),
                -2px 2px 0 var(--clr-gray-700),
                2px 2px 0 var(--clr-gray-700),
                -2px 0 0 var(--clr-gray-700),
                2px 0 0 var(--clr-gray-700),
                0 -2px 0 var(--clr-gray-700),
                0 2px 0 var(--clr-gray-700);

            @media (width <= 768px) {
                margin-bottom: var(--space-md);
            }
        }

        .card-description {
            color: var(--clr-light-500);
            font-size: clamp(var(--xs), 1.5vw, var(--h4));
            font-weight: 300;
            margin-bottom: 1rem;
            text-indent: 1rem;
            display: flex;
            justify-content: center;
            letter-spacing: 0px;
        }

        .card-button {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: transparent;
            color: var(--clr-light-500);
            border: 1px solid var(--clr-light-500);
            border-radius: var(--radius);
            font-family: var(--ultra);
            font-size: clamp(var(--sm), 1.2vw, var(--h5));
            font-weight: 300;
            letter-spacing: 1px;
            inline-size: fit-content;
            block-size: 10%;
            outline: none;
            margin: 1rem auto;
            filter: drop-shadow(0 0 0.75rem var(--clr-gray-700));
            transition: 300ms;
            outline: 3px solid currentColor;
            outline-offset: -7px;
            padding: var(--padding-button);
            user-select: none;
            transition: scale 0.15s ease-out;

            &:hover {
                outline-offset: 0px;
                text-decoration: none;
            }

            &:focus-visible {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
            }

            &:active {
                scale: 0.95;
            }
        }

        @media (width < 500px) {
            inline-size: 100%;

            .card-image {
                block-size: 190px;
                object-fit: cover;
            }

            .card-title {
                font-size: clamp(var(--h6), 2vw, var(--h5));
            }

            .card-description {
                font-size: clamp(var(--xs), 1vw, var(--h6));
            }

            .card-button {
                font-size: clamp(var(--sm), 1vw, var(--h6));
                font-weight: 700;
                padding: 1rem;
                inline-size: 100%;
            }
        }
    }
</style>
