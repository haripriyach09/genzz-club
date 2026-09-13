import { useEffect, useState } from "react";
import {
  categoryLabels,
  defaultColours,
  defaultSizes,
  featuredProductIds,
  products as staticProducts,
  type Product,
} from "@/data/products";
import { getSupabaseClient, getSupabaseProjectUrl } from "@/lib/supabase";
import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import teeCouple from "@/assets/tee-couple.jpg";
import heroTee from "@/assets/hero-tee.jpg";

export type CatalogState = {
  products: Product[];
  loading: boolean;
  error: boolean;
};

type ProductRow = {
  id: string;
  slug?: string | null;
  name: string | null;
  description: string | null;
  price: number | string | null;
  category: string | null;
  availability: boolean | null;
  default_image?: string | null;
  featured?: boolean;
};

type VariantRow = {
  product_id: string;
  colour: string | null;
  image: string | null;
  available: boolean | null;
};

type SizeRow = {
  product_id: string;
  size: string | null;
  available: boolean | null;
};

function normalizeText(value: unknown) {
  return String(value ?? "");
}

const localAssetByFilename: Record<string, string> = {
  "tee-black.jpg": teeBlack,
  "tee-white.jpg": teeWhite,
  "tee-couple.jpg": teeCouple,
  "hero-tee.jpg": heroTee,
};

/** Resolves legacy source paths to the Vite-built asset URL without changing DB data. */
export function resolveProductImage(value: string | null | undefined, fallback = "") {
  if (!value) return fallback;
  const filename = value.split("/").pop()?.split("?")[0];
  if (filename && localAssetByFilename[filename]) return localAssetByFilename[filename];
  return value.startsWith("/src/assets/") ? fallback : value;
}

/** Stores local assets as stable filenames instead of dev-only /src/assets paths. */
export function getStoredProductImageReference(value: string | null | undefined) {
  if (!value) return null;
  const localAsset = Object.entries(localAssetByFilename).find(([, assetUrl]) => assetUrl === value);
  if (localAsset) return localAsset[0];
  if (value.startsWith("/src/assets/")) return value.split("/").pop() ?? value;
  return value;
}

export async function fetchCatalogProducts(): Promise<Product[]> {
  const client = getSupabaseClient();
  console.info("[catalogue] querying Supabase project", getSupabaseProjectUrl());
  const { data: productRows, error: productsError } = await client
    .from("products")
    .select("id, slug, name, description, price, category, availability, default_image, featured")
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("[catalogue] products query failed", {
      message: productsError.message,
      code: productsError.code,
      details: productsError.details,
      hint: productsError.hint,
    });
    throw productsError;
  }

  const returnedProducts = (productRows ?? []) as ProductRow[];
  console.info("[catalogue] products query succeeded", {
    rowCount: returnedProducts.length,
    products: returnedProducts.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      price: row.price,
    })),
  });

  if (!returnedProducts.length) {
    console.warn("[catalogue] Supabase returned zero products; using static fallback", {
      project: getSupabaseProjectUrl(),
    });
    return staticProducts;
  }

  const [{ data: variantRows, error: variantsError }, { data: sizeRows, error: sizesError }] =
    await Promise.all([
      client
        .from("product_variants")
        .select("product_id, colour, image, available")
        .eq("available", true),
      client.from("product_sizes").select("product_id, size, available").eq("available", true),
    ]);

  if (variantsError) console.error("Unable to refresh product variants.", variantsError);
  if (sizesError) console.error("Unable to refresh product sizes.", sizesError);

  return mapDatabaseProducts(
    returnedProducts,
    variantsError ? [] : ((variantRows ?? []) as VariantRow[]),
    sizesError ? [] : ((sizeRows ?? []) as SizeRow[]),
  );
}

