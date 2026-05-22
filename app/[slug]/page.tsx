import Link from "next/link";
import { notFound } from "next/navigation";
import { variations } from "@/lib/variations";

export function generateStaticParams() {
  return variations.map((v) => ({ slug: v.slug }));
}

export default function VariationPage({
  params,
}: {
  params: { slug: string };
}) {
  const variation = variations.find((v) => v.slug === params.slug);
  if (!variation) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="mb-10 inline-block text-sm text-neutral-500 transition hover:text-neutral-200"
      >
        ← All variations
      </Link>

      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
        {variation.flag} · {variation.effort} · {variation.duration}
      </p>
      <h1 className="text-4xl font-semibold leading-tight">{variation.title}</h1>
      <p className="mt-4 text-lg text-neutral-400">{variation.tagline}</p>

      <p className="mt-8 text-base leading-relaxed text-neutral-300">
        {variation.summary}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        {variation.vercelUrl ? (
          <a
            href={variation.vercelUrl}
            className="rounded-md bg-neutral-50 px-4 py-2 font-medium text-neutral-950 transition hover:bg-white"
          >
            Open preview →
          </a>
        ) : (
          <span className="rounded-md border border-dashed border-neutral-700 px-4 py-2 text-neutral-500">
            Preview pending
          </span>
        )}
        <a
          href={variation.branchUrl}
          className="rounded-md border border-neutral-700 px-4 py-2 text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-900"
        >
          View branch on GitHub
        </a>
        <code className="rounded bg-neutral-900 px-2 py-1 text-xs text-neutral-300">
          {variation.featureFlag}
        </code>
      </div>

      <Section title="Highlights">
        <ul className="space-y-2">
          {variation.highlights.map((h) => (
            <Bullet key={h}>{h}</Bullet>
          ))}
        </ul>
      </Section>

      <Section title="Acceptance criteria">
        <ul className="space-y-2">
          {variation.acceptance.map((a) => (
            <Bullet key={a}>{a}</Bullet>
          ))}
        </ul>
      </Section>

      <Section title="Out of scope (v2+)">
        <ul className="space-y-2">
          {variation.outOfScope.map((o) => (
            <Bullet key={o} muted>
              {o}
            </Bullet>
          ))}
        </ul>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-neutral-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Bullet({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <li
      className={`flex gap-3 text-sm leading-relaxed ${
        muted ? "text-neutral-500" : "text-neutral-300"
      }`}
    >
      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-600" />
      <span>{children}</span>
    </li>
  );
}
