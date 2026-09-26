<script lang="ts">
    interface Props {
        href: string;
        title: string;
    }

    let { href, title }: Props = $props();
</script>

<article class="learn-article">
    <h3 class="learn-title">Learn more about {title}</h3>

    <p class="learn-summary">
        If you would like to know more about <a
            class="link"
            {href}
            aria-label="greensock">{title}</a
        >, click the link!
    </p>
</article>

<style>
    .learn-article {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: transparent;
        box-shadow: none;
        padding: 0;

        & .learn-title {
            text-align: center;
            font-family: var(--anta);
            color: var(--clr-blue-350);
            font-size: clamp(var(--h6), 2vw, var(--h3));
            padding: 0;
            margin: 0;
        }

        & .learn-summary {
            text-align: center;
            font-size: clamp(var(--xs), 1.5vw, var(--h4));
            line-height: 1.5;
            color: var(--clr-light-500);
            margin: 0;
            padding: 0;

            & .link {
                text-decoration: none;
                color: var(--clr-pale-700);
                font-family: var(--mono);
                font-size: clamp(var(--h6), 1.5vw, var(--h3));
                font-weight: 900;
                letter-spacing: 0;
                margin: 0;
                padding: 0;

                &:visited {
                    color: var(--clr-light-400);
                }

                &:focus-visible,
                &:focus {
                    background-color: transparent;
                    outline: 1px solid var(--clr-light-500);
                    outline-offset: 2px;
                    box-shadow: none;
                }
            }
        }
    }
</style>
