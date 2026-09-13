import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { generalEnquiryMessage, whatsappLink } from "@/utils/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/customize", label: "Customize" },
  { to: "/bulk-orders", label: "Bulk Orders" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-page py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl uppercase md:text-3xl">
              GEN-ZZ<span className="text-accent">&nbsp;CLUB</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
              {siteConfig.tagline} Custom T-shirt printing for your ideas, your people
              and your moments.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="label-eyebrow text-accent">Quick Links</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block py-0.5 text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label-eyebrow text-accent">Get In Touch</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              <li>
                <a
                  href={whatsappLink(generalEnquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 py-0.5 transition-colors hover:text-accent"
                >
                  <WhatsAppIcon className="size-4 shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 py-0.5 transition-colors hover:text-accent"
                >
                  <Instagram aria-hidden="true" className="size-4 shrink-0" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2.5 py-0.5 break-all transition-colors hover:text-accent"
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0" />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ink-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.businessName}. All rights reserved.</p>
          <p>{siteConfig.serviceArea}</p>
        </div>
      </div>
    </footer>
  );
}
