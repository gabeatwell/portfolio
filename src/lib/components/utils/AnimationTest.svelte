<script lang="ts">
    import { fade, fly, scale, blur } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    let show = $state<boolean>(true);
    let currentTransition = $state<string>('fade');

    let duration = $state<number>(300);
    let delay = $state<number>(0);

    function toggle() {
        show = !show;
    }

    // Debug: Log current values
    $effect(() => {
        console.log('Current transition:', currentTransition);
        console.log('Duration:', duration, 'Delay:', delay);
        console.log('Show:', show);
    });
</script>

<div class="grid">
    <div class="controls">
        <button onclick={toggle}
            >Toggle Animation (Current: {show ? 'Shown' : 'Hidden'})</button
        >

        <label>
            Duration: {duration}ms
            <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={duration}
                oninput={(e) =>
                    (duration = Number((e.target as HTMLInputElement).value))}
            />
        </label>

        <label>
            Delay: {delay}ms
            <input
                type="range"
                min="0"
                max="1000"
                step="100"
                value={delay}
                oninput={(e) =>
                    (delay = Number((e.target as HTMLInputElement).value))}
            />
        </label>

        <label>
            Transition:
            <select bind:value={currentTransition}>
                <option value="fade">Fade</option>
                <option value="fly">Fly</option>
                <option value="scale">Scale</option>
                <option value="blur">Blur</option>
            </select>
        </label>

        <div class="presets">
            <button
                onclick={() => {
                    duration = 300;
                    delay = 0;
                }}>Quick</button
            >
            <button
                onclick={() => {
                    duration = 800;
                    delay = 100;
                }}>Slow</button
            >
            <button
                onclick={() => {
                    duration = 1500;
                    delay = 300;
                }}>Very Slow</button
            >
        </div>
    </div>

    <div class="demo">
        <!-- Separate blocks for each transition type -->
        {#if currentTransition === 'fade' && show}
            <div
                class="box"
                transition:fade={{ duration, delay, easing: quintOut }}
            >
                <h2>Fade Animation</h2>
                <p>Duration: {duration}ms</p>
                <p>Delay: {delay}ms</p>
                <p>Opacity changes</p>
            </div>
        {/if}

        {#if currentTransition === 'fly' && show}
            <div
                class="box"
                transition:fly={{ duration, delay, easing: quintOut, y: -200 }}
            >
                <h2>Fly Animation</h2>
                <p>Duration: {duration}ms</p>
                <p>Delay: {delay}ms</p>
                <p>Flies in from above</p>
            </div>
        {/if}

        {#if currentTransition === 'scale' && show}
            <div
                class="box"
                transition:scale={{
                    duration,
                    delay,
                    easing: quintOut,
                    start: 0.5,
                }}
            >
                <h2>Scale Animation</h2>
                <p>Duration: {duration}ms</p>
                <p>Delay: {delay}ms</p>
                <p>Scales from 50%</p>
            </div>
        {/if}

        {#if currentTransition === 'blur' && show}
            <div
                class="box"
                transition:blur={{
                    duration,
                    delay,
                    easing: quintOut,
                    amount: 10,
                }}
            >
                <h2>Blur Animation</h2>
                <p>Duration: {duration}ms</p>
                <p>Delay: {delay}ms</p>
                <p>Blurs in/out</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
        padding: 2rem 3em;

        @media (width <= 768px) {
            grid-template-columns: 1fr;
            padding: 1rem;
        }

        & .controls {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-inline-size: 400px;
            margin-top: 15em;

            @media (width <= 768px) {
                margin-top: 5em;
            }

            & button {
                padding: 0.75rem 1.5rem;
                color: var(--clr-light-500);
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
                transition: background 0.3s;
                background: var(--clr-secondary, #6c757d);

                &:hover {
                    background: var(--clr-accent, #28a745);
                }
            }
        }

        & .demo {
            padding: 2rem;
            min-height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 15em;
            border: 1px solid var(--clr-gray-500-fade);

            @media (width <= 768px) {
                margin-top: 0;
            }
        }

        & .box {
            background: var(--clr-light-500);
            color: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;

            & h2,
            & p {
                color: var(--clr-dark-500);
            }

            & h2 {
                font-weight: 800;
            }

            & p {
                font-weight: 600;
            }
        }

        & label {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            color: var(--clr-light-500);
        }

        & input,
        & select {
            padding: 0.5rem;
        }

        & .presets {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;

            & button {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
                background: var(--clr-secondary, #6c757d);

                &:hover {
                    background: var(--clr-accent, #28a745);
                }
            }
        }
    }
</style>
