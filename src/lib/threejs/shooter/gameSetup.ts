import {
    AmbientLight,
    Color,
    DirectionalLight,
    FogExp2,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    TextureLoader,
    RepeatWrapping,
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    Texture,
    LoadingManager,
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
        const density = 0.085;
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
    controls.target.set(5, 0, 5);
    camera.position.set(1, 4, 3);
    controls.update();

    // ------------- WORLD DIMENSIONS -------------
    const WORLD_WIDTH = 50;
    const WORLD_DEPTH = 50;
    const world = new World(WORLD_WIDTH, WORLD_DEPTH);
    scene.add(world);

    console.log('generating world');
    await world.generate();
    scene.add(world.buildings);

    // ------------- procedural level config  -------------
    const levelConfig = generateLevelConfig(world, {
        width: WORLD_WIDTH,
        depth: WORLD_DEPTH,
    });
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

    const manager = new LoadingManager();
    const loader = new TextureLoader(manager);

    const texturesLoaded = new Promise<void>((resolve) => {
        manager.onLoad = () => resolve();
        manager.onError = (url) => {
            console.warn('Failed to load:', url);
            resolve(); // don't block the game
        };
    });

    // ------------- ROAD  -------------
    const roadColor = loader.load(
        'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/asphalt_track/asphalt_track_diff_1k.jpg',
    );
    const roadNormal = loader.load(
        'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/asphalt_track/asphalt_track_nor_gl_1k.jpg',
    );
    const roadRough = loader.load(
        'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/asphalt_track/asphalt_track_arm_1k.jpg',
    );
    const sidewalkColor = loader.load(
        'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/concrete_pavement_03/concrete_pavement_03_diff_1k.jpg',
    );
    const sidewalkNormal = loader.load(
        'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/concrete_pavement_03/concrete_pavement_03_nor_gl_1k.jpg',
    );
    const sidewalkRough = loader.load(
        'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/concrete_pavement_03/concrete_pavement_03_arm_1k.jpg',
    );

    const configureTextures = (
        textures: Texture[],
        repeatX: number,
        repeatY: number,
    ) => {
        textures.forEach((tex) => {
            tex.wrapS = tex.wrapT = RepeatWrapping;
            tex.repeat.set(repeatX, repeatY);
        });
    };

    const roadWidth = WORLD_WIDTH * 0.18;
    const sidewalkWidth = roadWidth * 0.35;
    const roadLength = WORLD_DEPTH;
    const roadGeo = new PlaneGeometry(roadWidth, roadLength);
    const roadMat = new MeshStandardMaterial({
        map: roadColor,
        normalMap: roadNormal,
        roughnessMap: roadRough,
        roughness: 0.95,
        metalness: 0.05,
    });

    const sidewalkGeo = new PlaneGeometry(sidewalkWidth, roadLength);
    const sidewalkMat = new MeshStandardMaterial({
        map: sidewalkColor,
        normalMap: sidewalkNormal,
        roughnessMap: sidewalkRough,
        roughness: 0.9,
    });
    const roadCenters = [-WORLD_WIDTH * 0.25, 0, WORLD_WIDTH * 0.25];

    roadCenters.forEach((centerX) => {
        // road
        const road = new Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.position.set(centerX, 0.01, WORLD_DEPTH / 2);
        road.receiveShadow = true;
        scene.add(road);

        // left sidewalk
        const leftSW = new Mesh(sidewalkGeo, sidewalkMat);
        leftSW.rotation.x = -Math.PI / 2;
        leftSW.position.set(
            centerX - (roadWidth / 2 + sidewalkWidth / 2),
            0.01,
            WORLD_DEPTH / 2,
        );
        leftSW.receiveShadow = true;
        scene.add(leftSW);

        // right sidewalk
        const rightSW = leftSW.clone();
        rightSW.position.set(
            centerX + (roadWidth / 2 + sidewalkWidth / 2),
            0.01,
            WORLD_DEPTH / 2,
        );
        scene.add(rightSW);
    });

    configureTextures(
        [roadColor, roadNormal, roadRough],
        roadWidth / 5,
        roadLength / 5,
    );
    configureTextures(
        [sidewalkColor, sidewalkNormal, sidewalkRough],
        sidewalkWidth / 2,
        roadLength / 5,
    );

    await texturesLoaded;
    // ------------- END ROAD -------------

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

    const enemyManager = new EnemyManager(player, world, scene, spawnConfig);
    enemyManager.spawnFromLevelConfig(levelConfig.spawnPoints);
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
