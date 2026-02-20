# DevLog

A web app for developers to track daily work, ideas, and notes. React frontend + Node/Express backend (no database).

## Tech

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Lucide, date-fns
- **Backend:** Node.js, Express, Helmet, express-rate-limit, express-validator
- **Storage:** In-memory (no DB); replaceable for future DB/features

## Get started

- Node 18+
- `npm install`
- `npm run dev` — starts API (port 3000) and client (port 5173)
- Open http://localhost:5173

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | API + frontend |
| `npm run dev:server` | API only |
| `npm run dev:client` | Frontend only |
| `npm run build` | Build frontend |
| `npm run start` | Production API |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run security:check` | `npm audit` (moderate+) |

## Structure

- `server/` — Express API (config, routes, middleware, utils)
- `src/` — React app (components, context, pages, utils)

## Security

Input validation/sanitization, rate limiting, Helmet headers, CSP, secure IDs. Run `npm audit` and `npm run security:check` regularly.

## Deploy to Render

1. Push the repo to GitHub and connect it in [Render](https://render.com).
2. New Web Service → use the repo; Render will use `render.yaml` if present.
3. Or manually: **Build** `npm install && npm run build`, **Start** `npm start`.
4. Set **CORS_ORIGIN** to your service URL (e.g. `https://your-app.onrender.com`) if you need CORS.

One service serves both the API and the built frontend. Data is in-memory (resets on deploy/sleep).

## License

MIT.
