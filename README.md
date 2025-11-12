# VeeHub — Online Vehicle Sales System (Prototype)

This repository contains a MERN-stack prototype for VeeHub: an online vehicle sales platform with buyer and seller roles. It implements the requested features as a working prototype including search & filters, gallery + 360° viewer, comparison, trade-in valuation, quick listing wizard, and market-driven pricing suggestion.

This README includes setup and run instructions.

## Structure
- backend/ — Express + MongoDB API
- frontend/ — React prototype UI

## Prerequisites
- Node.js >= 16
- npm or yarn
- MongoDB running locally (or MongoDB Atlas)

## Backend setup
1. Open a terminal in `backend/`.
2. Copy `.env.example` to `.env` and set values (MONGO_URI, JWT_SECRET, PORT).
3. Install packages:

```bash
cd backend
npm install
```

4. Seed sample data (optional):

```bash
node seed.js
```

5. Start server:

```bash
npm run dev   # uses nodemon if installed, or
node server.js
```

API will run at http://localhost:5000 by default.

## Frontend setup
1. Open a terminal in `frontend/`.
2. Install packages:

```bash
cd frontend
npm install
npm start
```

The React app runs at http://localhost:3000 and talks to the backend at http://localhost:5000 (CORS enabled).

## Notes
- This is a prototype intended to demonstrate functionality. For production use you should add stronger validation, file storage (S3), rate limiting, deeper market analytics, and tests.
