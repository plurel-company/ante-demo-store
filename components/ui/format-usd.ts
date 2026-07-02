import { formatMoney } from "@/lib/currency";

/** @deprecated Prefer formatMoney(minorUnits, currency) — kept for USD-only call sites. */
export function formatUsd(cents: number): string {
  return formatMoney(cents, "USD");
}
