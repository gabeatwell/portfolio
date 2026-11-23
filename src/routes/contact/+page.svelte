<script lang="ts">
    import SEO from '#lib/data/SEO.svelte';
    import ContactForm from '#lib/components/contact/forms/ContactForm.svelte';
    import Title from '#lib/components/layout/titles/Title.svelte';
    import SkullBg from '#lib/components/contact/SkullBg.svelte';
</script>

<SEO
    title="Contact Me"
    description="You can contact Gabe if you have any questions or if you find bugs on any of his sites"
    keywords="contact gabe atwell, contact gabriel atwell, contact gabe, message me"
/>

<SkullBg />

<section class="contact-wrapper">
    <Title
        title="contact"
        title2="contact"
        viewTransitionName="contact-heading"
    />

    <ContactForm />
</section>

<style>
    .contact-wrapper {
        display: flex;
        flex-direction: column;
        gap: 2em;
        margin: 0;
    }

    ::view-transition-old(contact-heading) {
        opacity: 0;
    }

    ::view-transition-group(contact-heading) {
        animation-duration: var(--link-transition-duration);
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (width <= 768px) {
        ::view-transition-old(contact-heading) {
            animation: slide-out var(--title-transition-duration) ease-out
                forwards;
            opacity: 1;
        }

        ::view-transition-new(contact-heading) {
            animation: slide-in var(--title-transition-duration) ease-out
                forwards;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        ::view-transition-group(contact-heading),
        ::view-transition-old(contact-heading),
        ::view-transition-new(contact-heading) {
            animation: none;
        }
    }
</style>
