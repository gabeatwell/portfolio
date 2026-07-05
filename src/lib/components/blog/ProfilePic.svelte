<script lang="ts">
    interface Props {
        src?: string;
        alt?: string;
        priority?: boolean;
    }

    let {
        src = 'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/gabe-face.webp',
        alt = 'gabe atwell',
        priority = false,
    }: Props = $props();
</script>

<section class="avatar-wrapper">
    <div class="avatar">
        <img
            {src}
            {alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width="400"
            height="400"
        />
    </div>
</section>

<style>
    .avatar-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5em;
        inline-size: fit-content;
        block-size: fit-content;

        & .avatar {
            --avatar-size: 3.5rem;

            inline-size: var(--avatar-size);
            block-size: var(--avatar-size);
            flex-shrink: 0;

            transition:
                transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.35s ease;

            &:hover {
                transform: scale(1.06);
            }

            & img {
                inline-size: 100%;
                block-size: 100%;
                object-fit: contain;
                display: block;

                @media (width <= 768px) {
                    margin-top: -2.5em;
                }
            }
        }
    }
</style>
