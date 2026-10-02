import type { Attachment } from 'svelte/attachments';
import { gsap } from '#lib/data/gsap.js';
import { onNavigate } from '$app/navigation';

type ResolveOptions = Required<Omit<PixelTransitionOptions, 'scroll'>> & {
    scroll: PixelTransitionOptions['scroll'];
};

export interface PixelTransitionOptions {
    cols?: number;
    rows?: number;
    duration?: number;
    stagger?: number;
    color?: string;
    ease?: string;
    from?: 'random' | 'start' | 'end' | 'center' | 'edges';
    zIndex?: number;
    scroll?:
        | {
              trigger?: string | HTMLElement;
              start?: string;
              end?: string;
              scrub?: number | boolean;
              spread?: number;
              layerHeight?: string;
              color?: string;
              band?: number;
              stroke?: string;
          }
        | undefined;
}

const defaults: ResolveOptions = {
    cols: 16,
    rows: 10,
    duration: 0.45,
    stagger: 0.35,
    color: '#0a0a0a',
    ease: 'power2.out',
    from: 'random',
    zIndex: 9999,
    scroll: undefined,
};

export function pixelTransition(
    options: PixelTransitionOptions = {},
): Attachment {
    const opts = { ...defaults, ...options };

    return (node: Element) => {
        // Create the fixed overlay once
        const overlay = document.createElement('div');
        overlay.className = 'pixel-transition-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            display: 'none',
            gridTemplateColumns: `repeat(${opts.cols}, 1fr)`,
            gridTemplateRows: `repeat(${opts.rows}, 1fr)`,
            zIndex: String(opts.zIndex),
            pointerEvents: 'none',
        });

        // create pixels
        const createPixels = (rows: number) => {
            overlay.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
            const total = opts.cols * rows;
            while (overlay.children.length > total) {
                overlay.lastElementChild?.remove();
            }
            while (overlay.children.length < total) {
                const pixel = document.createElement('div');
                pixel.className = 'pixel-transition-pixel';
                Object.assign(pixel.style, {
                    background: opts.color,
                    width: 'calc(100% + 1px)',
                    height: 'calc(100% + 1px)',
                    transformOrigin: 'center',
                    willChange: 'transform, opacity',
                });
                overlay.appendChild(pixel);
            }
        };

        document.body.appendChild(overlay);
        const getPixels = () =>
            overlay.querySelectorAll<HTMLElement>('.pixel-transition-pixel');

        // scrolltrigger
        createPixels(opts.rows);
        if (opts.scroll) {
            const isImg = node instanceof HTMLImageElement;
            let wrap: HTMLElement | null = null;
            let host: HTMLElement;

            if (isImg) {
                wrap = document.createElement('div');
                wrap.className = 'pixel-transition-host';
                Object.assign(wrap.style, {
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    lineHeight: '0',
                });
                node.replaceWith(wrap);
                wrap.appendChild(node);
                host = wrap;
            } else {
                host = node as HTMLElement;
            }

            const prevPos = host.style.position;
            const prevOverflow = host.style.overflow;
            const spread = opts.scroll.spread ?? 5;
            const band = opts.scroll.band ?? 0.25;

            Object.assign(overlay.style, {
                position: 'absolute',
                inset: 'auto 0 0 0',
                height: `${band * 100}%`,
                display: 'grid',
            });

            const rect = host.getBoundingClientRect();
            const rows = Math.max(
                2,
                Math.round(opts.cols * ((rect.height * band) / rect.width)),
            );

            createPixels(rows);

            if (getComputedStyle(host).position === 'static')
                host.style.position = 'relative';
            host.style.overflow = 'hidden';
            host.appendChild(overlay);

            const hash = (i: number) => {
                const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
                return x - Math.floor(x);
            };

            const img = isImg
                ? (node as HTMLImageElement)
                : host.querySelector('img');
            const fillColor = opts.scroll.color ?? opts.color;
            const strokeColor = opts.scroll.stroke ?? 'var(--clr-dark-500)';

            const paint = (i: number, sampled: string[] | null) =>
                sampled?.[i] ?? fillColor;
            const applyColors = () => {
                let sampled: string[] | null = null;
                if (img?.complete && img.naturalWidth > 0) {
                    try {
                        sampled = pixelImage(img, opts.cols, rows, band);
                    } catch {
                        sampled = null;
                    }
                }
                getPixels().forEach((p, i) => {
                    p.style.background = paint(i, sampled);
                    p.style.clipPath = 'inset(6% 6% 6% 6%)';
                    if (strokeColor && !p.firstElementChild) {
                        const stroke = document.createElement('div');
                        Object.assign(stroke.style, {
                            position: 'absolute',
                            inset: '0',
                            pointerEvents: 'none',
                            boxShadow: `inset 0 0 0 1px ${strokeColor}`,
                            clipPath: 'inset(6% 6% 6% 6%)',
                        });
                        p.style.position = 'relative';
                        p.appendChild(stroke);
                    }
                });
            };
            applyColors();

            if (img && !img.complete) {
                img.addEventListener('load', applyColors, { once: true });
            }

            const pixels = Array.from(getPixels());
            const maxDelay = Math.max(rows - 1 + spread, 1);
            const delays = pixels.map((_, i) => {
                const rowFromBottom = rows - 1 - Math.floor(i / opts.cols);
                return (rowFromBottom + hash(i) * spread) / maxDelay;
            });
            const strokes = pixels
                .map((p) => p.firstElementChild as HTMLElement | null)
                .filter((s): s is HTMLElement => s !== null);

            gsap.set(pixels, { opacity: 0 });
            gsap.set(strokes, { opacity: 0 });

            const tl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: host,
                    start: opts.scroll.start ?? 'top 90%',
                    end: opts.scroll.end ?? 'bottom center',
                    scrub: opts.scroll.scrub ?? 1,
                    refreshPriority: 1,
                },
            });

            tl.to(pixels, {
                opacity: 1,
                duration: 1,
                stagger: (i) => delays[i],
            });
            tl.to(
                strokes,
                { opacity: 1, duration: 0.6, stagger: (i) => delays[i] },
                0.2,
            );

            const mergeStart = tl.duration() - 0.35; // last ~35% of the scroll
            tl.to(
                strokes,
                {
                    opacity: 0,
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 0.25,
                    ease: 'power1.in',
                },
                mergeStart,
            );
            tl.to(
                pixels,
                {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 0.3,
                    ease: 'power2.inOut',
                },
                mergeStart,
            );

            return () => {
                tl.scrollTrigger?.kill();
                tl.kill();
                overlay.remove();
                if (img) img.style.clipPath = '';
                host.style.position = prevPos;
                host.style.overflow = prevOverflow;
                if (wrap) wrap.replaceWith(node);
            };
        }

        let isAnimating = false;
        let currentTween: gsap.core.Timeline | null = null;

        async function cover(): Promise<void> {
            if (isAnimating) return;
            isAnimating = true;

            const pixels = getPixels();
            gsap.set(overlay, { display: 'grid', pointerEvents: 'all' });
            gsap.set(pixels, { opacity: 0, scale: 0.6 });

            return new Promise((resolve) => {
                currentTween = gsap.timeline({
                    onComplete: () => {
                        isAnimating = false;
                        resolve();
                    },
                });

                currentTween.to(pixels, {
                    opacity: 1,
                    scale: 1,
                    duration: opts.duration * 0.6,
                    stagger: {
                        amount: opts.stagger,
                        from: opts.from,
                    },
                    ease: opts.ease,
                });
            });
        }

        async function reveal(): Promise<void> {
            if (isAnimating) return;
            isAnimating = true;

            const pixels = getPixels();

            return new Promise((resolve) => {
                currentTween = gsap.timeline({
                    onComplete: () => {
                        gsap.set(overlay, {
                            display: 'none',
                            pointerEvents: 'none',
                        });
                        isAnimating = false;
                        resolve();
                    },
                });

                currentTween.to(pixels, {
                    opacity: 0,
                    scale: 0.4,
                    duration: opts.duration * 0.7,
                    stagger: {
                        amount: opts.stagger * 1.1,
                        from: opts.from,
                    },
                    ease: 'power2.in',
                });
            });
        }

        let active = true;
        onNavigate(async (navigation) => {
            if (navigation.shallow) return;
            if (!active) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
                return;
            await cover();
            await navigation.complete;
            await reveal();
        });

        return () => {
            active = false;
            currentTween?.kill();
            overlay.remove();
        };
    };
}

function pixelImage(
    img: HTMLImageElement,
    cols: number,
    rows: number,
    bottomFraction: number,
): string[] {
    const canvas = document.createElement('canvas');
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext('2d')!;
    const srcH = img.naturalHeight * bottomFraction;
    const srcY = img.naturalHeight - srcH; // take from the bottom
    ctx.drawImage(
        img,
        0,
        srcY,
        img.naturalWidth,
        srcH, // source: bottom slice
        0,
        0,
        cols,
        rows, // dest: full mini-canvas
    );
    const { data } = ctx.getImageData(0, 0, cols, rows);
    return Array.from({ length: cols * rows }, (_, i) => {
        const o = i * 4;
        return `rgb(${data[o]}, ${data[o + 1]}, ${data[o + 2]})`;
    });
}
