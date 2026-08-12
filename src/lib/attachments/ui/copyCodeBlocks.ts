// src/lib/attachments/ui/copyCodeBlocks.ts
import type { Attachment } from 'svelte/attachments';

export function copyCodeBlocks(html: string): Attachment<HTMLElement> {
    return (node) => {
        void html;

        console.log('[copyCodeBlocks]', {
            htmlLength: html?.length ?? 0,
            preCount: node.querySelectorAll('pre').length,
            codeCount: node.querySelectorAll('code').length,
            snippet: node.innerHTML.slice(0, 300),
        });

        const buttons: HTMLButtonElement[] = [];

        // support both <pre> and <pre><code>
        const blocks = node.querySelectorAll('pre');

        blocks.forEach((pre) => {
            if (pre.querySelector(':scope > .copy-button')) return;

            // needed for absolute button
            const computed = getComputedStyle(pre);
            if (computed.position === 'static') {
                pre.style.position = 'relative';
            }

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'copy-button';
            button.textContent = 'Copy';
            button.setAttribute('aria-label', 'Copy code');

            button.onclick = async () => {
                const code =
                    pre.querySelector('code')?.textContent ??
                    pre.textContent ??
                    '';
                try {
                    await navigator.clipboard.writeText(code);
                    button.textContent = 'Copied!';
                    setTimeout(() => (button.textContent = 'Copy'), 2000);
                } catch {
                    button.textContent = 'Failed';
                    setTimeout(() => (button.textContent = 'Copy'), 2000);
                }
            };

            pre.appendChild(button);
            buttons.push(button);
        });

        return () => {
            buttons.forEach((btn) => btn.remove());
        };
    };
}
