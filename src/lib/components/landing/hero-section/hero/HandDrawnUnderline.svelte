<script lang="ts">
    interface Props {
        width?: number;
        height?: number;
    }

    let { width = 150, height = 60 }: Props = $props();
</script>

<svg
    {width}
    {height}
    viewBox="0 0 400 140"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    class="underline"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        class="underline-path"
        d="M74.717,125.094C74.921,125.146 75.03,125.443 75.234,125.495C75.343,125.523 75.341,125.464 78.93,124.821C128.68,115.911 297.262,90.067 377.531,115.113C378.809,115.512 378.818,115.613 380.129,115.406C380.441,115.357 382.235,115.074 383.525,113.18C383.722,112.891 384.856,111.226 384.557,108.781C384.514,108.43 384.267,106.411 382.579,104.958C381.512,104.039 381.457,104.129 380.152,103.77C361.958,98.771 309.002,87.213 175.416,106.502C118.912,114.66 75.075,124.51 75.074,124.512L74.717,125.094Z"
        fill="var(--clr-dark-500)"
        stroke="var(--clr-light-500)"
        stroke-width="2.5"
        stroke-linejoin="round"
    />
</svg>

<style>
    .underline {
        --angle: 180deg;
        display: block;
        width: 100%;
        height: auto;
        overflow: visible;
        transform: rotateY(var(--angle));
        margin-top: -0.3em;
    }

    .underline-path {
        stroke-dasharray: 900;
        stroke-dashoffset: 600;
        animation: dash 4s ease-out forwards;
        animation-delay: 1.5s;
    }

    @keyframes dash {
        to {
            stroke-dashoffset: 0;
        }
    }
</style>
