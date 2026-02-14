# Changelog

## [Unreleased]
### Added
- Added a /health endpoint that returns {"ok":true} for service health checks. [paths] server/routes.ts

### VERIFY
- Run: `curl -s http://localhost:5000/health | jq .` and confirm `{ "ok": true }`.

### UNDO
- Remove the `/health` route from `server/routes.ts`.
