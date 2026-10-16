<script lang="ts">
    let { title } = $props();
</script>

<a class="test-link" href="/experiments"
    ><span class="visually-hidden">frontend</span> {title}</a
>

<style>
    .test-link {
        position: absolute;
        bottom: 1.2em;
        right: 1em;
        border-radius: 5px;
        background-color: transparent;
        color: var(--clr-warning-500);
        padding: 0.5rem 0.75rem;
        z-index: 100;
        text-decoration: none;
        font-size: clamp(var(--xs), 1vw, var(--sm));
        font-weight: 700;
        letter-spacing: 1px;

        &:not(:focus-visible) {
            clip-path: inset(50%);
            overflow: hidden;
            width: 1px;
            height: 1px;
            white-space: nowrap;
        }

        &:focus-visible {
            outline: 3px solid var(--dark-pale);
            transform: scale(1.05);
            bottom: 1.5rem;
            transition: top 0.2s ease-out;
        }
    }
</style>
