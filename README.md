# KG Robotics Web (Astro)

Push-camera site for **Rapido Pro** / **Rapido** family (30, 60, 90 m).

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:4321/

## GitHub Pages (public URL)

**Site (after deploy):** https://cesargomez1970.github.io/KG-Robotics-Web-Push-Cam/

Deploys run on push to **`main`** via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Develop on `KG-Robotics-Push-cam`, then merge into `main` to publish.

### One-time enable (repository owner)

1. Open [Repository Settings → Pages](https://github.com/cesargomez1970/KG-Robotics-Web-Push-Cam/settings/pages).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `KG-Robotics-Push-cam` or run **Deploy to GitHub Pages** manually under Actions.

If deploy fails with `Failed to create deployment (status: 404)`, Pages is not enabled yet (step 2).

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable baseline (merge via PR) |
| `KG-Robotics-Push-cam` | Active push-cam site + GitHub Pages deploy |
