<script lang="ts">
    import { selectedThreeComponent } from '$lib/data/stores/threejsComponent';
    import { componentImportMap } from '$lib/data/threeComponentImports';
    import SEO from '$lib/data/SEO.svelte';
    import type { Component } from 'svelte';
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    type ComponentType = Component<Record<string, never>>;

    // let selectedComponent = $state<string>('Select');
    let selectedComponent = $state(
        page.url.searchParams.get('component') ?? 'Select',
    );
    let backgroundImage = $derived(
        selectedComponent === 'Select'
            ? 'repeating-linear-gradient(0deg, transparent, transparent 98px, var(--clr-gray-500) 98px, var(--clr-gray-500) 100px), repeating-linear-gradient(90deg, transparent, transparent 98px, var(--clr-gray-500) 98px, var(--clr-gray-500) 100px)'
            : 'none',
    );
    let SelectedComponent: ComponentType | null = $state(null);

    $effect(() => {
        const entry = componentImportMap[selectedComponent];

        if (entry) {
            entry.import().then((mod) => (SelectedComponent = mod.default));
        } else {
            SelectedComponent = null;
        }
    });

    onMount(() => {
        // cleanup when navigating away
        return () => selectedThreeComponent.set(null);
    });

    $effect(() => {
        selectedThreeComponent.set(
            selectedComponent === 'Select' ? null : selectedComponent,
        );
    });

    $effect(() => {
        function onExit() {
            selectedComponent = 'Select';
        }
        window.addEventListener('exit-game', onExit);

        return () => window.removeEventListener('exit-game', onExit);
    });
</script>

<SEO
    title="Three.js Experiments"
    description="Learning three.js by building small experiments to understand how it works and how to use it in any project."
    keywords="three.js experiments, three.js projects, three.js examples, three.js learning, three.js environment mapping, three.js hand particles, three.js hero canvas, three.js post-processing, three.js loader"
/>

<div class="wholeScreen" style:background-image={backgroundImage}>
    <div class="content">
        {#if SelectedComponent}
            <SelectedComponent />
        {:else if selectedComponent === 'Select'}
            <h2>select a component to view</h2>

            <p>
                *be advised that these components will still work even if you
                have animation effects turned off.
            </p>
        {/if}
    </div>
</div>

<select bind:value={selectedComponent} class="select">
    <option value="Select" disabled>select a component</option>
    <option value="Environment">environment mapping</option>
    <option value="PictureParticles">picture particles</option>
    <option value="HeroCanvas">hero section</option>
    <option value="PostProcess">post-processing</option>
    <option value="Loader">loading bar</option>
    <option value="slaynet">slaynet</option>
    <option value="killgrid">killgrid</option>
    <option value="Carousel">image carousel</option>
</select>

<style>
    .select {
        inline-size: clamp(200px, 20vw, 300px);
        position: fixed;
        bottom: 1.5em;
        left: 25%;
        transform: translateX(-50%);
        color: var(--clr-gray-600);
        font-weight: 700;
        z-index: 999;
        touch-action: auto;

        @media (width <= 768px) {
            top: 3.5em;
            bottom: auto;
            left: 50%;
        }

        & option {
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 1.2vw, var(--h4));
            font-weight: 500;
        }
    }

    .wholeScreen {
        inline-size: 100vw;
        block-size: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: var(--clr-dark-500);

        @media (width <= 500px) {
            position: relative;
            block-size: auto;
            min-block-size: 110vh;
        }

        & .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            position: relative;

            & h2 {
                color: var(--clr-blue-350);
                font-family: var(--bronova-bold);
                font-size: clamp(var(--h4), 5vw, var(--xl));
                text-align: center;
                -webkit-text-stroke: 1px var(--clr-light-500);
                text-shadow: 3px 3px 0 var(--clr-light-500);

                @media (width <= 768px) {
                    text-shadow: 1px 1px 0 var(--clr-light-500);
                    margin-top: 3em;
                }
            }

            & p {
                color: var(--clr-gray-700);
                font-family: var(--bronova);
                font-size: clamp(var(--sm), 1.25vw, var(--h5));
                font-weight: 600;
                text-align: center;
                margin-top: 1em;
                max-inline-size: 600px;
                padding-inline: 0.2em;
            }
        }
    }
</style>
