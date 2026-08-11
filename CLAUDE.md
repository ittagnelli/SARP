# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SARP (Scuola Agnelli Resource Planning) is a school management system for [Istituto Agnelli (TO)](https://agnelli.it/). It is a SvelteKit full-stack web app (Svelte 3, Node.js adapter) backed by SQLite via Prisma ORM.

## Commands

```bash
npm run dev        # generate RBAC policy then start dev server
npm run build      # generate RBAC policy then production build (outputs to SARP_BUILD/)
npm run preview    # preview production build
npm run check      # svelte-kit sync + svelte-check type checking
npm run lint       # prettier + eslint check
npm run format     # prettier auto-format
npm run policy     # regenerate RBAC policy.js from policy YAML (run before dev/build)
npx prisma migrate dev   # apply DB migrations
npx prisma db seed       # seed DB via utils/scripts/seed_db.js
npx prisma studio        # open Prisma DB GUI
npx playwright test      # run E2E tests
```

## Architecture

### Request lifecycle

1. `src/hooks.server.js` — validates the `session` cookie against the `Session` table on every request and populates `event.locals.session` with the authenticated user and their roles.
2. `src/routes/+layout.server.js` — passes `session` and app `version` down to all pages.
3. Each route's `+page.server.js` — calls `check_auth()` from `$js/helper.js` which uses `RBAC` to enforce access control before running the load function or form actions.

### Core utilities (`src/js/`)

| File | Purpose |
|------|---------|
| `rbac.js` | Singleton `RBAC` class — checks `policy.js` to decide if a role can perform an action on a resource |
| `policy.js` | **Auto-generated** by `utils/scripts/policy_generate.js` from YAML sources — never edit by hand |
| `helper.js` | `check_auth()`, date converters, redirect helpers, shared logic used across all routes |
| `logger.js` | Pino-based logger (works both server and browser side) |
| `audit.js` | Audit trail writes (separate log file) |
| `prisma_db.js` | Shared Prisma client singleton |
| `store.js` | Svelte writable stores for global UI state (modal messages, etc.) |

The `$js` alias (defined in `svelte.config.js`) maps to `./src/js`.

### Modules (`src/routes/`)

| Route | Feature |
|-------|---------|
| `pcto/` | PCTO internship management — companies, student attendance, evaluations |
| `pdp/` | Individualized Education Plans (PDP/BES) — diagnostic grids, DOCX generation |
| `programmazione/` | Annual lesson planning — class programs, DOCX/PDF generation |
| `sicurezza_sul_lavoro/` | Workplace safety courses, online quizzes, test scoring |
| `support/` | Google OAuth login, user management, class management, tickets |
| `tools/` | PDF/document utilities |
| `documentazione/` | Markdown-based dynamic documentation pages (via mdsvex) |

### Database

SQLite at `prisma/SARP.db`. Schema defined in `prisma/schema.prisma` (~35 models). Migrations are in `prisma/migrations/`.

### Document generation

DOCX output (PDP, programmazione annuale, etc.) is produced server-side using `docxtemplater` + `pizzip` with templates stored in `server_static/pdp_templates/` and `server_static/programmazione_annuale_template/`.

### Authentication & Authorization

- **Auth:** Google OAuth (via `google-auth-library`). On login, a `Session` row is created and a `session` cookie is set.
- **RBAC:** Roles are stored in `ruolo_Utente` table. The `RBAC` singleton reads from the generated `policy.js`. To change permissions, update the policy YAML sources and run `npm run policy`.
- **CSP:** Configured in `svelte.config.js` — `connect-src` is restricted to `self`, `localhost`, and `https://sarp.agnelli.it`.

## Environment

The app requires a `.env` file. Key variables:
- `DATABASE_URL` — path to SQLite file
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth credentials
- `SESSION_TIMEOUT` — session TTL in ms (default 14400000 = 4h)
- `PUBLIC_ADMIN_ROLE` — role name with admin privileges
- Template directory paths for DOCX generation
