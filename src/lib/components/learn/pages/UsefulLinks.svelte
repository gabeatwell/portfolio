<script lang="ts">
    import LoadBtn from '$lib/components/learn/pages/LoadBtn.svelte';
</script>

<section class="useful-links" id="useful-links">
    <h2 class="useful-links-title">Useful Links:</h2>

    <div class="buttons">
        <LoadBtn
            loading="loading..."
            delay={1500}
            submit="Beginner HTML"
            href="https://www.websiteplanet.com/blog/html-guide-beginners/"
        />
        <LoadBtn
            loading="loading..."
            delay={1500}
            submit="JoyOfCode"
            href="https://joyofcode.xyz"
        />
        <LoadBtn
            loading="loading..."
            delay={1500}
            submit="Kevin Powell"
            href="https://kevinpowell.co"
        />
        <LoadBtn
            loading="loading..."
            delay={1500}
            submit="Creative Coding"
            href="https://creativecodingclub.com"
        />
        <LoadBtn
            loading="loading..."
            delay={1500}
            submit="Three.js Journey"
            href="https://threejs-journey.com"
        />
        <LoadBtn
            loading="loading..."
            delay={1500}
            submit="Frontend Masters"
            href="https://frontendmasters.com"
        />
        <LoadBtn
            loading="loading..."
            delay={1500}
            submit="View Transitions"
            href="https://view-transitions.chrome.dev/"
        />
        <LoadBtn
            loading="loading..."
            delay={1500}
            submit="GoFlow"
            href="https://bytesizego.com/goflow-landing/"
        />
    </div>

    <p class="explanation">
        <span>🛠️</span> All of these links are resources that I used to learn frontend
        and design for the web
    </p>
</section>

<style>
    .useful-links {
        & .buttons {
            display: grid;
            grid-template-columns: repeat(2, minmax(200px, 1fr));
            gap: 0.25rem;

            @media (width <= 768px) {
                grid-template-columns: 1fr;
            }
        }

        @media (width >= 300px) {
            width: fit-content;
            margin-inline: auto;
            margin-top: 1.5rem;
            text-align: center;

            & .useful-links-title {
                margin-top: 2rem;
                margin-bottom: 1.2em;
                margin-inline: auto;
                font-family: var(--bronova);
                font-size: clamp(var(--h6), 2vw, var(--h4));
                color: var(--clr-dark-500);
                text-shadow:
                    0 0 2px var(--clr-dark-500),
                    -2px -2px 0 var(--clr-blue-500),
                    2px -2px 0 var(--clr-blue-500),
                    -2px 2px 0 var(--clr-blue-500),
                    2px 2px 0 var(--clr-blue-500),
                    -2px 0 0 var(--clr-blue-500),
                    2px 0 0 var(--clr-blue-500),
                    0 -2px 0 var(--clr-blue-500),
                    0 2px 0 var(--clr-blue-500);
                letter-spacing: 1px;
                border-bottom: 2px solid var(--clr-blue-500);
                width: fit-content;

                @media (width <= 768px) {
                    border-bottom: 1px solid var(--clr-blue-500);
                }

                @media (width <= 500px) {
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
                }
            }

            & .explanation {
                color: var(--clr-light-400);
                font-family: var(--bronova);
                font-size: clamp(var(--sm), 1.25rem, var(--h4));
                font-style: italic;
                text-align: center;
                margin-top: 2rem;
                line-height: 1.5;
                letter-spacing: 0px;

                & span {
                    font-style: normal;
                    font-size: clamp(var(--sm), 3vw, var(--h5));
                }
            }
        }
    }
</style>
