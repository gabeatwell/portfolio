<script lang="ts">
</script>

<button class="submit-button" type="submit">Submit</button>

<style>
    .submit-button {
        @media (width >= 300px) {
            background-color: transparent;
            font-family: var(--ultra);
            font-size: clamp(var(--h5), 1.5vw, var(--h4));
            font-weight: 900;
            border: 1px solid var(--clr-light-500);
            outline: 3px solid var(--clr-light-500);
            color: var(--clr-dark-500);
            text-shadow:
                0 0 1px var(--clr-light-500),
                -2px -2px 0 var(--clr-light-350),
                2px -2px 0 var(--clr-light-350),
                -2px 2px 0 var(--clr-light-350),
                2px 2px 0 var(--clr-light-350),
                -2px 0 0 var(--clr-light-350),
                2px 0 0 var(--clr-light-350),
                0 -2px 0 var(--clr-light-350),
                0 2px 0 var(--clr-light-350);
            border-radius: var(--radius);
            outline-offset: -7px;
            margin-inline: auto;
            cursor: pointer;
            letter-spacing: 2px;
            width: fit-content;
            transition: all 300ms ease-out;
            padding: var(--padding-button);
            user-select: none;
            transition:
                outline-offset 300ms ease-out,
                opacity 300ms ease-out,
                scale 0.15s ease-out;

            &:not(:hover) {
                opacity: 0.85;
            }

            &:hover {
                outline-offset: 0px;
            }

            &:focus-visible {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
            }

            &:active {
                scale: 0.95;
            }
        }

        /* @media (width >= 500px) {
            text-shadow:
                0 0 1px var(--clr-light-500),
                -3px -3px 0 var(--clr-light-500),
                3px -3px 0 var(--clr-light-500),
                -3px 3px 0 var(--clr-light-500),
                3px 3px 0 var(--clr-light-500),
                -3px 0 0 var(--clr-light-500),
                3px 0 0 var(--clr-light-500),
                0 -3px 0 var(--clr-light-500),
                0 3px 0 var(--clr-light-500);
        } */
    }

    @keyframes right {
        0% {
            transform: translateX(0);
        }
        50% {
            transform: translateX(10px);
        }
        100% {
            transform: translateX(0);
        }
    }
</style>
