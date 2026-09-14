import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, Mail, Truck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { generalEnquiryMessage, whatsappLink } from "@/utils/whatsapp";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact GEN-ZZ CLUB — Custom T-Shirt Enquiries" },
      {
        name: "description",
        content:
          "Get in touch with GEN-ZZ CLUB about custom T-shirt printing. Chat on WhatsApp, email us, or find us on Instagram.",
      },
      { property: "og:title", content: "Contact GEN-ZZ CLUB" },
      {
        property: "og:description",
        content: "Chat with us on WhatsApp about your custom T-shirt order.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="section-y">
      <div className="container-page">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Talk to us"
          description="WhatsApp is the fastest way to reach us — it's where every order happens."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <Reveal>
            <div className="rounded-xl bg-ink p-7 text-ink-foreground sm:p-10">
              <p className="font-display text-2xl uppercase sm:text-3xl">
                GEN-ZZ<span className="text-accent">&nbsp;CLUB</span>
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
                {siteConfig.tagline} Send us your idea and we'll reply with pricing,
                timelines and honest advice on how it'll print.
              </p>
              <div className="mt-8">
                <WhatsAppButton
                  message={generalEnquiryMessage()}
                  size="lg"
                  className="w-full sm:w-auto"
                  ariaLabel={`Chat with ${siteConfig.businessName} on WhatsApp`}
                >
                  Chat with us on WhatsApp
                </WhatsAppButton>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ul className="space-y-4">
              <li>
                <a
                  href={whatsappLink(generalEnquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground"
                >
                  <WhatsAppIcon className="mt-0.5 size-5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-semibold">WhatsApp</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Tap to open a chat with your message ready to send.
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground"
                >
                  <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-semibold">Email</span>
                    <span className="mt-1 block text-sm break-all text-muted-foreground">
                      {siteConfig.email}
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground"
                >
                  <Instagram aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-semibold">Instagram</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {siteConfig.instagramHandle}
                    </span>
                  </span>
                </a>
              </li>

              <li className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <span className="min-w-0">
                  <span className="block font-semibold">Business hours</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {siteConfig.businessHours}
                  </span>
                </span>
              </li>

              <li className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <Truck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <span className="min-w-0">
                  <span className="block font-semibold">Where we ship</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {siteConfig.serviceArea}. Charges and timelines are confirmed per
                    order.
                  </span>
                </span>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
