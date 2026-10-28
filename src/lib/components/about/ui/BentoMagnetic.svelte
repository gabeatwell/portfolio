<script lang="ts">
    import Image from '#lib/components/layout/images/Image.svelte';

    interface Item {
        title: string;
        description: string;
        src?: string;
        alt?: string;
    }

    interface Props {
        title?: string;
        description?: string;
        src?: string;
        alt?: string;
    }

    const baseline: Item[] = [
        { title: 'Develop', description: 'Build the thing.' },
        { title: 'Preview', description: 'See it live.' },
        { title: 'Ship', description: 'Push to prod.' },
        { title: 'Profit', description: 'Celebrate.' },
    ];

    let { title, description, src, alt }: Props = $props();

    const items = $derived<Item[]>(
        title || description || src
            ? [
                  {
                      title: title ?? '',
                      description: description ?? '',
                      src,
                      alt,
                  },
              ]
            : baseline,
    );
</script>

<ul class="bento" class:solo={items.length === 1}>
    {#each items as item}
        <li>
            <article>
                {#if item.src}
                    <div class="card-images">
                        <Image
                            src={item.src}
                            alt={item.alt ?? ''}
                            aspectRatio="16/9"
                        />
                    </div>
                {/if}

                {#if item.title}
                    <h2>{item.title}</h2>
                {/if}

                {#if item.description}
                    <p>{item.description}</p>
                {/if}
            </article>

            <div class="indicator" aria-hidden="true"></div>
        </li>
    {/each}
</ul>

<style>
    .bento {
        --dur: 0.35s;
        --ease: cubic-bezier(0.25, 1, 0.5, 1);
        --radius: 0.25em;
        --halo: var(--clr-blue-500-fade);

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: minmax(9rem, auto);
        gap: 1rem;
        list-style: none;
        padding: 0;
        margin-inline: 1rem;

        & > li {
            position: relative;
            min-inline-size: 0;
            transition: transform var(--dur) var(--ease);
            list-style: none;

            &:hover {
                transform: translateY(-0.3rem);
            }
        }

        &:not(.solo) > li:nth-child(1) {
            grid-column: span 2;
            grid-row: span 2;
        }

        &:not(.solo) > li:nth-child(2) {
            grid-column: span 2;
        }

        &.solo > li {
            grid-column: 1 / -1;
        }

        article {
            --card-fg: hsl(0 0% 90%);
            --card-title: var(--clr-blue-500);
            position: relative;
            z-index: 1;
            block-size: 100%;
            padding: 1.5rem;
            border-radius: var(--radius);
            background: var(--clr-gray-500);
            color: var(--card-fg);
            anchor-name: --bento;
            transition:
                background-color var(--dur) var(--ease),
                color var(--dur) var(--ease);
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            & h2 {
                font-family: var(--bronova-bold);
            }
            & p {
                font-family: var(--bronova);
            }
        }

        .card-images {
            margin: -1.5rem -1.5rem 0.5rem;

            :global(img) {
                inline-size: 100%;
                border-radius: 0;
            }
        }

        .indicator {
            position: absolute;
            position-anchor: --bento;
            top: anchor(top);
            right: anchor(right);
            bottom: anchor(bottom);
            left: anchor(left);
            transition:
                opacity 0.25s ease,
                scale var(--dur) var(--ease);
            pointer-events: none;
            z-index: 2;
            outline: 1px solid color-mix(in oklab, var(--halo) 60%, transparent);
            outline-offset: 0.4rem;
            border-radius: var(--radius);
            box-shadow: 0 8px 30px hsl(0 0% 0% / 0.3);
            background-color: var(--clr-gray-500-fade);

            opacity: 0;
            scale: 0.96;
        }

        & > li:hover .indicator {
            opacity: 1;
            scale: 1;
        }

        @media (width < 60rem) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (width < 40rem) {
            grid-template-columns: 1fr;

            &:not(.solo) > li:nth-child(n) {
                grid-column: 1 / -1;
                grid-row: auto;
            }
        }
    }

    @supports not (anchor-name: --a) {
        .bento > li:hover article {
            outline: 1px solid var(--clr-blue-500);
            outline-offset: 0.4rem;
        }
    }
</style>
