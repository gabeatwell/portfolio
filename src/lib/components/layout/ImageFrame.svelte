<script lang="ts">
    import { imageFrame } from '$lib/attachments/gsap/imageFrame';

    interface Props {
        src: string;
        alt: string;
        text: string;
    }

    let { src, alt, text }: Props = $props();
</script>

<div class="image-container" {@attach imageFrame}>
    <img {src} {alt} loading="lazy" />

    <h1>{text}</h1>
</div>

<style>
    .image-container {
        position: relative;
        width: calc(fit-content + 10%);
        height: 5in;
        background: var(--dark-blue);
        border-radius: 15px;
        margin: 5% 0 3% 0;
        padding: 2rem;

        & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 2;
            border-radius: 10px;
        }

        h1 {
            position: absolute;
            top: 96%;
            left: 50%;
            transform: translate(-50%, -96%);
            letter-spacing: 3px;
            font-family: var(--bronova);
            font-size: clamp(var(--h6), 2vw, var(--h3));
            font-weight: 700;
            color: var(--purple);
            text-wrap: nowrap;
        }
    }

    @media (max-inline-size: 768px) {
        .image-container {
            width: 90%;
            height: 75%;
            margin-top: 20%;
            margin-bottom: -5%;

            h1 {
                letter-spacing: 0;
                text-align: center;
            }
        }
    }
</style>
