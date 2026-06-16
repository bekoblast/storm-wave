# StormView — Interactive Product Site

A dark, cinematic single-page website for **StormView** smart solar 4G security cameras.
Built as an immersive, scroll-driven product experience (think gadget-launch page) for the
UAE / Saudi / GCC market.

## Stack

- **Astro 5** — static single-page site
- **Tailwind CSS v4** — styling (via `@tailwindcss/vite`)
- **GSAP + ScrollTrigger** — scroll-driven reveals & animation
- **Lenis** — smooth scrolling

## Project structure

```
storm-view-website/
├── site/                 # the Astro app (build from here)
│   ├── public/images/    # site images
│   └── src/
│       ├── layouts/      # Base layout + section components
│       ├── pages/        # index.astro (assembles sections)
│       ├── scripts/      # GSAP/Lenis interactions
│       └── styles/       # global.css design system
├── products/             # source: per-model details + photos
└── _source-assets/       # original brand profile, spec sheet, logo
```

## Develop

```bash
cd site
npm install
npm run dev      # http://localhost:4321
```

## Build

```bash
cd site
npm run build    # outputs to site/dist
npm run preview  # preview the production build
```

## Deploy

Static output. Point your host (Cloudflare Pages / Netlify) at the **`site/`** subdirectory:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Root / base directory:** `site`

## Contact

info@stormview.online · +971 52 362 0668 · Dubai, UAE
