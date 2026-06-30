"use client";

import { LodgingProductCard } from "@/components/store/LodgingProductCard";
import { SectionHeader } from "@/components/store/SectionHeader";
import { ShopProductCard } from "@/components/store/ShopProductCard";
import { PRODUCT_SECTIONS, productsInCategory } from "@/lib/store";

export function ProductGrid() {
  return (
    <div className="space-y-14 lg:space-y-16">
      {PRODUCT_SECTIONS.map((section) => {
        const products = productsInCategory(section.id);
        const isLodging = section.id === "lodging";

        return (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <SectionHeader
              title={section.title}
              subtitle={section.subtitle}
              count={products.length}
              countLabel={isLodging ? "listings" : "products"}
            />
            <div
              className={
                isLodging
                  ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-2"
                  : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              }
            >
              {products.map((product) =>
                isLodging ? (
                  <LodgingProductCard key={product.id} product={product} />
                ) : (
                  <ShopProductCard key={product.id} product={product} />
                ),
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
