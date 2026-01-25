# Development Guide

## Prerequisites

- Node.js 20+
- npm

## Local Development

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:4321 in your browser.

### Build for Production

```bash
npm run build
```

Static files will be generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── public/
│   ├── icons/          # Favicons and logos
│   ├── images/         # Project and blog images
│   ├── styles/         # CSS files
│   └── scripts/        # JavaScript files
├── src/
│   ├── content/
│   │   └── blog/       # Blog posts (Markdown)
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Main layout
│   │   └── BlogLayout.astro    # Blog post layout
│   └── pages/
│       ├── index.astro         # Homepage
│       ├── projects.astro      # Projects portfolio
│       ├── team.astro          # Team page
│       ├── consulting.astro    # AI Consulting page
│       ├── products/           # Product pages
│       └── blog/               # Blog pages
├── .github/
│   └── workflows/
│       └── ci.yaml     # GitHub Pages deployment
├── astro.config.mjs
└── package.json
```

## Adding Blog Posts

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description"
pubDate: 2024-12-20
author: "Manaira Labs"
tags: ["AI", "Technology"]
heroImage: "/images/blog/your-image.jpg"
category: "Insights"
---

Your content here...
```

To save as draft (not published), add `draft: true` to frontmatter.

## Deployment

The site is automatically deployed to GitHub Pages on push to `main`.

The GitHub Actions workflow (`.github/workflows/ci.yaml`):
1. Installs dependencies
2. Builds the Astro site
3. Deploys to GitHub Pages

No secrets required - uses GitHub's built-in Pages permissions.
