# Deploying Osei-Serwaa to Render

This file describes the minimal steps to deploy this repository to Render using the included `render.yaml`.

Pre-requisites

- A GitHub repository with this code pushed to the `main` branch.
- A Render account.

Quick deploy steps (Create from Repo)

1. In Render, choose "New" → "Web Service" → "Connect a repository" and select this repository.
2. When asked whether to use a `render.yaml`, confirm Render will read it from the repo. The provided `render.yaml` will:
   - Build the frontend with `npm run build`.
   - Run `npm start` to launch the server (`server/index.js`).
3. In the Environment settings for the service, configure the following Environment Variables:
   - `SECRET_KEY` — Required. Paste a strong base64 or hex secret (>=32 bytes recommended). This is used to sign JWTs.
   - `DATABASE_PATH` — Optional. If you want persistent SQLite storage, set this to `/data/database.sqlite` and add a persistent disk in Render (recommended for production). If not set, the app falls back to `./server/database.sqlite`.
   - `NODE_ENV=production` — Render sets this by default; keep it.
4. If you need database persistence across deploys, add a Persistent Disk in the Render service settings and set `DATABASE_PATH` to the disk path (for example `/data/database.sqlite`).

Notes about dependencies

- The repo's root `package.json` runs `npm ci` for root dependencies and includes a `postinstall` script: `cd server && npm ci`. This installs server dependencies into `server/node_modules` automatically when Render (or `npm ci` locally) runs.

Local test commands (PowerShell)

```powershell
# Install dependencies for root and server
npm ci
# Build the frontend
npm run build
# Run server locally with a test secret
$env:SECRET_KEY = "test-secret-for-local"
npm start
```

Security & operations notes

- Do NOT commit your real `SECRET_KEY` to git. Use the Render dashboard to store it.
- Rotating `SECRET_KEY` invalidates all existing JWTs.
- SQLite is fine for demos, but for production use a managed DB (Postgres) or use Render persistent disks.

If you want I can also:

- Add a `render.yaml` disk section to request a persistent disk (requires Render to approve/allocate on creation).
- Help convert the server to Postgres with environment driven connection and migration scripts.
