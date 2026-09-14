import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";
import { categoryLabel, formatInr } from "@/lib/products";
import { SmartImage } from "@/components/SmartImage";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        to="/shop/$productId"
        params={{ productId: product.id }}
        className="flex h-full flex-col rounded-lg"
        aria-label={`${product.name} — view details and customize`}
      >
        <div className="relative overflow-hidden rounded-lg bg-muted">
          <SmartImage
            src={product.image}
            alt={product.imageAlt}
            width={900}
            height={1100}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
            className="aspect-[4/5]w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.14em] uppercase">
            {categoryLabel(product.category)}
          </span>
          {!product.availability ? (
            <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.14em] uppercase">
              Unavailable
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <h3 className="text-lg leading-tight">{product.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>

          <p className="mt-3 text-sm font-semibold">
            Starting from {formatInr(product.price)}
          </p>

          <p className="mt-2 flex flex-wrap gap-1.5">
            <span className="sr-only">Available colours:</span>
            {product.colours.map((colour) => (
              <span
                key={colour}
                className="rounded-full border border-border px-2 py-0.5 text-[0.6875rem] text-muted-foreground"
              >
                {colour}
              </span>
            ))}
          </p>

          <span className="mt-4 inline-flex min-h-11 items-center justify-center gap-1.5 self-start rounded-full bg-foreground px-5 text-sm font-semibold tracking-wide text-background uppercase transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
            {product.availability ? "Customize" : "View details"}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
