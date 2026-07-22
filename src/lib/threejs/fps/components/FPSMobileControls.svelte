<script lang="ts">
    interface Props {
        game: any;
        enabled: boolean;
    }

    let { game, enabled }: Props = $props();

    // Touch tracking
    let leftTouchId: number | null = $state(null);
    let rightTouchId: number | null = $state(null);
    let lastLeftX = 0;
    let lastLeftY = 0;
    let lastRightX = 0;
    let lastRightY = 0;
    let joystickX = $state(0);
    let joystickY = $state(0);

    function handleTouchStart(e: TouchEvent) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (t.clientX < window.innerWidth / 2 && leftTouchId === null) {
                // Left side — movement joystick
                leftTouchId = t.identifier;
                lastLeftX = t.clientX;
                lastLeftY = t.clientY;
                joystickX = 0;
                joystickY = 0;
            } else if (
                t.clientX >= window.innerWidth / 2 &&
                rightTouchId === null
            ) {
                // Right side — look
                rightTouchId = t.identifier;
                lastRightX = t.clientX;
                lastRightY = t.clientY;
            }
        }
    }

    function handleTouchMove(e: TouchEvent) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];

            if (t.identifier === leftTouchId) {
                // Left joystick — distance from initial touch point
                const dx = (t.clientX - lastLeftX) / (window.innerWidth * 0.25);
                const dy =
                    (t.clientY - lastLeftY) / (window.innerHeight * 0.25);
                joystickX = Math.max(-1, Math.min(1, dx));
                joystickY = Math.max(-1, Math.min(1, dy));
                if (game) game.setMobileMove(joystickX, joystickY);
            } else if (t.identifier === rightTouchId) {
                // Right drag — look around
                const dx = t.clientX - lastRightX;
                const dy = t.clientY - lastRightY;
                lastRightX = t.clientX;
                lastRightY = t.clientY;
                if (game) game.setMobileLook(dx, dy);
            }
        }
    }

    function handleTouchEnd(e: TouchEvent) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (t.identifier === leftTouchId) {
                leftTouchId = null;
                joystickX = 0;
                joystickY = 0;
                if (game) game.setMobileMove(0, 0);
            }
            if (t.identifier === rightTouchId) {
                rightTouchId = null;
            }
        }
    }

    function handleTouchCancel() {
        leftTouchId = null;
        rightTouchId = null;
        joystickX = 0;
        joystickY = 0;
        if (game) game.setMobileMove(0, 0);
    }
</script>

{#if enabled}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="touch-overlay"
        ontouchstart={handleTouchStart}
        ontouchmove={handleTouchMove}
        ontouchend={handleTouchEnd}
        ontouchcancel={handleTouchCancel}
    >
        <!-- Left joystick indicator -->
        {#if leftTouchId !== null}
            <div class="joystick-area" style="left: 25%; bottom: 20%;">
                <div
                    class="joystick-knob"
                    style="transform: translate({joystickX * 20}px, {joystickY *
                        20}px)"
                ></div>
            </div>
        {/if}

        <!-- Right drag indicator -->
        {#if rightTouchId !== null}
            <div class="look-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        stroke-width="1"
                        fill="none"
                        opacity="0.3"
                    />
                </svg>
            </div>
        {/if}
    </div>
{/if}

<style>
    .touch-overlay {
        position: fixed;
        inset: 0;
        z-index: 6;
        touch-action: none;
        pointer-events: auto;
    }

    .joystick-area {
        position: fixed;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, 50%);
        pointer-events: none;
    }

    .joystick-knob {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transition: transform 0.05s;
    }

    .look-indicator {
        position: fixed;
        top: 50%;
        right: 15%;
        transform: translate(50%, -50%);
        pointer-events: none;
        opacity: 0.5;
    }
</style>
