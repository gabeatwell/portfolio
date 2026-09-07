<script lang="ts">
    interface Props {
        name: string;
        title: string;
        company?: string;
        testimonial: string;
        avatar?: string;
        rating?: number;
        highlighted?: boolean;
        index?: number;
    }

    let {
        name,
        title,
        company = '',
        testimonial,
        avatar = '',
        rating = 0,
        highlighted = false,
        index = 0,
    }: Props = $props();
</script>

<article
    class="testimonial"
    class:highlighted
    style="--stagger-delay: {index * 1.25}s;"
>
    <div class="quote-mark">"</div>

    <blockquote>{testimonial}</blockquote>

    <footer class="testimonial-footer">
        {#if avatar}
            <div class="avatar">
                <img src={avatar} alt={`Photo of ${name}`} loading="lazy" />
            </div>
        {/if}

        <div class="author-info">
            <strong>{name}</strong>

            <span>{title} {company ? `, ${company}` : ''}</span>
        </div>
    </footer>
</article>

<style>
    .testimonial {
        --dark-bg-rgb: var(--clr-light-500);
        --light-bg-rgb: var(--clr-dark-500);
        background-color: hsla(var(--light-bg-rgb), 0.25);
        border-radius: var(--radius);
        padding: calc(var(--space-md) + 0.8rem);
        position: relative;
        box-shadow: 0 0 12px var(--clr-light-500);
        margin-top: -6rem;
        margin-bottom: 2rem;
        max-inline-size: 50em;
        width: 95%;
        margin-inline: auto;
        padding-bottom: 5em;
        opacity: 0;
        animation: fadeIn 0.8s ease-out forwards;
        animation-delay: var(--stagger-delay, 0s);
        will-change: opacity, transform;
        scale: 0.75;
        user-select: none;
        transition:
            transform 0.2s,
            box-shadow 0.2s;

        @media (width <= 500px) {
            scale: 0.95;
            margin-top: -2rem;
        }

        &:hover {
            transform: translateY(-5px);
        }

        & .author-info {
            display: flex;
            flex-direction: column;

            border-radius: var(--radius);
            padding: calc(var(--space-md) - 0.55rem);

            & strong {
                font-size: clamp(var(--sm), 1.75vw, var(--h5));
                font-weight: 600;
                color: var(--clr-light-500);
                letter-spacing: 0px;
            }

            & span {
                color: var(--clr-light-500);
                font-size: clamp(var(--xs), 1.25vw, var(--h6));
                font-weight: 400;
                opacity: 0.5;
                letter-spacing: -1px;
            }
        }

        & .quote-mark {
            position: absolute;
            top: 1rem;
            left: 1.5rem;
            font-size: 4rem;
            color: var(--clr-light-500);
            font-family: Georgia, serif;
            line-height: 1;
        }

        & blockquote {
            margin: 0;
            padding-left: 1rem;
            font-size: clamp(var(--h6), 1.5vw, var(--h3));
            font-style: italic;
            color: var(--clr-light-500);
            line-height: 1.5;
            border-left: none;
        }

        & .testimonial-footer {
            background-color: transparent;
            border-top: 1px solid var(--clr-light-500);
            margin-top: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            max-inline-size: 55em;
            padding: 1rem 0;
            display: flex;
            align-items: center;
            padding: calc(var(--space-md) + 0.7rem);

            @media (width <= 500px) {
                padding-bottom: 0.15rem;
            }

            & .avatar {
                overflow: clip;
                flex-shrink: 0;

                & img {
                    inline-size: 150px;
                    vertical-align: middle;
                    border-radius: 50%;

                    @media (width <= 500px) {
                        inline-size: 145px;
                    }
                }
            }
        }
    }

    :global(body.light) .testimonial {
        background-color: rgba(var(--dark-bg-rgb), 0.25);
    }

    .highlighted {
        border-left: 3px solid hsl(0, 0%, 16%);
    }

    @media (max-inline-size: 640px) {
        .testimonial {
            padding: 1.5rem;
            width: 90%;
            margin-inline: auto;
        }
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
