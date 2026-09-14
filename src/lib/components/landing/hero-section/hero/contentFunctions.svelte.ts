import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';

const chars = 'Handcrafted Frontend Interfaces';

class HeroContentState {
    showContent = $state<boolean>(false);
    displayedTitle = $state<string[]>([]);
    titleText = 'Handcrafted Frontend Interfaces';
    titleWords = $derived(this.titleText.split(' '));

    constructor() {
        this.displayedTitle = this.titleText.split('').map((char, index) => {
            const wordIndex = this.getWordIndexFromCharIndex(index);
            // first word stays unchanged
            if (wordIndex === 0) return char;
            return char === ' ' ? ' ' : this.getRandomChar();
        });
    }

    getWordChars(wordIndex: number) {
        let charIndex = 0;
        for (let i = 0; i < wordIndex; i++) {
            charIndex += this.titleWords[i].length + 1;
        }
        return {
            start: charIndex,
            chars: this.displayedTitle.slice(
                charIndex,
                charIndex + this.titleWords[wordIndex].length,
            ),
        };
    }

    getWordIndexFromCharIndex(index: number): number {
        let charCount = 0;
        for (let i = 0; i < this.titleWords.length; i++) {
            if (index < charCount + this.titleWords[i].length) return i;
            charCount += this.titleWords[i].length + 1;
        }
        return 0;
    }

    getRandomChar() {
        return chars[Math.floor(Math.random() * chars.length)];
    }

    animateTitle() {
        const breakpoints = getBreakpoints();
        const prefersReducedMotion = breakpoints.isReduced;

        if (prefersReducedMotion) {
            this.displayedTitle = this.titleText.split('');
            this.showContent = true;
            return;
        }

        // animation state for each character
        const animState = this.titleText.split('').map((char, index) => ({
            index,
            char,
            iterations: 0,
            shouldAnimate:
                char !== ' ' && this.getWordIndexFromCharIndex(index) > 0,
        }));

        const startTime = Date.now();
        const animationDuration = 5000;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const isComplete = elapsed > animationDuration;
            let hasUpdates = false;

            animState.forEach((state) => {
                if (!state.shouldAnimate) return;
                const delay = state.index * 70;
                if (elapsed < delay) return;

                const timeSinceStart = elapsed - delay;
                const iterations = Math.floor(timeSinceStart / 175);

                if (iterations !== state.iterations) {
                    hasUpdates = true;
                    state.iterations = iterations;
                    this.displayedTitle[state.index] =
                        iterations >= 2 ? state.char : this.getRandomChar();
                }
            });

            if (hasUpdates) {
                this.displayedTitle = [...this.displayedTitle];
            }

            if (!isComplete) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
        setTimeout(() => (this.showContent = true), 1300);
    }
}

export const heroContentState = new HeroContentState();
