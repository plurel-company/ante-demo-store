import type { CurrencyCode } from "@/lib/currency";
import { CURRENCY_ORDER, getMinimumOrderMinor } from "@/lib/currency";
import type { Product, ProductCategory } from "@/lib/types";

/** Public site origin for absolute product image URLs (Ante hosted checkout). */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://ante-demo-store.vercel.app";

function productImageUrl(filename: string): string {
  return `${SITE_URL}/products/${filename}`;
}

/** Ante default minimum order for USD (matches splitante.com merchant settings). */
export const MINIMUM_ORDER_CENTS = getMinimumOrderMinor("USD");

export const PRODUCT_SECTIONS: { id: ProductCategory; title: string; subtitle: string }[] = [
  {
    id: "shop",
    title: "Shop",
    subtitle: "Physical goods with flat-rate shipping — prices in local currency.",
  },
  {
    id: "lodging",
    title: "Stays",
    subtitle: "Hotel rooms and whole-home rentals with cleaning and resort fees.",
  },
];

/** Prices in minor units per currency. Product photos live in /public/products. */
export const PRODUCTS: Product[] = [
  {
    id: "mug",
    name: "Ceramic Mug",
    description: "12 oz matte finish, dishwasher safe.",
    unitPrice: 1800,
    currency: "USD",
    emoji: "☕",
    category: "shop",
    imageUrl: productImageUrl("mug.jpg"),
  },
  {
    id: "tote",
    name: "Canvas Tote",
    description: "Heavy cotton, fits a laptop.",
    unitPrice: 2200,
    currency: "EUR",
    emoji: "👜",
    category: "shop",
    imageUrl: productImageUrl("tote.jpg"),
  },
  {
    id: "stickers",
    name: "Sticker Pack",
    description: "Five weatherproof vinyl stickers.",
    unitPrice: 950,
    currency: "GBP",
    emoji: "✨",
    category: "shop",
    imageUrl: productImageUrl("stickers.jpg"),
  },
  {
    id: "deluxe-suite",
    name: "Deluxe Penthouse Suite",
    description: "Corner suite with skyline views, lounge access, and in-room dining.",
    unitPrice: 48900,
    currency: "USD",
    emoji: "🏨",
    category: "lodging",
    imageUrl: productImageUrl("deluxe-suite.jpg"),
    lodging: {
      beds: "1 king + sofa bed",
      baths: "2 full",
      rooms: "Bedroom, living room, dining nook",
      sqft: "850 sq ft",
      amenities: ["Club lounge", "Rain shower + soaking tub", "Nespresso bar", "Turndown service"],
    },
    fees: [
      { id: "resort", label: "Resort fee", amount: 7500, billing: "per_night" },
      { id: "housekeeping", label: "Deep cleaning", amount: 12000, billing: "per_stay" },
    ],
  },
  {
    id: "hotel-room",
    name: "Classic Hotel Room",
    description: "Quiet queen room on a lower floor — ideal for solo travelers or couples.",
    unitPrice: 13500,
    currency: "EUR",
    emoji: "🛏️",
    category: "lodging",
    imageUrl: productImageUrl("hotel-room.jpg"),
    lodging: {
      beds: "1 queen",
      baths: "1 full",
      rooms: "Studio layout",
      sqft: "280 sq ft",
      amenities: ["Desk + ergonomic chair", "Mini fridge", "Blackout shades", "Walk-in shower"],
    },
    fees: [{ id: "resort", label: "Resort fee", amount: 3200, billing: "per_night" }],
  },
  {
    id: "compound-house",
    name: "Cedar Compound Retreat",
    description: "Airbnb-style estate — main lodge plus two guest cottages on five acres.",
    unitPrice: 268000,
    currency: "JPY",
    emoji: "🏡",
    category: "lodging",
    imageUrl: productImageUrl("compound-house.jpg"),
    lodging: {
      beds: "5 bedrooms (8 beds total)",
      baths: "4 full",
      buildings: "Main house + 2 guest cottages",
      rooms: "Great room, chef's kitchen, game loft",
      sqft: "4,200 sq ft across 3 buildings",
      amenities: ["Hot tub", "Fire pit", "EV charger", "Sleeps 12", "Mountain views"],
    },
    fees: [
      { id: "cleaning", label: "Cleaning fee", amount: 35000, billing: "per_stay" },
      { id: "service", label: "Platform service fee", amount: 18000, billing: "per_stay" },
      { id: "waiver", label: "Damage waiver", amount: 9500, billing: "per_stay" },
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function productsInCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((product) => product.category === category);
}

/** Products in a category grouped by currency (stable order). */
export function productsByCurrencyInCategory(
  category: ProductCategory,
): { currency: CurrencyCode; products: Product[] }[] {
  const inCategory = productsInCategory(category);
  return CURRENCY_ORDER.filter((currency) =>
    inCategory.some((product) => product.currency === currency),
  ).map((currency) => ({
    currency,
    products: inCategory.filter((product) => product.currency === currency),
  }));
}
