<div align="center">

# Portfolio

  <p>
    <strong>My private portfolio built in Next.js</strong>
  </p>

  <p>
    <img src="./public/og.png" alt="Portfolio preview" />
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React_19-20232a?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <br />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn/ui" />
  </p>
  <p>
     <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
     <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>
</div>

---

## 🚀 Overview

This is my personal portfolio website with a hero intro, skills showcase, project highlights,
career timeline, and a contact form. The UI leans on bold typography, a grid-driven layout, and
purposeful motion to keep the content focused while still feeling alive. It is structured to be
easy to iterate on, so updating copy or sections stays fast and predictable.

## 🛠️ Local setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/alwoodm/portfolio.git
cd portfolio
pnpm install
```

Copy the env file and fill values:

```bash
cp .env.example .env
```

Start the dev server:

```bash
pnpm dev
```

## 🔐 Environment variables

Set these in `.env`. Start with `PORT=3000` and
`NEXT_PUBLIC_APP_URL=http://localhost:3000` for canonical URLs. Use
`NEXT_PUBLIC_ICONIFY_API_URL=https://api.iconify.design` for Iconify. For the contact form, set
`RESEND_API_KEY=`, `RESEND_FROM_EMAIL=`, and optionally `RESEND_FORWARD_TO=` using
[Resend](https://resend.com). The content update API uses `ADMIN_TOKEN=`.

## 🧰 Development commands

Use `pnpm dev` to start the dev server. Run `pnpm lint` to check ESLint and
`pnpm lint --fix` to auto-fix issues. For formatting, use `pnpm format:check` or
`pnpm format` to write changes. Type checks run with `pnpm tsc --noEmit`, builds with
`pnpm build`, and the production server with `pnpm start`.

## ✍️ Content and contact

Content lives in `data/*.json` and is rendered directly by the pages. You can edit these files
manually or update them via `POST /api/content/<file>` using the `x-admin-token` header.

The contact form posts to `/api/contact` and relies on the `RESEND_*` env vars configured above to
send and optionally forward inbound emails.

## 📄 License

This project is licensed under the terms described in [LICENSE](./LICENSE).
