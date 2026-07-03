"use client";

import { AnteProvider } from "@splitante/react-sdk";

import { useAnteMode } from "@/components/ante-mode-provider";
import { CheckoutPanel } from "@/components/checkout-panel";
import { ProductGrid } from "@/components/product-grid";

const FALLBACK_BASE = "https://ante-tabby-ante.vercel.app";

export function Storefront() {
  const { merchantId, publishableKey, environment, mode, apiFallback } = useAnteMode();

  return (
    <AnteProvider
      key={`${mode}-${publishableKey.slice(0, 12)}-${apiFallback ? "fb" : "main"}`}
      merchantId={merchantId}
      publishableKey={publishableKey}
      environment={environment}
      theme="light"
      apiBaseUrl={apiFallback ? `${FALLBACK_BASE}/api/v1` : undefined}
      payBaseUrl={apiFallback ? FALLBACK_BASE : undefined}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
        <div className="min-w-0">
          <ProductGrid />
        </div>
        <aside className="lg:sticky lg:top-[84px]">
          <CheckoutPanel />
        </aside>
      </div>
    </AnteProvider>
  );
}
