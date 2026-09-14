import { PackageOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/50 px-6 py-16 text-center">
        <PackageOpen aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
        <h3 className="mt-4 text-xl">Nothing here yet</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          There are no products in this category right now. Try another category, or
          start from scratch — we can make almost anything.
        </p>
        <Link
          to="/customize"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-foreground px-6 text-sm font-semibold tracking-wide text-background uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Customize your tee
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <Reveal as="li" key={product.id} delay={Math.min(i, 4) * 60}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </ul>
  );
}
