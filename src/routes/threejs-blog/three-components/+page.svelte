<script lang="ts">
    import SEO from '#lib/data/SEO.svelte';
    import ExamplesLayout from '#lib/components/threejs-blog/ExamplesLayout.svelte';
    import ScrollyIntro from '#lib/components/threejs-blog/ScrollyIntro.svelte';

    let scrollyIntro = $state(true);

    function finishIntro() {
        scrollyIntro = false;
    }
</script>

<SEO
    title="Three.js Experiments"
    description="Learning three.js by building small experiments to understand how it works and how to use it in any project."
    keywords="three.js experiments, three.js projects, three.js examples, three.js learning, three.js environment mapping, three.js hand particles, three.js hero canvas, three.js post-processing, three.js loader"
/>

{#if scrollyIntro}
    <ScrollyIntro oncomplete={finishIntro} />
{:else}
    <ExamplesLayout />
{/if}
