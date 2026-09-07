<script>
</script>

<a class="to-top" href="#top" aria-label="back to top">
    Back to Top
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width="1em"
        height="1em"
    >
        <path
            d="M342.6 81.4C330.1 68.9 309.8 68.9 297.3 81.4L137.3 241.4C124.8 253.9 124.8 274.2 137.3 286.7C149.8 299.2 170.1 299.2 182.6 286.7L288 181.3L288 552C288 569.7 302.3 584 320 584C337.7 584 352 569.7 352 552L352 181.3L457.4 286.7C469.9 299.2 490.2 299.2 502.7 286.7C515.2 274.2 515.2 253.9 502.7 241.4L342.7 81.4z"
        />
    </svg>
</a>

<style>
    .to-top {
        position: relative;
        text-decoration: none;
        color: var(--clr-light-500);
        font-size: clamp(var(--sm), 1.5vw, var(--h6));
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5em;
        justify-content: center;
        user-select: none;

        &:focus,
        &:focus-visible {
            outline: 1px solid var(--clr-light-500);
            box-shadow: none;
            background: transparent;
            color: var(--clr-light-500);
        }

        &:active {
            color: var(--clr-light-500);
            background: transparent;
        }
    }
</style>
