# Trikonet Frontend

The modern, responsive web application for [Trikonet](https://trikonet.com) — the premier healthcare, engineering, and professional career portal in the UAE.

## Architecture

- **Platform**: Vanilla ES Modules, CSS, HTML5 SPA.
- **Backend API**: Connected to `https://api.trikonet.com` (configured in `config.js`).
- **Git Repository**: [medbiomate/trikonet](https://github.com/medbiomate/trikonet)

## Development

Run the frontend locally:

```bash
npm run dev
```

Opens at `http://localhost:3000`. When running locally, all API calls automatically point to the local backend server (`http://127.0.0.1:4173`) or can be customized via `window.TRIKONET_API_BASE`.

In production (e.g. `https://trikonet.com`), API calls route to `https://api.trikonet.com`.

## SEO Job Pages

Pages → SEO Job Pages uses the backend's durable SEO registry. Register a main
category page here, or choose its category in the existing Pages editor. Location
pages qualify at 10 active jobs. The editor supports status, Index/Noindex,
management mode, metadata and content overrides without changing the admin design.

Run the Node web server for server-rendered SEO tags and real draft HTTP 404s.
`TRIKONET_API_BASE` configures its backend (default `https://api.trikonet.com`).
The sitemap index references `/sitemap-seo-job-pages.xml`, which proxies the
current backend sitemap. A static-only host cannot enforce these server routes.
Run `npm run test:seo` to verify rendering, metadata, Noindex and draft responses.

## Deployment

This directory contains the production-ready static website bundle:
- Can be uploaded directly to Hostinger's `public_html` directory for `trikonet.com`.
- Or deployed to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
