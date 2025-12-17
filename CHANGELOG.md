# Changelog

## setup-project & basic configuration

- Scaffolded the app with `pnpm create next-app`, selecting the App Router, TypeScript, ESLint, Tailwind CSS 4 (`@tailwindcss/postcss`), and React 19 on Next.js 16.
- Bootstrapped the initial shell: `app/layout.tsx` (Geist fonts/metadata), `app/globals.css` (theme tokens + Tailwind), and `app/page.tsx` (starter hero with light/dark).
- Added root configs for builds and tooling (`next.config.ts`, `tsconfig.json` with `@/*` alias, `postcss.config.mjs`, `eslint.config.mjs`) plus workspace and lock files (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).
- Included scaffolded assets (`public/next.svg`, `public/vercel.svg`, `app/favicon.ico`) for initial branding and testing.
- Installed quality tooling (Prettier + Tailwind class sorter) and ESLint plugins for React, hooks, a11y, imports, unused imports, SonarJS, and Unicorn; added Husky/lint-staged deps and wired SonarJS/Unicorn/import hygiene/unused-import rules with Prettier checks into `eslint.config.mjs`.
- Replaced legacy config with strict ESLint flat config (Next core-web-vitals + compat for recommended React/TS/Prettier, direct SonarJS/Unicorn recommended) and a Prettier config (`.prettierrc`); formatted code and sorted JSX props to satisfy new rules.
- Added Prettier scripts: `pnpm format` (write) and `pnpm format:check` (verify) for consistent formatting runs.
