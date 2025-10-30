# Deploying to Vercel (Static, Zero-Config)

This project is a static web app. The deploy root is the `cadott-wrestling-attendance/public` folder, which contains `index.html`, `season-stats.html`, and all assets.

## One-time setup (GitHub import)

1. Push your latest changes to GitHub (main).
2. Open https://vercel.com/new and click "Import Git Repository".
3. Select this repository, then on the Configure Project screen set:
   - Root Directory: `cadott-wrestling-attendance/public`
   - Framework Preset: `Other`
   - Build Command: leave empty
   - Output Directory: leave empty
   - Environment Variables: none
4. Click Deploy.

Your site will be available at `https://<project>.vercel.app/`.

## Verify pages

- `/` (main check-in UI)
- `/season-stats.html`
- `/go-live.html`

## Notes

- Google Sheets is fetched client-side, so no server is required.
- Favicon and PWA icons point to `logo.png` to avoid 404s.
- If you want pretty URLs (no `.html`), we can add a simple rewrite later; for now, linking directly to `*.html` is simplest.

## Optional: Custom domain

1. In your Vercel project, open Settings → Domains.
2. Add your custom domain and follow Vercel's DNS instructions.

## Optional: Automatic production deploys on push

- In Vercel → Project Settings → Git, ensure "Production Branch" is `main` and auto-deploys are enabled.
- Every push to `main` will trigger a Production deployment.
