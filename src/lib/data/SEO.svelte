<script lang="ts">
    import { page } from '$app/state';

    interface Props {
        title?: string;
        description?: string;
        keywords?: string;
        image?: string;
        type?: string;
    }

    let {
        title = 'Gabe Atwell',
        description = 'Web developer and web designer',
        keywords = '',
        image = '',
        type = 'website',
    }: Props = $props();

    const currentUrl = $derived(page.url);
    const baseUrl = $derived(
        currentUrl.origin.includes('localhost') ||
            currentUrl.origin.includes('127.168.0.1')
            ? currentUrl.origin
            : 'https://atwell.dev',
    );
    const normalizedPath = $derived(
        currentUrl.pathname === '/'
            ? '/'
            : currentUrl.pathname.replace(/\/$/, ''),
    );
    const canonicalUrl = $derived(`${baseUrl}${normalizedPath}`);
    const ogImage = $derived(
        image
            ? image.startsWith('http')
                ? image
                : `${baseUrl}${image}`
            : 'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/atwellUI_social-media.webp',
    );
    const siteName = 'atwellUI';

    const jsonLd = $derived(
        JSON.stringify([
            // 1. website schema
            {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'atwellUI',
                url: baseUrl,
                description: description,
                image: ogImage,
                author: {
                    '@type': 'Person',
                    name: 'Gabriel Atwell',
                },
            },
            // 2. person schema
            {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'Gabriel Atwell',
                alternateName: ['Gabe Atwell', 'Atwell', 'atwellUI'],
                url: baseUrl,
                image: ogImage,
                jobTitle: 'UI Designer & Frontend Developer',
                description:
                    'Las Vegas-based UI designer and frontend developer specializing in custom websites, animations, and interactive experiences.',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Las Vegas',
                    addressRegion: 'NV',
                    addressCountry: 'US',
                },
                sameAs: [
                    'https://github.com/gabeatwell',
                    'https://www.linkedin.com/in/gabrielatwell/',
                    'https://codepen.io/gabrielatwell',
                    'https://www.behance.net/gabrielatwell702',
                ],
            },
        ]),
    );

    const structuredData = $derived(
        '<script type="application/ld+json">' + jsonLd + '<' + '/script>',
    );

    const finalTitle = $derived(
        title.startsWith('Gabe Atwell') ? title : `Gabe Atwell - ${title}`,
    );
</script>

<svelte:head>
    <!-- critical -->
    <title>{finalTitle}</title>
    <link rel="canonical" href={canonicalUrl} />
    <meta name="description" content={description} />
    <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    />

    <!-- helpful -->
    {#if keywords}
        <meta name="keywords" content={keywords} />
    {/if}
    <meta name="author" content="Gabriel Atwell" />

    <!-- required: Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content={type} />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:locale" content="en_US" />
    {#if ogImage}
        <meta property="og:image" content={ogImage} />
        <meta
            property="og:image:alt"
            content={`${title} - Gabriel Atwell Portfolio`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
    {/if}

    <!-- required: Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {#if ogImage}
        <meta name="twitter:image" content={ogImage} />
        <meta
            name="twitter:image:alt"
            content={`${title} - Gabriel Atwell Portfolio`}
        />
    {/if}

    {@html structuredData}
</svelte:head>
