export interface PopoverState {
    popoverElement: HTMLElement | null;
    showPopover(): void;
    hidePopover(): void;
    cancelHide(): void;
    closePopover(): void;
}

export function createPopoverState(): PopoverState {
    let popoverElement = $state<HTMLElement | null>(null);
    let hoverTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

    function showPopover(): void {
        if (!popoverElement) return;
        if (hoverTimeout) clearTimeout(hoverTimeout);
        popoverElement.showPopover();
    }

    function hidePopover(): void {
        if (!popoverElement) return;

        hoverTimeout = setTimeout(() => {
            popoverElement?.hidePopover();
        }, 150);
    }

    function cancelHide(): void {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
    }

    function closePopover(): void {
        cancelHide();
        popoverElement?.hidePopover();
    }

    return {
        get popoverElement() {
            return popoverElement;
        },
        set popoverElement(el: HTMLElement | null) {
            popoverElement = el;
        },
        showPopover,
        hidePopover,
        cancelHide,
        closePopover,
    };
}
