import { createFileRoute, Link } from "@tanstack/react-router";

import { aboutContent } from "@/data/about";
import { siteConfig } from "@/config/site";
import { generalEnquiryMessage } from "@/utils/whatsapp";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import { ctaOutline } from "@/components/CtaLink";
import heroTee from "@/assets/hero-tee.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About GEN-ZZ CLUB — Personalized T-Shirt Brand" },
      {
        name: "description",
        content:
          "GEN-ZZ CLUB is a customized T-shirt brand built around personal expression — turning ideas, photos, names and artwork into wearable designs.",
      },
      { property: "og:title", content: "About GEN-ZZ CLUB" },
      {
        property: "og:description",
        content:
          "A customized T-shirt brand built around personal expression and creativity.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="About us"
              title={aboutContent.heading}
              description={aboutContent.intro}
            />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              {aboutContent.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-xl bg-muted">
              <SmartImage
                src={heroTee}
                alt="A plain black T-shirt worn as a blank canvas for a custom print"
                width={1200}
                height={1504}
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="aspect-[4/5]w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-secondary">
        <div className="container-page">
          <SectionHeading eyebrow="What we care about" title="How we work" />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {aboutContent.values.map((value, i) => (
              <Reveal as="li" key={value.title} delay={Math.min(i, 3) * 70}>
                <div className="h-full border-t-2 border-foreground pt-5">
                  <h3 className="text-lg">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page text-center">
          <h2 className="display-lg">Got an idea?</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Send it over. We'll tell you honestly how it'll look on a T-shirt.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <WhatsAppButton
              message={generalEnquiryMessage()}
              size="lg"
              ariaLabel={`Chat with ${siteConfig.businessName} on WhatsApp`}
            >
              Chat with us
            </WhatsAppButton>
            <Link to="/shop" className={ctaOutline}>
              Browse the collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
