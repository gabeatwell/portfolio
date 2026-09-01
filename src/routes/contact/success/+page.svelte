<script lang="ts">
    import SEO from '$lib/data/SEO.svelte';

    $effect(() => {
        console.log('Success! Your message was sent.');
    });
</script>

<SEO
    title="Success!"
    description="Your message has been sent!"
    keywords="success, contact success"
/>

<article class="success-wrapper">
    <section class="success-content">
        <img
            src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/success.webp"
            alt="Atwell"
            loading="lazy"
        />

        <div class="success-results">
            <p class="subheading"><i>Your message has been sent.</i></p>
            <p class="subheading">I'll get back to you soon!</p>
            <p class="thank-you">Thank you for reaching out!</p>
        </div>
    </section>
</article>

<style>
    @media (width >= 18.75rem) {
        :root {
            --100: 100%;
            --5: 5em;
        }

        .success-wrapper {
            min-block-size: 70vh;
            padding-top: 3em;
            background-color: transparent;

            & .success-content {
                inline-size: var(--100);
                padding: clamp(2rem, 5vw, 5em);
                margin-inline: auto;
                margin-top: var(--5);
                text-align: center;

                & img {
                    margin-inline: auto;
                    display: block;
                    inline-size: 100%;
                    max-inline-size: clamp(12rem, 40vw, 28rem);
                    block-size: auto;
                    object-fit: contain;
                    aspect-ratio: auto;
                }
            }

            & .success-results {
                padding-top: 3em;

                & .thank-you {
                    font-size: clamp(var(--sm), 1.5vw, var(--h4));
                    font-weight: 500;
                    margin: 0.5em 0;
                    color: var(--clr-blue-500);
                }

                & .subheading {
                    font-size: clamp(var(--xs), 1.2vw, var(--h6));
                    font-weight: 200;
                    margin: 0.5em 0 -0.5rem 0;
                    color: var(--clr-gray-700);
                }
            }
        }
    }

    @media (width >= 720px) {
        section {
            inline-size: 50vw;
            margin-bottom: 10%;
        }
    }

    @media (width <= 500px) {
        article {
            min-block-size: 70vh;
        }
    }
</style>
