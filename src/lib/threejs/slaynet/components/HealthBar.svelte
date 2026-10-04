<script lang="ts">
    let {
        playerHealth = 0,
        maxPlayerHealth = 10,
        screenPos = { x: 0, y: 0 },
    } = $props();
</script>

<div
    class="health-container"
    style="left: {screenPos.x}px; top: {screenPos.y}px"
>
    <div class="health-bar">
        <div
            class="health-fill"
            style="width: {(playerHealth / maxPlayerHealth) * 100}%"
        >
            health
        </div>
    </div>
</div>

<style>
    .health-container {
        position: fixed;
        transform: translateX(-50%);

        z-index: 100;
        background: transparent;
        padding: 1rem;
        border-radius: 0.5rem;
        min-inline-size: 5vw;
        opacity: 0.75;

        @media (width <= 768px) {
            bottom: 0;
            left: 0;
        }

        & .health-bar {
            inline-size: 100%;
            block-size: clamp(0.75rem, 1vw, 1.15rem);
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 0.25rem;
            overflow: hidden;
        }

        & .health-fill {
            block-size: 100%;
            background: linear-gradient(
                90deg,
                var(--clr-dark-400),
                var(--clr-fail-500)
            );
            transition: inline-size 0.1s ease;
            font-size: clamp(var(--xxxs), 0.1vw, var(--xxs));
            font-weight: 200;
            text-align: center;

            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>
