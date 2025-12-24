# Changelog

## 3: Implement hero page

- Added a circular SVG favicon based on the green logo (`app/icon.svg`), replacing the legacy `.ico`.
- Reworked the home hero layout into a two-column composition with larger typography, a prominent inverted logo mark, and upward positioning.
- Updated `data/home.json` to include name/role content and social links, and wired the hero text + LinkedIn/GitHub buttons to that data.
- Refined the hero copy layout to the “My name is / I am a … and …” structure and tuned social button sizing.
- Split the hero into `HeroText` and `HeroSocial` components for cleaner layout and future animation hooks.
- Added a reusable text-typing animation component under `components/animation/text-type.tsx` and wired the secondary role to animate through `roles`.
- Centered the hero columns and scaled the layout (text block + logo sizing) for a larger, more balanced hero presentation.
- Added the AnimatedContent utility in `components/animation/animated-content.tsx` and aligned it with linting rules for future motion work.
- Added entrance animations to the hero columns using `AnimatedContent` with longer slide/fade timing.
- Sequenced hero animations so the social buttons reveal after the column motion and before the typing loop begins.
- Tuned hero spacing and alignment (name sizing/leading, social gap, and subtle grid-aligned offsets for both columns).
- Swapped the global theme tokens to the Supabase preset and set the primary color to the logo green.
- Simplified the hero text layout and alignment to a clean, responsive stack.
- Reverted the primary font to **Outfit** to restore the original geometric aesthetic.
- Implemented precision optical alignment for the Hero text using a hybrid CSS strategy (`data-letter` attributes + `::first-letter` negative margins).
- Tuned the optical alignment specifically for "A" (-0.005em) and "L" (-0.045em) to perfectly balance the visual weight on the grid.
- Fixed the Dock sizing logic to ensure icons are vertically centered by enforcing a 20px difference between `panelHeight` and `baseItemSize` (e.g., 70px/50px).
- Resolved linting issues in `app/layout.tsx` (unused imports) and `components/hero-text.tsx` (class ordering).

## 2: Setup layout

- Removed unused scaffolded SVG assets from `public/`.
- Added an edge-to-edge responsive grid background driven by CSS variables.
- Restored light/dark theme tokens and synced the grid colors to the active theme.
- Matched the header height to 72px to align the hero layout with `min-h-[calc(100vh-72px)]`.
- Moved page content into JSON data files (`data/home.json`, `data/about.json`, `data/contact.json`, `data/projects.json`, `data/skills.json`) and wired pages to read them.
- Added About, Projects, Skills, and Contact pages with minimal layouts driven by JSON content.
- Replaced the theme dropdown with a fixed, animated round toggle button.
- Replaced the grid background implementation with a reusable component and larger grid size; added an optional fade overlay.
- Added the Dock component and fixed lint issues (renamed to `components/dock.tsx`, updated imports, prop typing, and dependencies).
- Added a floating top navigation dock, aligned tooltips for top placement, and synced dock colors with the active theme.
- Tuned responsive sizing for the dock and theme toggle, and corrected the home hero height to avoid mobile scroll.
- Ensured `public/` is tracked in git via `public/.gitkeep` to fix Docker copy in CI.

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
