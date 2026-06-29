"use client";

import { useEffect, useRef } from "react";

import type { FundedOrder } from "@/lib/order-store";

const POLL_MS = 2000;
const TIMEOUT_MS = 5 * 60 * 1000;

type UseOrderFundingPollOptions = {
  orderRef: string | null;
  enabled: boolean;
  onFunded: (order: FundedOrder) => void;
  onError?: (message: string) => void;
};

export function useOrderFundingPoll({
  orderRef,
  enabled,
  onFunded,
  onError,
}: UseOrderFundingPollOptions) {
  const onFundedRef = useRef(onFunded);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onFundedRef.current = onFunded;
  }, [onFunded]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!enabled || !orderRef) return;

    const ref = orderRef;
    let cancelled = false;
    const startedAt = Date.now();

    async function poll() {
      while (!cancelled && Date.now() - startedAt < TIMEOUT_MS) {
        try {
          const response = await fetch(`/api/orders/${encodeURIComponent(ref)}`);
          if (response.ok) {
            const data = (await response.json()) as { order?: FundedOrder };
            if (data.order?.status === "funded") {
              onFundedRef.current(data.order);
              return;
            }
          }
        } catch {
          onErrorRef.current?.("Could not reach order status.");
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_MS));
      }
    }

    void poll();
    return () => {
      cancelled = true;
    };
  }, [enabled, orderRef]);
}
