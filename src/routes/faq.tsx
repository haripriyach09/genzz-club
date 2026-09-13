import { createFileRoute } from "@tanstack/react-router";

import { faqs } from "@/data/faq";
import { siteConfig } from "@/config/site";
import { generalEnquiryMessage } from "@/utils/whatsapp";
import { SectionHeading } from "@/components/SectionHeading";
import { FAQItem } from "@/components/FAQItem";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Custom T-Shirt Orders | GEN-ZZ CLUB" },
      {
        name: "description",
        content:
          "Answers about ordering customized T-shirts: sending your own design, photo prints, sizes, colours, bulk orders, delivery across India and returns.",
      },
      { property: "og:title", content: "FAQ — GEN-ZZ CLUB" },
      {
        property: "og:description",
        content: "Common questions about custom T-shirt orders, sizes, delivery and returns.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="section-y">
      <div className="container-page">
        <SectionHeading
          as="h1"
          eyebrow="FAQ"
          title="Questions, answered"
          description="If something isn't covered here, just ask us on WhatsApp — we answer properly."
        />

        <ul className="mx-auto mt-10 max-w-3xl border-t border-border">
          {faqs.map((item) => (
            <FAQItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </ul>

        <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-border bg-card p-6 text-center sm:p-8">
          <h2 className="text-xl">Still not sure?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Ask us anything before you order — sizing, print quality, timelines or
            pricing.
          </p>
          <div className="mt-6 flex justify-center">
            <WhatsAppButton
              message={generalEnquiryMessage("I have a question before I order:")}
              size="lg"
              ariaLabel={`Ask ${siteConfig.businessName} a question on WhatsApp`}
            >
              Ask on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
