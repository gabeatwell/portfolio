import {
    Object3D,
    MeshStandardMaterial,
    Vector3,
    Mesh,
    CapsuleGeometry,
} from 'three';

export class Projectile extends Object3D {
    private mesh: Mesh;
    private velocity: Vector3;
    private speed: number = 10; // Units per second
    private maxDistance: number; // Configurable range
    private distanceTraveled: number = 0;
    private createdAt: number = performance.now();
    private maxLifetime: number = 5000; // 5 seconds in milliseconds

    constructor(
        startPosition: Vector3,
        direction: Vector3,
        maxDistance: number = 5,
    ) {
        super();
        this.maxDistance = maxDistance;

        // projectile mesh
        const geometry = new CapsuleGeometry(0.02, 0.15, 8, 8);
        const material = new MeshStandardMaterial({
            color: 0x626262,
            emissive: 0xaaaaaa,
            emissiveIntensity: 0.5,
        });
        this.mesh = new Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI / 2;
        this.add(this.mesh);

        this.position.copy(startPosition);
        // set velocity
        this.velocity = direction.normalize().multiplyScalar(this.speed);

        // projectiles face the player
        this.lookAt(startPosition.clone().add(direction));
    }

    /**
     * Override the projectile's mesh appearance (scale, color, emissive).
     * Useful for FPS vs top-down shooter variants.
     */
    setAppearance(
        scale: number,
        color: number,
        emissive: number,
        emissiveIntensity: number,
    ): void {
        this.mesh.scale.set(scale, scale, scale);
        const mat = this.mesh.material as MeshStandardMaterial;
        mat.color.setHex(color);
        mat.emissive.setHex(emissive);
        mat.emissiveIntensity = emissiveIntensity;
    }

    update(dt: number): boolean {
        // check if projectile has expired
        const age = performance.now() - this.createdAt;
        if (age >= this.maxLifetime) {
            return false; // indicates this projectile should be removed
        }

        // move projectile
        const displacement = this.velocity.clone().multiplyScalar(dt);
        this.position.add(displacement);

        // track distance traveled
        this.distanceTraveled += displacement.length();

        // remove if traveled too far (only check distance, not time)
        if (this.distanceTraveled >= this.maxDistance) {
            return false; // indicates this projectile should be removed
        }

        return true; // still alive
    }

    getPosition(): Vector3 {
        return this.position.clone();
    }

    getVelocity(): Vector3 {
        return this.velocity.clone();
    }

    dispose(): void {
        this.mesh.geometry.dispose();
        (this.mesh.material as MeshStandardMaterial).dispose();
    }
}
