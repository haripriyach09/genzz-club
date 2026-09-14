import { siteConfig } from "@/config/site";
import { generalEnquiryMessage, whatsappLink } from "@/utils/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

/**
 * Floating chat button. Sits above the iOS/Android browser chrome using
 * safe-area insets so it never covers page buttons or system UI.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink(generalEnquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${siteConfig.businessName} on WhatsApp`}
      className="fixed right-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-105 active:scale-95 md:right-6 md:size-15"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
