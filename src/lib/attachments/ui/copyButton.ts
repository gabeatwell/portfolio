import type { Attachment } from 'svelte/attachments';

export const copyButton: Attachment<HTMLElement> = (root) => {
    const cleanups: Array<() => void> = [];

    function enhance(pre: HTMLElement) {
        if (pre.dataset.copyButton === 'true') return; // already handled
        pre.setAttribute('data-copy-button', 'true');

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const parent = pre.parentNode;
        parent?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Copy';
        button.className = 'copy-button';
        button.setAttribute('aria-label', 'Copy code block');

        let resetTimer: ReturnType<typeof setTimeout> | undefined;

        button.onclick = () => {
            const code = pre.textContent || '';
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = '✓ Copied!';
                clearTimeout(resetTimer);
                resetTimer = setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        };

        wrapper.appendChild(button);

        cleanups.push(() => {
            button.remove();
            clearTimeout(resetTimer);
            wrapper.replaceWith(pre);
            pre.removeAttribute('data-copy-button');
        });
    }

    if (root.matches('pre')) {
        enhance(root);
    } else {
        root.querySelectorAll('pre').forEach(enhance);
    }

    // code blocks are injected asynchronously via {@html}
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;
                if (node.matches('pre')) enhance(node);
                node.querySelectorAll('pre').forEach(enhance);
            });
        }
    });
    observer.observe(root, { childList: true, subtree: true });
    cleanups.push(() => observer.disconnect());

    return () => {
        cleanups.forEach((cleanup) => cleanup());
        cleanups.length = 0;
    };
};
