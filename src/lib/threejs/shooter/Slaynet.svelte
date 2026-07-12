<script lang="ts">
    import { gsap } from '$lib/data/gsap';
    import HealthBar from './components/HealthBar.svelte';
    import GameOver from './components/GameOver.svelte';
    import Directions from './components/Directions.svelte';
    import LandscapeMobile from './components/LandscapeMobile.svelte';
    import TitleScreen from './TitleScreen.svelte';
    import { initializeGame, cleanupGame, type GameState } from './gameSetup';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';

    let canvas = $state<HTMLCanvasElement | null>(null);
    let playerHealth = $state(10);
    let maxPlayerHealth = $state(10);
    let restartTrigger = $state(0);
    let showDirections = $state(false);

    let joystickX = $state(0);
    let joystickY = $state(0);
    let joystickElement = $state<HTMLElement | null>(null);
    let gameState = $state<GameState | null>(null);

    let enemyKillCount = $state(0);
    let isGameOver = $state(false);
    let won = $derived(enemyKillCount >= 3);
    let showTitle = $state(true);

    function startSlaynetGame(): void {
        showTitle = false;
    }
    let enemiesDisposed = $state(false);
    let isMobile = $state(false);
    let isPaused = $state(false);
    let ammo = $state<number | null>(null);

    let playerScreenPos = $state({ x: 0, y: 0 });
    let enemyHealthBars = $state<
        Array<{
            id: string;
            x: number;
            y: number;
            health: number;
            maxHealth: number;
        }>
    >([]);

    const breakpoints = getBreakpoints();

    function handleRestart(): void {
        isGameOver = false;
        playerHealth = 10;
        maxPlayerHealth = 10;
        restartTrigger += 1;
        enemyKillCount = 0;
        enemiesDisposed = false;
    }

    $effect(() => {
        if (gameState?.player) {
            try {
                gameState.player.getCombatManager().setPaused(isPaused);
            } catch (e) {
                // Ignore
            }
        }
    });

    // initialize game only when canvas is available or restart is triggered
    $effect(() => {
        if (!canvas || showTitle) return;

        const trigger = restartTrigger;

        const abortController = new AbortController();
        let lastFrameTime = performance.now();
        let animationLoopRunning = true;

        isMobile = window.innerWidth <= 768;

        let cleanup: (() => void) | null = null;

        initializeGame(canvas, joystickElement)
            .then((state) => {
                if (!animationLoopRunning) return;

                gameState = state;

                if (isMobile) {
                    isPaused = false;
                }

                const {
                    renderer,
                    scene,
                    camera,
                    controls,
                    player,
                    enemyManager,
                    mobileJoystick,
                } = state;

                const cameraTarget = {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z,
                };
                let cameraTween: gsap.core.Tween | null = null;

                enemyManager.setOnEnemyKilled(() => {
                    enemyKillCount = enemyManager.getKillCount();

                    try {
                        const cm = player.getCombatManager();
                        const cur = cm.getPlayerAmmo();
                        if (cur !== null) {
                            cm.setPlayerAmmo(cur + 5);
                        }
                    } catch (e) {
                        // Ignore
                    }

                    if (enemyKillCount >= 3) {
                        console.log('Win condition met!');
                        isGameOver = true;
                    }
                });

                function onResize() {
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    isMobile = w <= 768;
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                    renderer.setPixelRatio(
                        Math.min(window.devicePixelRatio, 2),
                    );
                    renderer.setSize(w, h, false);
                }

                onResize();
                window.addEventListener('resize', onResize, {
                    signal: abortController.signal,
                });

                function onKeyToggle(e: KeyboardEvent) {
                    if (e.key === 'r' || e.key === 'R') {
                        controls.enableRotate = !controls.enableRotate;
                        console.log('Orbit rotate:', controls.enableRotate);
                    }
                }

                window.addEventListener('keydown', onKeyToggle, {
                    signal: abortController.signal,
                });

                function onEscape(e: KeyboardEvent) {
                    if (e.key === 'Escape') {
                        cleanupGame(state, abortController);
                        gameState = null;
                        window.dispatchEvent(new CustomEvent('exit-game'));
                    }
                }
                window.addEventListener('keydown', onEscape, {
                    signal: abortController.signal,
                });

                renderer.setAnimationLoop(() => {
                    if (isPaused) {
                        renderer.render(scene, camera);
                        return;
                    }

                    player.update();

                    const now = performance.now();
                    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
                    lastFrameTime = now;

                    if (isGameOver && !enemiesDisposed) {
                        enemyManager.dispose();
                        enemiesDisposed = true;
                    } else if (!isGameOver) {
                        enemyManager.update(dt);
                    }

                    if (gameState?.player && gameState?.camera) {
                        const playerWorldPos =
                            gameState.player.position.clone();
                        const vector = playerWorldPos.project(gameState.camera);

                        const screenX =
                            (vector.x * 0.5 + 0.5) * window.innerWidth;
                        const screenY =
                            -(vector.y * 0.5 - 0.5) * window.innerHeight;

                        playerScreenPos = { x: screenX, y: screenY - 125 };
                    }

                    if (gameState?.camera && gameState?.enemyManager) {
                        const enemies =
                            gameState.enemyManager.getEnemies?.() || [];
                        enemyHealthBars = enemies
                            .map((enemy: any) => {
                                try {
                                    if (!gameState?.camera) return null;
                                    const enemyWorldPos =
                                        enemy.position.clone();
                                    const vector = enemyWorldPos.project(
                                        gameState.camera,
                                    );

                                    const screenX =
                                        (vector.x * 0.5 + 0.5) *
                                        window.innerWidth;
                                    const screenY =
                                        -(vector.y * 0.5 - 0.5) *
                                        window.innerHeight;

                                    const health = enemy.getHealth?.() || 0;
                                    const maxHealth =
                                        enemy.getMaxHealth?.() || 100;

                                    return {
                                        id: String(enemy.id || Math.random()),
                                        x: screenX,
                                        y: screenY - 125,
                                        health: Number(health),
                                        maxHealth: Number(maxHealth),
                                    };
                                } catch (e) {
                                    return null;
                                }
                            })
                            .filter(
                                (
                                    bar: any,
                                ): bar is {
                                    id: string;
                                    x: number;
                                    y: number;
                                    health: number;
                                    maxHealth: number;
                                } => bar !== null,
                            );
                    }

                    if (mobileJoystick) {
                        joystickX = mobileJoystick.getJoystickX();
                        joystickY = mobileJoystick.getJoystickY();
                    }

                    const combatManager = player.getCombatManager();
                    playerHealth = combatManager.getPlayerHealth();
                    maxPlayerHealth = combatManager.getMaxPlayerHealth();

                    try {
                        ammo = combatManager.getPlayerAmmo();
                    } catch (e) {
                        ammo = null;
                    }

                    if (playerHealth <= 0 && !isGameOver) {
                        isGameOver = true;
                    }

                    const desiredX = player.position.x + 1;
                    const desiredY = player.position.y + 4;
                    const desiredZ = player.position.z + 3;

                    if (isMobile) {
                        camera.position.set(desiredX, desiredY, desiredZ);
                    } else {
                        if (controls.enableRotate) {
                            if (cameraTween) {
                                cameraTween.kill();
                                cameraTween = null;
                            }
                        } else {
                            if (cameraTween) cameraTween.kill();

                            cameraTween = gsap.to(cameraTarget, {
                                x: desiredX,
                                y: desiredY,
                                z: desiredZ,
                                duration: 0.3,
                                ease: 'power2.out',
                                onUpdate: () => {
                                    camera.position.set(
                                        cameraTarget.x,
                                        cameraTarget.y,
                                        cameraTarget.z,
                                    );
                                },
                            });
                        }
                    }

                    controls.target.copy(player.position);
                    controls.update();

                    renderer.render(scene, camera);
                });

                cleanup = () => {
                    animationLoopRunning = false;
                    if (cameraTween) cameraTween.kill();
                    cleanupGame(state, abortController);
                    gameState = null;
                };
            })
            .catch((error) => {
                console.error('Failed to initialize game:', error);
            });

        return () => {
            if (cleanup) cleanup();
        };
    });

    // update pause state separately
    $effect(() => {
        if (gameState?.player) {
            try {
                gameState.player.getCombatManager().setPaused(isPaused);
            } catch (e) {
                // Ignore
            }
        }
    });

    // apply pause state after game initializes
    $effect(() => {
        if (gameState && isMobile) {
            isPaused = false;
        }
    });

    $effect(() => {
        const footer = document.querySelector('footer') as HTMLElement | null;
        const nav = document.querySelector('.navigation') as HTMLElement | null;
        const select = document.querySelector('.select') as HTMLElement | null;
        const isLandscapeMobile =
            breakpoints.isLandscape && breakpoints.isMobile;

        if (nav) nav.style.display = isLandscapeMobile ? 'none' : '';
        if (select) select.style.display = isLandscapeMobile ? 'none' : '';
        if (footer) footer.style.display = isLandscapeMobile ? 'none' : '';

        return () => {
            if (footer) footer.style.display = '';
            if (nav) nav.style.display = '';
            if (select) select.style.display = '';
        };
    });
