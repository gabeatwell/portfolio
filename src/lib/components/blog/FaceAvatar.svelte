<script lang="ts">
    interface Props {
        src?: string;
        alt?: string;
        name?: string;
        size?: string;
        priority?: boolean;
    }

    let {
        src = 'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/gabe-face.webp',
        alt = 'gabe atwell',
        name = '',
        size = '',
        priority = false,
    }: Props = $props();
</script>

<section class="avatar-wrapper" class:has-name={!!name}>
    <div class="avatar" style={size ? `--avatar-size: ${size};` : ''}>
        <img
            {src}
            {alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width="400"
            height="400"
        />
    </div>

    {#if name}
        <p class="name">{name}</p>
    {/if}
</section>

<style>
    .avatar-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5em;
        inline-size: fit-content;
        block-size: fit-content;
        position: relative;
        margin-right: 17em;

        @media (width <= 990px) {
            scale: 0.75;
            margin-right: 11em;
        }

        @media (width <= 768px) {
            scale: 0.5;
            margin-right: 7em;
        }

        & .avatar {
            --avatar-size: 10rem;

            inline-size: var(--avatar-size);
            block-size: var(--avatar-size);
            border-radius: 50%;
            position: relative;
            flex-shrink: 0;

            display: flex;
            align-items: end;

            transition:
                transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.35s ease;

            &:hover {
                transform: scale(1.06);
            }

            & img {
                inline-size: 100%;
                block-size: 100%;
                object-fit: cover;
                object-position: center 30%;
                display: block;
                flex-shrink: 0;

                anchor-name: --avatar;
            }
        }

        & .name {
            color: var(--clr-light-500);
            font-family: var(--bronova-bold);
            font-size: clamp(var(--h4), 2.5vw, var(--sm));
            font-weight: 400;
            letter-spacing: 0.08em;
            text-align: center;
            opacity: 0.7;
            white-space: nowrap;

            position: absolute;
            position-anchor: --avatar;
            top: calc(anchor(center) - 0.75em);
            left: calc(anchor(right) + 3vw);

            @media (width <= 768px) {
                top: calc(anchor(center) - 0.5em);
                left: calc(anchor(right) + 1.5em);
            }
        }
    }
</style>
