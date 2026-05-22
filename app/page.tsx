import Link from "next/link";
import { variations } from "@/lib/variations";

const BASE_URL = "https://office-mock.vercel.app";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-16">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
          OFFICE Shoes
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Variations Hub
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-400">
          Vercel preview deployments for the top two competitor-gap initiatives
          identified for office.co.uk. Each variation lives on its own branch
          and ships behind a feature flag.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href={BASE_URL}
            className="rounded-md border border-neutral-700 px-4 py-2 text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-900"
          >
            Baseline →
          </a>
          <a
            href="https://github.com/KPS-UK/office-mock"
            className="rounded-md border border-neutral-800 px-4 py-2 text-neutral-400 transition hover:border-neutral-600 hover:text-neutral-200"
          >
            Source: office-mock
          </a>
          <a
            href="https://github.com/KPS-UK/office-variations-hub"
            className="rounded-md border border-neutral-800 px-4 py-2 text-neutral-400 transition hover:border-neutral-600 hover:text-neutral-200"
          >
            Source: variations-hub
          </a>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {variations.map((v) => (
          <article
            key={v.slug}
            className="group relative flex flex-col rounded-xl border border-neutral-800 bg-neutral-950 p-7 transition hover:border-neutral-600"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                {v.flag}
              </span>
              <span className="rounded-full border border-neutral-800 px-2.5 py-0.5 text-xs text-neutral-400">
                {v.effort} · {v.duration}
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-neutral-50">
              {v.title}
            </h2>
            <p className="mt-2 text-sm text-neutral-400">{v.tagline}</p>

            <p className="mt-4 text-sm leading-relaxed text-neutral-300">
              {v.summary}
            </p>

            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
                Highlights
              </p>
              <ul className="space-y-1.5 text-sm text-neutral-300">
                {v.highlights.slice(0, 5).map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-600" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center gap-3 text-xs text-neutral-500">
              <code className="rounded bg-neutral-900 px-2 py-1 text-neutral-300">
                {v.featureFlag}
              </code>
              <span>flag</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 border-t border-neutral-900 pt-5 text-sm">
              {v.vercelUrl ? (
                <a
                  href={v.vercelUrl}
                  className="rounded-md bg-neutral-50 px-4 py-2 font-medium text-neutral-950 transition hover:bg-white"
                >
                  Open preview →
                </a>
              ) : (
                <span
                  className="rounded-md border border-dashed border-neutral-700 px-4 py-2 text-neutral-500"
                  title="Add the Vercel URL in lib/variations.ts once deployed"
                >
                  Preview pending
                </span>
              )}
              <Link
                href={`/${v.slug}`}
                className="rounded-md border border-neutral-700 px-4 py-2 text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-900"
              >
                Full brief
              </Link>
              <a
                href={v.branchUrl}
                className="rounded-md border border-neutral-800 px-4 py-2 text-neutral-400 transition hover:border-neutral-600 hover:text-neutral-200"
              >
                Branch
              </a>
            </div>
          </article>
        ))}
      </section>

      <footer className="mt-20 border-t border-neutral-900 pt-8 text-xs text-neutral-500">
        Built for the OFFICE Shoes pre-sales workstream. Each branch is
        independently shippable behind its feature flag. No cross-iteration code
        in a single PR.
      </footer>
    </main>
  );
}
