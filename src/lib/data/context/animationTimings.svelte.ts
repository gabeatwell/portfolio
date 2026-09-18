import { getContext, setContext } from 'svelte';

const ANIMATION_KEY = Symbol('animation');

export const DEFAULT_DURATION = 300;
export const DEFAULT_DELAY = 0;

export interface AnimationCss {
    duration: string;
    delay: string;
}

export interface AnimationContext {
    duration: number;
    delay: number;
    isEnabled: boolean;
    readonly css: AnimationCss;
}

export function createAnimationContext(
    initialDuration: number = DEFAULT_DURATION,
    initialDelay: number = DEFAULT_DELAY,
): AnimationContext {
    let duration = $state<number>(initialDuration);
    let delay = $state<number>(initialDelay);
    let isEnabled = $state<boolean>(true);

    const context: AnimationContext = {
        get duration() {
            return duration;
        },
        set duration(v: number) {
            duration = v;
        },
        get delay() {
            return delay;
        },
        set delay(v: number) {
            delay = v;
        },
        get isEnabled() {
            return isEnabled;
        },
        set isEnabled(v: boolean) {
            isEnabled = v;
        },
        get css() {
            return {
                duration: `${duration}ms`,
                delay: `${delay}ms`,
            };
        },
    };

    setContext(ANIMATION_KEY, context);
    return context;
}

export function getAnimationContext(): AnimationContext | undefined {
    return getContext<AnimationContext>(ANIMATION_KEY);
}

export function useAnimation(): AnimationContext {
    const ctx = getContext<AnimationContext>(ANIMATION_KEY);
    if (!ctx) {
        throw new Error(
            'No animation context found. Make sure to call createAnimationContext() in a parent component.',
        );
    }
    return ctx;
}
