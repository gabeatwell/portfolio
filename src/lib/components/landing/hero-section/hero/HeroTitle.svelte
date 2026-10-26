<script lang="ts">
    interface Props {
        title: string;
    }

    let { title }: Props = $props();
</script>

<section>
    <h2>{title}</h2>
</section>

<style>
    section {
        @supports (background-clip: text) or (-webkit-background-clip: text) {
            & h2 {
                --bgSize: 200%;
                margin: 2rem auto;
                margin-top: 5%;
                color: transparent;
                font-family: var(--ultra);
                font-size: clamp(var(--h4), 4vw, var(--xxl));
                font-weight: 700;
                letter-spacing: -1px;
                background-image: linear-gradient(
                    to right,
                    var(--clr-blue-500),
                    var(--clr-light-500),
                    var(--clr-blue-500),
                    var(--clr-light-500),
                    var(--clr-blue-500)
                );
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-size: var(--bgSize);
                animation: animate 5s ease-out infinite;
            }
        }
    }

    @keyframes animate {
        0% {
            background-position: 0;
        }

        50% {
            background-position: 50%;
        }

        100% {
            background-position: 0;
        }
    }
</style>