</script>

{#if showTitle}
    <TitleScreen onStart={startSlaynetGame} />
{:else}
    <LandscapeMobile
        {isMobile}
        onPause={() => (isPaused = true)}
        onResume={() => (isPaused = false)}
    />
    <HealthBar {playerHealth} {maxPlayerHealth} screenPos={playerScreenPos} />
    {#each enemyHealthBars as enemy (enemy.id)}
        <HealthBar
            playerHealth={enemy.health}
            maxPlayerHealth={enemy.maxHealth}
            screenPos={{ x: enemy.x, y: enemy.y }}
        />
    {/each}
    <GameOver {isGameOver} {won} onRestart={handleRestart} />
    {#if !isMobile}
        <Directions bind:showDirections />
    {/if}

    <div class="mobile-wrapper">
        <canvas
            class="webgl"
            bind:this={canvas}
            data-testing="scene-canvas"
            style="anchor-name: --health-anchor;"
        ></canvas>

        <!-- mobile joystick -->
        <div
            class="mobile-joystick"
            bind:this={joystickElement}
            data-testing="interaction-state"
        >
            <div class="joystick-base">
                <div
                    class="joystick-stick"
                    style="transform: translate({joystickX * 30}px, {joystickY *
                        30}px)"
                ></div>
            </div>
        </div>

        <!-- shoot button -->
        <button
            class="shoot-button"
            onclick={() => gameState?.player?.shoot()}
            aria-label="Shoot"
            data-testing="interaction-state"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path
                    d="M560 120C560 106.7 549.3 96 536 96C522.7 96 512 106.7 512 120L512 128L64 128C46.3 128 32 142.3 32 160L32 272C32 289.7 46.3 304 64 304L74 304C94.8 304 110.1 323.6 105 343.8L65 504.2C62.6 513.8 64.8 523.9 70.8 531.7C76.8 539.5 86.1 544 96 544L192 544C206.7 544 219.5 534 223 519.8L249 416L353.4 416C377.1 416 398.2 401.1 406.1 378.8L432.8 304L463.9 304C472.4 304 480.5 300.6 486.5 294.6L509.1 272L575.8 272C593.5 272 607.8 257.7 607.8 240L607.8 160C607.8 142.3 593.5 128 575.8 128L559.8 128L559.8 120zM353.4 368L260.9 368L276.9 304L381.9 304L360.9 362.7C359.8 365.9 356.7 368 353.4 368zM112 192L496 192C504.8 192 512 199.2 512 208C512 216.8 504.8 224 496 224L112 224C103.2 224 96 216.8 96 208C96 199.2 103.2 192 112 192z"
                />
            </svg>
        </button>
    </div>

    <!-- ammo counter -->
    <div class="ammo-counter" aria-hidden={ammo === null}>
        {#if ammo === null}
            <span>Ammo: ∞</span>
        {:else}
            <span>Ammo: {ammo}</span>
        {/if}
    </div>
{/if}

<style>
    .mobile-wrapper {
        & .webgl {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            z-index: 0;
            min-height: 100vh;
            max-inline-size: 100vw;
            display: block;
            background: transparent;
            touch-action: none;

            anchor-name: --game;

            mask-image: radial-gradient(
                ellipse at center,
                var(--clr-dark-500) 0%,
                transparent 80%,
                transparent 100%
            );
            box-shadow: inset 0 0 10px 20px var(--clr-dark-500);

            @media (width <= 768px) {
                mask-image: radial-gradient(
                    ellipse at center,
                    var(--clr-dark-500) 0%,
                    transparent 95%,
                    transparent 100%
                );
            }
        }

        & .shoot-button {
            position: absolute;
            position-anchor: --game;
            top: anchor(bottom);
            right: anchor(right);

            inline-size: calc(1em * 2.2);
            block-size: calc(1em * 2.2);
            border-radius: 50%;
            background: var(--clr-blue-500);
            color: var(--clr-light-500);
            border: 2px solid var(--clr-blue-500);
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 100;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            touch-action: manipulation;
            user-select: none;

            &:hover {
                transform: scale(1.1);
            }

            &:active {
                transform: scale(0.95);
            }

            @media (max-width: 768px) {
                display: flex;
                top: auto;
                bottom: 1em;
                right: 1em;
            }

            & svg {
                inline-size: 2.3em;
                block-size: 2.3em;
                scale: 2;
            }
        }

        & .mobile-joystick {
            position: absolute;
            position-anchor: --game;
            bottom: anchor(bottom);
            left: anchor(left);

            inline-size: calc(1em * 6.5);
            block-size: calc(1em * 6.5);
            display: none;
            z-index: 100;
            touch-action: none;

            @media (max-width: 768px) {
                display: flex;
                align-items: center;
                justify-content: center;
                bottom: calc(1em * 3);
                left: calc(1em * 3.9);
            }

            @media (max-width: 500px) {
                bottom: calc(1em * 2);
                left: calc(1em * 1.2);
            }

            & .joystick-base {
                position: relative;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            & .joystick-stick {
                inline-size: calc(1em * 2.5);
                block-size: calc(1em * 2.5);
                background: rgba(255, 255, 255, 0.5);
                border: 2px solid rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                transition: transform 0.05s ease-out;
                pointer-events: none;
            }
        }
    }

    .ammo-counter {
        position: fixed;
        right: 1rem;
        bottom: 0;
        z-index: 200;
        background: var(--clr-dark-500);
        color: var(--clr-light-500);
        padding: 0.35rem 0.6rem;
        border-radius: 6px;
        font-size: 0.95rem;
        pointer-events: none;
    }
</style>
