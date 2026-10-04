import {
    AmbientLight,
    Color,
    DirectionalLight,
    FogExp2,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { World } from './world';
import { HumanPlayer } from './players/HumanPlayer';
import { EnemyManager } from './enemies/EnemyManager';
import { MobileJoystick } from './actions/MobileJoystick';
import { generateLevelConfig } from './procedural/levelGenerator';
import type { SpawnConfig } from './enemies/EnemyManager';

export interface GameState {
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;
    world: World;
    player: HumanPlayer;
    enemyManager: EnemyManager;
    mobileJoystick: MobileJoystick | null;
    sun: DirectionalLight;
    ambient: AmbientLight;
}

export async function initializeGame(
    canvas: HTMLCanvasElement,
    joystickElement: HTMLElement | null,
    seed?: number,
): Promise<GameState> {
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    const scene = new Scene();
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );

    // fog
    scene.background = new Color('#242424');
    {
        const fogColor = 0x242424;
        const density = 0.015;
        scene.fog = new FogExp2(fogColor, density);
    }

    const controls = new OrbitControls(camera, canvas);
    // keep camera locked to player: disable orbiting/panning/zooming
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;

    // ------------- WORLD DIMENSIONS -------------
    const WORLD_WIDTH = 50;
    const WORLD_DEPTH = 50;
    const world = new World(WORLD_WIDTH, WORLD_DEPTH);
    scene.add(world);

    await world.generate(true, scene);
    scene.add(world.buildings);

    // ------------- procedural level config  -------------
    const levelConfig = generateLevelConfig(
        world,
        {
            width: WORLD_WIDTH,
            depth: WORLD_DEPTH,
        },
        seed,
    );

    controls.target.set(
        levelConfig.playerSpawn.x,
        0,
        levelConfig.playerSpawn.z,
    );
    camera.position.set(
        levelConfig.playerSpawn.x + 1,
        4,
        levelConfig.playerSpawn.z + 3,
    );
    controls.update();

    const spawnConfig: SpawnConfig = {
        maxAlive: 4,
        // maxAlive: levelConfig.spawnPoints.length,
        cooldownMax: 3,
        spawnRadius: { min: 6, max: 10 },
        enemyTypes: [
            { type: 'basic', weight: 1, health: 3, speed: 2 },
            { type: 'ranged', weight: 1, health: 2, speed: 3 },
            { type: 'tank', weight: 1, health: 8, speed: 1 },
        ],
    };

    // player
    const player = new HumanPlayer(
        camera,
        world,
        world,
        canvas,
        scene,
        controls,
    );
    scene.add(player);

    player.position.set(
        levelConfig.playerSpawn.x,
        0,
        levelConfig.playerSpawn.z,
    );

    const enemyManager = new EnemyManager(player, world, scene, spawnConfig);
    enemyManager.spawnFromLevelConfig(levelConfig.spawnPoints);
    enemyManager.setOnEnemyKilled((position) => {
        player.getCombatManager().spawnHealthPickup(position);
    });
    scene.add(enemyManager);

    player.getCombatManager().setEnemyManager(enemyManager);

    // start player with limited ammo
    try {
        player.getCombatManager().setPlayerAmmo(10);
    } catch {
        // ignore if method missing
    }

    const mobileJoystick = joystickElement
        ? new MobileJoystick(player, world, joystickElement)
        : null;

    const sun = new DirectionalLight();
    sun.intensity = 3;
    sun.position.set(1, 2, 3);
    scene.add(sun);

    const ambient = new AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    return {
        scene,
        camera,
        renderer,
        controls,
        world,
        player,
        enemyManager,
        mobileJoystick,
        sun,
        ambient,
    };
}

export function cleanupGame(
    state: GameState,
    abortController: AbortController,
): void {
    abortController.abort();
    state.renderer.setAnimationLoop(null);
    state.world.clear();
    state.player?.dispose();
    state.enemyManager?.dispose();
    state.mobileJoystick?.dispose();
    state.renderer.dispose();
    state.scene.clear();
    state.controls.dispose();
    state.sun.dispose();
    state.ambient.dispose();
}
