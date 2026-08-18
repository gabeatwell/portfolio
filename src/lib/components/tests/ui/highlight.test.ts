import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock highlight.js/core — it's a static import in the module under test
vi.mock('highlight.js/lib/core', () => ({
    default: {
        registerLanguage: vi.fn(),
        highlightElement: vi.fn(),
    },
}));

// Mock dompurify — it's dynamically imported inside sanitizeAndHighlight
vi.mock('dompurify', () => ({
    default: {
        sanitize: vi.fn((html: string) => html),
        addHook: vi.fn(),
    },
}));

import { sanitizeAndHighlight } from '../../utils/highlight';
import hljs from 'highlight.js/lib/core';

// Capture registerLanguage calls made at module import time,
// before beforeEach's clearAllMocks can wipe them.
const capturedRegisterCalls = vi.mocked(hljs.registerLanguage).mock.calls;

describe('sanitizeAndHighlight', () => {
    const mockHighlightElement = vi.mocked(hljs.highlightElement);

    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '';
    });

    it('calls DOMPurify.sanitize with the raw HTML and USE_PROFILES.html', async () => {
        const rawHtml = 'p>Hello</p>';
        await sanitizeAndHighlight(rawHtml);

        const dompurify = await import('dompurify');
        expect(dompurify.default.sanitize).toHaveBeenCalledWith(rawHtml, {
            USE_PROFILES: { html: true },
        });
    });

    it('adds an uponSanitizeAttribute hook that strips on* attributes', async () => {
        await sanitizeAndHighlight('p>test</p>');

        const { default: DOMPurify } = await import('dompurify');
        expect(DOMPurify.addHook).toHaveBeenCalledWith(
            'uponSanitizeAttribute',
            expect.any(Function),
        );

        // Grab the hook function and verify it strips event handlers
        const addHookCall = vi.mocked(DOMPurify.addHook).mock.calls[0];
        const hookFn = addHookCall[1] as unknown as (
            node: null,
            data: { attrName: string; keepAttr: boolean },
        ) => void;
        const eventAttr = { attrName: 'onclick', keepAttr: true };
        hookFn(null, eventAttr);
        expect(eventAttr.keepAttr).toBe(false);

        const safeAttr = { attrName: 'class', keepAttr: true };
        hookFn(null, safeAttr);
        expect(safeAttr.keepAttr).toBe(true);
    });

    it('returns the sanitized HTML string', async () => {
        const { default: DOMPurify } = await import('dompurify');
        vi.mocked(DOMPurify.sanitize).mockReturnValue('p>Clean</p>');

        const result = await sanitizeAndHighlight('p>Dirty</p>');
        expect(result).toBe('p>Clean</p>');
    });

    it('highlights all pre>code> blocks found in the DOM', async () => {
        document.body.innerHTML = '<pre><code>const x = 1;</code></pre>';

        const _result = await sanitizeAndHighlight('p>test</p>');

        expect(mockHighlightElement).toHaveBeenCalledTimes(1);
        const calledElement = mockHighlightElement.mock.calls[0][0];
        expect(calledElement.textContent).toBe('const x = 1;');
    });

    it('does not call highlightElement when there are no code blocks', async () => {
        document.body.innerHTML = '<p>No code here</p>';

        await sanitizeAndHighlight('p>test</p>');

        expect(mockHighlightElement).not.toHaveBeenCalled();
    });

    it('handles multiple code blocks', async () => {
        document.body.innerHTML = `
            <pre><code>const a = 1;</code></pre>
            <pre><code>const b = 2;</code></pre>
        `;

        await sanitizeAndHighlight('p>test</p>');

        expect(mockHighlightElement).toHaveBeenCalledTimes(2);
    });

    it('handles empty string input', async () => {
        const { default: DOMPurify } = await import('dompurify');
        vi.mocked(DOMPurify.sanitize).mockReturnValue('');

        const result = await sanitizeAndHighlight('');
        expect(result).toBe('');
    });

    it('registers javascript, css, and xml/html languages on init', () => {
        // These registrations happen at module import time, but
        // beforeEach's clearAllMocks wipes the live mock.calls.
        // We use capturedRegisterCalls which was captured before
        // any clearAllMocks ran.
        const js = capturedRegisterCalls.filter((c) => c[0] === 'js').length;
        const css = capturedRegisterCalls.filter((c) => c[0] === 'css').length;
        const htmlLang = capturedRegisterCalls.filter(
            (c) => c[0] === 'html',
        ).length;
        const xml = capturedRegisterCalls.filter((c) => c[0] === 'xml').length;

        expect(js).toBe(1);
        expect(css).toBe(1);
        expect(htmlLang).toBe(1);
        expect(xml).toBe(1);
    });
});
