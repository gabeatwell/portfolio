<script lang="ts">
    import InstallButton from './InstallButton.svelte';
    import Burger from '#lib/components/navigation/bar/Burger.svelte';
    import ThemeToggle from '#lib/components/navigation/bar/ThemeToggle.svelte';
    import NavDropdown from '#lib/components/navigation/bar/NavDropdown.svelte';
    import NavLink from '#lib/components/navigation/bar/NavLink.svelte';
    import SelectLink from '#lib/components/navigation/bar/SelectLink.svelte';
    import AtwellLogo from '../AtwellLogo.svelte';
    import projects from '#lib/components/projects/projects.json';

    type Project = (typeof projects)[number];

    const withImage = projects.filter((p) => p.img && p.title);
    let featured = $state<Project | null>(null);
    let open = $state<boolean>(false);

    function closeMenu() {
        if (open) {
            open = false;
        }
    }

    $effect(() => {
        if (withImage.length === 0) return;
        featured = withImage[Math.floor(Math.random() * withImage.length)];
    });

    // nav items
    const desktopItems = $derived([
        {
            type: 'link' as const,
            href: '/about',
            title: 'About',
            index: 0,
            viewTransitionName: 'about-heading',
        },
        {
            type: 'dropdown' as const,
            title: 'Builds',
            href: '/projects',
            index: 1,
            dropdownType: 'links' as const,
            panelOffset: '4em',
            links: [
                { label: 'My Projects', href: '/projects' },
                { label: 'Experiments', href: '/experiments' },
            ],
        },
        {
            type: 'link' as const,
            href: '/learn',
            title: 'Learn',
            index: 2,
            viewTransitionName: 'learn-heading',
        },
        {
            type: 'dropdown' as const,
            title: 'Three.js',
            href: '/threejs-blog',
            index: 3,
            dropdownType: 'image' as const, // or 'iframe'
            imageSrc:
                'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/threejs-svgloader.webp',
            imageAlt: 'Three.js work',
        },
    ]);
</script>

<InstallButton />

<nav class="navigation">
    <div class="nav-main">
        <Burger bind:open ariaLabel="Toggle menu" />

        <AtwellLogo title="atwell" />

        <ThemeToggle />
    </div>

    <ul class="desktop" aria-label="desktop navigation menu">
        {#each desktopItems as item}
            {#if item.type === 'dropdown'}
                <NavDropdown
                    title={item.title}
                    href={item.href}
                    index={item.index}
                    type={item.dropdownType}
                    links={item.links}
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt}
                    panelOffset={item.panelOffset}
                />
            {:else}
                <NavLink
                    href={item.href}
                    title={item.title}
                    index={item.index}
                    viewTransitionName={item.viewTransitionName}
                />
            {/if}
        {/each}

        <SelectLink />
    </ul>

    <ul class="mobile" id="mobile-menu" aria-label="Main navigation menu">
        <li>
            <NavLink href="/about" title="About Gabe" onclick={closeMenu} />
        </li>
        <li>
            <NavLink
                href="/projects"
                title="Things I've Built"
                onclick={closeMenu}
            />
        </li>
        <li>
            <NavLink href="/learn" title="Learn the Web" onclick={closeMenu} />
        </li>
        <li>
            <NavLink
                href="/threejs-blog"
                title="Learn Three.js"
                onclick={closeMenu}
            />
        </li>
        <li>
            <NavLink href="/contact/hire" title="Hire Me" onclick={closeMenu} />
        </li>
        <li>
            <NavLink href="/contact" title="Contact Me" onclick={closeMenu} />
        </li>
    </ul>
</nav>

<style>
    nav.navigation {
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 500;
        inline-size: 100%;
        block-size: fit-content;
        padding: 0 calc(var(--space-xxxl) * 2) 0 calc(var(--space-md) + 2rem);
        margin-inline: auto;
        pointer-events: auto;
        position: fixed;
        top: 0;
        border-radius: var(--radius);
        box-shadow: 0 0 2px oklch(from var(--clr-light-500) 0.5 c h);
        background: oklch(from var(--bg) l c h / 0.6);

        & .nav-main {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            gap: 1rem;
            flex: 1;
            inline-size: 100%;
        }

        @media (width > 768px) and (width < 1098px) {
            inline-size: 100%;
            border-radius: var(--radius);
            padding: 1.2rem 0.75em 0.4rem 0.25em;
            block-size: 3.75rem;
            min-block-size: 5rem;
            justify-content: space-between;
            flex: 1;
        }

        @media (width > 300px) and (width < 750px) {
            inline-size: 100%;
            border-radius: var(--radius);
            padding: 1.2rem 0 0.4rem 0;
            block-size: 3.75rem;
            min-block-size: 3.75rem;
            justify-content: space-between;
            flex: 1;
        }

        @media (width <= 768px) {
            justify-content: space-between;
            padding-inline: 0.75rem;
        }

        @media (width <= 500px) {
            box-shadow: 0 0 8px oklch(from var(--clr-light-500) 0.65 c h);
        }
    }

    .desktop {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: clamp(0.25rem, 2vw, 1.5rem);
        font-family: var(--ultra);
        font-weight: 600;
        list-style: none;

        @media (width >= 300px) and (width <= 750px) {
            display: none;
        }
    }

    .mobile {
        position: fixed;
        right: 1em;
        top: 3em;
        z-index: 10;
        overflow: clip;
        transform: scale(0.8);
        transition:
            opacity 0.3s ease-out,
            visibility 0s linear 0.3s,
            transform 0.15s ease-out;
        opacity: 0;
        transform-origin: top left;
        box-shadow: 0 0 0 1px var(--clr-light-500);
        visibility: hidden;

        @media (width >= 300px) and (width <= 750px) {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            gap: 1.25rem;
            border-radius: 5px;
            padding: calc(var(--space-md) - 0.45rem);
            background-color: var(--clr-dark-500);
            list-style: none;
            min-width: 150px;
            width: auto;

            & li {
                padding: 0.15rem;
            }
        }

        @media (width >= 750px) {
            display: none;
        }
    }
</style>
