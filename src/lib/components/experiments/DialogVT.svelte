<script lang="ts">
    import { onMount } from 'svelte';

    let dialog: HTMLDialogElement | null = null;

    const prefersReducedMotion = matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;

    let sourceCard: HTMLElement | null = null;
    let cards: HTMLDivElement;

    // fallback
    const transition = (callback: () => void | Promise<void>) => {
        if (!document.startViewTransition) {
            callback();
            return { finished: Promise.resolve() };
        }
        return document.startViewTransition(callback);
    };

    // set vt names
    const setNames = (img: HTMLElement, btn: HTMLElement, active: boolean) => {
        if (prefersReducedMotion) return;
        img.style.viewTransitionName = active ? 'card' : '';
        btn.style.viewTransitionName = active ? 'card-button' : '';
    };

    const openCard = (card: HTMLElement) => {
        sourceCard = card;
        const img = card.querySelector('img');
        const btn = card.querySelector('button');
        if (!img || !btn) return;

        // Clone the card and swap the button for a close button
        const clone = card.cloneNode(true) as HTMLElement;
        const cloneImg = clone.querySelector('img');
        const cloneBtn = clone.querySelector('button');
        if (!cloneImg || !cloneBtn) return;
        if (!dialog) return;
        const d = dialog;
        cloneBtn.className = 'close';
        cloneBtn.setAttribute('aria-label', 'Close');
        cloneBtn.addEventListener('click', closeCard);

        // Give view transition names to the source elements
        setNames(img, btn, true);

        transition(() => {
            card.setAttribute('aria-expanded', 'true');

            // Move the view transition names to the clone
            setNames(img, btn, false);
            setNames(cloneImg, cloneBtn, true);

            // Open the dialog
            d.append(clone);
            d.showModal();
            cloneBtn.focus();
        });
    };

    const closeCard = () => {
        if (!dialog || !sourceCard) return;
        const d = dialog;
        const sc = sourceCard;
        const clone = d.querySelector('.card');
        const cloneImg = clone?.querySelector('img');
        const cloneBtn = clone?.querySelector('button');
        const img = sc.querySelector('img');
        const btn = sc.querySelector('button');
        if (!clone || !cloneImg || !cloneBtn || !img || !btn) return;

        // Give view transition names to the elements in the dialog
        setNames(cloneImg, cloneBtn, true);

        transition(() => {
            // Move the view transition names to the source elements
            setNames(cloneImg, cloneBtn, false);
            setNames(img, btn, true);

            sc.removeAttribute('aria-expanded');
            clone.remove();
            d.close();
        }).finished.then(() => {
            // Clean up after transition completes
            setNames(img, btn, false);
        });
    };

    onMount(() => {
        if (!dialog) return;
        document.querySelector('.cards')?.addEventListener('click', (e) => {
            const target = e.target;
            if (!target || !(target instanceof Element)) return;
            const btn = target.closest('.card button');
            const card = btn?.closest('.card');
            if (
                btn &&
                card instanceof HTMLElement &&
                !btn.classList.contains('close')
            ) {
                openCard(card);
            }
        });

        // Intercept cancel (closedby="any") to run transition first
        dialog.addEventListener('cancel', (e) => {
            e.preventDefault();
            closeCard();
        });
    });
</script>

<div class="cards" bind:this={cards}>
    <figure class="card">
        <img
            src="https://placecats.com/millie/800/600"
            alt="A cat"
            width="800"
            height="600"
        />

        <button aria-label="Expand image"></button>
    </figure>

    <figure class="card">
        <img
            src="https://placecats.com/millie_neo/800/600"
            alt="A cat"
            width="800"
            height="600"
        />

        <button aria-label="Expand image"></button>
    </figure>

    <figure class="card">
        <img
            src="https://placecats.com/neo_banana/800/600"
            alt="A cat"
            width="800"
            height="600"
        />

        <button aria-label="Expand image"></button>
    </figure>

    <figure class="card">
        <img
            src="https://placecats.com/neo/800/600"
            alt="A cat"
            width="800"
            height="600"
        />

        <button aria-label="Expand image"></button>
    </figure>

    <figure class="card">
        <img
            src="https://placecats.com/neo_2/800/600"
            alt="A cat"
            width="800"
            height="600"
        />

        <button aria-label="Expand image"></button>
    </figure>

    <figure class="card">
        <img
            src="https://placecats.com/bella/800/600"
            alt="A cat"
            width="800"
            height="600"
        />

        <button aria-label="Expand image"></button>
    </figure>
</div>

<dialog closedby="any" bind:this={dialog}></dialog>

<style>
    .cards {
        inline-size: 100%;
        min-inline-size: 0;
        max-inline-size: 40rem;
        margin-inline: auto;
        margin-block: 15vw;

        display: grid;
        place-items: center;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;

        @media (max-width: 600px) {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }

        .card {
            display: grid;
            position: relative;
            will-change: transform;

            &:global([aria-expanded='true']) {
                visibility: hidden;
            }

            & img {
                grid-column: 1;
                grid-row: 1;
                inline-size: 100%;
                block-size: auto;
                background: #dedede;
                border-radius: var(--radius);
            }

            & button {
                justify-self: start;
                align-self: end;
                grid-column: 1;
                grid-row: 1;
                inline-size: 1.5rem;
                block-size: 1.5rem;
                margin: 0.5rem;
                background: rgba(255, 255, 255, 0.75)
                    url('https://assets.codepen.io/889665/zoom-in.svg') center /
                    0.75rem no-repeat;
                border-radius: var(--radius);
                transition: background-color 0.1s;

                &::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                }

                &:focus-visible,
                &:hover {
                    outline: none;
                    background-color: #fff;
                }

                &:global(.close) {
                    transform: rotate(-180deg);
                    background-image: url('https://assets.codepen.io/889665/zoom-out.svg');
                }
            }
        }
    }

    dialog {
        border: none;
        padding: 0;
        background: none;
        margin: auto;
        inline-size: 100%;
        max-inline-size: min(30rem, (100% - 1rem));
        max-block-size: calc(100svh - 1rem);

        &::backdrop {
            background: rgb(255 255 255 / 0.5);
        }
    }

    dialog :global(.card img) {
        border-radius: var(--radius);
    }

    dialog :global(.card .close) {
        background: rgb(255 255 255 / 0.9)
            url('https://assets.codepen.io/889665/zoom-out.svg') center /
            0.75rem no-repeat;
        color: #333;
        font-size: 0.7rem;
        font-family: inherit;
        padding-inline-end: 0.5rem;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        inline-size: 2.5em;
        block-size: 2em;
        padding: 0.35rem 0.5rem;
        gap: 0.25rem;
        background-position: left 0.5rem center;
        outline: none;
    }

    ::view-transition-group(card),
    ::view-transition-group(card-button) {
        animation-duration: 0.35s;
        animation-timing-function: linear(
            0,
            0.006,
            0.025 2.8%,
            0.101 6.1%,
            0.539 18.9%,
            0.721 25.3%,
            0.849 31.5%,
            0.937 38.1%,
            0.968 41.8%,
            0.991 45.7%,
            1.006 50.1%,
            1.015 55%,
            1.017 63.9%,
            1.001
        );
    }
</style>
