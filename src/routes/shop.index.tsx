import { createFileRoute, Link } from "@tanstack/react-router";

import { shopFilters, type ProductCategory } from "@/data/products";
import { useCatalogProducts } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

type ShopSearch = { c?: string };

export const Route = createFileRoute("/shop/")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const raw = search["c"];
    const value = typeof raw === "string" ? raw : undefined;
    const allowed = shopFilters.map((f) => f.value);
    return value && allowed.includes(value as ProductCategory) && value !== "all"
      ? { c: value }
      : {};
  },
  head: () => ({
    meta: [
      { title: "Shop Custom T-Shirts — GEN-ZZ CLUB" },
      {
        name: "description",
        content:
          "Browse customized T-shirts: custom graphic, personalized text, photo, couple, friendship, birthday, college and event tees. Order on WhatsApp.",
      },
      { property: "og:title", content: "Shop Custom T-Shirts — GEN-ZZ CLUB" },
      {
        property: "og:description",
        content:
          "Browse our customized T-shirt range and order your design on WhatsApp.",
      },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { c } = Route.useSearch();
  const { products } = useCatalogProducts();
  const active = c ?? "all";

  const filtered =
    active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div className="section-y">
      <div className="container-page">
        <SectionHeading
          as="h1"
          eyebrow="Shop"
          title="The collection"
          description="Every tee here is a starting point. Pick one, tell us what to print, and we'll take it from there."
        />

        <nav aria-label="Filter products by category" className="mt-8">
          <ul className="-mx-1 flex flex-wrap gap-2">
            {shopFilters.map((filter) => {
              const isActive = filter.value === active;
              return (
                <li key={filter.value}>
                  <Link
                    to="/shop"
                    search={filter.value === "all" ? {} : { c: filter.value }}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium tracking-wide uppercase transition-colors",
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                    )}
                  >
                    {filter.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          Showing {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>

        <div className="mt-6">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
