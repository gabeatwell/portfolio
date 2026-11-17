export function originAware(popover: HTMLElement) {
    // only the opener — skip the close button, which shares popovertarget
    const trigger = document.querySelector<HTMLElement>(
        `[popovertarget="${popover.id}"]:not([popovertargetaction])`,
    );
    if (!trigger) return;

    const onBeforeToggle = (event: Event) => {
        if ((event as ToggleEvent).newState !== 'open') return;

        // the popover has no layout box until the frame it opens in;
        // offset* reads are transform-independent, so scale/translate won't skew them
        requestAnimationFrame(() => {
            const btn = trigger.getBoundingClientRect();
            popover.style.setProperty(
                '--origin-x',
                `${btn.left + btn.width / 2 - popover.offsetLeft}px`,
            );
            popover.style.setProperty(
                '--origin-y',
                `${btn.top + btn.height / 2 - popover.offsetTop}px`,
            );
        });
    };

    popover.addEventListener('beforetoggle', onBeforeToggle);
    return () => popover.removeEventListener('beforetoggle', onBeforeToggle);
}
