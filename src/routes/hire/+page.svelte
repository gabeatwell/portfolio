<script lang="ts">
    import HireForm from '$lib/components/contact/HireForm.svelte';
    import DoYouNeed from '$lib/components/contact/DoYouNeed.svelte';
    import SEO from '$lib/data/SEO.svelte';
    import Popover from '$lib/components/layout/Popover.svelte';
</script>

<SEO
    title="Need a Website Built?"
    description="If you need help with web development or design, please fill out the form."
    keywords="hire gabriel atwell, hire gabe atwell, project questionnaire"
/>

<div class="hire-form">
    <DoYouNeed text="do you need a " span="website?" />

    <div class="popover-directions">
        <Popover
            title="Why?"
            text="This form is for potential clients to fill out if they are interested in hiring me for web development or design work. Please fill out the form as accurately as possible so I can better understand your needs."
        />
    </div>

    <section class="hire-form-wrapper">
        <HireForm />
    </section>
</div>

<style>
    .hire-form {
        background: linear-gradient(
            to bottom,
            oklch(from var(--clr-gray-700) 0.35 c h) 0%,
            var(--clr-dark-500) 30%,
            var(--clr-dark-500) var(--100)
        );

        & .hire-form-wrapper {
            display: grid;
            place-items: center;
            height: 100vh;
            margin: 0;
            anchor-name: --hire-form-wrapper;
        }

        & .popover-directions {
            position: absolute;
            position-anchor: --hire-form-wrapper;
            top: calc(anchor(top) - 5em);
            left: anchor(center);
            transform: translateX(-50%);

            @media (width <= 768px) {
                top: calc(anchor(top) - 1.5em);
            }
        }
    }
</style>
