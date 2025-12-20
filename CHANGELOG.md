# Changelog

## 2: Setup layout

- Removed unused scaffolded SVG assets from `public/`.
- Added an edge-to-edge responsive grid background driven by CSS variables.
- Restored light/dark theme tokens and synced the grid colors to the active theme.
- Matched the header height to 72px to align the hero layout with `min-h-[calc(100vh-72px)]`.
- Moved page content into JSON data files (`data/home.json`, `data/about.json`, `data/contact.json`, `data/projects.json`, `data/skills.json`) and wired pages to read them.
- Added About, Projects, Skills, and Contact pages with minimal layouts driven by JSON content.
- Replaced the theme dropdown with a fixed, animated round toggle button.
- Replaced the grid background implementation with a reusable component and larger grid size; added an optional fade overlay.

## 1: Setup project & Basic configuration

- Scaffolded the app with `pnpm create next-app`, selecting the App Router, TypeScript, ESLint, Tailwind CSS 4 (`@tailwindcss/postcss`), and React 19 on Next.js 16.
- Bootstrapped the initial shell: `app/layout.tsx` (Geist fonts/metadata), `app/globals.css` (theme tokens + Tailwind), and `app/page.tsx` (starter hero with light/dark).
- Added root configs for builds and tooling (`next.config.ts`, `tsconfig.json` with `@/*` alias, `postcss.config.mjs`, `eslint.config.mjs`) plus workspace and lock files (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).
- Included scaffolded assets (`public/next.svg`, `public/vercel.svg`, `app/favicon.ico`) for initial branding and testing.
- Installed quality tooling (Prettier + Tailwind class sorter) and ESLint plugins for React, hooks, a11y, imports, unused imports, SonarJS, and Unicorn; added Husky/lint-staged deps and wired SonarJS/Unicorn/import hygiene/unused-import rules with Prettier checks into `eslint.config.mjs`.
- Replaced legacy config with strict ESLint flat config (Next core-web-vitals + compat for recommended React/TS/Prettier, direct SonarJS/Unicorn recommended) and a Prettier config (`.prettierrc`); formatted code and sorted JSX props to satisfy new rules.
- Added Prettier scripts: `pnpm format` (write) and `pnpm format:check` (verify) for consistent formatting runs.
- Initialized Husky pre-commit to run `pnpm tsc --noEmit` then `npx lint-staged`; lint-staged now checks (no auto-fix) using `eslint --max-warnings=0` and `prettier --check` on staged JS/TS/MD/CSS/JSON to block commits when issues exist.
- Initialized shadcn/ui for Tailwind v4 + Next.js/React 19 (`components.json`, `lib/utils.ts`) and installed all UI components/hooks via `pnpm dlx shadcn@latest add --all`, pulling in Radix UI, form, chart, and utility dependencies.
- Added shadcn components under `components/ui/` and `hooks/use-mobile.ts`, updated `app/globals.css` with shadcn tokens, and relaxed ESLint rules for generated UI files to keep lint/format checks passing.
- Added theme support: installed `next-themes`, created `components/theme-provider.tsx`, and applied the shadcn Vercel theme (`pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/vercel.json`) updating `app/globals.css` tokens.
- Implemented header theme toggle (`components/theme-toggle.tsx`) and updated layout/page: theme-aware shell with header, cleaned hero copy in `app/page.tsx`, and lint-compliant import/prop ordering in `app/layout.tsx`.
- Added containerization: multi-stage `Dockerfile`, `docker-compose.yml` with env-file support, `.dockerignore`, and sample `.env`/`.env.example` (`PORT`, `NEXT_PUBLIC_APP_URL`) for repeatable builds and deploys.
- Added GitHub Actions CI to run pnpm install, lint, format check, type check, and Docker build on pushes/PRs to `setup-project`.
- Replaced README with a concise project guide (name, description, run/lint/format/type-check commands, Docker usage, tech stack, license).
