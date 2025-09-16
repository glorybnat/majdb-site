# Majd Bnat – Personal Website & Knowledge Hub

![Open Graph default](public/og-default.png)
Fast, minimal, content‑driven site for articles, projects, and professional links. 

Live site: https://majdb.com

## Features

- **App Router (Next.js 15)** with RSC MDX rendering
- **MDX content** for articles & projects (frontmatter: title, description, date, tags, repo, image, draft)
- **Automatic reading time** + date normalization
- **Framer Motion** page + element animation utilities
- **Open Graph & Twitter cards** with per-entry image support (`image` frontmatter) + default fallback
- **Accessible semantic typography** via custom MDX components (tables, code blocks, callouts)
- **Tailwind CSS 4** (next-gen PostCSS pipeline) + minimal global styles
- **Optimized fonts** using `next/font` (Geist Sans & Mono)
- **TypeScript** strict authoring
- **Zero runtime data fetching** for content (filesystem build-time parsing)

## Project Structure

```
content/
	articles/         # MDX posts
	projects/         # MDX project pages
public/
	og-default.png    # Default Open Graph fallback image
src/
	app/              # Next.js App Router routes
		articles/[slug]/ # Dynamic article pages
		projects/[slug]/ # Dynamic project pages
	components/       # UI + animation + MDX components
	lib/mdx.ts        # MDX parsing, frontmatter typing & helpers
	config/site.ts    # Site-wide metadata + links
```

## MDX Frontmatter Schema

```yaml
title: My Post Title
description: Optional short summary
date: 2025-09-16        # YYYY-MM-DD (any parseable date accepted)
tags: [nextjs, mdx]
draft: false             # (optional) exclude from lists
repo: https://github.com/...  # (optional for projects)
external: https://...    # (optional link override)
image: /my-og-image.png  # (1200x630 recommended for social cards)
```

If `image` is omitted a global fallback (`/og-default.png`) is used for Open Graph & Twitter.

## Development

Requirements: Node 18+ (or latest LTS) & npm/pnpm/bun.

```bash
git clone https://github.com/glorybnat/majdb-site.git
cd majdb-site
npm install
npm run dev
```

Open http://localhost:3000

### Quality Commands

```bash
npm run lint       # ESLint
npm run lint:fix   # Fix issues
npm run typecheck  # TypeScript project-wide check
npm run build      # Production build
```

##  Deployment

Recommended: **Vercel** (zero-config for Next.js App Router).

Environment steps:

1. Push to a public GitHub repository.
2. Import repo in Vercel dashboard.
3. Build command: `npm run build` (default) – uses Turbopack.
4. Output: `.next` (automatic).
5. Configure custom domain `majdb.com` (already referenced in `siteConfig`).

