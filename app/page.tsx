"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  PAGES,
  baseline,
  variations,
  type PagePath,
  type Variation,
} from "@/lib/variations";

const BYPASS_TOKEN = process.env.NEXT_PUBLIC_OFFICE_MOCK_BYPASS;

function buildUrl(base: string, page: PagePath): string {
  if (!BYPASS_TOKEN) return `${base}/${page}`;
  const params = new URLSearchParams({
    "x-vercel-protection-bypass": BYPASS_TOKEN,
    "x-vercel-set-bypass-cookie": "samesitenone",
  });
  return `${base}/${page}?${params.toString()}`;
}

type NavMsg = { type: "kps-nav"; page: PagePath };
type ScrollMsg = { type: "kps-scroll"; page: string; frac: number };
type IncomingMsg = NavMsg | ScrollMsg;

export default function HomePage() {
  const [page, setPage] = useState<PagePath>("index.html");
  const [compareSlug, setCompareSlug] = useState<string>(variations[0].slug);

  // Refs to the two iframes — callback-style to avoid React 18 ref-type clash
  const leftFrame = useRef<HTMLIFrameElement | null>(null);
  const rightFrame = useRef<HTMLIFrameElement | null>(null);
  // Suppress one round of postMessage echoes after we programmatically change
  // page/compare so the freshly-loaded iframes don't ping-pong each other.
  const ignoreNavUntil = useRef<number>(0);

  const right = variations.find((v) => v.slug === compareSlug) ?? variations[0];

  useEffect(() => {
    function onMessage(e: MessageEvent<IncomingMsg>) {
      const data = e.data;
      if (!data || typeof data !== "object") return;

      // Figure out which iframe sent this and which one to forward to
      const sourceIsLeft = e.source === leftFrame.current?.contentWindow;
      const sourceIsRight = e.source === rightFrame.current?.contentWindow;
      if (!sourceIsLeft && !sourceIsRight) return;
      const other = sourceIsLeft ? rightFrame.current : leftFrame.current;

      if (data.type === "kps-nav") {
        if (Date.now() < ignoreNavUntil.current) return;
        const next = data.page;
        if (!PAGES.some((p) => p.path === next)) return;
        setPage((current) => (current === next ? current : next));
        return;
      }

      if (data.type === "kps-scroll") {
        other?.contentWindow?.postMessage(
          { type: "kps-apply-scroll", frac: data.frac },
          "*",
        );
        return;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const navigate = useCallback((next: PagePath) => {
    ignoreNavUntil.current = Date.now() + 1500;
    setPage(next);
  }, []);

  const chooseCompare = useCallback((slug: string) => {
    ignoreNavUntil.current = Date.now() + 1500;
    setCompareSlug(slug);
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <Header
        page={page}
        onNavigate={navigate}
        compareSlug={compareSlug}
        onCompare={chooseCompare}
      />
      <div className="grid flex-1 grid-cols-1 gap-3 px-3 pb-3 lg:grid-cols-2">
        <Panel
          variation={baseline}
          page={page}
          role="current"
          frameRef={leftFrame}
        />
        <Panel
          variation={right}
          page={page}
          role="compare"
          frameRef={rightFrame}
        />
      </div>
      <Legend right={right} />
    </main>
  );
}

function Header({
  page,
  onNavigate,
  compareSlug,
  onCompare,
}: {
  page: PagePath;
  onNavigate: (p: PagePath) => void;
  compareSlug: string;
  onCompare: (slug: string) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            OFFICE
          </span>
          <h1 className="text-sm font-semibold text-neutral-100">
            Variations Hub
          </h1>
          <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            ● Synced
          </span>
        </div>

        <div className="flex flex-wrap items-stretch gap-4">
          <ControlGroup
            label="Page"
            helper="Both panels follow"
          >
            <div className="flex gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-1">
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
            </div>
          </ControlGroup>

          <span
            aria-hidden="true"
            className="hidden self-stretch border-l border-neutral-800 lg:block"
          />

          <ControlGroup
            label="Compare against"
            helper="Left panel stays as the current site"
          >
            <div className="flex gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-1">
              {variations.map((v) => {
                const active = v.slug === compareSlug;
                const dot =
                  v.accent === "rose" ? "bg-rose-500" : "bg-indigo-500";
                return (
                  <button
                    key={v.slug}
                    onClick={() => onCompare(v.slug)}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-neutral-50 text-neutral-950"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${dot}`}
                      aria-hidden="true"
                    />
                    {v.shortTitle}
                  </button>
                );
              })}
            </div>
          </ControlGroup>
        </div>
      </div>
    </header>
  );
}

function ControlGroup({
  label,
  helper,
  children,
}: {
  label: string;
  helper: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
          {label}
        </span>
        <span className="text-[10px] text-neutral-600">{helper}</span>
      </div>
      {children}
    </div>
  );
}

function Panel({
  variation,
  page,
  role,
  frameRef,
}: {
  variation: Variation;
  page: PagePath;
  role: "current" | "compare";
  frameRef: React.MutableRefObject<HTMLIFrameElement | null>;
}) {
  const accent = variation.accent;
  const accentBg =
    accent === "rose"
      ? "bg-rose-500"
      : accent === "indigo"
        ? "bg-indigo-500"
        : "bg-neutral-400";
  const accentText =
    accent === "rose"
      ? "text-rose-400"
      : accent === "indigo"
        ? "text-indigo-400"
        : "text-neutral-400";
  const accentBorder =
    accent === "rose"
      ? "border-rose-500/40"
      : accent === "indigo"
        ? "border-indigo-500/40"
        : "border-neutral-700";

  const url = buildUrl(variation.vercelUrl, page);

  return (
    <section
      className={`flex flex-col overflow-hidden rounded-xl border ${accentBorder} bg-neutral-950`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-neutral-900 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${
              role === "current"
                ? "bg-neutral-800 text-neutral-300"
                : "bg-neutral-50 text-neutral-950"
            }`}
          >
            {role === "current" ? "Current" : "Compare"}
          </span>
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${accentBg}`}
            aria-hidden="true"
          />
          <h2 className="truncate text-sm font-semibold text-neutral-100">
            {variation.title}
          </h2>
          {variation.featureFlag !== "—" && (
            <code className={`hidden text-[10px] ${accentText} md:inline`}>
              {variation.featureFlag}
            </code>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[11px]">
          {role === "compare" && variation.slug !== "baseline" && (
            <Link
              href={`/${variation.slug}`}
              className="rounded-md border border-neutral-800 px-2 py-1 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
            >
              Brief
            </Link>
          )}
          <a
            href={url}
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
          ref={(el) => {
            frameRef.current = el;
          }}
          src={url}
          title={variation.title}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </section>
  );
}

function Legend({ right }: { right: Variation }) {
  const rightLabel =
    right.accent === "rose"
      ? "border-rose-500"
      : right.accent === "indigo"
        ? "border-indigo-500"
        : "border-neutral-500";

  return (
    <footer className="border-t border-neutral-900 px-4 py-3 text-[11px] text-neutral-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-5">
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-5 rounded border-2 border-neutral-700"
              aria-hidden="true"
            />
            Left: current site (main branch)
          </span>
          <span className="flex items-center gap-2">
            <span
              className={`inline-block h-3 w-5 rounded border-2 border-dashed ${rightLabel}`}
              aria-hidden="true"
            />
            Right: {right.title} — dashed boxes = proposed changes
          </span>
          <span className="text-neutral-600">
            Pages and scroll position are kept in sync
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
