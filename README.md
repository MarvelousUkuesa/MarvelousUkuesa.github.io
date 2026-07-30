# Portfolio

Modular Next.js portfolio for **GitHub work** + **blog writing**.
Content, sections, and motion stay separate so changes don’t cascade.

## Architecture

```
content/                  → data (projects.json, blog/*.md)
src/lib/schemas/          → Zod contracts (Project, Post)
src/lib/content/          → adapters (normalize sources → schemas)
src/lib/github.ts         → optional GitHub enrichment
src/components/sections/  → page sections (one job each)
src/components/motion/    → FadeIn, Stagger only
src/app/                  → routes
```

### Project schema

| Field | Notes |
|--------|--------|
| `id` | Stable id (used by blog `relatedProjectId`) |
| `title`, `description` | Display copy |
| `tech[]` | Tags |
| `repoUrl`, `demoUrl` | Links |
| `image?` | Optional image path/URL |
| `featured` | Shows on homepage |
| `githubRepo?` | Repo name for API enrichment |

### Blog frontmatter

| Field | Notes |
|--------|--------|
| `title`, `date`, `summary` | Required |
| `tags[]` | Optional |
| `relatedProjectId?` | Links to a project `id` |
| `draft` | Hidden when `true` |

### Page outline

1. **Home** — Hero → Featured work → Latest posts  
2. **`/work`** — All curated projects  
3. **`/blog`** — Post list  
4. **`/blog/[slug]`** — Post + optional related project  

## Setup

```bash
# If node isn't on PATH yet (local install used during scaffold):
export PATH="$HOME/.local/node/bin:$PATH"

cp .env.example .env.local
# Set NEXT_PUBLIC_GITHUB_USER and update src/content/site.ts
# Optionally set NEXT_PUBLIC_API_URL after deploying ~/portfolio-api

npm install
npm run dev
```

## Backend (separate repo)

Infrastructure lives in **`~/portfolio-api`** (AWS CDK) — not in this folder.
Deploy that stack, copy `ApiUrl` into `NEXT_PUBLIC_API_URL`, and the Work section will read from DynamoDB via API Gateway. Without that env var, local `content/projects.json` is used.

## Day-to-day edits

- **New project:** add an entry in `content/projects.json`
- **New post:** add `content/blog/your-slug.md`
- **Identity / links:** `src/content/site.ts`
- **Look & feel:** CSS variables in `src/app/globals.css`
- **Motion:** `src/components/motion/*` only

## Note

Git init may require Xcode Command Line Tools on this Mac (`xcode-select --install`).
Node was installed to `~/.local/node` for scaffolding — add it to your shell PATH or install Node via your preferred method.
