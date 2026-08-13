<style>
    :global(.copy-button) {
        position: absolute;
        position: absolute;
        top: 0.5em;
        right: 0.5em;

        inline-size: fit-content;
        block-size: fit-content;
        padding: 0.25em 0.75em;
        background: var(--clr-dark-500);
        border: 2px solid var(--clr-gray-700);
        color: var(--clr-gray-700);
        border-radius: var(--radius);
        cursor: pointer;
        font-size: clamp(var(--sm), 0.875rem, var(--h5));
        font-weight: 400;
        z-index: 10;
        transition: font-weight 0.2s ease-out;

        @media (width <= 768px) {
            right: calc(anchor(right) - 0.2em);
        }

        &:hover {
            font-weight: 600;
        }
    }
</style>
