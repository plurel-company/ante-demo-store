import { formatMoney as formatMoneyLib, type CurrencyCode } from "@/lib/currency";

export { formatMoney, type CurrencyCode } from "@/lib/currency";

/** Format minor units for display; defaults to USD for legacy call sites. */
export function formatPrice(minorUnits: number, currency: CurrencyCode = "USD"): string {
  return formatMoneyLib(minorUnits, currency);
}
