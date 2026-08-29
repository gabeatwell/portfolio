<script lang="ts">
    interface Props {
        href?: string;
        title: string;
        class?: string;
    }

    let { href, title, class: className = '' }: Props = $props();
</script>

<a class="button {className}" {href}>{title}</a>

<style>
    @media (width >= 300px) {
        .button {
            display: inline-block;
            text-decoration: none;
            background-color: var(--clr-gray-600);
            background-color: var(--clr-blue-500);
            font-family: var(--ultra);
            font-size: clamp(var(--h5), 2vw, var(--h3));
            border: 1px solid var(--clr-dark-500);
            outline: 3px solid var(--clr-dark-500);
            color: var(--clr-dark-500);
            border-radius: var(--radius);
            outline-offset: -7px;
            margin-inline: auto;
            cursor: pointer;
            letter-spacing: 2px;
            width: fit-content;
            transition:
                outline-offset 300ms ease-out,
                opacity 300ms ease-out,
                scale 0.15s ease-out;
            padding: clamp(0.4em, 1.5vw, 0.3em) clamp(1em, 2vw, 0.7em);
            user-select: none;

            &:not(:hover) {
                opacity: 0.85;
            }

            &:focus-visible {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
            }

            &:hover {
                outline-offset: 0px;
            }

            &:active {
                scale: 0.95;
            }
        }
    }
</style>
