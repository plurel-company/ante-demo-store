import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ante Demo Store",
  description: "Minimal storefront demo for Ante group checkout",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
