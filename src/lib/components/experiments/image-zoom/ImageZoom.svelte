<script lang="ts">
    import { gsap, ScrollTrigger } from '$lib/data/gsap';

    $effect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.wrapper',
                start: 'top top',
                end: '+=150%',
                pin: true,
                scrub: 1,
                markers: true,
            },
        });

        tl.set('.overlay-text', {
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
        });
        tl.set('.title-start', {
            xPercent: -100,
            opacity: 0,
        });
        tl.set('.title-end', {
            xPercent: 100,
            opacity: 0,
        });

        tl.to('img', {
            scale: 2,
            z: 350,
            transformOrigin: 'center center',
            ease: 'circ.inOut',
        });

        tl.to('.section.hero', {
            scale: 1.1,
            transformOrigin: 'center center',
            ease: 'circ.inOut',
        });

        tl.to(
            '.overlay-text',
            {
                opacity: 1,
                ease: 'circ.out',
            },
            '>-0.3',
        );

        tl.to(['.title-start', '.title-end'], {
            xPercent: 0,
            opacity: 1,
            ease: 'circ.in',
        });

        tl.from(
            '.desc',
            {
                opacity: 0,
            },
            '+=0.2',
        );

        return () => tl.revert();
    });
</script>

<div class="wrapper">
    <div class="content">
        <section class="section hero"></section>
    </div>

    <div class="image-container">
        <img
            src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/concrete-hole.webp"
            alt="frame"
        />
    </div>

    <div class="overlay-text">
        <div class="heading">
            <h2 class="title-start">the title</h2>
            <h2 class="title-end">goes here</h2>
        </div>

        <p class="desc">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus
            itaque dicta soluta aspernatur dolorem animi earum voluptatem
            asperiores. Eveniet, incidunt? Enim perspiciatis nisi incidunt
            nostrum dolorem? Earum ducimus id dolorem ea provident quo
            reiciendis sapiente sunt dolores quam quis temporibus, obcaecati
            aliquid neque minus, eligendi dignissimos ad, hic deserunt vel?
        </p>
    </div>
</div>

<style>
    .wrapper,
    .content {
        position: relative;
        inline-size: 100%;
        z-index: 1;
    }

    .wrapper {
        block-size: 100vh;
        overflow: hidden;
    }

    .content {
        inline-size: 100%;
        block-size: 100vh;
        overflow-x: hidden;
        z-index: 1;

        & .section {
            inline-size: 100%;
            block-size: 100%;
        }

        & .section.hero {
            background-image: url('https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/random-stock.webp');
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
        }
    }

    .image-container {
        inline-size: 100%;
        block-size: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;
        perspective: 500px;
        overflow: hidden;

        & img {
            inline-size: 100%;
            block-size: 100%;
            object-fit: cover;
            object-position: center center;
            scale: 1.35;
        }
    }

    .overlay-text {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 3;
        opacity: 0;
        pointer-events: none;
        text-align: center;
        color: var(--clr-light-500);

        & .heading {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5em;

            & .title-start,
            & .title-end {
                color: var(--clr-pale-700);
                font-family: var(--mono);
                font-size: clamp(var(--h4), 7vw, var(--xl));
                font-weight: 700;
                line-height: 1.1;
                text-shadow:
                    0 0 10px var(--clr-dark-500),
                    0 0 20px var(--clr-dark-500),
                    0 0 30px var(--clr-dark-500),
                    0 0 40px var(--clr-dark-500);
            }
        }

        & .desc {
            font-size: clamp(var(--sm), 1.4vw, var(--h3));
        }
    }
</style>
