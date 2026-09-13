import { createFileRoute, Link } from "@tanstack/react-router";
import { Shirt, Upload, Printer, Package, Sparkles } from "lucide-react";

import { steps } from "@/data/steps";
import { generalEnquiryMessage } from "@/utils/whatsapp";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { ctaOnInk } from "@/components/CtaLink";

const icons = [Shirt, Upload, Printer, Package, Sparkles];

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Custom T-Shirt Ordering | GEN-ZZ CLUB" },
      {
        name: "description",
        content:
          "Ordering a custom T-shirt in five steps: choose your tee, send your design, we print it, we pack it, you wear it.",
      },
      { property: "og:title", content: "How It Works — GEN-ZZ CLUB" },
      {
        property: "og:description",
        content: "Five simple steps from your idea to a printed T-shirt.",
      },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <>
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="How it works"
            title="From your head to your wardrobe"
            description="No accounts, no complicated checkout. One conversation, start to finish."
          />

          <ol className="mt-12 space-y-4">
            {steps.map((step, i) => {
              const Icon = icons[i] ?? Shirt;
              return (
                <Reveal as="li" key={step.number} delay={Math.min(i, 4) * 60}>
                  <div className="flex gap-5 rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground sm:gap-7 sm:p-7">
                    <div className="shrink-0">
                      <span className="font-display text-3xl text-muted-foreground sm:text-4xl">
                        {step.number}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Icon aria-hidden="true" className="size-4.5" />
                        </span>
                        <h2 className="text-lg sm:text-xl">{step.title}</h2>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section-y bg-ink text-ink-foreground">
        <div className="container-page text-center">
          <h2 className="display-lg">Ready when you are</h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-muted">
            Start with a product, or send us the idea directly — whichever is easier.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/customize"
              className={ctaOnInk}
            >
              Customize your tee
            </Link>
            <WhatsAppButton
              message={generalEnquiryMessage()}
              variant="ink"
              size="lg"
              ariaLabel="Chat with GEN-ZZ CLUB on WhatsApp"
            >
              Chat with us
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
