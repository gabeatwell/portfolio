import { browser } from '$app/env';
import DOMPurify from 'dompurify';

export function sanitize(html: string): string {
    if (!browser) return html;
    return DOMPurify.sanitize(html);
}

class DetailsAccordion {
    openStates = $state<boolean[]>([]);

    init(length: number) {
        this.openStates.length = length;

        for (let i = 0; i < length; i++) {
            if (this.openStates[i] === undefined) this.openStates[i] = false;
        }
    }

    toggle(index: number) {
        if (this.openStates[index]) {
            this.openStates[index] = false;
        } else {
            this.openStates = this.openStates.map((_, i) => i === index);
        }
    }

    handleKeydown(event: KeyboardEvent, index: number) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggle(index);
        }
    }
}

export const detailsAccordion = new DetailsAccordion();
