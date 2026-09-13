/**
 * GEN-ZZ CLUB — CENTRAL SITE CONFIGURATION
 * =======================================
 * This is the ONLY place business contact details live.
 * Change a value here and it updates everywhere on the website.
 *
 * TODO (owner): replace every value marked PLACEHOLDER with the real one.
 */

export const siteConfig = {
  /** Brand name shown in the logo, page titles and WhatsApp messages. */
  businessName: "GEN-ZZ CLUB",

  tagline: "Customized T-shirts & personalized designs.",

  /**
   * WhatsApp number in INTERNATIONAL format, digits only.
   * No "+", no spaces, no dashes. India = country code 91.
   * Example: "919876543210"
   *
   * PLACEHOLDER — replace with the real GEN-ZZ CLUB WhatsApp Business number.
   */
  whatsappNumber: "917483850299",

  /**
   * Official business email.
   * PLACEHOLDER — replace with the real GEN-ZZ CLUB email address.
   */
  email: "genzzclub@gmail.com",

  /**
   * Instagram profile URL.
   * PLACEHOLDER — replace with the real GEN-ZZ CLUB Instagram link.
   */
  instagramUrl: "https://instagram.com/the.genzz.club",

  /** Instagram handle shown as text. PLACEHOLDER. */
  instagramHandle: "@the.genzz.club",

  serviceArea: "South India — Karnataka, Tamil Nadu, Kerala & Andhra Pradesh",

  /** Business hours shown on the Contact page. PLACEHOLDER — edit freely. */
  businessHours: "Monday – Saturday, 10:00 AM – 7:00 PM IST",

  /** Currency symbol used for all prices. */
  currency: "₹",
} as const;

/** True when the owner has not yet replaced the placeholder WhatsApp number. */
export const isWhatsappPlaceholder = siteConfig.whatsappNumber === "917483850299";

/** True when the owner has not yet replaced the placeholder email. */
export const isEmailPlaceholder = siteConfig.email === "genzzclub@gmail.com";
