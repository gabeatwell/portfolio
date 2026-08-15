import type { Attachment } from 'svelte/attachments';
import { FPSGame } from '$lib/threejs/fps/FPSGameSetup';

export type FPSHudCallbacks = {
    onGame: (game: FPSGame | null) => void;
    onLocked: (locked: boolean) => void;
    onMobile: (mobile: boolean) => void;
    onPlayerHealth: (h: number, max: number) => void;
    onAmmo: (a: number | null) => void;
    onKillCount: (n: number) => void;
    onBoss: (state: {
        spawned: boolean;
        alive: boolean;
        health: number;
        maxHealth: number;
        screenX: number;
        screenY: number;
    }) => void;
    onGameOver: (won: boolean) => void;
    getIsGameOver: () => boolean;
    onRestart: () => void;
};

export function attachKillgridGame(
    opts: {
        /** bump to force dispose + re-init (restart) */
        restartTrigger: number;
    },
    cb: FPSHudCallbacks,
): Attachment<HTMLCanvasElement> {
    return (canvas) => {
        void opts.restartTrigger;

        const isMobile =
            'ontouchstart' in window || navigator.maxTouchPoints > 0;
        cb.onMobile(isMobile);

        // hide chrome while playing
        document
            .querySelector('nav')
            ?.style.setProperty('display', 'none', 'important');
        document
            .querySelector('footer')
            ?.style.setProperty('display', 'none', 'important');

        const game = new FPSGame();
        cb.onGame(game);

        let hudInterval: ReturnType<typeof setInterval> | null = null;
        let disposed = false;

        const onLockChange = () => {
            cb.onLocked(document.pointerLockElement === canvas);
        };
        document.addEventListener('pointerlockchange', onLockChange);

        const onEscape = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            game.dispose();
            cb.onGame(null);
            if (hudInterval) clearInterval(hudInterval);
            document.removeEventListener('pointerlockchange', onLockChange);
            window.dispatchEvent(new CustomEvent('exit-game'));
        };
        document.addEventListener('keydown', onEscape);

        game.init(canvas)
            .then(() => {
                if (disposed) return;
                if (isMobile) game.setMobile(true);
                game.start();
                cb.onLocked(
                    isMobile ? true : document.pointerLockElement === canvas,
                );
            })
            .catch((err) => console.error('FPS init failed', err));

        hudInterval = setInterval(() => {
            if (!game || disposed || cb.getIsGameOver()) return;
            if (!game.combatManager || !game.enemyManager) return;

            const mgr = game.enemyManager;

            cb.onPlayerHealth(
                game.combatManager.getPlayerHealth(),
                game.combatManager.getMaxPlayerHealth(),
            );
            cb.onAmmo(game.combatManager.getPlayerAmmo());
            const killCount = mgr.getKillCount();
            cb.onKillCount(killCount);

            // boss spawn
            if (killCount >= 5 && !mgr.hasBossSpawned()) {
                mgr.spawnBoss();
                setTimeout(() => {
                    cb.onBoss({
                        spawned: true,
                        alive: true,
                        health: mgr.getBossHealth(),
                        maxHealth: mgr.getBossMaxHealth(),
                        screenX: -1000,
                        screenY: -1000,
                    });
                }, 100);
            }

            const bossStillAlive = mgr.isBossAlive();
            if (bossStillAlive) {
                let screenX = -1000;
                let screenY = -1000;
                const bossEnemy = mgr.getEnemies().find((e: any) => e.isBoss);
                if (bossEnemy && game.camera) {
                    const pos = bossEnemy.position.clone();
                    pos.y += 2.8;
                    const projected = pos.clone().project(game.camera);
                    screenX = ((projected.x + 1) / 2) * window.innerWidth;
                    screenY = ((-projected.y + 1) / 2) * window.innerHeight;
                    if (projected.z > 1) {
                        screenX = -1000;
                        screenY = -1000;
                    }
                }
                cb.onBoss({
                    spawned: true,
                    alive: true,
                    health: mgr.getBossHealth(),
                    maxHealth: mgr.getBossMaxHealth(),
                    screenX,
                    screenY,
                });
            } else if (mgr.hasBossSpawned()) {
                // was boss flow, now dead → win
                const health = game.combatManager.getPlayerHealth();
                if (health > 0) {
                    cb.onBoss({
                        spawned: true,
                        alive: false,
                        health: 0,
                        maxHealth: mgr.getBossMaxHealth(),
                        screenX: -1000,
                        screenY: -1000,
                    });
                    if (!isMobile) game.controls.unlock();
                    game.pause?.();
                    cb.onGameOver(true);
                    setTimeout(() => cb.onRestart(), 2500);
                    return;
                }
            }

            if (game.combatManager.getPlayerHealth() <= 0) {
                if (!isMobile) game.controls.unlock();
                game.pause?.();
                cb.onGameOver(false);
                setTimeout(() => cb.onRestart(), 2500);
            }
        }, 100);

        return () => {
            disposed = true;
            if (hudInterval) clearInterval(hudInterval);
            document.removeEventListener('pointerlockchange', onLockChange);
            document.removeEventListener('keydown', onEscape);
            try {
                game.dispose();
            } catch {
                // ignore
            }
            cb.onGame(null);

            // restore chrome
            const nav = document.querySelector('nav') as HTMLElement | null;
            const footer = document.querySelector(
                'footer',
            ) as HTMLElement | null;
            if (nav) nav.style.display = '';
            if (footer) footer.style.display = '';
        };
    };
}
