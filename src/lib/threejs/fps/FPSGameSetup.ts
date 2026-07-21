import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    Fog,
    Vector3,
    AmbientLight,
    DirectionalLight,
    HemisphereLight,
    PointLight,
    Raycaster,
    Vector2,
    Sphere,
    Group,
    Object3D,
    DoubleSide,
} from 'three';
import { World } from '../shooter/world';
import { FPSPlayer } from './player/FPSPlayer';
import { FPSEnemyManager } from './enemy/FPSEnemyManager';
import { FPSBuilding } from './buildings/FPSBuilding';
import { FPSCombatManager } from './combat/FPSCombatManager';
import { FPSAmmoBrick } from './combat/FPSAmmoBricks';

export class FPSGame {
    scene!: Scene;
    camera!: PerspectiveCamera;
    renderer!: WebGLRenderer;
    controls!: PointerLockControls;
    fpsPlayer!: FPSPlayer;
    world!: World;
    buildings!: Group;
    enemyManager!: FPSEnemyManager;
    combatManager!: FPSCombatManager;

    /** Combined mesh array of buildings for AI line-of-sight checks */
    private obstacles: Object3D[] = [];

    private moveForward = false;
    private moveBackward = false;
    private moveLeft = false;
    private moveRight = false;
    private isRunning = false;
    private direction = new Vector3();
    private verticalVelocity = 0;
    private isGrounded = true;
    private jumpForce = 5;
    private gravity = -15;
    private groundLevel = 0;
    private boundOnKeyDown: (e: KeyboardEvent) => void = () => {};
    private boundOnKeyUp: (e: KeyboardEvent) => void = () => {};
    private boundOnMouseDown: (e: MouseEvent) => void = () => {};
    private boundOnResize: () => void = () => {};
    private gunModel: Object3D | null = null;
    private muzzleOffset = new Vector3(0.35, -0.35, -0.8);

    // --- Mobile touch controls ---
    private mobileMode = false;
    private moveX = 0;
    private moveY = 0;
    private lookYaw = 0; // accumulated yaw from touch drag
    private lookPitch = 0; // accumulated pitch from touch drag
    private lookSpeed = 0.005;
    private autoShootCooldown = 0;
    private animationFrameId: number | null = null;
    private started = false;

    /** Start the game simulation (enemies, combat, player updates) */
    start(): void {
        this.started = true;
    }

    /** Enable mobile mode (no pointer lock, camera controlled by setMobileLook) */
    setMobile(enabled: boolean): void {
        this.mobileMode = enabled;
    }

    /** Left-side touch joystick: values -1 to 1 */
    setMobileMove(x: number, y: number): void {
        this.moveX = Math.max(-1, Math.min(1, x));
        this.moveY = Math.max(-1, Math.min(1, y));
    }

    /** Right-side touch drag delta (pixels moved since last frame) */
    setMobileLook(dx: number, dy: number): void {
        this.lookYaw -= dx * this.lookSpeed;
        this.lookPitch -= dy * this.lookSpeed;
        this.lookPitch = Math.max(
            -Math.PI / 2.5,
            Math.min(Math.PI / 2.5, this.lookPitch),
        );
    }

    /** Check if any enemy is under the crosshair (for auto-shoot) */
    private checkAutoShoot(): boolean {
        const raycaster = new Raycaster();
        raycaster.setFromCamera(new Vector2(0, 0), this.camera);
        const enemies = this.enemyManager.getEnemies();
        for (const enemy of enemies) {
            const hitbox = new Sphere(
                enemy.position,
                enemy.getHitboxRadius?.() ?? 0.9,
            );
            if (raycaster.ray.intersectsSphere(hitbox)) return true;
        }
        return false;
    }

