# Multiage Technologies (Vite + React)

## Backend (single source of truth)

All API code lives in **`server/`** (Express + Mongoose). Entry file: `server/index.js`.

| Command | What it runs |
|--------|----------------|
| `npm run server` | API only (`server/`) |
| `npm run dev` | API + Vite client together |
| `npm start` | API production (`server/`) |

Configure environment in **`server/.env`** (copy from `server/.env.example`). The frontend reads **`VITE_API_BASE_URL`** from `multiage_v2/.env` (see `.env.example`).

There is **no** second backend at the `multiage_v2` root; avoid duplicating Express apps.
