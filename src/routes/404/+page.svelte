<script lang="ts">
    import SEO from '$lib/data/SEO.svelte';
</script>

<SEO
    title="Page Not Found"
    description="The page you're looking for doesn't exist."
    keywords="error, 404, not found"
/>

<div class="error-page">
    <div class="error">
        <div class="image">
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img
                src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/error.webp"
                alt="an error has occurred"
                width="300"
                height="300"
                style="width: 100%; height: auto;"
            />
        </div>

        <h2 class="subtitle">You have encountered an error</h2>

        <h1 class="status">404</h1>

        <p class="message">Page Not Found</p>
    </div>
</div>

<style>
    .error-page {
        padding: 1rem 1.5rem;
        height: 80vh;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        & .error {
            inline-size: 100%;
            margin-top: clamp(5em, 5vh, 10em);

            display: flex;
            flex-direction: column;
            gap: 1em;

            anchor-name: --error;

            @media (width <= 768px) {
                transform: translateX(-12%);
            }

            & .status {
                font-family: var(--ultra);
                font-size: clamp(var(--h5), 40vw, var(--xxxxl));
                font-weight: 900;
                -webkit-text-stroke: 5px var(--clr-success-500);
                margin-inline: auto;
                text-align: center;
                color: lightblue;
                letter-spacing: 7px;
                text-wrap: balance;
                z-index: 5;
                anchor-name: --status;
                line-height: 1;
            }

            .subtitle {
                font-family: var(--bronova);
                font-size: clamp(var(--h6), 1.25vw, var(--xl));
                font-weight: 600;
                margin-inline: auto;
                margin-block: 0;
                text-align: center;
                color: var(--clr-light-500);
                letter-spacing: 5px;
                text-wrap: balance;
                line-height: 1.1;

                @media (width <= 768px) {
                    transform: translateX(15%);
                    letter-spacing: 0;
                }
            }

            & .message {
                font-family: var(--bronova);
                font-size: clamp(var(--h5), 3vw, var(--h3));
                font-weight: 400;
                letter-spacing: 5px;
                line-height: 1.1;
                text-align: center;
                padding: 2rem 4rem;
                color: var(--clr-light-500);
                text-shadow: 0 0 8px var(--clr-dark-500);
                z-index: 6;

                position: absolute;
                position-anchor: --status;
                top: anchor(center);
                left: anchor(center);
                transform: translate(-50%, -50%);

                @media (width <= 768px) {
                    text-shadow: 0 0 5px var(--clr-dark-500);
                }
            }

            & .image {
                inline-size: clamp(300px, 28vw, 400px);

                position: absolute;
                position-anchor: --status;
                top: anchor(center);
                left: anchor(center);
                transform: translate(-50%, -50%);
                z-index: 4;

                @media (width <= 768px) {
                    left: calc(anchor(center) - 0.25em);
                }
            }
        }
    }
</style>
