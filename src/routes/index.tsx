import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import heroTee from "@/assets/hero-tee.jpg";
import { siteConfig } from "@/config/site";
import { generalEnquiryMessage } from "@/utils/whatsapp";
import { homeCategories } from "@/data/categories";
import { getFeaturedCatalogProducts, useCatalogProducts } from "@/lib/products";
import { steps } from "@/data/steps";
import { SmartImage } from "@/components/SmartImage";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SectionHeading } from "@/components/SectionHeading";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { ctaSolid, ctaOnInk, ctaOutlineOnInk, ctaOutline } from "@/components/CtaLink";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GEN-ZZ CLUB — Custom T-Shirt Printing | Wear Your Vibe" },
      {
        name: "description",
        content:
          "Customized T-shirts made for your ideas, your people and your moments. Personalized text, photo, couple, friendship and college tees. Order on WhatsApp.",
      },
      { property: "og:title", content: "GEN-ZZ CLUB — Custom T-Shirt Printing" },
      {
        property: "og:description",
        content:
          "Custom T-shirts made to your idea. Choose, customize and order on WhatsApp.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { products } = useCatalogProducts();
  const featured = getFeaturedCatalogProducts(products);

  return (
    <>
      {/* HERO */}
      <section className="bg-ink text-ink-foreground">
        <div className="container-page grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <Reveal>
            <p className="label-eyebrow text-accent">
              Custom T-shirt printing · India
            </p>
            <h1 className="display-xl mt-4">
              Wear your
              <br />
              <span className="text-accent">vibe.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
              Custom T-shirts made for your ideas, your people and your moments.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/customize" className={ctaOnInk}>
                Customize your tee
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link to="/shop" className={ctaOutlineOnInk}>
                Shop collection
              </Link>
            </div>

            <div className="mt-4">
              <WhatsAppButton
                message={generalEnquiryMessage()}
                variant="ink"
                size="lg"
                className="w-full sm:w-auto"
                ariaLabel={`Order on WhatsApp — chat with ${siteConfig.businessName}`}
              >
                Order on WhatsApp
              </WhatsAppButton>
            </div>
          </Reveal>

          <Reveal delay={120} className="order-firstlg:order-none">
            <div className="relative overflow-hidden rounded-xl">
              <SmartImage
                src={heroTee}
                alt="Person wearing a plain black oversized T-shirt ready for a custom print"
                width={1200}
                height={1504}
                priority
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="aspect-[4/5]w-full object-coversm:aspect-[5/4]lg:aspect-[4/5]"
              />
            </div>
          </Reveal>
        </div>

        {/* Marquee strip */}
        <div className="overflow-hidden border-y border-ink-border py-3">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <span key={copy} aria-hidden={copy === 1} className="flex shrink-0">
                {[
                  "Custom tees",
                  "Photo prints",
                  "Couple sets",
                  "College crews",
                  "Bulk orders",
                  "Event merch",
                ].map((word) => (
                  <span
                    key={word}
                    className="label-eyebrow flex items-center gap-6 px-6 text-ink-muted"
                  >
                    {word}
                    <span aria-hidden="true" className="text-accent">
                      ✳
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND INTRO */}
      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <h2 className="display-lg">
              Not just a T-shirt.
              <br />
              <span className="text-muted-foreground">It's your idea, worn.</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="self-center">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Send us an idea, a photo, a name, a quote, a piece of artwork or a
              memory — we turn it into something you actually want to wear. One
              piece or a hundred, the process is the same: talk it through, get it
              right, then print.
            </p>
            <Link to="/how-it-works" className={ctaOutline + " mt-6"}>
              See how it works
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-y bg-secondary">
        <div className="container-page">
          <SectionHeading
            eyebrow="Browse"
            title="Pick your category"
            description="Every category starts blank. You bring the design."
          />
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {homeCategories.map((category, i) => (
              <Reveal as="li" key={category.label} delay={Math.min(i, 5) * 50}>
                <CategoryCard category={category} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section-y">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Featured"
              title="Start with these"
              description="Starting prices only — the final quote depends on your design, quantity and finish."
            />
            <Link to="/shop" className={ctaOutline}>
              View all
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid products={featured} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PREVIEW */}
      <section className="section-y bg-ink text-ink-foreground">
        <div className="container-page">
          <SectionHeading
            eyebrow="The process"
            tone="ink"
            title="From your head to your wardrobe"
            description="Five steps, one WhatsApp chat, zero forms to fight with."
          />
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={Math.min(i, 4) * 70}>
                <div className="h-full border-t border-ink-border pt-4">
                  <span className="font-display text-3xl text-accent">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-base text-ink-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* BULK CTA */}
      <section className="section-y">
        <div className="container-page">
          <Reveal className="rounded-xl border border-border bg-card p-7 sm:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="label-eyebrow text-muted-foreground">Bulk orders</p>
                <h2 className="display-lg mt-3">One design. Your whole crew.</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  College batches, friend groups, fests, startups, clubs and farewells.
                  Tell us the quantity and we'll come back with a quote.
                </p>
              </div>
              <Link to="/bulk-orders" className={ctaSolid + " shrink-0"}>
                Get a bulk quote
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
