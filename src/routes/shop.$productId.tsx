import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Info, Minus, Plus } from "lucide-react";

import { getProduct } from "@/data/products";
import { categoryLabel, formatInr, useCatalogProduct } from "@/lib/products";
import { productOrderMessage } from "@/utils/whatsapp";
import { SmartImage } from "@/components/SmartImage";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ctaOutline } from "@/components/CtaLink";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/$productId")({
  loader: ({ params }) => {
    return { product: getProduct(params.productId) };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.product) {
      return {
        meta: [
          { title: "Product not found — GEN-ZZ CLUB" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — Custom T-Shirt | GEN-ZZ CLUB` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} — GEN-ZZ CLUB` },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/shop/${product.id}` },
      ],
      links: [{ rel: "canonical", href: `/shop/${product.id}` }],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductDetailPage,
});

function ProductNotFound() {
  return (
    <div className="container-page section-y text-center">
      <h1 className="display-lg">We couldn't find that tee</h1>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">
        It may have been renamed or removed. Browse the full collection instead.
      </p>
      <Link to="/shop" className={ctaOutline + " mt-8"}>
        Back to shop
      </Link>
    </div>
  );
}

function ProductDetailPage() {
  const initialProduct = Route.useLoaderData().product;
  const { product, loading } = useCatalogProduct(Route.useParams().productId, initialProduct);
  const currentProduct = product ?? initialProduct;
  const [colour, setColour] = useState(currentProduct?.colours[0] ?? "");
  const [size, setSize] = useState(currentProduct?.sizes[2] ?? currentProduct?.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  if (loading && !currentProduct) {
    return <div className="container-page section-y text-muted-foreground">Loading product...</div>;
  }

  if (!currentProduct) return <ProductNotFound />;
  const resolvedProduct = currentProduct;

  return (
    <div className="section-y">
      <div className="container-page">
        <Link
          to="/shop"
          className="inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Back to shop
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-xl bg-muted">
            <SmartImage
              src={resolvedProduct.colourImages?.[colour] ?? resolvedProduct.image}
              alt={`${resolvedProduct.imageAlt} — ${colour}`}
              width={900}
              height={1100}
              priority
              sizes="(min-width: 1024px) 48vw, 92vw"
              className="aspect-[4/5]w-full object-cover"
            />
          </div>

          <div>
            <p className="label-eyebrow text-muted-foreground">
              {categoryLabel(resolvedProduct.category)}
            </p>
            <h1 className="display-lg mt-2">{resolvedProduct.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {resolvedProduct.description}
            </p>

            <p className="mt-6 text-2xl font-semibold">
              Starting from {formatInr(resolvedProduct.price)}
              <span className="ml-2 align-middle text-sm font-normal text-muted-foreground">
                final price confirmed on WhatsApp
              </span>
            </p>

            {/* Colour */}
            <fieldset className="mt-8">
              <legend className="label-eyebrow text-muted-foreground">
                Colour: <span className="text-foreground">{colour}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {resolvedProduct.colours.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setColour(option)}
                    aria-pressed={colour === option}
                    className={cn(
                      "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                      colour === option
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Size */}
            <fieldset className="mt-6">
              <legend className="label-eyebrow text-muted-foreground">
                Size: <span className="text-foreground">{size}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {resolvedProduct.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={size === option}
                    className={cn(
                      "min-h-11 min-w-11 rounded-full border px-4 text-sm font-medium transition-colors",
                      size === option
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Quantity */}
            <div className="mt-6">
              <p className="label-eyebrow text-muted-foreground">Quantity</p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-secondary disabled:opacity-40"
                >
                  <Minus aria-hidden="true" className="size-4" />
                </button>
                <span
                  aria-live="polite"
                  className="min-w-10 text-center text-base font-semibold"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                  aria-label="Increase quantity"
                  className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-secondary"
                >
                  <Plus aria-hidden="true" className="size-4" />
                </button>
              </div>
            </div>

            {/* Customization info */}
            <div className="mt-8 flex gap-3 rounded-lg bg-secondary p-4">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Customization:</span>{" "}
                {resolvedProduct.customization} Send your artwork in the WhatsApp chat — we'll
                confirm print quality and pricing before anything is produced.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {resolvedProduct.availability ? <WhatsAppButton
                size="lg"
                className="w-full sm:w-auto"
                message={productOrderMessage({
                  productName: resolvedProduct.name,
                  productImage:
                    resolvedProduct.colourImages?.[colour] ?? resolvedProduct.image,
                  size,
                  colour,
                  quantity,
                })}
                ariaLabel={`Order ${resolvedProduct.name} on WhatsApp`}
              >
                Order on WhatsApp
              </WhatsAppButton> : <button type="button" disabled className="inline-flex min-h-11 items-center justify-center rounded-full bg-muted px-6 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Currently unavailable
              </button>}
              <Link to="/customize" className={ctaOutline}>
                Start from blank
              </Link>
            </div>

            {quantity >= 10 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Ordering 10 or more?{" "}
                <Link to="/bulk-orders" className="font-semibold underline">
                  Ask for a bulk quote
                </Link>{" "}
                instead.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
