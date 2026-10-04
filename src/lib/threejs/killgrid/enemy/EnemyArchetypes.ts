/**
 * Enemy archetypes — each type has distinct stats and behavior preferences.
 * Add new archetypes here to create more enemy variety.
 */

export enum EnemyArchetype {
    Grunt = 'grunt',
    Sniper = 'sniper',
    Flanker = 'flanker',
    Tank = 'tank',
    Rusher = 'rusher',
}

export interface ArchetypeConfig {
    health: number;
    moveSpeed: number;
    detectionRange: number;
    attackRange: number;
    shootCooldown: number;
    damage: number;
    color: number;
    headColor: number;
    /** How likely this type is to flank (0-1) */
    flankChance: number;
    /** How likely this type is to retreat when low HP (0-1) */
    retreatChance: number;
    /** If true, enemy does melee damage instead of shooting */
    meleeOnly: boolean;
}

export const ARCHETYPE_CONFIGS: Record<EnemyArchetype, ArchetypeConfig> = {
    [EnemyArchetype.Grunt]: {
        health: 5,
        moveSpeed: 2.5,
        detectionRange: 15,
        attackRange: 8,
        shootCooldown: 2,
        damage: 1,
        color: 0xdd1214,
        headColor: 0xaa4132,
        flankChance: 0.2,
        retreatChance: 0.2,
        meleeOnly: false,
    },
    [EnemyArchetype.Sniper]: {
        health: 3,
        moveSpeed: 1.2,
        detectionRange: 25,
        attackRange: 22,
        shootCooldown: 2.5,
        damage: 3,
        color: 0x2244aa,
        headColor: 0x334488,
        flankChance: 0.1,
        retreatChance: 0.6,
        meleeOnly: false,
    },
    [EnemyArchetype.Flanker]: {
        health: 3,
        moveSpeed: 5,
        detectionRange: 18,
        attackRange: 8,
        shootCooldown: 1.2,
        damage: 1,
        color: 0x22aa44,
        headColor: 0x338855,
        flankChance: 0.8,
        retreatChance: 0.3,
        meleeOnly: false,
    },
    [EnemyArchetype.Tank]: {
        health: 10,
        moveSpeed: 1.5,
        detectionRange: 12,
        attackRange: 8,
        shootCooldown: 1.2,
        damage: 1,
        color: 0x884422,
        headColor: 0x996633,
        flankChance: 0.0,
        retreatChance: 0.0,
        meleeOnly: false,
    },
    [EnemyArchetype.Rusher]: {
        health: 2,
        moveSpeed: 7,
        detectionRange: 25,
        attackRange: 2.5,
        shootCooldown: 999,
        damage: 2,
        color: 0xff8800,
        headColor: 0xffaa33,
        flankChance: 0.5,
        retreatChance: 0.0,
        meleeOnly: true,
    },
};

/** Get a random archetype, weighted toward easier types early on */
export function getRandomArchetype(wave: number = 1): EnemyArchetype {
    const roll = Math.random();
    if (wave <= 2) {
        // Early waves: mostly grunts
        if (roll < 0.7) return EnemyArchetype.Grunt;
        if (roll < 0.85) return EnemyArchetype.Flanker;
        return EnemyArchetype.Sniper;
    }
    if (wave <= 5) {
        if (roll < 0.35) return EnemyArchetype.Grunt;
        if (roll < 0.55) return EnemyArchetype.Flanker;
        if (roll < 0.75) return EnemyArchetype.Sniper;
        if (roll < 0.9) return EnemyArchetype.Tank;
        return EnemyArchetype.Rusher;
    }
    // Late waves: everything
    if (roll < 0.2) return EnemyArchetype.Grunt;
    if (roll < 0.4) return EnemyArchetype.Flanker;
    if (roll < 0.6) return EnemyArchetype.Sniper;
    if (roll < 0.8) return EnemyArchetype.Tank;
    return EnemyArchetype.Rusher;
}
