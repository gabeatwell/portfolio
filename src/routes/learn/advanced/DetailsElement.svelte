<script>
    let { summary, children } = $props();
</script>

<details class="details-element">
    <summary>{summary}</summary>
    {@render children()}
</details>

<style>
    .details-element {
        margin-block: 2em;

        & summary {
            text-align: center;
            list-style: none;
            cursor: pointer;
            border: none;
            font-weight: bold;
        }
    }
</style>
