import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import type { SvelteComponent } from 'svelte';
import { expect, type Mock } from 'vitest';

interface RenderOptions {
    props?: Record<string, unknown>;
    [key: string]: unknown;
}

interface RerenderOptions {
    timeout?: number;
    interval?: number;
}

/**
 * extended render function with testing
 */
export function renderComponent<T extends Record<string, unknown>>(
    Component: typeof SvelteComponent,
    props?: T,
    options?: Omit<RenderOptions, 'props'>,
) {
    const result = render(Component, { props, ...options });

    return {
        ...result,
        rerender: (newProps?: Partial<T>) => {
            return renderComponent(
                Component,
                { ...props, ...newProps },
                options,
            );
        },
    };
}

/**
 * user interaction helper
 */
export async function userInteractions() {
    return {
        user: userEvent.setup(),
        click: async (element: HTMLElement) => userEvent.click(element),
        type: async (element: HTMLElement, text: string) =>
            userEvent.type(element, text),
        clear: async (element: HTMLElement) => userEvent.clear(element),
        selectOption: async (element: HTMLElement, value: string) =>
            userEvent.selectOptions(element, value),
        keyboard: async (keys: string) => userEvent.keyboard(keys),
    };
}

/**
 * query helper
 */
export const queries = {
    button: (name: string) => screen.getByRole('button', { name }),
    input: (label: string) => screen.getByLabelText(label),
    text: (text: string) => screen.getByText(text),
    testId: (id: string) => screen.getByTestId(id),
};

/**
 * state & props changes
 */
export async function waitForChange(
    callback: () => boolean,
    options: RerenderOptions = {},
): Promise<true> {
    const { timeout = 3000, interval = 50 } = options;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        if (callback()) return true;
        await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Timeout waiting for change after ${timeout}ms`);
}

/**
 * assert component emits expected callback
 */
export function expectCallback(callback: Mock) {
    return {
        toHaveBeenCalled: () => expect(callback).toHaveBeenCalled(),
        toHaveBeenCalledWith: (...args: unknown[]) =>
            expect(callback).toHaveBeenCalledWith(...args),
        toHaveBeenCalledTimes: (times: number) =>
            expect(callback).toHaveBeenCalledTimes(times),
    };
}
