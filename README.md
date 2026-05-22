# office-variations-hub

A small Next.js + Tailwind hub that links to the Vercel preview deployments for each OFFICE Shoes competitor-gap variation.

## Variations

Each variation lives on its own branch in [`KPS-UK/office-mock`](https://github.com/KPS-UK/office-mock):

| Iteration | Branch | Feature flag |
|---|---|---|
| 1 — Customer Reviews at Scale | `feature/customer-reviews` | `reviews.enabled` |
| 2 — OFFICE Club Tiered Loyalty | `feature/office-club-loyalty` | `loyalty.enabled` |

Each branch has its own `ITERATION.md` describing scope, acceptance criteria, sub-branches, and risks.

## Updating preview URLs

After Vercel deploys a branch, edit `lib/variations.ts` and set the `vercelUrl` field for that variation. The home page card and detail page will start linking to it automatically.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

This repo deploys to Vercel as a standard Next.js app. Push to `main` for production, push any branch for preview.
