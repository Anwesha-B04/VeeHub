# VeeHub — Online Vehicle Marketplace (Prototype)

This repository contains a MERN-stack prototype for VeeHub — a buyer/seller vehicle marketplace. It includes a React (Vite) frontend and an Express + Mongoose backend. The project demonstrates the following features and flows:

- Advanced search & filters (make, model, year, price ranges, mileage, fuel type, sorting)
- Listing pages with image galleries and 360° viewer support
- Compare up to 3 vehicles side-by-side
- Trade-in valuation calculator
- Quick listing wizard for sellers (multi-step form + image uploads)
- Market-driven price suggestions
- Authentication (buyer / seller) with JWT
- Admin / seller dashboard basics and listing management

This README explains how to run the app locally, seed demo data, and deploy (Netlify + Render). Replace any placeholder URLs below with your actual deployed links.

---

## Tech stack

- Frontend: React (Vite), React Router, Tailwind (CDN staged), plain CSS fallback
- Backend: Node.js, Express, Mongoose (MongoDB)
- DB: MongoDB (Atlas recommended)
- Hosting / Deployment: Netlify (frontend) + Render (backend)

## Repository layout

- `backend/` — Express API, Mongoose models, `seed.js` for demo data
- `frontend/` — Vite + React app, `public/` contains favicon & static assets

---

## Prerequisites (local)

- Node.js (>=16)
- npm (or yarn)
- MongoDB (local) or MongoDB Atlas (connection string)

---

## Environment variables

Backend (`backend/.env`)
- MONGO_URI — MongoDB connection string (required)
- JWT_SECRET — secret used to sign auth tokens (required)
- PORT — optional (default 5000)
- (optional) ALLOWED_ORIGINS — comma-separated list of allowed origins for CORS

Frontend (`frontend/.env`)
- VITE_API_BASE — full API base including `/api`, e.g. `https://your-backend.onrender.com/api`

Note: Vite picks up `VITE_*` env vars at build time. Make sure Netlify build env includes `VITE_API_BASE`.

---

## Running locally (recommended flow)

1) Backend

```bash
cd backend
npm install
# create .env from .env.example and set MONGO_URI + JWT_SECRET
node seed.js   # optional: clears & inserts demo listings/users
PORT=5001 npm run dev   # or: PORT=5001 node server.js
```

The API serves routes under `/api` (e.g. `http://localhost:5001/api/auth/login`). The server also serves uploaded images at `/uploads`.

2) Frontend

```bash
cd frontend
npm install
# set VITE_API_BASE in frontend/.env (e.g. VITE_API_BASE=http://localhost:5001/api)
npm run dev
```

Vite will run a dev server (usually at http://localhost:5173). Open the app and test flows (sign up, sign in, browse, filters, compare).

3) Quick production build test (optional)

```bash
cd frontend
npm run build
# serve the built site (optional)
npx serve -s dist -l 5000
```

---

## Seeding & demo data

- `backend/seed.js` creates demo users and 3 sample listings (it clears existing listings). Run it locally before testing the deployed app if you want consistent demo content.
- If you deployed earlier and used MongoDB Atlas, be careful: running `seed.js` against Atlas may overwrite data.

## Deployment notes (Netlify + Render)

Frontend (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variable: `VITE_API_BASE=https://<your-render-service>.onrender.com/api`
- If you see stale CSS or favicon, use Netlify's "Clear cache and deploy site" option or push a new commit.

Backend (Render)
- Service root: `backend`
- Start command: `npm start` (server.js uses process.env.PORT)
- Add required env vars: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, and optionally `ALLOWED_ORIGINS` (Netlify site URL)

Cross-checks after deploy
- DevTools → Network: auth requests (POST /api/auth/login) must go to your Render URL (not localhost or another service)
- Ensure uploads are served from your backend or use Cloudinary for persistent public hosting of images

---

## Styling notes and Tailwind

- This project used a staged Tailwind conversion (CDN-based) so you can iterate quickly without changing the build. The CDN snippet and a small Tailwind config are present in `frontend/index.html`.
- For production (smaller CSS) consider migrating to the PostCSS Tailwind build (npm package) and adding `content` paths to purge unused CSS.

---

## Features (summary)

- User accounts (buyer, seller) with JWT auth
- Create / edit / view listings with images
- Search + filters including preset price ranges (min/max wired to backend)
- Listing cards with responsive grid and image previews
- Listing detail page with gallery and thumbnails
- Compare vehicles (2–3) with side-by-side specs
- Trade-in calculator and market price suggestions (server-side endpoints)
- Seller quick-listing wizard (multi-step form)

---

## Common troubleshooting

- If sign-in/register fail locally, check `frontend/.env` → `VITE_API_BASE` points to the running backend (include `/api`). Port conflicts (macOS services) may occupy 5000; start backend on another port and update `VITE_API_BASE`.
- If Tailwind styles seem missing, ensure the CDN snippet in `frontend/index.html` is present in deployed HTML, or migrate to a Tailwind build.
- Favicon stale: browsers cache favicons aggressively. Hard refresh or open in an incognito window. If needed, add `public/favicon.ico` for maximum compatibility.

---

## Where to update deployed links

Replace the placeholders below with your real deployment URLs so readers can open the live demo:

- Frontend (Netlify): https://veehub.netlify.app/
- Backend (Render): https://veehub.onrender.com/

---

## Next steps / recommended improvements

- Migrate Tailwind to a build-time setup and remove unused CSS
- Add persistent image storage (Cloudinary or S3) for uploaded images
- Add unit/integration tests for critical API endpoints
- Harden auth flows (email verification, password reset), and add rate limiting

---


