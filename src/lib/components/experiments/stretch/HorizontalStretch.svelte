<script lang="ts">
    interface Props {
        letters?: string[];
    }

    let { letters = [] }: Props = $props();
    let randomIndex = $state(0);

    function refreshRandom() {
        randomIndex = Math.floor(Math.random() * letters.length);
    }

    $effect(() => {
        randomIndex = Math.floor(Math.random() * letters.length);
    });
</script>

<div class="stretch-text">
    <h2>
        {#each letters as letter, index}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
                class="letter-{index}"
                class:active={index === randomIndex}
                onmouseleave={refreshRandom}>{letter}</span
            >
        {:else}
            {letters}
        {/each}
    </h2>
</div>

<style>
    .stretch-text {
        display: flex;
        justify-content: center;
        z-index: 200;
        user-select: none;

        & h2 {
            font-family: var(--ultra);
            font-size: clamp(var(--h4), 10vw, var(--xxxxl));
            font-weight: bold;
            color: var(--clr-dark-500-fade);
            text-shadow:
                0 0 1px var(--clr-dark-500),
                -1px -1px 0 var(--clr-blue-500),
                1px -1px 0 var(--clr-blue-500),
                -1px 1px 0 var(--clr-blue-500),
                1px 1px 0 var(--clr-blue-500),
                -1px 0 0 var(--clr-blue-500),
                1px 0 0 var(--clr-blue-500),
                0 -1px 0 var(--clr-blue-500),
                0 1px 0 var(--clr-blue-500);
            margin: 0;
            margin-bottom: 0.5em;
            margin-top: -0.75em;
            padding: 0;
            transform: scaleY(2.25);

            & span {
                display: inline-block;
                transition:
                    transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55),
                    margin-inline 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                transform-origin: center bottom;
                margin: 0;
                padding: 0;

                &.active:hover {
                    transform: scaleX(2.25);
                    margin-inline: 0.5em;
                }
            }
        }
    }

    @keyframes stretch {
        0% {
            transform: scaleX(1);
        }
        50% {
            transform: scaleX(1.8);
            margin-inline: 0.5em;
        }
        100% {
            transform: scaleX(1);
        }
    }
</style>
