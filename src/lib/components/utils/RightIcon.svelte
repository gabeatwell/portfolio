<script lang="ts">
    interface Props {
        color?: string;
        isHovered?: boolean;
        classes?: string;
    }

    let {
        color = 'currentColor',
        isHovered = false,
        classes = '',
    }: Props = $props();

    function handleMouseEnter() {
        isHovered = true;

        setTimeout(() => {
            isHovered = false;
        }, 200);
    }
</script>

<section
    class={classes}
    aria-label="arrow-right"
    role="img"
    onmouseenter={handleMouseEnter}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <title>Right Arrow Icon</title>
        <path
            d="M30.9566 19.6875H6.5625C6.2144 19.6875 5.88056 19.8258 5.63442 20.0719C5.38828 20.3181 5.25 20.6519 5.25 21C5.25 21.3481 5.38828 21.6819 5.63442 21.9281C5.88056 22.1742 6.2144 22.3125 6.5625 22.3125H30.9566L21.3832 31.8833C21.1368 32.1297 20.9983 32.464 20.9983 32.8125C20.9983 33.161 21.1368 33.4953 21.3832 33.7418C21.6297 33.9882 21.964 34.1267 22.3125 34.1267C22.661 34.1267 22.9953 33.9882 23.2418 33.7418L35.0543 21.9293C35.1765 21.8073 35.2735 21.6625 35.3396 21.503C35.4058 21.3436 35.4398 21.1726 35.4398 21C35.4398 20.8274 35.4058 20.6564 35.3396 20.497C35.2735 20.3375 35.1765 20.1927 35.0543 20.0708L23.2418 8.25825C22.9953 8.0118 22.661 7.87334 22.3125 7.87334C21.964 7.87334 21.6297 8.0118 21.3832 8.25825C21.1368 8.5047 20.9983 8.83897 20.9983 9.1875C20.9983 9.53604 21.1368 9.8703 21.3832 10.1168L30.9566 19.6875Z"
            class:head={isHovered}
        />
    </svg>
</section>

<style>
    svg {
        display: inline-block;
        margin: 0;

        &:hover {
            animation: right 0.5s ease infinite;
        }

        path {
            transition: all 0.2s ease-out;
        }

        .head {
            transform: translateX(-3px);
        }
    }

    @keyframes right {
        0% {
            transform: translateX(0);
        }
        50% {
            transform: translateX(10px);
        }
        100% {
            transform: translateX(0);
        }
    }
</style>
