import { FormEvent, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { products as staticProducts } from "@/data/products";
import { getSupabaseClient } from "@/lib/supabase";
import {
  getStoredProductImageReference,
  resolveProductImage,
} from "@/lib/products";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  availability: boolean;
  featured: boolean;
  default_image: string;
};

type ProductVariant = {
  id?: string;
  colour: string;
  image: string;
  available: boolean;
  imageFile: File | null;
  imagePreview: string | null;
};

type ProductSize = {
  id?: string;
  size: string;
  available: boolean;
};

function normalizeText(value: unknown) {
  return String(value ?? "");
}

type ProductForm = Omit<Product, "id"> & {
  id?: string;
  originalSlug?: string;
  variants: ProductVariant[];
  sizes: ProductSize[];
  defaultImageFile: File | null;
  defaultImagePreview: string | null;
};

const emptyForm: ProductForm = {
  slug: "",
  originalSlug: "",
  name: "",
  description: "",
  price: 0,
  category: "custom",
  availability: true,
  featured: false,
  default_image: "",
  variants: [],
  sizes: [],
  defaultImageFile: null,
  defaultImagePreview: null,
};

const maxImageSize = 5 * 1024 * 1024;

const acceptedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "GEN-ZZ CLUB — Admin Products" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts(): Promise<Product[] | undefined> {
    setLoading(true);
    setError(null);

    try {
      const client = getSupabaseClient();

      const { data, error: productsError } = await client
        .from("products")
        .select(
          "id, slug, name, description, price, category, availability, featured, default_image",
        )
        .order("created_at", { ascending: false });

      if (productsError) {
        throw productsError;
      }

      const freshProducts = (data ?? []).map((row) => ({
        ...(row as Product),
        slug: normalizeText((row as Product).slug),
        name: normalizeText((row as Product).name),
        description: normalizeText((row as Product).description),
        category: normalizeText((row as Product).category),
        default_image: normalizeText((row as Product).default_image),
        price: Number((row as Product).price ?? 0),
        availability: Boolean((row as Product).availability),
        featured: Boolean((row as Product).featured),
      }));

      setProducts(freshProducts);

      return freshProducts;
    } catch (loadError) {
      console.error("Admin products refresh failed.", loadError);

      setError(
        formatSupabaseError(
          loadError,
          "Products could not be loaded.",
        ),
      );

      return undefined;
    } finally {
      setLoading(false);
    }
  }

  async function openEditor(product?: Product) {
    setFeedback(null);
    setError(null);

    if (!product) {
      setForm({
        ...emptyForm,
        variants: [],
        sizes: [],
        defaultImageFile: null,
        defaultImagePreview: null,
      });
      return;
    }

    try {
      const client = getSupabaseClient();

      const [
        { data: variants, error: variantsError },
        { data: sizes, error: sizesError },
      ] = await Promise.all([
        client
          .from("product_variants")
          .select("id, colour, image, available")
          .eq("product_id", product.id),

        client
          .from("product_sizes")
          .select("id, size, available")
          .eq("product_id", product.id),
      ]);

      if (variantsError || sizesError) {
        throw variantsError ?? sizesError;
      }

      setForm({
        ...product,
        slug: product.slug ?? product.id,
        originalSlug: product.slug ?? product.id,
        default_image: product.default_image ?? "",
        price: Number(product.price),

        variants: (variants ?? []).map((variant) => ({
          id: variant.id,
          colour: normalizeText(variant.colour),
          image: normalizeText(variant.image),
          available: Boolean(variant.available),
          imageFile: null,
          imagePreview: null,
        })),

        sizes: (sizes ?? []).map((size) => ({
          id: size.id,
          size: normalizeText(size.size),
          available: Boolean(size.available),
        })),

        defaultImageFile: null,
        defaultImagePreview: null,
      });
    } catch (openError) {
      console.error("Product editor failed.", openError);
      setError("This product could not be opened for editing.");
    }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form || !form.name.trim() || form.price < 0) {
      return;
    }

    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const client = getSupabaseClient();

      const enteredSlug = form.slug.trim();

      const slug = form.id
        ? enteredSlug || form.originalSlug || slugify(form.name)
        : await getUniqueSlug(
            client,
            enteredSlug || slugify(form.name),
          );

      if (form.id && slug !== form.originalSlug) {
        const {
          data: conflictingProduct,
          error: slugError,
        } = await client
          .from("products")
          .select("id")
          .eq("slug", slug)
          .neq("id", form.id)
          .maybeSingle();

        if (slugError) {
          throw databaseOperationError(
            "products slug validation",
            slugError,
          );
        }

        if (conflictingProduct) {
          setError(
            "This slug is already used by another product. Please choose a different slug.",
          );
          return;
        }
      }

      const productPayload = {
        slug,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        availability: form.availability,
        featured: form.featured,
        default_image: form.default_image.trim() || null,
      };

      const productResult = form.id
        ? await client
            .from("products")
            .update(productPayload)
            .eq("id", form.id)
            .select()
            .single()
        : await client
            .from("products")
            .insert(productPayload)
            .select()
            .single();

      if (productResult.error) {
        throw databaseOperationError(
          form.id ? "products update" : "products insert",
          productResult.error,
        );
      }

      if (!productResult.data) {
        throw new Error("products save returned no product row");
      }

      const productId = productResult.data.id as string;

      const uploadedDefaultImage = form.defaultImageFile
        ? await uploadProductImage(
            client,
            form.defaultImageFile,
            productId,
            "default",
          )
        : null;

      if (uploadedDefaultImage) {
        const {
          data: imageProduct,
          error: imageUpdateError,
        } = await client
          .from("products")
          .update({
            default_image: uploadedDefaultImage,
          })
          .eq("id", productId)
          .select(
            "id, slug, name, description, price, category, availability, featured, default_image",
          )
          .single();

        if (imageUpdateError) {
          throw databaseOperationError(
            "products image update",
            imageUpdateError,
          );
        }

        if (!imageProduct) {
          throw new Error(
            "products image update returned no product row",
          );
        }

        productResult.data = imageProduct;
      }

      const variantsWithUploadedImages =
        await uploadVariantImages(
          client,
          productId,
          form.variants,
        );

      await saveVariantsAndSizes(
        client,
        productId,
        variantsWithUploadedImages,
        form.sizes,
      );

      const savedProduct = productResult.data as Product;

      setProducts((currentProducts) =>
        form.id
          ? currentProducts.map((product) =>
              product.id === savedProduct.id
                ? savedProduct
                : product,
            )
          : [savedProduct, ...currentProducts],
      );

      setForm(null);

      setFeedback(
        form.id
          ? "Product updated successfully."
          : "Product added successfully.",
      );

      await loadProducts();
    } catch (saveError) {
      console.error("Product save failed.", saveError);

      setError(
        formatSupabaseError(
          saveError,
          "The product could not be saved.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function importStaticCatalogue() {
    if (
      !window.confirm(
        "Import or update the 9 existing static products in Supabase?",
      )
    ) {
      return;
    }

    setError(null);
    setFeedback(null);
    setSaving(true);

    try {
      const client = getSupabaseClient();

      for (const product of staticProducts) {
        const productPayload = {
          slug: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          availability: product.availability,
          featured: [
            "custom-graphic-tee",
            "couple-tee-set",
            "college-crew-tee",
            "photo-print-tee",
          ].includes(product.id),
          default_image:
            getStoredProductImageReference(product.image),
        };

        const {
          data: existingProduct,
          error: lookupError,
        } = await client
          .from("products")
          .select("id")
          .eq("slug", product.id)
          .maybeSingle();

        if (lookupError) {
          throw lookupError;
        }

        const productResult = existingProduct
          ? await client
              .from("products")
              .update(productPayload)
              .eq("id", existingProduct.id)
              .select("id")
              .single()
          : await client
              .from("products")
              .insert(productPayload)
              .select("id")
              .single();

        if (productResult.error || !productResult.data) {
          throw productResult.error;
        }

        const importedVariants: ProductVariant[] =
          product.colours.map((colour) => ({
            colour,
            image:
              getStoredProductImageReference(
                product.colourImages?.[colour],
              ) ?? "",
            available: true,
            imageFile: null,
            imagePreview: null,
          }));

        const importedSizes: ProductSize[] =
          product.sizes.map((size) => ({
            size,
            available: true,
          }));

        await saveVariantsAndSizes(
          client,
          productResult.data.id as string,
          importedVariants,
          importedSizes,
        );
      }

      setFeedback(
        "The 9 static products were imported or updated without duplicates.",
      );

      await loadProducts();
    } catch (importError) {
      console.error(
        "Static catalogue import failed.",
        importError,
      );

      setError(
        formatSupabaseError(
          importError,
          "The static catalogue could not be imported.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?",
      )
    ) {
      return;
    }

    setError(null);
    setFeedback(null);

    try {
      const { error: deleteError } =
        await getSupabaseClient()
          .from("products")
          .delete()
          .eq("id", product.id);

      if (deleteError) {
        throw deleteError;
      }

      setFeedback("Product deleted successfully.");

      await loadProducts();
    } catch (deleteError) {
      console.error("Product deletion failed.", deleteError);

      setError("The product could not be deleted.");
    }
  }

  if (loading) {
    return (
      <p className="text-muted-foreground">
        Loading products...
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage Supabase catalogue records.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Prices are stored as numeric database values.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void openEditor()}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold tracking-wide text-background uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Add Product
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => void importStaticCatalogue()}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold tracking-wide uppercase transition-colors hover:border-foreground hover:bg-secondary disabled:opacity-50"
          >
            Import Static Catalogue
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-5 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {feedback ? (
        <p className="mt-5 rounded-lg bg-accent/20 p-4 text-sm">
          {feedback}
        </p>
      ) : null}

      {form ? (
        <ProductForm
          form={form}
          setForm={setForm}
          onSubmit={saveProduct}
          saving={saving}
          onCancel={() => setForm(null)}
        />
      ) : null}

      {products.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          No products have been added to Supabase yet.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/60">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  Product
                </th>

                <th className="px-4 py-3 font-semibold">
                  Category
                </th>

                <th className="px-4 py-3 font-semibold">
                  Price
                </th>

                <th className="px-4 py-3 font-semibold">
                  Availability
                </th>

                <th className="px-4 py-3 font-semibold">
                  Featured
                </th>

                <th className="px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-4 font-medium">
                    {product.name}
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {product.category}
                  </td>

                  <td className="px-4 py-4">
                    {formatPrice(product.price)}
                  </td>

                  <td className="px-4 py-4">
                    {product.availability
                      ? "Available"
                      : "Unavailable"}
                  </td>

                  <td className="px-4 py-4">
                    {product.featured ? "Yes" : "No"}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          void openEditor(product)
                        }
                        className="rounded-full border border-border px-3 py-2 text-xs font-semibold uppercase hover:border-foreground"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void deleteProduct(product)
                        }
                        className="rounded-full border border-destructive/40 px-3 py-2 text-xs font-semibold text-destructive uppercase hover:bg-destructive/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  form,
  setForm,
  onSubmit,
  saving,
  onCancel,
}: {
  form: ProductForm;
  setForm: (form: ProductForm) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
  saving: boolean;
  onCancel: () => void;
}) {
  const update = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K],
  ) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-lg border border-border bg-secondary/30 p-5 sm:p-7"
    >
      <h2 className="text-xl font-semibold">
        {form.id ? "Edit Product" : "Add Product"}
      </h2>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Slug / URL key">
          <input
            required
            value={form.slug}
            onChange={(event) =>
              update("slug", event.target.value)
            }
            className="admin-input"
          />
        </Field>

        <Field label="Product name">
          <input
            required
            value={form.name}
            onChange={(event) =>
              update("name", event.target.value)
            }
            className="admin-input"
          />
        </Field>

        <Field label="Category">
          <input
            required
            value={form.category}
            onChange={(event) =>
              update("category", event.target.value)
            }
            className="admin-input"
          />
        </Field>

        <Field label="Price (₹)">
          <input
            required
            min="0"
            step="0.01"
            type="number"
            value={form.price}
            onChange={(event) =>
              update(
                "price",
                Number(event.target.value),
              )
            }
            className="admin-input"
          />
        </Field>

        <Field label="Default image URL">
          <input
            type="text"
            value={form.default_image}
            onChange={(event) =>
              update(
                "default_image",
                event.target.value,
              )
            }
            className="admin-input"
          />

          <ImageUploadControl
            value={form.default_image}
            preview={form.defaultImagePreview}
            onChange={(file, preview) => {
              update("defaultImageFile", file);
              update("defaultImagePreview", preview);
            }}
          />
        </Field>

        <label className="flex min-h-12 items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) =>
              update(
                "featured",
                event.target.checked,
              )
            }
            className="size-4"
          />

          Featured on homepage
        </label>

        <label className="flex min-h-12 items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.availability}
            onChange={(event) =>
              update(
                "availability",
                event.target.checked,
              )
            }
            className="size-4"
          />

          Available for sale
        </label>

        <Field label="Description" wide>
          <textarea
            required
            value={form.description}
            onChange={(event) =>
              update(
                "description",
                event.target.value,
              )
            }
            rows={3}
            className="admin-input resize-y"
          />
        </Field>
      </div>

      <VariantEditor
        variants={form.variants}
        onChange={(variants) =>
          update("variants", variants)
        }
      />

      <SizeEditor
        sizes={form.sizes}
        onChange={(sizes) =>
          update("sizes", sizes)
        }
      />

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold tracking-wide text-background uppercase disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Product"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold uppercase hover:border-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function VariantEditor({
  variants,
  onChange,
}: {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">
            Colour variants
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Each colour can have its own image.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange([
              ...variants,
              {
                colour: "",
                image: "",
                available: true,
                imageFile: null,
                imagePreview: null,
              },
            ])
          }
          className="rounded-full border border-border px-3 py-2 text-xs font-semibold uppercase hover:border-foreground"
        >
          Add Colour
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {variants.map((variant, index) => (
          <div
            key={variant.id ?? index}
            className="grid gap-3 sm:grid-cols-[1fr_2fr_auto_auto]"
          >
            <input
              required
              placeholder="Colour"
              value={variant.colour}
              onChange={(event) =>
                updateVariant(
                  variants,
                  onChange,
                  index,
                  {
                    colour: event.target.value,
                  },
                )
              }
              className="admin-input"
            />

            <input
              placeholder="Image URL or asset path (optional)"
              type="text"
              value={variant.image}
              onChange={(event) =>
                updateVariant(
                  variants,
                  onChange,
                  index,
                  {
                    image: event.target.value,
                  },
                )
              }
              className="admin-input"
            />

            <ImageUploadControl
              value={variant.image}
              preview={variant.imagePreview}
              onChange={(file, preview) =>
                updateVariant(
                  variants,
                  onChange,
                  index,
                  {
                    imageFile: file,
                    imagePreview: preview,
                  },
                )
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={variant.available}
                onChange={(event) =>
                  updateVariant(
                    variants,
                    onChange,
                    index,
                    {
                      available:
                        event.target.checked,
                    },
                  )
                }
              />

              Available
            </label>

            <button
              type="button"
              onClick={() =>
                onChange(
                  variants.filter(
                    (_, variantIndex) =>
                      variantIndex !== index,
                  ),
                )
              }
              className="text-sm text-destructive hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function SizeEditor({
  sizes,
  onChange,
}: {
  sizes: ProductSize[];
  onChange: (sizes: ProductSize[]) => void;
}) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">
            Sizes
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Track size availability for this product.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange([
              ...sizes,
              {
                size: "",
                available: true,
              },
            ])
          }
          className="rounded-full border border-border px-3 py-2 text-xs font-semibold uppercase hover:border-foreground"
        >
          Add Size
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {sizes.map((size, index) => (
          <div
            key={size.id ?? index}
            className="flex flex-wrap items-center gap-3"
          >
            <input
              required
              placeholder="Size (e.g. M)"
              value={size.size}
              onChange={(event) =>
                updateSize(
                  sizes,
                  onChange,
                  index,
                  {
                    size: event.target.value,
                  },
                )
              }
              className="admin-input max-w-xs"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={size.available}
                onChange={(event) =>
                  updateSize(
                    sizes,
                    onChange,
                    index,
                    {
                      available:
                        event.target.checked,
                    },
                  )
                }
              />

              Available
            </label>

            <button
              type="button"
              onClick={() =>
                onChange(
                  sizes.filter(
                    (_, sizeIndex) =>
                      sizeIndex !== index,
                  ),
                )
              }
              className="text-sm text-destructive hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label
      className={wide ? "md:col-span-2" : ""}
    >
      <span className="label-eyebrow text-muted-foreground">
        {label}
      </span>

      <span className="mt-2 block">
        {children}
      </span>
    </label>
  );
}

function updateVariant(
  variants: ProductVariant[],
  onChange: (variants: ProductVariant[]) => void,
  index: number,
  patch: Partial<ProductVariant>,
) {
  onChange(
    variants.map((variant, variantIndex) =>
      variantIndex === index
        ? {
            ...variant,
            ...patch,
          }
        : variant,
    ),
  );
}

function updateSize(
  sizes: ProductSize[],
  onChange: (sizes: ProductSize[]) => void,
  index: number,
  patch: Partial<ProductSize>,
) {
  onChange(
    sizes.map((size, sizeIndex) =>
      sizeIndex === index
        ? {
            ...size,
            ...patch,
          }
        : size,
    ),
  );
}

async function saveVariantsAndSizes(
  client: ReturnType<typeof getSupabaseClient>,
  productId: string,
  variants: ProductVariant[],
  sizes: ProductSize[],
) {
  const {
    error: variantsDeleteError,
  } = await client
    .from("product_variants")
    .delete()
    .eq("product_id", productId);

  if (variantsDeleteError) {
    throw databaseOperationError(
      "product_variants delete",
      variantsDeleteError,
    );
  }

  const variantRows = variants
    .filter(
      (variant) => variant.colour.trim(),
    )
    .map((variant) => ({
      product_id: productId,
      colour: variant.colour.trim(),
      image: variant.image.trim() || null,
      available: variant.available,
    }));

  if (variantRows.length) {
    const { error } = await client
      .from("product_variants")
      .insert(variantRows);

    if (error) {
      throw databaseOperationError(
        "product_variants insert",
        error,
      );
    }
  }

  const {
    error: sizesDeleteError,
  } = await client
    .from("product_sizes")
    .delete()
    .eq("product_id", productId);

  if (sizesDeleteError) {
    throw databaseOperationError(
      "product_sizes delete",
      sizesDeleteError,
    );
  }

  const sizeRows = sizes
    .filter((size) => size.size.trim())
    .map((size) => ({
      product_id: productId,
      size: size.size.trim(),
      available: size.available,
    }));

  if (sizeRows.length) {
    const { error } = await client
      .from("product_sizes")
      .insert(sizeRows);

    if (error) {
      throw databaseOperationError(
        "product_sizes insert",
        error,
      );
    }
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getUniqueSlug(
  client: ReturnType<typeof getSupabaseClient>,
  baseSlug: string,
) {
  const normalizedBase =
    baseSlug || "product";

  let candidate = normalizedBase;
  let suffix = 2;

  while (true) {
    const { data, error } = await client
      .from("products")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw databaseOperationError(
        "products slug validation",
        error,
      );
    }

    if (!data) {
      return candidate;
    }

    candidate = `${normalizedBase}-${suffix}`;
    suffix += 1;
  }
}

function formatSupabaseError(
  error: unknown,
  fallback: string,
) {
  if (
    !error ||
    typeof error !== "object"
  ) {
    return fallback;
  }

  const details = error as {
    operation?: string;
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
  };

  if (details.code === "23505") {
    return "This slug is already used by another product. Please choose a different slug.";
  }

  const parts = [
    details.message,
    details.code &&
      `Code: ${details.code}`,
    details.details,
    details.hint &&
      `Hint: ${details.hint}`,
  ].filter(Boolean);

  return parts.length
    ? `${
        details.operation
          ? `${details.operation} failed: `
          : ""
      }${parts.join(" — ")}`
    : fallback;
}

function databaseOperationError(
  operation: string,
  error: unknown,
) {
  if (
    error &&
    typeof error === "object"
  ) {
    return Object.assign(error, {
      operation,
    });
  }

  return Object.assign(
    new Error(String(error)),
    { operation },
  );
}

function ImageUploadControl({
  value,
  preview,
  onChange,
}: {
  value: string;
  preview: string | null;
  onChange: (
    file: File | null,
    preview: string | null,
  ) => void;
}) {
  const [localPreview, setLocalPreview] =
    useState<string | null>(null);

  const [validationError, setValidationError] =
    useState<string | null>(null);

  const currentPreview =
    localPreview ??
    preview ??
    resolveProductImage(value, "");

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setValidationError(null);

    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    try {
      validateImageFile(file);

      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }

      const nextPreview =
        URL.createObjectURL(file);

      setLocalPreview(nextPreview);

      onChange(file, nextPreview);
    } catch (validationFailure) {
      event.target.value = "";

      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }

      setLocalPreview(null);
      onChange(null, null);

      const message =
        validationFailure instanceof Error
          ? validationFailure.message
          : "The selected image is invalid.";

      setValidationError(message);
    }
  }

  return (
    <div className="space-y-2 sm:col-span-2">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="block w-full text-sm"
      />

      {validationError ? (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {validationError}
        </p>
      ) : null}

      {currentPreview ? (
        <img
          src={currentPreview}
          alt="Selected product preview"
          className="h-24 w-24 rounded-md border border-border object-cover"
        />
      ) : null}

      <p className="text-xs text-muted-foreground">
        JPG, PNG or WEBP, max 5 MB. Uploads are saved when you save the product.
      </p>
    </div>
  );
}

