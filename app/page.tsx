"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PAGES, variations, type PagePath } from "@/lib/variations";

const [reviews, loyalty] = variations;

export default function HomePage() {
  const [page, setPage] = useState<PagePath>("index.html");
  // Suppress one round of postMessage echoes after we programmatically set src,
  // so the two iframes don't ping-pong against each other.
  const ignoreUntil = useRef<number>(0);
  const reviewsRef = useRef<HTMLIFrameElement>(null);
  const loyaltyRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== "kps-nav") return;
      if (Date.now() < ignoreUntil.current) return;
      const next = e.data.page as PagePath;
      if (!PAGES.some((p) => p.path === next)) return;
      setPage((current) => (current === next ? current : next));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const navigate = useCallback((next: PagePath) => {
    // When we programmatically navigate, briefly ignore the iframe load-time
    // messages so they don't echo back and re-trigger setPage.
    ignoreUntil.current = Date.now() + 1500;
    setPage(next);
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <Header page={page} onNavigate={navigate} />
      <div className="grid flex-1 grid-cols-1 gap-3 px-3 pb-3 lg:grid-cols-2">
        <Panel
          variation={reviews}
          page={page}
          iframeRef={reviewsRef}
        />
        <Panel
          variation={loyalty}
          page={page}
          iframeRef={loyaltyRef}
        />
      </div>
      <Legend />
    </main>
  );
}

function Header({
  page,
  onNavigate,
}: {
  page: PagePath;
  onNavigate: (p: PagePath) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            OFFICE
          </span>
          <h1 className="text-sm font-semibold text-neutral-100">
            Variations Hub
          </h1>
          <span className="hidden text-xs text-neutral-500 lg:inline">
            · side-by-side comparison
          </span>
        </div>

        <nav
          aria-label="Navigate both previews"
          className="flex gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-1"
        >
          {PAGES.map((p) => (
            <button
              key={p.path}
              onClick={() => onNavigate(p.path)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                p.path === page
                  ? "bg-neutral-50 text-neutral-950"
                  : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {p.name}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 text-xs text-neutral-500">
          <span className="hidden sm:inline">Synced navigation</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            ● Live
          </span>
        </div>
      </div>
    </header>
  );
}

function Panel({
  variation,
  page,
  iframeRef,
}: {
  variation: (typeof variations)[number];
  page: PagePath;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const accent = variation.accent === "rose" ? "rose" : "indigo";
  const accentBg = accent === "rose" ? "bg-rose-500" : "bg-indigo-500";
  const accentText = accent === "rose" ? "text-rose-400" : "text-indigo-400";
  const accentBorder =
    accent === "rose" ? "border-rose-500/40" : "border-indigo-500/40";

  return (
    <section
      className={`flex flex-col overflow-hidden rounded-xl border ${accentBorder} bg-neutral-950`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-neutral-900 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span
            className={`h-2 w-2 rounded-full ${accentBg}`}
            aria-hidden="true"
          />
          <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            {variation.flag}
          </p>
          <h2 className="text-sm font-semibold text-neutral-100">
            {variation.title}
          </h2>
          <code className={`hidden text-[10px] ${accentText} md:inline`}>
            {variation.featureFlag}
          </code>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <Link
            href={`/${variation.slug}`}
            className="rounded-md border border-neutral-800 px-2 py-1 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
          >
            Brief
          </Link>
          <a
            href={`${variation.vercelUrl}/${page}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-neutral-800 px-2 py-1 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
          >
            Open ↗
          </a>
        </div>
      </div>
      <div className="relative flex-1 bg-white">
        <iframe
          ref={iframeRef}
          src={`${variation.vercelUrl}/${page}`}
          title={variation.title}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </section>
  );
}

function Legend() {
  return (
    <footer className="border-t border-neutral-900 px-4 py-3 text-[11px] text-neutral-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-5">
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-5 rounded border-2 border-dashed border-rose-500"
              aria-hidden="true"
            />
            Iteration 1 — Reviews changes
          </span>
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-5 rounded border-2 border-dashed border-indigo-500"
              aria-hidden="true"
            />
            Iteration 2 — Loyalty changes
          </span>
        </div>
        <div className="flex gap-3 text-neutral-600">
          <a
            href="https://github.com/KPS-UK/office-mock"
            className="hover:text-neutral-300"
          >
            office-mock
          </a>
          <a
            href="https://github.com/KPS-UK/office-variations-hub"
            className="hover:text-neutral-300"
          >
            office-variations-hub
          </a>
        </div>
      </div>
    </footer>
  );
}
