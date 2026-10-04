This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy to GitHub Pages

A workflow in `.github/workflows/deploy-pages.yml` builds the site as a static export and publishes it to GitHub Pages every time `main` is pushed (or when you run it by hand from the **Actions** tab).

One-time setup:

1. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Merge your changes into `main` (or run the workflow manually).
3. Your site goes live at `https://<your-username>.github.io/<repo-name>/` — the exact link shows up in the workflow run.

To try the Pages build locally:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/<repo-name> yarn build   # writes the site to ./out
```

Locally and on Vercel those two variables are unset, so nothing changes there. If you add photos, videos or audio under `public/`, reference them with `asset("/images/...")` from `@/lib/asset` so they still load when the site is served from `/<repo-name>/`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