async function uploadProductImage(
  client: ReturnType<typeof getSupabaseClient>,
  file: File,
  productId: string,
  purpose: string,
) {
  validateImageFile(file);

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    file.type.split("/").pop() ||
    "bin";

  const path = `${productId}/${purpose}-${crypto.randomUUID()}.${extension}`;

  const {
    error: uploadError,
  } = await client.storage
    .from("product-images")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw databaseOperationError(
      "product image upload",
      uploadError,
    );
  }

  const { data: publicUrlData } =
    client.storage
      .from("product-images")
      .getPublicUrl(path);

  const publicUrl =
    publicUrlData.publicUrl;

  if (!publicUrl) {
    throw new Error(
      "Product image upload succeeded, but Supabase did not return a public URL.",
    );
  }

  let verificationResponse: Response;

  try {
    verificationResponse =
      await fetch(publicUrl, {
        method: "GET",
        cache: "no-store",
      });
  } catch (verificationError) {
    throw new Error(
      `Product image uploaded, but the public URL could not be verified: ${
        verificationError instanceof Error
          ? verificationError.message
          : String(verificationError)
      }`,
    );
  }

  if (!verificationResponse.ok) {
    throw new Error(
      `Product image uploaded, but the public URL returned HTTP ${verificationResponse.status}.`,
    );
  }

  try {
    await verificationResponse.body?.cancel();
  } catch {
    // Ignore stream cleanup failures.
  }

  return publicUrl;
}

async function uploadVariantImages(
  client: ReturnType<typeof getSupabaseClient>,
  productId: string,
  variants: ProductVariant[],
) {
  return Promise.all(
    variants.map(
      async (variant, index) => ({
        ...variant,

        image: variant.imageFile
          ? await uploadProductImage(
              client,
              variant.imageFile,
              productId,
              `variant-${index}`,
            )
          : variant.image,
      }),
    ),
  );
}

function validateImageFile(file: File) {
  if (!acceptedImageTypes.has(file.type)) {
    throw new Error(
      "Product images must be JPG, PNG, or WEBP files.",
    );
  }

  if (file.size > maxImageSize) {
    throw new Error(
      "Product images must be 5 MB or smaller.",
    );
  }
}