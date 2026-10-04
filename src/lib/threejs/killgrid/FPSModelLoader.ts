import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Object3D, Box3, Vector3 } from 'three';

export interface ModelSize {
    width: number;
    height: number;
    depth: number;
}

export interface ModelCache {
    enemy: Object3D;
    boss: Object3D;
    buildings: Object3D[];
    /** Native size of the enemy model */
    enemySize: ModelSize;
    /** Native size of the boss model */
    bossSize: ModelSize;
    /** Native dimensions for each building model (for scaling) */
    buildingSizes: ModelSize[];
}

const CDN_BASE =
    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/models';

/**
 * Create a GLTFLoader with Draco decoder support.
 */
export function createLoader(): GLTFLoader {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
        'https://www.gstatic.com/draco/versioned/decoders/1.5.6/',
    );
    loader.setDRACOLoader(dracoLoader);
    return loader;
}

/** Measure a model's bounding box dimensions */
function measureModel(model: Object3D): ModelSize {
    const bbox = new Box3().setFromObject(model);
    const size = bbox.getSize(new Vector3());
    return { width: size.x || 1, height: size.y || 1, depth: size.z || 1 };
}

/**
 * Pre-load all GLTF models from the CDN in parallel.
 * Call this early so network requests overlap with other setup work.
 */
export async function preloadModels(loader: GLTFLoader): Promise<ModelCache> {
    const [enemyGltf, bossGltf, bldg1, bldg2] = await Promise.all([
        loader.loadAsync(`${CDN_BASE}/minecraft_avatar.glb`),
        loader.loadAsync(`${CDN_BASE}/bob_the_tomato_2000.glb`),
        loader.loadAsync(`${CDN_BASE}/convenience-store-01.glb`),
        loader.loadAsync(`${CDN_BASE}/apartment-block-01.glb`),
    ]);

    const enemyScene = enemyGltf.scene;
    const bossScene = bossGltf.scene;
    const buildingScenes = [bldg1.scene, bldg2.scene];

    return {
        enemy: enemyScene,
        boss: bossScene,
        buildings: buildingScenes,
        enemySize: measureModel(enemyScene),
        bossSize: measureModel(bossScene),
        buildingSizes: buildingScenes.map(measureModel),
    };
}
