<script lang="ts">
    import SEO from '#lib/data/SEO.svelte';
    import ContactForm from '#lib/components/contact/forms/ContactForm.svelte';
    import Title from '#lib/components/layout/titles/Title.svelte';
    import SkullBg from '#lib/components/contact/SkullBg.svelte';
</script>

<SEO
    title="Contact Me"
    description="Contact Gabe"
    keywords="contact gabe atwell, contact gabriel atwell, contact gabe, message me"
/>

<SkullBg />

<section class="contact-wrapper">
    <Title title="message" title2="message" />

    <ContactForm />
</section>

<style>
    .contact-wrapper {
        display: flex;
        flex-direction: column;
        gap: 2em;
        margin: 0;
    }
</style>
