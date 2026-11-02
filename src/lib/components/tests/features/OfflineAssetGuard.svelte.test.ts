import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';

const { mockCheck } = vi.hoisted(() => ({ mockCheck: vi.fn() }));

vi.mock('#lib/data/assetAvailability.ts', () => ({
    areAssetsAvailableOffline: mockCheck,
}));

import OfflineAssetGuard from '#lib/components/offline/OfflineAssetGuard.svelte';

const ASSETS = ['/threejayess/models/shark.glb'];
const children = createRawSnippet(() => ({
    render: () => '<p>scene loaded</p>',
}));

function setOnline(online: boolean) {
    Object.defineProperty(window.navigator, 'onLine', {
        configurable: true,
        get: () => online,
    });
}

function renderGuard() {
    return render(OfflineAssetGuard, { assets: ASSETS, children });
}

afterEach(() => {
    vi.resetAllMocks();
    Reflect.deleteProperty(window.navigator, 'onLine');
});

describe('OfflineAssetGuard', () => {
    it('renders children while online without checking the cache', () => {
        setOnline(true);
        renderGuard();

        expect(screen.getByText('scene loaded')).toBeInTheDocument();
        expect(mockCheck).not.toHaveBeenCalled();
    });

    it('renders children offline when every asset is cached', async () => {
        setOnline(false);
        mockCheck.mockResolvedValue(true);
        renderGuard();

        expect(await screen.findByText('scene loaded')).toBeInTheDocument();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('shows the notice instead of the scene when assets are missing', async () => {
        setOnline(false);
        mockCheck.mockResolvedValue(false);
        renderGuard();

        expect(await screen.findByRole('status')).toBeInTheDocument();
        expect(screen.queryByText('scene loaded')).not.toBeInTheDocument();
    });
});
