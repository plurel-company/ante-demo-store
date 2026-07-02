/** Supported checkout currencies — one currency per Ante cart. */
export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY";

export const CURRENCY_ORDER: CurrencyCode[] = ["USD", "EUR", "GBP", "JPY"];

type CurrencyMeta = {
  locale: string;
  /** Divisor from stored minor units to major units (100 for cent-based, 1 for JPY). */
  minorUnitDivisor: number;
  fractionDigits: number;
  /** Minimum order total in minor units for this currency. */
  minimumOrderMinor: number;
  /** Flat shipping for shop items in minor units. */
  shopShippingMinor: number;
  label: string;
};

export const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  USD: {
    locale: "en-US",
    minorUnitDivisor: 100,
    fractionDigits: 2,
    minimumOrderMinor: 1000,
    shopShippingMinor: 500,
    label: "US Dollar",
  },
  EUR: {
    locale: "de-DE",
    minorUnitDivisor: 100,
    fractionDigits: 2,
    minimumOrderMinor: 1000,
    shopShippingMinor: 450,
    label: "Euro",
  },
  GBP: {
    locale: "en-GB",
    minorUnitDivisor: 100,
    fractionDigits: 2,
    minimumOrderMinor: 1000,
    shopShippingMinor: 400,
    label: "British Pound",
  },
  JPY: {
    locale: "ja-JP",
    minorUnitDivisor: 1,
    fractionDigits: 0,
    minimumOrderMinor: 1500,
    shopShippingMinor: 800,
    label: "Japanese Yen",
  },
};

export function toMajorUnits(minorUnits: number, currency: CurrencyCode): number {
  return minorUnits / CURRENCY_META[currency].minorUnitDivisor;
}

/** Format stored minor units with Intl.NumberFormat for the given currency. */
export function formatMoney(minorUnits: number, currency: CurrencyCode): string {
  const meta = CURRENCY_META[currency];
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: meta.fractionDigits,
    maximumFractionDigits: meta.fractionDigits,
  }).format(toMajorUnits(minorUnits, currency));
}

export function anteCurrencyCode(currency: CurrencyCode): string {
  return currency.toLowerCase();
}

export function getMinimumOrderMinor(currency: CurrencyCode): number {
  return CURRENCY_META[currency].minimumOrderMinor;
}

export function currencySectionTitle(currency: CurrencyCode): string {
  return `${currency} · ${CURRENCY_META[currency].label}`;
}
