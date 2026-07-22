<script lang="ts">
    interface Props {
        active: boolean;
    }
    let { active }: Props = $props();

    $effect(() => {
        if (!active) return;

        function updateChrome() {
            const isLandscape = window.innerWidth > window.innerHeight;
            const nav = document.querySelector('nav') as HTMLElement | null;
            const footer = document.querySelector(
                'footer',
            ) as HTMLElement | null;
            const select = document.querySelector(
                '.select',
            ) as HTMLElement | null;
            const body = document.body;
            const html = document.documentElement;

            if (isLandscape) {
                if (nav) nav.style.display = 'none';
                if (footer) footer.style.display = 'none';
                if (select) select.style.display = 'none';
                Object.assign(body.style, {
                    overflow: 'hidden',
                    width: '100vw',
                    height: '100vh',
                    margin: '0',
                    padding: '0',
                });
                Object.assign(html.style, {
                    overflow: 'hidden',
                    width: '100vw',
                    height: '100vh',
                    margin: '0',
                    padding: '0',
                });
            } else {
                if (nav) nav.style.display = '';
                if (footer) footer.style.display = '';
                if (select) select.style.display = '';
                body.style.overflow =
                    body.style.width =
                    body.style.height =
                    body.style.margin =
                    body.style.padding =
                        '';
                html.style.overflow =
                    html.style.width =
                    html.style.height =
                    html.style.margin =
                    html.style.padding =
                        '';
            }
        }

        updateChrome();
        window.addEventListener('resize', updateChrome);
        window.addEventListener('orientationchange', updateChrome);

        return () => {
            window.removeEventListener('resize', updateChrome);
            window.removeEventListener('orientationchange', updateChrome);

            // only restore when not in landscape - session ending
            const isLandscape = window.innerWidth > window.innerHeight;
            if (!isLandscape) {
                const nav = document.querySelector('nav') as HTMLElement | null;
                const footer = document.querySelector(
                    'footer',
                ) as HTMLElement | null;
                if (nav) nav.style.display = '';
                if (footer) footer.style.display = '';
            }
        };
    });
</script>
