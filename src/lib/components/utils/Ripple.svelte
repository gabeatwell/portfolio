<script lang="ts">
    interface Props {
        title: string;
        href: string;
    }

    let { title, href }: Props = $props();
</script>

<a {href}>
    <button class="rippleBtn">{title}</button>
</a>

<style>
    .rippleBtn {
        position: relative;
        overflow: clip;
        padding: 0.75rem 1rem;
        font-family: var(--ultra);
        font-size: clamp(1.2rem, 1.5vw, 2rem);
        font-weight: 900;
        letter-spacing: 1px;
        color: var(--dark-pale);
        background: transparent;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: fit-content;
        box-shadow: 0 0 10px var(--dark-pale);
        margin-inline: auto;

        &:hover {
            opacity: 0.8;
            color: var(--dark-pale);
            outline-offset: 0px;
            @media (hover: hover) {
                animation: wiggle 0.5s ease-out infinite;
            }
        }

        &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: radial-gradient(
                circle,
                var(--smoke) 10%,
                transparent 50.01%
            );
            background-size: 100%;
            background-repeat: no-repeat;
            transform: scale(0.9);
            opacity: 0;
            transition:
                transform 0.6s,
                opacity 0.6s;
        }

        &:active::after {
            transform: scale(3);
            opacity: 1;
            transition:
                transform 0.6s,
                opacity 0.6s;
        }
    }

    @keyframes wiggle {
        0% {
            rotate: 0deg;
            translate: 0 0;
        }
        25% {
            rotate: -2deg;
            translate: -5px 0;
        }
        80% {
            rotate: 2deg;
            translate: 5px 0;
        }
    }
</style>
