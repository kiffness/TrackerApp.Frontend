# TrackerApp Frontend

A personal tracking app for monitoring blood pressure readings and scratch card spending/winnings. Built with React 19, TypeScript, and Material UI.

## Features

- **Blood pressure tracking** — log and view systolic, diastolic, and pulse readings
- **Scratch card tracking** — record cards by denomination (£1, £2, £3, £5) with winnings; view the full history
- **Scratch card summary** — aggregated totals by day, week, month, year, or all time
- **Scratch card reports** — period toggle (week/month/year/all time) with a drill-down breakdown by card value
- **JWT authentication** — login with username and password; token stored as an HttpOnly cookie

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TypeScript |
| Build Tool | Vite |
| UI | Material UI (MUI) v6 |
| Routing | React Router v7 |
| HTTP | Axios |
| Deployment | Docker + Nginx |

## Pages

| Path | Description |
|---|---|
| `/login` | Login form |
| `/blood-pressure` | List, add, and delete blood pressure readings |
| `/scratch-cards` | List, add, and delete scratch card entries |
| `/scratch-cards/summary` | Aggregated totals with period selector |
| `/scratch-cards/reports` | Full report with per-value breakdown table |

## Running Locally

**Prerequisites:** Node.js 22+, backend API running on `http://localhost:5000`

```bash
npm install
npm run dev
```

The Vite dev server starts on `http://localhost:5173`. All `/api` requests are proxied to `http://localhost:5000` so cookies work without any CORS issues.

## Running with Docker

```bash
docker build -t trackerapp-frontend .
docker run -p 80:80 trackerapp-frontend
```

The production build is served by Nginx on port 80. All routes fall back to `index.html` for client-side routing.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for the API (defaults to empty, relying on the Vite proxy in dev) |
