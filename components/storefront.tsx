"use client";

import { useEffect } from "react";
import { PlurelProvider } from "@plurel/react-sdk";

import { usePlurelMode } from "@/components/plurel-mode-provider";
import { CheckoutPanel } from "@/components/checkout-panel";
import { ProductGrid } from "@/components/product-grid";

/* The sessions API goes through our own origin (see app/api/plurel/v1) so no
   cross-site fetch ever leaves the browser — some devices block those outright.
   The hosted checkout loads from plurelpay.com (or a vercel.app alias fallback). */
const DEFAULT_PAY_BASE = "https://plurelpay.com";
/** Vercel alias fallback — update if the plurelpay-web project's default domain changes. */
const FALLBACK_PAY_BASE = "https://plurelpay-web-tabby-ante.vercel.app";

/** The SDK's checkout iframe ships allow="payment *; clipboard-write" — without
 *  `web-share` the browser blocks navigator.share inside it, so the checkout's
 *  invite buttons silently fall back to copy. Patch the allow list the moment
 *  the SDK inserts the iframe (re-assign src so the policy applies to the
 *  document that loads). Remove when @plurel/sdk grants web-share itself. */
function useGrantWebShareToCheckout() {
  useEffect(() => {
    const patch = (el: Element) => {
      if (!(el instanceof HTMLIFrameElement)) return;
      const id = el.id;
      if (id !== "plurel-checkout-iframe" && id !== "ante-checkout-iframe") return;
      if (el.allow.includes("web-share")) return;
      el.allow = `${el.allow}; web-share`;
      const src = el.src;
      if (src) el.src = src;
    };
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          patch(node);
          node.querySelectorAll?.("iframe#plurel-checkout-iframe, iframe#ante-checkout-iframe").forEach(patch);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
}

export function Storefront() {
  const { merchantId, publishableKey, environment, mode, apiFallback } = usePlurelMode();
  useGrantWebShareToCheckout();
  const payBaseUrl = apiFallback ? FALLBACK_PAY_BASE : DEFAULT_PAY_BASE;

  return (
    <PlurelProvider
      key={`${mode}-${publishableKey.slice(0, 12)}-${payBaseUrl}`}
      merchantId={merchantId}
      publishableKey={publishableKey}
      environment={environment}
      theme="light"
      apiBaseUrl="/api/plurel/v1"
      payBaseUrl={payBaseUrl}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
        <div className="min-w-0">
          <ProductGrid />
        </div>
        <aside className="lg:sticky lg:top-[84px]">
          <CheckoutPanel />
        </aside>
      </div>
    </PlurelProvider>
  );
}
