<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { topics } from './topics';

    let query = $derived(page.url.searchParams.get('q') ?? '');

    // filtered topics
    let filteredTopics = $derived(
        query.trim() === ''
            ? topics
            : topics.filter(
                  (topic) =>
                      topic.title.toLowerCase().includes(query.toLowerCase()) ||
                      topic.category
                          .toLowerCase()
                          .includes(query.toLowerCase()),
              ),
    );

    // update the url
    function updateSearch(value: string) {
        const url = new URL(page.url);

        if (value.trim()) {
            url.searchParams.set('q', value);
        } else {
            url.searchParams.delete('q');
        }

        goto(url.toString(), {
            replaceState: true,
            keepFocus: true,
            noScroll: true,
        });
    }
</script>

<div class="search-wrapper">
    <input
        type="search"
        placeholder="Search CSS & GSAP topics..."
        value={query}
        oninput={(e) => updateSearch(e.currentTarget.value)}
        autocomplete="off"
        spellcheck="false"
    />

    {#if query}
        <button
            type="button"
            class="clear"
            onclick={() => updateSearch('')}
            aria-label="Clear search"
            ><svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M8.00191 9.41621C7.61138 9.02569 7.61138 8.39252 8.00191 8.002C8.39243 7.61147 9.0256 7.61147 9.41612 8.002L12.0057 10.5916L14.5896 8.00771C14.9801 7.61719 15.6133 7.61719 16.0038 8.00771C16.3943 8.39824 16.3943 9.0314 16.0038 9.42193L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.004C15.6133 16.3945 14.9802 16.3945 14.5896 16.004L12.0057 13.42L9.42192 16.0038C9.03139 16.3943 8.39823 16.3943 8.00771 16.0038C7.61718 15.6133 7.61718 14.9801 8.00771 14.5896L10.5915 12.0058L8.00191 9.41621Z"
                    fill="var(--clr-fail-500)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"
                    fill="var(--clr-fail-500)"
                />
            </svg></button
        >
    {/if}
</div>

<div class="topic-list">
    <div class="topic-header">
        <span class="count">
            {filteredTopics.length}
            {filteredTopics.length === 1 ? 'result' : 'results'}
        </span>
    </div>

    {#if filteredTopics.length === 0}
        <p class="no-results">No topics found</p>
    {:else}
        <ul>
            {#each filteredTopics as topic (topic.id)}
                <li>
                    <a href="#{topic.id}">
                        {topic.title}
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .search-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2em;

        & input {
            max-inline-size: 45vw;
            inline-size: 100%;
            margin-inline: auto;
            block-size: 2em;
            border-radius: 9999px;
            corner-shape: squircle;
            padding: 0 0 0 2em;
            font-size: clamp(1em, 2vw, 1.5rem);
            color: var(--clr-light-500);
            background-color: var(--clr-dark-500);
            border: 3px solid var(--clr-gray-600);

            anchor-name: --search-input;

            @media (width <= 1050px) {
                max-inline-size: 65vw;
            }

            @media (width <= 768px) {
                max-inline-size: 90vw;
                padding: 0 0 0 2.5em;
            }

            &::placeholder {
                color: var(--clr-light-400);
            }
        }

        & .clear {
            background: none;
            border: none;
            inline-size: fit-content;
            margin-inline: auto;

            position: absolute;
            position-anchor: --search-input;
            right: calc(anchor(right) + 0.05em);

            &:focus,
            &:focus-within {
                outline: 1px solid var(--clr-light-500);
                background-color: transparent;
            }

            & svg {
                inline-size: clamp(1.5em, 3vw, 2.5rem);
                block-size: clamp(1.5em, 3vw, 2.5rem);
            }
        }
    }

    .topic-list {
        padding: 0 clamp(1em, 5vw, 5em);

        & .no-results {
            text-align: center;
            font-size: clamp(1em, 2vw, 1.5rem);
            color: var(--clr-gray-900);
        }

        & ul {
            display: grid;
            grid-template-columns: repeat(
                auto-fit,
                minmax(clamp(10em, 20vw, 20em), 1fr)
            );
            justify-content: center;

            & li {
                list-style-type: none;
                margin: 0;

                & a {
                    font-family: var(--bronova-bold);
                    font-size: clamp(var(--sm), 0.8vw, var(--h5));
                    text-decoration: none;
                    color: var(--clr-light-500);
                    display: block;
                    padding: 0.5em 1em;
                    border-radius: 0.5em;
                    transition: background-color 0.3s ease;
                    inline-size: fit-content;

                    &:hover {
                        background-color: var(--clr-dark-400);
                    }
                }
            }
        }
    }
</style>
