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

## Deployment

This directory contains the production-ready static website bundle:
- Can be uploaded directly to Hostinger's `public_html` directory for `trikonet.com`.
- Or deployed to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.