## FGSM Demo App (Client)

A minimal Next.js UI for visualizing FGSM adversarial attacks. It talks to a backend (FastAPI expected) for model inference.

## Requirements

Environment variables:

- `NEXT_PUBLIC_API_URL` (required): Base URL of the attack backend (e.g. `https://your-api.example.com`). Falls back to `http://localhost:8000` in development.
- `NEXT_PEXELS_API_KEY` (optional, server runtime): Enables the gallery picker via the built-in `/api/pexels` route.

## Develop

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build & Run (Production)

```bash
npm run build
npm start
```

## Notes

- Images are allowed only from `images.pexels.com` via Next image config.
- Gallery fetching is encapsulated in `src/lib/api.js` (`getGalleryItems`).
- Attack submission is handled via `postAttack` in `src/lib/api.js`.
