<script lang="ts">
    import { FPSGame } from './FPSGameSetup';
    import Confetti from './components/Confetti.svelte';
    import TitleScreen from './TitleScreen.svelte';
    import GameLandscape from './components/GameLandscape.svelte';
    import FPSMobileControls from './components/FPSMobileControls.svelte';
    import { attachKillgridGame } from '$lib/attachments/threejs/attachKillgrid';

    let game: FPSGame | null = $state(null);
    let isLocked = $state(false);
    let isMobile = $state(false);
    let playerHealth = $state(10);
    let maxPlayerHealth = $state(10);
    let ammo = $state<number | null>(null);
    let enemyKillCount = $state(0);
    let isGameOver = $state(false);
    let showTitle = $state(true);

    // ─── Boss flow ───────────────────────────────────────────
    let bossSpawned = $state(false);
    let bossAlive = $state(false);
    let bossHealth = $state(0);
    let bossMaxHealth = $state(0);
    let won = $state(false);
    // Screen position for boss health bar (above boss head)
    let bossScreenX = $state(-1000);
    let bossScreenY = $state(-1000);

    let restartTrigger = $state(0);

    function startTitleGame(): void {
        showTitle = false;
    }

    function handleRestart(): void {
        isGameOver = false;
        won = false;
        bossSpawned = false;
        bossAlive = false;
        bossHealth = 0;
        bossMaxHealth = 0;
        playerHealth = 10;
        maxPlayerHealth = 10;
        enemyKillCount = 0;
        restartTrigger += 1;
    }

    // auto restart if game sticks
    $effect(() => {
        if (!isGameOver) return;
        const timer = setTimeout(() => handleRestart(), 3000);

        return () => clearTimeout(timer);
    });

    const gameAttach = $derived(
        attachKillgridGame(
            { restartTrigger },
            {
                onGame: (g) => (game = g),
                onLocked: (v) => (isLocked = v),
                onMobile: (v) => (isMobile = v),
                onPlayerHealth: (h, max) => {
                    playerHealth = h;
                    maxPlayerHealth = max;
                },
                onAmmo: (a) => (ammo = a),
                onKillCount: (n) => (enemyKillCount = n),
                onBoss: (b) => {
                    bossSpawned = b.spawned;
                    bossAlive = b.alive;
                    bossHealth = b.health;
                    bossMaxHealth = b.maxHealth;
                    bossScreenX = b.screenX;
                    bossScreenY = b.screenY;
                    if (b.spawned && !b.alive) won = true;
                },
                onGameOver: (didWin) => {
                    won = didWin;
                    isGameOver = true;
                },
                getIsGameOver: () => isGameOver,
                onRestart: handleRestart,
            },
        ),
    );
</script>

{#if showTitle}
    <TitleScreen onStart={startTitleGame} />
{:else}
    <GameLandscape active={!showTitle} />

    <div class="wrapper">
        <canvas {@attach gameAttach} class="webgl"></canvas>

        <!-- crosshair -->
        <div class="crosshair" class:visible={isLocked}>
            <div class="dot"></div>
            <div class="line top"></div>
            <div class="line bottom"></div>
            <div class="line left"></div>
            <div class="line right"></div>
        </div>

        <!-- HUD: Player health -->
        <div class="health-bar">
            <div
                class="health-fill"
                style="width: {(playerHealth / maxPlayerHealth) * 100}%"
            ></div>
        </div>

        <!-- HUD: Boss health bar (floating above boss head) -->
        {#if bossAlive && bossMaxHealth > 0}
            <div
                class="boss-bar"
                style="left: {bossScreenX}px; top: {bossScreenY}px;"
            >
                <div class="boss-label">BOSS</div>
                <div
                    class="boss-fill"
                    style="width: {(bossHealth / bossMaxHealth) * 100}%"
                ></div>
            </div>
        {/if}

        <!-- HUD: Ammo -->
        <div class="ammo">
            ammo:
            {#if ammo === null}
                &infin;
            {:else}
                {ammo}
            {/if}
        </div>

        <!-- HUD: Kill progress -->
        <div class="kills">
            {#if bossSpawned}
                BOSS
            {:else}
                Kills: {enemyKillCount}/5
            {/if}
        </div>
    </div>

    {#key game}
        <FPSMobileControls
            {game}
            enabled={isMobile && isLocked && !isGameOver}
        />
    {/key}

    <Confetti active={isGameOver} color={won ? 'green' : 'red'} />
{/if}

<style>
    .wrapper {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;

        & .webgl {
            z-index: 0;
            width: 100%;
            height: 100%;
            display: block;
            background: transparent;
            touch-action: none;
        }

        & .crosshair {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 5;
            opacity: 0;
            transition: opacity 0.2s;

            &.visible {
                opacity: 1;
            }

            & .dot {
                width: 5px;
                height: 5px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            & .line {
                position: absolute;
                background: rgba(255, 255, 255, 0.7);
            }

            & .top {
                width: 2px;
                height: 10px;
                top: -12px;
                left: 50%;
                transform: translateX(-50%);
            }

            & .bottom {
                width: 2px;
                height: 10px;
                bottom: -12px;
                left: 50%;
                transform: translateX(-50%);
            }

            & .left {
                width: 10px;
                height: 2px;
                left: -12px;
                top: 50%;
                transform: translateY(-50%);
            }

            & .right {
                width: 10px;
                height: 2px;
                right: -12px;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .health-bar {
            position: fixed;
            bottom: 1.5rem;
            left: 1.5rem;
            width: 200px;
            height: 12px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 6px;
            overflow: hidden;
            z-index: 5;
            pointer-events: none;

            @media (width <= 768px) {
                width: 120px;
                height: 10px;
                bottom: 1rem;
                left: 1rem;
            }
        }

        .health-fill {
            height: 100%;
            background: #e74c3c;
            border-radius: 6px;
            transition: width 0.2s;
        }

        .boss-bar {
            position: fixed;
            transform: translate(-50%, -100%);
            width: 300px;
            height: 18px;
            background: rgba(0, 0, 0, 0.6);
            border: 2px solid rgba(255, 68, 0, 0.8);
            border-radius: 9px;
            overflow: hidden;
            z-index: 6;
            pointer-events: none;
            box-shadow: 0 0 12px rgba(255, 68, 0, 0.4);
            margin-top: -8px;

            @media (width <= 768px) {
                width: 200px;
                height: 14px;
            }
        }

        .boss-label {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: monospace;
            font-size: 0.7rem;
            font-weight: bold;
            color: #ff8844;
            text-shadow: 0 0 6px rgba(255, 68, 0, 0.8);
            z-index: 1;
            letter-spacing: 2px;
        }

        .boss-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff4400, #ff8800);
            border-radius: 8px;
            transition: width 0.15s;
        }

        .ammo {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            font-family: monospace;
            font-size: 1.2rem;
            font-weight: bold;
            color: white;
            text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
            z-index: 5;
            pointer-events: none;

            @media (width <= 768px) {
                bottom: 1rem;
                right: 1rem;
                font-size: 1rem;
            }
        }

        .kills {
            position: fixed;
            position-anchor: --viewport;
            top: anchor(top);
            right: anchor(right);
            margin: 1.5rem;
            font-family: monospace;
            font-size: 1rem;
            color: white;
            text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
            opacity: 0.8;
            z-index: 5;
            pointer-events: none;
        }
    }
</style>