    async init(canvas: HTMLCanvasElement) {
        this.renderer = new WebGLRenderer({ canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene = new Scene();
        this.scene.background = new Color('#87ceeb');
        this.scene.fog = new Fog(0x87ceeb, 30, 60);

        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this.camera.position.set(5.5, 1.6, 5.5);

        this.controls = new PointerLockControls(this.camera, canvas);

        // ═══ Attempt pointer lock (desktop only) ═══
        // On mobile, requestPointerLock throws — catch it and switch to mobile mode.
        // The lock must be attempted before any await so the click gesture is active.
        try {
            this.controls.lock();
        } catch {
            // Pointer lock failed — likely mobile. Switch to touch controls.
            this.mobileMode = true;
        }

        // --- World terrain ---
        this.world = new World(50, 50);
        await this.world.generate();
        this.scene.add(this.world);

        // Swap GLTF buildings for simple boxes
        if (this.world.buildings) {
            this.world.remove(this.world.buildings);
        }
        const buildingCells = new Set<string>();
        this.buildings = await FPSBuilding.createBuildings(
            50,
            50,
            8,
            buildingCells,
        );
        for (const cell of buildingCells) {
            this.world.buildingCells.add(cell);
        }
        this.scene.add(this.buildings);

        // --- FPS Player ---
        this.fpsPlayer = new FPSPlayer();
        this.fpsPlayer.rotation.y = Math.PI;
        this.fpsPlayer.position.set(5.5, 0, 5.5);
        this.scene.add(this.fpsPlayer);

        // --- Gun Model (async callback — doesn't hold up init) ---
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            '/threejayess/models/ray_gun.glb',
            (gltf) => {
                const gun = gltf.scene;
                gun.traverse((child: any) => {
                    if (child.isMesh) {
                        const mat = child.material;
                        mat.side = DoubleSide;
                        mat.envMapIntensity = 2;
                        mat.metalness = 0.2;
                        mat.roughness = 0.6;
                        if (mat.emissive) mat.emissiveIntensity = 0.3;
                        child.frustumCulled = false;
                        mat.needsUpdate = true;
                    }
                });
                gun.scale.set(16, 16, 16);
                this.gunModel = gun;
                this.scene.add(gun);
            },
            undefined,
            (error) => console.error('Failed to load ray_gun.glb', error),
        );

        // --- Lighting ---
        // HemisphereLight gives a natural sky/ground fill
        const hemi = new HemisphereLight(0x87ceeb, 0x362d25, 0.8);
        this.scene.add(hemi);
        const ambient = new AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);
        const sun = new DirectionalLight(0xffffff, 1.2);
        sun.position.set(10, 20, 10);
        this.scene.add(sun);
        // Extra light near player so the gun is always lit
        const playerLight = new PointLight(0xffffff, 0.8, 10);
        playerLight.position.set(5.5, 3, 5.5);
        this.scene.add(playerLight);

        // --- Collect obstacle meshes for AI line-of-sight ---
        this.obstacles = [];
        this.buildings.traverse((child) => {
            if ((child as any).isMesh) this.obstacles.push(child);
        });

        // --- AI Combat & Enemies ---
        this.combatManager = new FPSCombatManager(this.fpsPlayer, this.scene);
        this.combatManager.setPlayerAmmo(50);

        this.enemyManager = new FPSEnemyManager(
            this.fpsPlayer,
            this.world,
            this.scene,
        );
        this.enemyManager.setObstacles(this.obstacles);
        this.scene.add(this.enemyManager);
        this.combatManager.setEnemyManager(this.enemyManager);

        // ─── Ammo brick spawning ────────────────────────────
        this.enemyManager.setOnAmmoBrickSpawn((position) => {
            const brick = new FPSAmmoBrick(position);
            this.scene.add(brick);
            this.combatManager.addAmmoBrick(brick);
        });

        // --- Store bound references for cleanup ---
        this.boundOnKeyDown = (e: KeyboardEvent) => this.onKeyChange(e, true);
        this.boundOnKeyUp = (e: KeyboardEvent) => this.onKeyChange(e, false);
        this.boundOnMouseDown = (e: MouseEvent) => {
            if (e.button === 0 && this.controls.isLocked) this.shoot();
        };
        this.boundOnResize = () => this.onResize();

        // --- Input ---
        document.addEventListener('keydown', this.boundOnKeyDown);
        document.addEventListener('keyup', this.boundOnKeyUp);
        document.addEventListener('mousedown', this.boundOnMouseDown);
        window.addEventListener('resize', this.boundOnResize);

        this.animate();
    }

    private onKeyChange(e: KeyboardEvent, pressed: boolean) {
        switch (e.code) {
            case 'KeyW':
                this.moveForward = pressed;
                break;
            case 'KeyS':
                this.moveBackward = pressed;
                break;
            case 'KeyA':
                this.moveLeft = pressed;
                break;
            case 'KeyD':
                this.moveRight = pressed;
                break;
            case 'Space':
                if (pressed && this.isGrounded) {
                    this.verticalVelocity = this.jumpForce;
                    this.isGrounded = false;
                }
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.isRunning = pressed;
                break;
        }
    }

    private shoot() {
        const raycaster = new Raycaster();
        raycaster.setFromCamera(new Vector2(0, 0), this.camera);
        const dir = raycaster.ray.direction.clone();

        // Spawn projectile from just below camera center
        const cameraPos = this.camera.position;
        const spawnOffset = new Vector3(0.25, -0.3, -1.2);
        spawnOffset.applyQuaternion(this.camera.quaternion);
        const spawnPos = cameraPos.clone().add(spawnOffset);

        // FPSCombatManager handles hitscan + projectile internally
        this.combatManager.shoot(dir, spawnPos);
    }

