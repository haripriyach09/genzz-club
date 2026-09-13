/**
 * PRODUCT CATALOGUE
 * =================
 * Edit this file to add, remove or change products.
 * Images: drop a file into src/assets/ and import it at the top of this file.
 *
 * `price` is a STARTING price in rupees. Final pricing is always confirmed
 * on WhatsApp — never treat these as fixed final prices.
 */

import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import teeCouple from "@/assets/tee-couple.jpg";

export type ProductCategory =
  | "custom"
  | "couple"
  | "friendship"
  | "birthday"
  | "college"
  | "events";

export type Product = {
  id: string;
  name: string;
  /** Database categories may include future owner-defined values. */
  category: string;
  description: string;
  /** Default image used when a selected colour has no mapped image. */
  image: string;
  imageAlt: string;
  /** Starting price in ₹ */
  price: number;
  colours: string[];
  sizes: string[];
  /** Optional image overrides keyed by the exact colour name. */
  colourImages?: Record<string, string>;
  availability: boolean;
  featured?: boolean;
  /** Short line about what can be customized on this product. */
  customization: string;
};

export const categoryLabels: Record<ProductCategory, string> = {
  custom: "Custom",
  couple: "Couple",
  friendship: "Friendship",
  birthday: "Birthday",
  college: "College",
  events: "Events",
};

export const shopFilters: Array<{ value: "all" | ProductCategory; label: string }> = [
  { value: "all", label: "All" },
  { value: "custom", label: "Custom" },
  { value: "couple", label: "Couple" },
  { value: "friendship", label: "Friendship" },
  { value: "birthday", label: "Birthday" },
  { value: "college", label: "College" },
  { value: "events", label: "Events" },
];

/** Default options — edit once, used as fallback across the site. */
export const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
export const defaultColours = ["Black", "White", "Beige", "Navy", "Olive", "Grey"];

export const products: Product[] = [
  {
    id: "custom-graphic-tee",
    name: "Custom Graphic Tee",
    category: "custom",
    description:
      "Your artwork, quote or graphic printed on a soft cotton tee. Send the design and we handle the rest.",
    image: teeBlack,
    imageAlt: "Folded plain black custom graphic T-shirt on a concrete surface",
    price: 499,
    colours: ["Black", "White", "Beige", "Navy"],
    sizes: defaultSizes,
    colourImages: { Black: teeBlack, White: teeWhite },
    availability: true,
    customization: "Front and/or back print. Send artwork, a photo or just describe your idea.",
  },
  {
    id: "personalised-text-tee",
    name: "Personalised Text Tee",
    category: "custom",
    description:
      "A name, a date, an inside joke — set in clean type on a classic fit tee.",
    image: teeWhite,
    imageAlt: "Folded plain white personalised text T-shirt on a concrete surface",
    price: 449,
    colours: ["White", "Black", "Beige", "Grey"],
    sizes: defaultSizes,
    availability: true,
    customization: "Any text, in a typeface we suggest based on your vibe.",
  },
  {
    id: "photo-print-tee",
    name: "Photo Print Tee",
    category: "custom",
    description:
      "Turn a photo into a wearable print. Best results come from a high-resolution image.",
    image: teeBlack,
    imageAlt: "Folded plain black photo print T-shirt on a concrete surface",
    price: 599,
    colours: ["Black", "White"],
    sizes: defaultSizes,
    availability: true,
    customization: "Send the original photo on WhatsApp so we can check print quality.",
  },
  {
    id: "couple-tee-set",
    name: "Couple Tee Set",
    category: "couple",
    description:
      "A matching pair designed together. Same graphic, or two halves of one idea.",
    image: teeCouple,
    imageAlt: "A black and a white T-shirt laid side by side as a couple set",
    price: 899,
    colours: ["Black", "White", "Beige"],
    sizes: defaultSizes,
    availability: true,
    customization: "Price is for the set of two. Sizes can be different for each tee.",
  },
  {
    id: "friendship-squad-tee",
    name: "Friendship Squad Tee",
    category: "friendship",
    description:
      "One design for the whole group, with individual names or nicknames on each tee.",
    image: teeWhite,
    imageAlt: "Folded plain white friendship squad T-shirt on a concrete surface",
    price: 449,
    colours: defaultColours,
    sizes: defaultSizes,
    availability: true,
    customization: "Per-tee names available. Group pricing on 6 pieces and above.",
  },
  {
    id: "birthday-tee",
    name: "Birthday Tee",
    category: "birthday",
    description:
      "Age, name, date or a one-liner — made for the person of the day.",
    image: teeBlack,
    imageAlt: "Folded plain black birthday T-shirt on a concrete surface",
    price: 499,
    colours: ["Black", "White", "Beige"],
    sizes: defaultSizes,
    availability: true,
    customization: "Add a photo collage or keep it clean and typographic.",
  },
  {
    id: "college-crew-tee",
    name: "College Crew Tee",
    category: "college",
    description:
      "Department, batch year, club or farewell tees for your whole crew.",
    image: teeWhite,
    imageAlt: "Folded plain white college crew T-shirt on a concrete surface",
    price: 429,
    colours: defaultColours,
    sizes: defaultSizes,
    availability: true,
    customization: "Front logo, back names and numbers. Bulk pricing available.",
  },
  {
    id: "event-tee",
    name: "Event Tee",
    category: "events",
    description:
      "Fests, fundraisers, launches and meet-ups. One design, printed for everyone attending.",
    image: teeBlack,
    imageAlt: "Folded plain black event T-shirt on a concrete surface",
    price: 429,
    colours: defaultColours,
    sizes: defaultSizes,
    availability: true,
    customization: "Send your event logo as PNG, PDF or vector for the sharpest print.",
  },
  {
    id: "custom-logo-tee",
    name: "Custom Logo Tee",
    category: "events",
    description:
      "Brand, startup or club merch. Your logo, printed clean on quality cotton.",
    image: teeWhite,
    imageAlt: "Folded plain white custom logo T-shirt on a concrete surface",
    price: 549,
    colours: defaultColours,
    sizes: defaultSizes,
    availability: true,
    customization: "Left-chest or full-front placement. Share your logo file on WhatsApp.",
  },
];

/** Products shown in the Featured strip on the home page. */
export const featuredProductIds = [
  "custom-graphic-tee",
  "couple-tee-set",
  "college-crew-tee",
  "photo-print-tee",
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return featuredProductIds
    .map((id) => getProduct(id))
    .filter((p): p is Product => Boolean(p));
}
