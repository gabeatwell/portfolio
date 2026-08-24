import { gsap } from '$lib/data/gsap';
import {
    initializeGame,
    cleanupGame,
    type GameState,
} from '$lib/threejs/shooter/gameSetup';
import type { Attachment } from 'svelte/attachments';

export type GameHudCallbacks = {
    onState: (state: GameState | null) => void;
    onTotalEnemies: (n: number) => void;
    onKillCount: (n: number) => void;
    onGameOver: () => void;
    onPlayerHealth: (health: number, max: number) => void;
    onAmmo: (ammo: number | null) => void;
    onPlayerScreenPos: (pos: { x: number; y: number }) => void;
    onEnemyHealthBars: (
        bars: Array<{
            id: string;
            x: number;
            y: number;
            health: number;
            maxHealth: number;
        }>,
    ) => void;
    onJoystick: (x: number, y: number) => void;
    onMobile: (v: boolean) => void;
    getIsPaused: () => boolean;
    getIsGameOver: () => boolean;
    getEnemiesDisposed: () => boolean;
    setEnemiesDisposed: (v: boolean) => void;
};

export function attachSlaynetGame(
    opts: {
        restartTrigger: number;
        joystickElement: HTMLElement | null;
    },
    cb: GameHudCallbacks,
): Attachment<HTMLCanvasElement> {
    return (canvas) => {
        // re-run when restartTrigger changes
        void opts.restartTrigger;

        const abortController = new AbortController();
        let lastFrameTime = performance.now();
        let animationLoopRunning = true;
        let cleanup: (() => void) | null = null;

        cb.onMobile(window.innerWidth <= 768);

        initializeGame(canvas, opts.joystickElement)
            .then((state) => {
                if (!animationLoopRunning) return;

                cb.onState(state);

                const {
                    renderer,
                    scene,
                    camera,
                    controls,
                    player,
                    enemyManager,
                    mobileJoystick,
                } = state;

                cb.onTotalEnemies(enemyManager.getMaxEnemies());

                const cameraTarget = {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z,
                };
                let cameraTween: gsap.core.Tween | null = null;

                enemyManager.setOnEnemyKilled(() => {
                    const count = enemyManager.getKillCount();
                    cb.onKillCount(count);

                    try {
                        const cm = player.getCombatManager();
                        const cur = cm.getPlayerAmmo();
                        if (cur !== null) cm.setPlayerAmmo(cur + 5);
                    } catch {
                        // ignore
                    }

                    if (count >= enemyManager.getMaxEnemies()) cb.onGameOver();
                });

                const onResize = () => {
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    cb.onMobile(w <= 768);
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                    renderer.setPixelRatio(
                        Math.min(window.devicePixelRatio, 2),
                    );
                    renderer.setSize(w, h, false);
                };
                onResize();
                window.addEventListener('resize', onResize, {
                    signal: abortController.signal,
                });

                window.addEventListener(
                    'keydown',
                    (e) => {
                        if (e.key === 'r' || e.key === 'R') {
                            controls.enableRotate = !controls.enableRotate;
                        }
                        if (e.key === 'Escape') {
                            cleanupGame(state, abortController);
                            cb.onState(null);
                            window.dispatchEvent(new CustomEvent('exit-game'));
                        }
                    },
                    { signal: abortController.signal },
                );

                renderer.setAnimationLoop(() => {
                    if (cb.getIsPaused()) {
                        renderer.render(scene, camera);
                        return;
                    }

                    player.update();

                    const now = performance.now();
                    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
                    lastFrameTime = now;

                    if (cb.getIsGameOver() && !cb.getEnemiesDisposed()) {
                        enemyManager.dispose();
                        cb.setEnemiesDisposed(true);
                    } else if (!cb.getIsGameOver()) {
                        enemyManager.update(dt);
                    }

                    // player HUD position
                    const playerWorldPos = player.position.clone();
                    const playerVec = playerWorldPos.project(camera);
                    cb.onPlayerScreenPos({
                        x: (playerVec.x * 0.5 + 0.5) * window.innerWidth,
                        y:
                            -(playerVec.y * 0.5 - 0.5) * window.innerHeight -
                            125,
                    });

                    // enemy HUD bars
                    const enemies = enemyManager.getEnemies?.() || [];
                    cb.onEnemyHealthBars(
                        enemies
                            .map((enemy: any) => {
                                try {
                                    const v = enemy.position
                                        .clone()
                                        .project(camera);
                                    return {
                                        id: String(enemy.id ?? Math.random()),
                                        x:
                                            (v.x * 0.5 + 0.5) *
                                            window.innerWidth,
                                        y:
                                            -(v.y * 0.5 - 0.5) *
                                                window.innerHeight -
                                            125,
                                        health: Number(
                                            enemy.getHealth?.() || 0,
                                        ),
                                        maxHealth: Number(
                                            enemy.getMaxHealth?.() || 100,
                                        ),
                                    };
                                } catch {
                                    return null;
                                }
                            })
                            .filter(
                                (
                                    bar,
                                ): bar is {
                                    id: string;
                                    x: number;
                                    y: number;
                                    health: number;
                                    maxHealth: number;
                                } => bar !== null,
                            ),
                    );

                    if (mobileJoystick) {
                        cb.onJoystick(
                            mobileJoystick.getJoystickX(),
                            mobileJoystick.getJoystickY(),
                        );
                    }

                    const combatManager = player.getCombatManager();
                    cb.onPlayerHealth(
                        combatManager.getPlayerHealth(),
                        combatManager.getMaxPlayerHealth(),
                    );
                    try {
                        cb.onAmmo(combatManager.getPlayerAmmo());
                    } catch {
                        cb.onAmmo(null);
                    }

                    if (
                        combatManager.getPlayerHealth() <= 0 &&
                        !cb.getIsGameOver()
                    ) {
                        cb.onGameOver();
                    }

                    const desiredX = player.position.x + 1;
                    const desiredY = player.position.y + 4;
                    const desiredZ = player.position.z + 3;
                    const mobile = window.innerWidth <= 768;

                    if (mobile) {
                        camera.position.set(desiredX, desiredY, desiredZ);
                    } else if (!controls.enableRotate) {
                        cameraTween?.kill();
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
                    } else {
                        cameraTween?.kill();
                        cameraTween = null;
                    }

                    controls.target.copy(player.position);
                    controls.update();
                    renderer.render(scene, camera);
                });

                cleanup = () => {
                    animationLoopRunning = false;
                    cameraTween?.kill();
                    cleanupGame(state, abortController);
                    cb.onState(null);
                };
            })
            .catch((err) => console.error('Failed to initialize game:', err));

        return () => {
            animationLoopRunning = false;
            cleanup?.();
        };
    };
}
