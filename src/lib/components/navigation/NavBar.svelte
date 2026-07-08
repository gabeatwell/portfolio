<script lang="ts">
    import InstallButton from './InstallButton.svelte';
    import Burger from '$lib/components/navigation/Burger.svelte';
    import ThemeToggle from '$lib/components/navigation/ThemeToggle.svelte';
    import NavLink from '$lib/components/navigation/NavLink.svelte';
    import SelectLink from '$lib/components/navigation/SelectLink.svelte';
    // import AtwellUnderline from './AtwellUnderline.svelte';
    import AtwellLogo from './AtwellLogo.svelte';

    let open = $state<boolean>(false);

    function closeMenu() {
        if (open) {
            open = false;
        }
    }
</script>

<InstallButton />

<nav class="navigation">
    <div class="nav-main">
        <Burger bind:open ariaLabel="Toggle menu" />

        <!-- <AtwellUnderline /> -->
        <AtwellLogo title="atwell" />

        <ThemeToggle />
    </div>

    <ul class="desktop" aria-label="Desktop navigation menu">
        <li>
            <NavLink
                href="/about"
                title="About"
                index={0}
                viewTransitionName="about-heading"
            />
        </li>
        <li>
            <NavLink
                href="/projects"
                title="Builds"
                index={1}
                viewTransitionName="build-heading"
            />
        </li>
        <li>
            <NavLink
                href="/learn"
                title="Learn"
                index={2}
                viewTransitionName="learn-heading"
            />
        </li>
        <li>
            <NavLink
                href="/threejs-blog"
                title="Three.js"
                index={3}
                viewTransitionName="three-heading"
            />
        </li>
        <SelectLink />
    </ul>

    <ul
        class="mobile {open ? 'open' : ''}"
        id="mobile-menu"
        aria-label="Main navigation menu"
    >
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
        <li><NavLink href="/hire" title="Hire Me" onclick={closeMenu} /></li>
        <li>
            <NavLink href="/contact" title="Contact Me" onclick={closeMenu} />
        </li>
    </ul>
</nav>

<style>
    :root {
        --100: 100%;
    }

    nav.navigation {
        display: flex;
        justify-content: space-around;
        align-items: center;
        backdrop-filter: blur(0.15rem);
        -webkit-backdrop-filter: blur(0.15rem);
        z-index: 15;
        inline-size: 100%;
        block-size: fit-content;
        padding: 0 9em 0 1rem;
        margin-inline: auto;
        pointer-events: auto;
        position: fixed;
        top: 0;
        border-radius: var(--radius);
        box-shadow: 0 0 5px oklch(from var(--clr-light-500) 0.5 c h);

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
            transform 0.15s ease-out;
        opacity: 0;
        transform-origin: top left;
        box-shadow: 0 0 0 1px var(--clr-light-500);
        visibility: hidden;

        &.open {
            transition-delay: 0ms;
            transform: scale(1);
            opacity: 1;
            visibility: visible;
        }

        @media (width >= 300px) and (width <= 750px) {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            gap: 1.25rem;
            border-radius: 5px;
            padding: 0.75rem;
            background-color: var(--clr-dark-500);
            backdrop-filter: blur(125px);
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