function mapDatabaseProducts(
  rows: ProductRow[],
  variantRows: VariantRow[],
  sizeRows: SizeRow[],
): Product[] {
  const variantsByProduct = groupBy(variantRows, (variant) => variant.product_id);
  const sizesByProduct = groupBy(sizeRows, (size) => size.product_id);

  const mappedProducts = rows.map((row) => {
    const productId = normalizeText(row.slug) || row.id;
    const fallback = staticProducts.find((product) => product.id === productId);
    const variants = variantsByProduct.get(row.id) ?? [];
    const sizes = sizesByProduct.get(row.id) ?? [];
    const normalizedVariants = variants
      .map((variant) => ({
        ...variant,
        colour: normalizeText(variant.colour),
        image: normalizeText(variant.image),
      }))
      .filter((variant) => variant.colour);
    const normalizedSizes = sizes
      .map((size) => ({ ...size, size: normalizeText(size.size) }))
      .filter((size) => size.size);
    const colourImages = Object.fromEntries(
      normalizedVariants
        .filter((variant) => Boolean(variant.image))
        .map((variant) => [
          variant.colour,
          resolveProductImage(variant.image, fallback?.image ?? ""),
        ]),
    );

    const mappedProduct: Product = {
      id: productId,
      name: normalizeText(row.name),
      category: normalizeText(row.category),
      description: normalizeText(row.description),
      image: resolveProductImage(row.default_image, fallback?.image ?? ""),
      imageAlt: fallback?.imageAlt || `${row.name} product image`,
      price: Number(row.price ?? 0),
      colours: normalizedVariants.length ? normalizedVariants.map((variant) => variant.colour) : fallback?.colours ?? defaultColours,
      sizes: normalizedSizes.length ? normalizedSizes.map((size) => size.size) : fallback?.sizes ?? defaultSizes,
      availability: row.availability ?? false,
      featured: row.featured ?? featuredProductIds.includes(productId),
      customization: fallback?.customization ?? "Share your design idea on WhatsApp and we will confirm the details.",
    };

    const mappedColourImages = Object.keys(colourImages).length
      ? colourImages
      : fallback?.colourImages;
    if (mappedColourImages) mappedProduct.colourImages = mappedColourImages;

    return mappedProduct;
  });

  console.info("[catalogue] mapped Supabase products", {
    sourceRowCount: rows.length,
    mappedProductCount: mappedProducts.length,
    ids: mappedProducts.map((product) => product.id),
    namesAndPrices: mappedProducts.map((product) => ({ name: product.name, price: product.price })),
  });

  return mappedProducts;
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  return items.reduce((groups, item) => {
    const groupKey = key(item);
    const group = groups.get(groupKey) ?? [];
    group.push(item);
    groups.set(groupKey, group);
    return groups;
  }, new Map<string, T[]>());
}

export function useCatalogProducts(): CatalogState {
  const [state, setState] = useState<CatalogState>({
    products: staticProducts,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let active = true;
    void fetchCatalogProducts()
      .then((nextProducts) => {
        if (active) setState({ products: nextProducts, loading: false, error: false });
      })
      .catch((error) => {
        console.error("Unable to load the customer catalogue from Supabase.", error);
        if (active) setState({ products: staticProducts, loading: false, error: true });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

export function useCatalogProduct(
  id: string,
  initialProduct?: Product,
): CatalogState & { product?: Product | undefined } {
  const state = useCatalogProducts();
  const product = state.products.find((item) => item.id === id) ?? (state.loading ? initialProduct : undefined);
  return { ...state, product };
}

export function getFeaturedCatalogProducts(catalogue: Product[]): Product[] {
  const featuredRecords = catalogue.filter((product) => product.featured);
  if (featuredRecords.length) return featuredRecords;

  const featured = featuredProductIds
    .map((id) => catalogue.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
  return featured.length ? featured : catalogue.slice(0, 4);
}

export function categoryLabel(category: string): string {
  return categoryLabels[category as keyof typeof categoryLabels] ?? category;
}

export function formatInr(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}
