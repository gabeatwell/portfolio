<script lang="ts">
    interface Props {
        image: string;
        alt?: string;
    }
    let { image, alt = '' }: Props = $props();
</script>

{#if image}
    <img class="parallax" src={image} {alt} />
{/if}

<style>
    .parallax {
        display: block;
        margin-inline: auto;
        max-inline-size: min(25vw, 90%);
        block-size: auto;
        border-radius: var(--radius);

        animation-name: parallax-image;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-fill-mode: both;
        animation-timeline: view();
        animation-range: cover;
    }

    @keyframes parallax-image {
        from {
            transform: translateY(-12em) scale(1);
            filter: blur(5px);
        }
        50% {
            transform: translateY(0) scale(0.9);
            filter: blur(0);
        }
        to {
            transform: translateY(12em) scale(1);
            filter: blur(5px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .parallax {
            animation: none;
        }
    }
</style>
