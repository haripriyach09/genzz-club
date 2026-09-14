import { siteConfig } from "@/config/site";

/**
 * Builds a WhatsApp click-to-chat URL with a pre-filled message.
 * The number always comes from src/config/site.ts — never hard-code it.
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message.trim())}`;
}

/** Joins "Label: value" lines, skipping anything empty. */
export function messageLines(lines: Array<string | false | null | undefined>): string {
  return lines.filter(Boolean).join("\n");
}

/** Generic "I'm interested" opener used by nav / floating buttons. */
export function generalEnquiryMessage(context?: string): string {
  return messageLines([
    `Hi ${siteConfig.businessName}!`,
    "",
    context ?? "I'd like to know more about your custom T-shirts.",
    "",
    "Please share the next steps.",
  ]);
}

export type OrderDetails = {
  productName: string;
  productImage?: string;
  size?: string;
  colour?: string;
  quantity?: number;
  note?: string;
};

/** Pre-filled message for a product order. */
export function productOrderMessage(details: OrderDetails): string {
  return messageLines([
    `Hi ${siteConfig.businessName}!`,
    "I want to order:",
    "",
    `Product: ${details.productName}`,
    details.size && `Size: ${details.size}`,
    details.colour && `Colour: ${details.colour}`,
    details.quantity ? `Quantity: ${details.quantity}` : false,
    details.note && `Note: ${details.note}`,
    "",
    details.productImage
      ? `Product image: ${details.productImage}`
      : false,
    "",
    "Please share the next steps.",
  ]);
}
export type CustomDesignDetails = {
  colour: string;
  size: string;
  quantity: number;
  customText: string;
  designDescription: string;
};

/** Pre-filled message for the Customize page. */
export function customDesignMessage(d: CustomDesignDetails): string {
  return messageLines([
    `Hi ${siteConfig.businessName}!`,
    "I'd like a custom T-shirt:",
    "",
    `T-shirt colour: ${d.colour}`,
    `Size: ${d.size}`,
    `Quantity: ${d.quantity}`,
    d.customText && `Text to print: ${d.customText}`,
    d.designDescription && `Design idea: ${d.designDescription}`,
    "",
    "I'll attach my design/image in this WhatsApp chat.",
    "",
    "Please share the price and next steps.",
  ]);
}

export type BulkEnquiryDetails = {
  name: string;
  phone: string;
  email: string;
  orderType: string;
  quantity: string;
  requirements: string;
  message: string;
};

/** Pre-filled message for the Bulk Orders enquiry form. */
export function bulkEnquiryMessage(d: BulkEnquiryDetails): string {
  return messageLines([
    `Hi ${siteConfig.businessName}!`,
    "I'd like a bulk order quote:",
    "",
    `Name: ${d.name}`,
    `Phone / WhatsApp: ${d.phone}`,
    d.email && `Email: ${d.email}`,
    `Type of order: ${d.orderType}`,
    `Approximate quantity: ${d.quantity}`,
    d.requirements && `T-shirt requirements: ${d.requirements}`,
    d.message && `Message: ${d.message}`,
    "",
    "Please share a quote and the next steps.",
  ]);
}
