import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OFFICE — Variations Hub",
  description:
    "Vercel preview deployments for OFFICE Shoes competitor-gap initiatives",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
