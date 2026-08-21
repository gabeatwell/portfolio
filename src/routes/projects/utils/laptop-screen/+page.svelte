<script lang="ts">
    import HeroContent from '$lib/components/landing/hero-section/hero/HeroContent.svelte';
</script>

<div class="laptop-screen">
    <HeroContent />
</div>

<style>
    .laptop-screen {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        background: var(--clr-dark-500);
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
</style>
