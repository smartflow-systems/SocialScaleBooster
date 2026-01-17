# SocialScaleBooster — Replit Baseline

**Baseline commit:** 00f43e2
**Node:** v20.20.0  
**npm:** 10.8.2

## What was fixed
- Replit workflow runs dev on **PORT=5000** and waits for port 5000 (see [.replit])
- Express: `trust proxy` enabled (fixes rate-limit + X-Forwarded-For)
- Vite dev middleware paths use `process.cwd()` (no undefined dirname)
- Tailwind pinned to **v3** (matches shadcn-style tokens like `border-border`)
- PostCSS uses `tailwindcss` + `autoprefixer`
- Installed required Tailwind plugins: `tailwindcss-animate`, `@tailwindcss/typography`
- Clean repo hygiene: ignore backups + scratch assets

## Run / Verify
- Local:  http://127.0.0.1:5000/
- Public: https://fc7a814a-8a6d-4484-95ae-46e6d49a65c9-00-1lro2zxxe703q.worf.replit.dev/

### Health (headers)
```
curl -I -m 5 http://127.0.0.1:5000/ | head -n 5
curl -I -m 8 "https://fc7a814a-8a6d-4484-95ae-46e6d49a65c9-00-1lro2zxxe703q.worf.replit.dev/" | head -n 8
```

## Key files
- [.replit]
- [server/index.ts]
- [server/vite.ts]
- [vite.config.ts]
- [postcss.config.js]
- [tailwind.config.ts]