    private animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());

        const dt = 1 / 60;

        if (this.mobileMode) {
            // Camera rotation via yaw/pitch
            const euler = new Vector3(this.lookPitch, this.lookYaw, 0);
            this.camera.rotation.order = 'YXZ';
            this.camera.rotation.set(euler.x, euler.y, 0);

            // Movement from touch joystick (camera-relative)
            const camForward = new Vector3();
            this.camera.getWorldDirection(camForward);
            camForward.y = 0;
            camForward.normalize();
            const camRight = new Vector3();
            camRight.crossVectors(camForward, this.camera.up).normalize();

            this.direction.set(0, 0, 0);
            if (this.moveY < -0.2)
                this.direction.add(
                    camForward.clone().multiplyScalar(-this.moveY),
                );
            if (this.moveY > 0.2)
                this.direction.sub(
                    camForward.clone().multiplyScalar(this.moveY),
                );
            if (this.moveX > 0.2)
                this.direction.add(camRight.clone().multiplyScalar(this.moveX));
            if (this.moveX < -0.2)
                this.direction.sub(
                    camRight.clone().multiplyScalar(-this.moveX),
                );
            this.direction.normalize();

            const speed = 5;
            this.fpsPlayer.position.add(
                this.direction.multiplyScalar(speed * dt),
            );

            // Auto-shoot when crosshair is on an enemy
            this.autoShootCooldown -= dt;
            if (this.autoShootCooldown <= 0 && this.checkAutoShoot()) {
                this.shoot();
                this.autoShootCooldown = 0.3;
            }
        } else {
            const forward = new Vector3();
            this.camera.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();

            const right = new Vector3();
            right.crossVectors(forward, this.camera.up).normalize();

            this.direction.set(0, 0, 0);
            if (this.moveForward) this.direction.add(forward);
            if (this.moveBackward) this.direction.sub(forward);
            if (this.moveLeft) this.direction.sub(right);
            if (this.moveRight) this.direction.add(right);
            this.direction.normalize();

            const speed = this.isRunning ? 8 : 5;
            this.fpsPlayer.position.add(
                this.direction.multiplyScalar(speed * dt),
            );
        }

        // Clamp to world bounds
        this.fpsPlayer.position.x = Math.max(
            0.5,
            Math.min(49.5, this.fpsPlayer.position.x),
        );
        this.fpsPlayer.position.z = Math.max(
            0.5,
            Math.min(49.5, this.fpsPlayer.position.z),
        );

        // Sync camera to player eye-level (camera is NOT parented — at scene root)
        this.camera.position.x = this.fpsPlayer.position.x;
        this.camera.position.z = this.fpsPlayer.position.z;
        this.camera.position.y = this.fpsPlayer.position.y + 1.6;

        // Sync player facing direction to camera (for AI flanking awareness)
        this.camera.getWorldDirection(this.fpsPlayer.facingDirection);

        // Apply gravity and vertical velocity (jumping)
        if (!this.isGrounded) {
            this.verticalVelocity += this.gravity * dt;
            this.fpsPlayer.position.y += this.verticalVelocity * dt;
            if (this.fpsPlayer.position.y <= this.groundLevel) {
                this.fpsPlayer.position.y = this.groundLevel;
                this.verticalVelocity = 0;
                this.isGrounded = true;
            }
        }

        // Sync gun model to follow camera (added to scene, not as camera child)
        if (this.gunModel) {
            // Bottom-right of screen. X=right, Y=down, Z=forward
            const gunOffset = new Vector3(0.6, -1.5, -1.2);
            gunOffset.applyQuaternion(this.camera.quaternion);
            this.gunModel.position.copy(this.camera.position).add(gunOffset);
            // Match camera rotation so gun faces the crosshair direction
            this.gunModel.quaternion.copy(this.camera.quaternion);
        }

        this.fpsPlayer.update();
        if (this.started) {
            this.enemyManager.update(dt);
            this.combatManager.update(dt);

            // Melee damage from rushers / close-range enemies
            const meleeDmg = this.enemyManager.checkMeleeAttacks(
                this.fpsPlayer.position,
            );
            if (meleeDmg > 0) {
                const dir = new Vector3()
                    .subVectors(
                        this.fpsPlayer.position,
                        this.enemyManager.getEnemies()[0]?.position ??
                            new Vector3(),
                    )
                    .normalize();
                this.combatManager.takeDamage(meleeDmg, dir);
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    private onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /** Freeze game logic but keep rendering the last frame visible */
    pause(): void {
        this.started = false;
    }

    /** Kill the render loop entirely (canvas goes dark) */
    stop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    dispose() {
        this.stop();
        this.controls.unlock();
        document.removeEventListener('keydown', this.boundOnKeyDown);
        document.removeEventListener('keyup', this.boundOnKeyUp);
        document.removeEventListener('mousedown', this.boundOnMouseDown);
        window.removeEventListener('resize', this.boundOnResize);
        if (this.gunModel) {
            this.scene.remove(this.gunModel);
            this.gunModel = null;
        }
        this.enemyManager.dispose();
        this.combatManager.dispose();
    }
}
