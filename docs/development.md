# Development Guide

## Prerequisites

- Node.js 20+
- npm
- Docker (optional, for container builds)

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

## Docker

### Build Image

```bash
docker build -t manaira/website .
```

### Run Container

```bash
docker run -p 3000:80 manaira/website
```

Or using docker-compose:

```bash
docker compose up -d
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
│       └── ci.yaml     # CI/CD pipeline
├── Dockerfile
├── docker-compose.yaml
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

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yaml`) automatically:

1. Builds the Docker image on push to `main`
2. Pushes to Docker Hub (`docker.io/manaira/website`)
3. Deploys to production server via SSH

### Required Secrets

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token
- `DEPLOY_HOST` - Production server hostname
- `DEPLOY_USER` - SSH username
- `DEPLOY_KEY` - SSH private key
