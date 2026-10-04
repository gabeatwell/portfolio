<script lang="ts">
    import Title from '#lib/components/layout/titles/Title.svelte';
    import Popover from '#lib/components/layout/Popover.svelte';

    interface Props {
        title: string;
        title2?: string;
        viewTransitionName?: string;
        popoverTitle?: string;
        popoverText?: string;
    }

    let {
        title,
        title2,
        viewTransitionName,
        popoverTitle = '',
        popoverText = '',
    }: Props = $props();
</script>

<div class="header">
    <Title {title} {title2} {viewTransitionName} />

    {#if popoverText}
        <div class="popover">
            <Popover title={popoverTitle} text={popoverText} />
        </div>
    {/if}
</div>

<style>
    .header {
        display: flex;
        justify-content: center;
        align-items: center;

        & .popover {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin-top: 5em;

            @media (width <= 768px) {
                margin-right: 0.75rem;
            }
        }
    }
</style>
