"use client";

import { AnteProvider } from "@splitante/react-sdk";

import { useAnteMode } from "@/components/ante-mode-provider";
import { CheckoutPanel } from "@/components/checkout-panel";
import { ProductGrid } from "@/components/product-grid";

/* The sessions API goes through our own origin (see app/api/ante/v1) so no
   cross-site fetch ever leaves the browser — some devices block those outright.
   The hosted checkout loads from the ante app's vercel.app alias: if this store
   page loaded, that domain family is reachable too. */
const PAY_BASE = "https://ante-tabby-ante.vercel.app";

export function Storefront() {
  const { merchantId, publishableKey, environment, mode } = useAnteMode();

  return (
    <AnteProvider
      key={`${mode}-${publishableKey.slice(0, 12)}`}
      merchantId={merchantId}
      publishableKey={publishableKey}
      environment={environment}
      theme="light"
      apiBaseUrl="/api/ante/v1"
      payBaseUrl={PAY_BASE}
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
