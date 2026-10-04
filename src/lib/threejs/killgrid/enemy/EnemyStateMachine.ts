/**
 * Finite State Machine for enemy AI.
 * Each enemy has one active state; states define their own update logic
 * and transition conditions back to the FSM for evaluation.
 */

export enum EnemyState {
    Idle = 'idle',
    Patrol = 'patrol',
    Alert = 'alert',
    Chase = 'chase',
    Attack = 'attack',
    Flank = 'flank',
    Retreat = 'retreat',
    Search = 'search',
}

/** Ordered list of all states (for debug / iteration) */
export const ALL_STATES: EnemyState[] = [
    EnemyState.Idle,
    EnemyState.Patrol,
    EnemyState.Alert,
    EnemyState.Chase,
    EnemyState.Attack,
    EnemyState.Flank,
    EnemyState.Retreat,
    EnemyState.Search,
];

export interface Transition {
    to: EnemyState;
    /** When this returns true, the transition fires (checked each frame) */
    condition: () => boolean;
    /** Optional priority — higher = checked first. Default 0. */
    priority?: number;
}

export interface StateHandlers {
    onEnter?: () => void;
    onUpdate?: (dt: number) => void;
    onExit?: () => void;
    transitions?: Transition[];
}

/**
 * Lightweight FSM. Compose this into an enemy for full state-driven AI.
 *
 * Usage:
 *   const fsm = new EnemyFSM(EnemyState.Patrol, { ... });
 *   fsm.update(dt);  // calls current state's update, then checks transitions
 *   fsm.transitionTo(EnemyState.Chase);
 */
export class EnemyFSM {
    current: EnemyState;
    private handlers: Map<EnemyState, StateHandlers>;
    /** Time spent in the current state (seconds) */
    elapsed: number = 0;

    constructor(
        initial: EnemyState,
        handlers: Record<EnemyState, StateHandlers>,
    ) {
        this.current = initial;
        this.handlers = new Map(
            Object.entries(handlers) as [EnemyState, StateHandlers][],
        );
    }

    /** Call each frame. Updates current state, then checks transitions. */
    update(dt: number): void {
        this.elapsed += dt;

        const state = this.handlers.get(this.current);
        state?.onUpdate?.(dt);

        this.evaluateTransitions();
    }

    /** Check all transitions for the current state and fire the first valid one. */
    private evaluateTransitions(): void {
        const state = this.handlers.get(this.current);
        if (!state?.transitions?.length) return;

        // Sort by priority descending so higher-priority transitions fire first
        const sorted = [...state.transitions].sort(
            (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
        );

        for (const t of sorted) {
            if (t.condition()) {
                this.transitionTo(t.to);
                return; // Only one transition per frame
            }
        }
    }

    /** Force a state change, calling exit/enter handlers. */
    transitionTo(newState: EnemyState): void {
        if (newState === this.current) return;

        const old = this.handlers.get(this.current);
        old?.onExit?.();

        this.elapsed = 0;
        this.current = newState;

        const next = this.handlers.get(newState);
        next?.onEnter?.();
    }

    /** Check if currently in one of the given states. */
    is(...states: EnemyState[]): boolean {
        return states.includes(this.current);
    }

    /** Reset to a specific state (for respawning enemies). */
    reset(state: EnemyState): void {
        const old = this.handlers.get(this.current);
        old?.onExit?.();
        this.elapsed = 0;
        this.current = state;
        const next = this.handlers.get(state);
        next?.onEnter?.();
    }
}
