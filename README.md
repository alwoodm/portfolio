<div align="center">

# Portfolio

  <p>
    <strong>My private portfolio build in Next.js</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/status-in%20development-orange?style=flat-square" alt="Status" />
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square&label=License&color=blue" alt="License" />
  </p>

<h3>Tech Stack</h3>
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

This is a modern portfolio scaffold designed for speed and scalability. It leverages the bleeding edge of the React ecosystem, utilizing **Next.js 16** and **React 19** features, styled with the new **Tailwind CSS v4** engine and **shadcn/ui** components. Theme management is handled seamlessly via `next-themes`.

## 🛠️ Run Locally

Clone the project and install the dependencies to get started.

### Prerequisites

Make sure you have `pnpm` installed.

### Development Commands

| Action         | Command             | Description                              |
| :------------- | :------------------ | :--------------------------------------- |
| **Install**    | `pnpm install`      | Install all dependencies                 |
| **Dev Server** | `pnpm dev`          | Starts server at `http://localhost:3000` |
| **Lint**       | `pnpm lint`         | Runs ESLint                              |
| **Format**     | `pnpm format:check` | Checks code formatting                   |
| **Type Check** | `pnpm tsc --noEmit` | Validates TypeScript types               |

### 🐳 Docker Support

To run the production build inside a Docker container, modify .env as needed by copying the example file:

```bash
cp .env.example .env
```

Then build and run with Docker Compose:

```bash
docker compose up --build
```

The `data/` directory is mounted into the container so content updates persist across restarts.
The container startup also runs `node scripts/generate-admin-token.mjs --if-missing` to ensure
`ADMIN_TOKEN` exists in `.env`.
The entrypoint also normalizes ownership of `/app/data` and `/app/.env` so runtime writes succeed.

### 🔐 Admin Token (Content Updates)

Generate a strong admin token for content update requests:

```bash
node scripts/generate-admin-token.mjs
```

This creates or updates `.env` with `ADMIN_TOKEN=...`. Use the token as the `x-admin-token` header when making `POST /api/content/<file>` requests.
