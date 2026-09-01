<script lang="ts">
    import { submitContact } from './contact.remote';
    import SubmitButton from '$lib/components/contact/SubmitButton.svelte';
    import A11yAnnouncer from '$lib/components/utils/A11yAnnouncer.svelte';
    import Popover from '$lib/components/layout/Popover.svelte';
    import ModalPopover from '$lib/components/contact/ModalPopover.svelte';
    import MotifPhoto from './MotifPhoto.svelte';

    let name = $state<string>('');
    let email = $state<string>('');
    let message = $state<string>('');
    let submitStatus = $state<string>('');
</script>

<div class="contact-icons">
    <div class="popover-icon">
        <Popover
            title=""
            text="Please provide a working email so I can message you back!"
        />
    </div>

    <ModalPopover />
</div>

<div class="personal-image">
    <MotifPhoto
        content="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/gabe-sketch.webp"
    />
</div>

<A11yAnnouncer message={submitStatus} />

<form {...submitContact} novalidate>
    <fieldset>
        <legend>reach me</legend>

        <div class="form-group">
            <label for="name">name</label>

            <input
                type="text"
                id="name"
                name="name"
                bind:value={name}
                required
                aria-describedby="name-error"
                autocomplete="name"
                spellcheck="true"
                placeholder="Your Name"
            />
            {#each submitContact.fields.name?.issues() ?? [] as issue}
                <p class="field-error">{issue.message}</p>
            {/each}
        </div>

        <div class="form-group">
            <label for="email">email</label>

            <input
                type="email"
                id="email"
                name="email"
                bind:value={email}
                required
                aria-describedby="email-error"
                autocomplete="email"
                spellcheck="true"
                placeholder="Your Email"
            />
            {#each submitContact.fields.email?.issues() ?? [] as issue}
                <p class="field-error">{issue.message}</p>
            {/each}
        </div>

        <div class="form-group">
            <label for="message">message</label>

            <textarea
                id="message"
                name="message"
                bind:value={message}
                rows="5"
                required
                aria-describedby="message-error"
                spellcheck="true"
                placeholder="Your Message"
            ></textarea>

            {#each submitContact.fields.message?.issues() ?? [] as issue}
                <p class="field-error">{issue.message}</p>
            {/each}
        </div>

        <div class="submit-button">
            <SubmitButton />
        </div>
    </fieldset>
</form>

<style>
    :root {
        --100: 100%;
    }

    :global(body.light) form {
        --label-bg: var(--dark-gray);
    }

    * {
        margin: 0;
        padding: 0;
    }

    .contact-icons {
        display: grid;
        place-content: center;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        grid-template-rows: auto;
        align-items: center;
        margin-bottom: 1em;
        margin: 0;
        margin-top: -3em;

        @media (width <= 768px) {
            margin-top: -4em;
        }

        & .popover-icon {
            display: flex;
            justify-content: space-evenly;
        }
    }

    form {
        --label-bg: var(--dark);

        @media (width >= 320px) {
            inline-size: 85%;
            margin-inline: auto;
            display: grid;
            padding: 0.25rem;
        }

        @media (width >= 1024px) {
            fieldset {
                border: 5px solid oklch(from var(--clr-light-500) 0.35 c h);

                font-weight: bolder;
                padding: 2rem 5rem;
                border-radius: 10px;
                inline-size: 90%;

                & .form-group input {
                    margin-bottom: 1rem;
                    transform: scale(1.05);
                    inline-size: var(--100);
                }

                & .form-group textarea {
                    margin-bottom: 1rem;
                    inline-size: var(--100);
                }
            }
        }

        & fieldset {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            inline-size: var(--100);
            margin: 0 auto;
        }

        & legend {
            font-family: var(--bronova);
            font-size: clamp(var(--h6), 3.75vw, var(--xl));
            font-weight: 800;
            letter-spacing: 1px;
            color: var(--clr-light-500);
            text-shadow: 0 0 5px var(--clr-dark-500);
            padding-inline: 1rem;
            margin-bottom: 1rem;

            @media (width >= 720px) {
                margin-bottom: 0;
            }
        }

        & .form-group {
            display: flex;
            flex-direction: column;
            inline-size: 100%;

            & label {
                transform: translate(20px, 5px);
                background-color: transparent;
                inline-size: fit-content;
                padding: 0;
                font-family: var(--bronova);
                font-size: clamp(var(--h6), 1.75vw, var(--h3));
                font-weight: 500;
                z-index: 5;
                border-radius: var(--radius);
                align-self: flex-start;
                position: relative;
                color: var(--clr-blue-500);
                transition: color 0.3s ease;

                @media (width <= 500px) {
                    transform: translate(20px, 7px);
                }

                &::before {
                    content: '';
                    block-size: 2rem;
                    background-color: var(--label-bg);
                    color: var(--clr-inputs);
                    transform: translateY(-50%);
                    z-index: -1;
                    border-radius: var(--radius);
                }
            }

            & input,
            & textarea {
                inline-size: 100%;
                background-color: transparent;
                box-shadow: none;
                border: 3px solid var(--gray);
                border-radius: var(--radius);
                caret-color: var(--sky);
                color: var(--clr-light-500);
                font-size: clamp(var(--sm), 1.75vw, var(--h5));
                outline: none;
                transition:
                    border-color 0.3s ease,
                    box-shadow 0.3s ease,
                    background-color 0.2s ease;

                &:focus {
                    outline: none;
                    border-color: var(--sky);
                    box-shadow: 0 0 0 2px var(--sky);
                }

                &:user-valid {
                    border-color: var(--clr-success-500);
                    box-shadow: 0 0 0 2px var(--clr-success-500);
                    background-color: hsla(120, 60%, 50%, 0.05);
                }

                &:user-invalid {
                    border-color: var(--clr-fail-500);
                    box-shadow: 0 0 0 2px var(--clr-fail-500);
                    background-color: hsla(0, 70%, 55%, 0.05);
                    animation: wiggle 0.5s ease-out;
                }

                &:placeholder-shown:user-invalid {
                    border-color: var(--dark-gray);
                    box-shadow: none;
                    background-color: transparent;
                    animation: none;
                }

                &::placeholder {
                    color: var(--clr-light-500);
                    font-size: clamp(var(--sm), 1vw, var(--h5));
                    font-weight: 400;
                    opacity: 0.7;
                }
            }

            & input:placeholder-shown {
                letter-spacing: 3px;
            }

            & textarea {
                padding: 0.5rem 1rem;
                resize: vertical;
                min-block-size: 120px;

                &:placeholder-shown {
                    letter-spacing: 0px;
                }
            }

            &:has(input:user-valid) label,
            &:has(textarea:user-valid) label {
                color: var(--clr-success-500);
                font-weight: 600;
            }

            &:has(input:user-invalid:not(:placeholder-shown)) label,
            &:has(textarea:user-invalid:not(:placeholder-shown)) label {
                color: var(--clr-fail-500);
                font-weight: 600;
            }
        }

        & .submit-button {
            margin-top: 1em;
        }
    }

    @keyframes wiggle {
        0% {
            rotate: 0deg;
            translate: 0 0;
        }
        25% {
            rotate: -2deg;
            translate: -5px 0;
        }
        80% {
            rotate: 2deg;
            translate: 5px 0;
        }
        100% {
            rotate: 0deg;
            translate: 0 0;
        }
    }
</style>
