<script lang="ts">
    import { letterIntro } from '$lib/attachments/gsap/letterIntro';
</script>

<section class="intro" {@attach letterIntro}>
    <h1>atwell</h1>

    <div class="full-image">
        <img
            src="https://images.pexels.com/photos/32342294/pexels-photo-32342294.jpeg"
            alt=""
        />

        <a href="/" class="enter">enter</a>
    </div>
</section>

<style>
    .intro {
        padding: 2rem;
        background-color: transparent;
        position: fixed;
        inline-size: 100%;
        block-size: 100vh;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        & h1 {
            font-family: var(--ultra);
            font-size: clamp(5em, 70vw, 35em);
            margin-bottom: 1rem;
            position: relative;
            transform: scaleY(1.7);

            color: var(--clr-dark-500);
            text-shadow:
                0 0 5px var(--clr-pale-700),
                -5px -5px 0 var(--clr-pale-700),
                5px -5px 0 var(--clr-pale-700),
                -5px 5px 0 var(--clr-pale-700),
                5px 5px 0 var(--clr-pale-700),
                -5px 0 0 var(--clr-pale-700),
                5px 0 0 var(--clr-pale-700),
                0 -5px 0 var(--clr-pale-700),
                0 5px 0 var(--clr-pale-700);
        }

        & .full-image {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            z-index: -1;
            opacity: 0;

            & img {
                anchor-name: --image;
            }

            & .enter {
                position: absolute;
                position-anchor: --image;
                top: calc(anchor(center) - 4em);
                left: calc(anchor(center) + 3em);

                font-family: var(--bronova-bold);
                font-size: clamp(var(--h6), 3vw, var(--lg));
                color: var(--clr-dark-500);
                text-decoration: none;
                border: 1px solid var(--clr-dark-500);
                border-radius: var(--radius);
                padding: 0.05em 0.25em;
                z-index: 50;
                pointer-events: auto;

                &:hover {
                    background-color: var(--clr-dark-500);
                    color: var(--clr-light-500);
                    border-color: var(--clr-light-500);
                }
            }
        }
    }
</style>
