export type Variation = {
  slug: string;
  branch: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  flag: string;
  effort: string;
  duration: string;
  featureFlag: string;
  accent: "neutral" | "rose" | "indigo";
  highlights: string[];
  outOfScope: string[];
  acceptance: string[];
  repoUrl: string;
  branchUrl: string;
  vercelUrl: string;
};

const REPO = "https://github.com/KPS-UK/office-mock";

export const baseline: Variation = {
  slug: "baseline",
  branch: "main",
  title: "Current site",
  shortTitle: "Current",
  tagline: "office.co.uk as it ships today.",
  summary:
    "The current production experience — no iteration changes applied. Used as the left-hand reference panel.",
  flag: "Baseline",
  effort: "—",
  duration: "—",
  featureFlag: "—",
  accent: "neutral",
  highlights: [],
  outOfScope: [],
  acceptance: [],
  repoUrl: REPO,
  branchUrl: `${REPO}/tree/main`,
  vercelUrl: "https://office-mock.vercel.app",
};

export const variations: Variation[] = [
  {
    slug: "customer-reviews",
    branch: "feature/customer-reviews",
    title: "Customer Reviews at Scale",
    shortTitle: "Reviews",
    tagline: "PDP + PLP review system, fit polls, and rich-snippet schema.",
    summary:
      "Move OFFICE from \"0 Reviews\" displayed on PDPs to a credible, filterable, fit-poll-enabled review system that lifts PDP conversion, reduces size-related returns, and earns Google review rich-snippets.",
    flag: "Iteration 1",
    effort: "2 / 5",
    duration: "8–10 weeks",
    featureFlag: "reviews.enabled",
    accent: "rose" as const,
    highlights: [
      "Vendor selection from Yotpo, Bazaarvoice, Reevoo or Trustpilot",
      "Post-purchase review-request email 14 days after delivery",
      "PDP review module with fit polls (size, width, comfort)",
      "PLP star ratings, minimum-rating filter, sort-by-top-rated",
      "AggregateRating + Review JSON-LD on every PDP",
      "Historic review backfill via SKU mapping",
      "Auto-publish 4–5★, hold 1–2★ for 24h CS review",
    ],
    outOfScope: [
      "Q&A on PDP",
      "AI-generated review summaries",
      "Video review capture",
      "SMS review requests",
    ],
    acceptance: [
      "Zero PDPs display the literal string \"0 Reviews\"",
      "Axe-core scan passes with zero criticals",
      "PDP LCP regression ≤ 100ms (mobile, 4G)",
      "JSON-LD validates in Google Rich Results Test",
      "Email delivery ≥ 98% within 24h of trigger",
      "Historic backfill imports ≥ 95% of reviews",
      "reviews.enabled feature flag toggles cleanly",
    ],
    repoUrl: REPO,
    branchUrl: `${REPO}/tree/feature/customer-reviews`,
    vercelUrl: "https://office-mock-reviews.vercel.app",
  },
  {
    slug: "office-club-loyalty",
    branch: "feature/office-club-loyalty",
    title: "OFFICE Club Tiered Loyalty",
    shortTitle: "Loyalty",
    tagline: "Three-tier points programme replacing standalone discount codes.",
    summary:
      "Replace current standalone discount codes (Student, Blue Light) with a tiered, points-based loyalty programme that drives repeat purchase, app installs, and email opt-ins.",
    flag: "Iteration 2",
    effort: "4 / 5",
    duration: "16–20 weeks",
    featureFlag: "loyalty.enabled",
    accent: "indigo" as const,
    highlights: [
      "Three tiers: Member (£0), Insider (£150), VIP (£400)",
      "1 point per £1 spent; 100 points = £5 redemption",
      "2× points on app, birthday voucher, welcome bonus",
      "/account/loyalty dashboard with progress and ledger",
      "Cart tier-progress nudge and checkout redemption UI",
      "Welcome, tier-up, expiry, birthday & win-back emails",
      "Student / Blue Light migrated to the loyalty engine",
    ],
    outOfScope: [
      "Referral programme (placeholder only)",
      "Gamification (scratch-cards, spin-the-wheel)",
      "Partner perks",
      "In-store points earn (EPOS — phase 2)",
      "Charity-donation burns",
    ],
    acceptance: [
      "End-to-end signup → earn → redeem on staging",
      "Tier upgrade triggers within 60s of qualifying order",
      "Redemption never allows negative balance (server-side)",
      "Emails comply with PECR and preference centre",
      "Finance liability report reconciles 100% daily",
      "Dashboard meets WCAG 2.2 AA",
      "loyalty.enabled toggles without breaking guest checkout",
      "Load test: 1,000 concurrent redemption checkouts",
    ],
    repoUrl: REPO,
    branchUrl: `${REPO}/tree/feature/office-club-loyalty`,
    vercelUrl: "https://office-mock-loyalty.vercel.app",
  },
];

export const PAGES = [
  { name: "Home", path: "index.html" },
  { name: "Category", path: "plp.html" },
  { name: "Product", path: "pdp.html" },
  { name: "Checkout", path: "checkout.html" },
] as const;

export type PagePath = (typeof PAGES)[number]["path"];
