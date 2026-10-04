<script lang="ts">
    interface Props {
        src: string;
        alt: string;
        radius?: string;
        name?: string;
        center?: boolean;
        scale?: string;
    }

    let {
        src,
        alt,
        radius = '0 1vw 0 0',
        name = '',
        center = false,
        scale = '1',
    }: Props = $props();
</script>

<section class="avatar" class:center style="transform: scale({scale});">
    <img {src} {alt} loading="lazy" style="border-radius: {radius};" />

    {#if name}
        <h2 class="title">{name}</h2>
    {/if}
</section>

<style>
    .avatar {
        --size: clamp(2rem, 15vw, 8rem);
        --head: calc(var(--size) * 0.25);
        --height-with-head: calc(var(--size) + var(--head));
        --border-width: calc(var(--size) * 0.015);

        inline-size: var(--size);
        block-size: var(--size);
        border-radius: 50%;
        border: var(--border-width) solid var(--clr-light-500);
        background-color: var(--clr-blue-500);
        background-image: url('https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/dots.svg');

        display: flex;
        align-items: end;
        position: relative;
        overflow: hidden;

        &.center {
            margin-inline: auto;
        }

        & img {
            width: 100%;
            height: var(--height-with-head);
            object-fit: cover;
            object-position: center 35%;
            flex-shrink: 0;
            display: block;

            anchor-name: --avatar;
        }

        & .title {
            position: absolute;
            position-anchor: --avatar;
            top: anchor(center);
            left: calc(anchor(right) + 3vw);

            @media (width <= 768px) {
                top: calc(anchor(bottom) + 1em);
                left: calc(anchor(center) - 3.5em);
            }

            color: var(--clr-light-500);
            font-family: var(--bronova-bold);
            font-size: clamp(var(--sm), 3.5vw, var(--h3));
            white-space: nowrap;
            letter-spacing: 1px;
        }
    }
</style>
