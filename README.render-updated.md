# Deploying Osei-Serwaa to Render (Updated)

This document provides explicit, copy-paste friendly steps to deploy this repository to Render, configure environment variables, and persist a SQLite database using a Render persistent disk.

Prerequisites

- A GitHub repository with this code pushed to the `main` branch.
- A Render account.

Quick deploy checklist

1. In Render: New → Web Service → Connect a repository → select this repo (branch `main`).
2. Confirm Render will use `render.yaml` in the repo (or add one like the example below).
3. Configure Environment Variables in the service (Service → Environment → Environment Variables):
   - `SECRET_KEY` — Required. Store this as a secret in Render. Use a cryptographically strong value (e.g. `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`).
   - `DATABASE_PATH` — Optional for ephemeral setups; required if you want persistence. Set to the absolute path on the persistent disk (example: `/data/database.sqlite`).
   - `NODE_ENV=production` — Render usually sets this automatically.
4. Add a Persistent Disk (Service → Disks → Add Disk) to the service and mount it at `/data` (or your chosen path). Then set `DATABASE_PATH` to `/data/database.sqlite`.

How to add env vars and a secret in the Render UI

- Open the service → "Environment" tab → "Environment Variables" → "Add Environment Variable".
- Enter `SECRET_KEY` as the key, choose the option to save it as a secret (not plain text), and paste the value.
- Add `DATABASE_PATH` with value `/data/database.sqlite` (or another absolute path inside the mounted disk).

Why this matters

- The server now resolves `DATABASE_PATH` relative to the server code when a relative path is supplied. However, Render's default filesystem is ephemeral—data written there can disappear on deploys or restarts. A mounted persistent disk ensures the SQLite file remains across deploys.

Example `render.yaml` (service + disk)

Below is a simple, ready-to-adapt `render.yaml`. After creating the service from this repo, attach the persistent disk in the Render UI (Disks tab) and add `SECRET_KEY` using the UI secrets form.

```yaml
services:
  - type: web
    name: osei-serwaa-web
    env: node
    branch: main
    plan: free
    buildCommand: npm ci && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SECRET_KEY
        fromSecret: SECRET_KEY
      - key: DATABASE_PATH
        value: /data/database.sqlite

disks:
  - name: db-data
    sizeGB: 10
```

Notes & verification

- After a successful deploy, open the service logs and look for a message like:

```
Connected to the SQLite database at /data/database.sqlite
```

- If you see an error creating/opening the DB path, ensure the disk is attached and the path in `DATABASE_PATH` is correct and writable.

Local development (PowerShell)

```powershell
# Install dependencies for root and server
npm ci
# Build the frontend
npm run build
# Run server locally with a test secret
$env:SECRET_KEY = "test-secret-for-local"
npm start
```

Recommendations

- For production, prefer a managed database (Postgres) instead of SQLite. I can help add Postgres support and migrations.
- Don't commit `SECRET_KEY` to git. Use Render secrets.
- If the app will store images or large blobs, consider object storage rather than storing binary data in SQLite.

Next steps I can take

- Replace `README.render.md` with this updated file (if you approve).
- Add a committed `render.yaml` matching your Render account preferences.
- Implement Postgres support and migration scripts.
