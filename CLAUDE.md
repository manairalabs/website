# Manaira Labs Astro Site

## Project Overview
Astro-based website for Manaira Labs - an AI consulting company. Features blog, projects portfolio, team page, and contact form.

## Tech Stack
- **Framework**: Astro
- **Styling**: CSS with CSS variables for light/dark theme support
- **Content**: Markdown files in `src/content/blog/`
- **Deployment**: Static site

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── content/
│   └── blog/           # Blog posts in Markdown
├── layouts/
│   ├── BaseLayout.astro    # Main layout with nav, footer
│   └── BlogLayout.astro    # Blog post layout
├── pages/
│   ├── index.astro         # Homepage
│   ├── projects.astro      # Projects portfolio
│   ├── team.astro          # Team page
│   └── blog/
│       ├── index.astro     # Blog listing with category filter
│       └── [...slug].astro # Dynamic blog post routes
public/
├── images/blog/        # Blog post images
├── icons/              # Favicons and logos
├── styles/
│   ├── main.css        # Main stylesheet
│   ├── projects.css    # Projects page styles
│   └── team-page.css   # Team page styles
└── scripts/
    └── main.js         # Client-side JavaScript
```

## Blog Posts

Blog posts are stored in `src/content/blog/` as Markdown files with frontmatter:

```yaml
---
title: "Post Title"
description: "Post description for SEO"
pubDate: 2024-12-15
author: "Manaira Labs"
tags: ["AI Strategy", "Enterprise AI"]
heroImage: "/images/blog/image-name.png"
category: "Insights"  # Options: Insights, Case Study, Tutorial, News
---
```

## Generating Blog Images with Gemini API

Blog placeholder images can be generated using Google's Gemini API.

### Setup

```bash
# Install dependencies (already in package.json)
npm install @google/genai mime
npm install -D @types/node ts-node
```

### Generate Images

```bash
# Set your Gemini API key and run the script
GEMINI_API_KEY=your_api_key_here npx ts-node scripts/generate-blog-images.ts
```

The script (`scripts/generate-blog-images.ts`) will:
1. Generate images for all blog posts defined in the script
2. Save them to `public/images/blog/`
3. Output PNG files

### Adding New Blog Images

Edit `scripts/generate-blog-images.ts` and add to the `BLOG_IMAGES` array:

```typescript
{
  filename: 'your-blog-slug',
  prompt: `Your image generation prompt here.
Color scheme: dark blue background (#0a1628) with cyan (#00f0ff) accents.
Style: minimalist, corporate tech, no text.
Aspect ratio 16:9, high quality.`,
},
```

### Image Prompt Guidelines

For consistent styling across blog images:
- **Background**: Dark blue/black (#0a1628)
- **Primary accent**: Cyan (#00f0ff)
- **Secondary accents**: Purple (#7c3aed), Green (#10b981), Red (#ff6b6b)
- **Style**: Minimalist, corporate tech, clean lines
- **Always include**: "no text", "Aspect ratio 16:9", "high quality"

## Theming

The site supports light and dark themes via CSS variables. Theme preference is stored in localStorage.

Key CSS variables are defined in `public/styles/main.css`:
- `[data-theme="light"]` - Light theme (default)
- `[data-theme="dark"]` - Dark theme

Use theme-aware variables like `--card-bg`, `--card-border`, `--text-primary` instead of hardcoded colors.

## Contact Form

Contact forms use Formspree: `https://formspree.io/f/mqardgdj`
