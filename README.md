# Gabriel Atwell's Portfolio

<div style="text-align: center;">
    <img src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/a-dev.webp" width="500" height="auto" alt="atwell logo" />
</div>

A fully custom, from-scratch portfolio built with **SvelteKit**, **GSAP**, and **Three.js**.
It's a **Progressive Web App**, features a collection of **frontend experiments**, and ships
a **Three.js blog** — and tutorials for **CSS** and **GSAP**.

## [https://atwell.dev](https://atwell.dev)

---

## Features

### Progressive Web App (PWA)

- **Installable** — web app manifest + icons let visitors add the site to their home screen or desktop.
- **Offline-ready** — the service worker caches the app shell so the portfolio loads without a connection.
- **Responsive & mobile-first** — fluid layouts and touch-friendly interactions on every screen size.

### 🧪 Frontend Experiments

A sandbox of interactive demos I've built to explore and push the limits of the web:

- **GSAP** — scroll-triggered animations, timelines, scrubbing, easing, and staggered reveals.
- **Three.js** — WebGL scenes, 3D models, and shader playgrounds.
- **CSS** — modern layout patterns, transforms, blend modes, and micro-interactions.
- Each experiment is isolated, runnable, and documented so it doubles as a reference snippet.

### Three.js Blog

- Posts are served by a **Remote Functions** in sveltekit.
- Content is authored in **Markdown** and rendered on the client.
- The blog keeps the site current — I update it regularly with new posts and experiments.

### CSS & GSAP Teachings

- The experiments section is a learning resource as much as a portfolio. (Reach it by pressing tab twice when not focused on anything)
- Every demo explains _why_ a technique works, not just _how_ to copy it.
- Articles pair written breakdowns with live, interactive examples you can inspect and tweak.

### Completely Custom

- No templates — the UI, animations, and layouts are all hand-coded.
- Markdown-driven content makes adding projects and posts quick.

---

## 🛠️ Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Frontend     | SvelteKit (Svelte 5 runes)        |
| Animations   | GSAP + ScrollTrigger              |
| 3D / WebGL   | Three.js                          |
| Blog backend | Sveltekit Remote Functions        |
| Content      | Markdown                          |
| PWA          | Service worker + web app manifest |
| Hosting      | Cloudflare Pages                  |
