import {
    Group,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    RepeatWrapping,
    SRGBColorSpace,
    Texture,
    TextureLoader,
} from 'three';
import { Building } from './objects/Building';

export const GROUND_TEXTURE_URL = import.meta.env.DEV
    ? 'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/asphalt-texture.webp'
    : 'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/asphalt-texture.webp';

function loadBrickGroundsTexture(): Texture | null {
    if (typeof document === 'undefined') return null;

    const texture = new TextureLoader().load(GROUND_TEXTURE_URL);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.colorSpace = SRGBColorSpace;
    return texture;
}

export class World extends Mesh {
    width: number;
    height: number;

    buildings!: Group;
    buildingCount: number;
    buildingDensity: number;
    buildingCells: Set<string>;

    private brickGroundsTexture: Texture | null = null;

    constructor(width: number, height: number) {
        super();

        this.width = width;
        this.height = height;

        this.buildingDensity = 1 / 175;
        this.buildingCount = 2;
        this.buildingCells = new Set<string>();

        this.brickGroundsTexture = loadBrickGroundsTexture();
    }

    private updateCountFromSize() {
        const cols = Math.max(1, Math.floor(this.width));
        const rows = Math.max(1, Math.floor(this.height));
        const totalCells = cols * rows;

        this.buildingCount = Math.min(
            totalCells,
            Math.round(totalCells * this.buildingDensity),
        );
    }

    async generate(recalculateFromDensity = true) {
        this.clear();

        if (recalculateFromDensity) this.updateCountFromSize();

        this.createTerrain();
        await this.createBuildings();
    }

    clear() {
        if (this.geometry) {
            this.geometry.dispose();
            (this.material as MeshStandardMaterial).dispose();
        }

        if (this.buildings) {
            this.buildings.children.forEach((building) => {
                if (building instanceof Mesh) {
                    building.geometry?.dispose();
                    if (building.material instanceof MeshStandardMaterial) {
                        building.material.dispose();
                    }
                }
            });
            this.buildings.clear();
        }

        this.buildingCells.clear();

        return this;
    }

    createTerrain() {
        if (!this.brickGroundsTexture)
            this.brickGroundsTexture = loadBrickGroundsTexture();

        const cols = Math.max(1, Math.floor(this.width));
        const rows = Math.max(1, Math.floor(this.height));

        if (this.brickGroundsTexture) {
            this.brickGroundsTexture.wrapS = RepeatWrapping;
            this.brickGroundsTexture.wrapT = RepeatWrapping;
            this.brickGroundsTexture.repeat.set(cols, rows);
            this.brickGroundsTexture.needsUpdate = true;
        }

        // geometry with more segments for deformation
        this.geometry = new PlaneGeometry(
            this.width,
            this.height,
            cols * 2,
            rows * 2,
        );

        const positionAttribute = this.geometry.getAttribute('position');
        positionAttribute.needsUpdate = true;
        this.geometry.computeVertexNormals();

        this.material = new MeshStandardMaterial({
            map: this.brickGroundsTexture ?? null,
            color: 0x333333,
        });

        this.rotation.x = -Math.PI / 2;
        this.position.set(this.width / 2, 0, this.height / 2);
    }

    async createBuildings() {
        if (this.buildings) {
            this.remove(this.buildings);
        }

        this.buildings = await Building.createBuildings(
            this.width,
            this.height,
            this.buildingCount,
            this.buildingCells,
        );
        this.add(this.buildings);
    }
}
