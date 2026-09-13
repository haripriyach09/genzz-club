import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Info } from "lucide-react";

import { defaultColours, defaultSizes } from "@/data/products";
import { customDesignMessage } from "@/utils/whatsapp";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customize")({
  head: () => ({
    meta: [
      { title: "Customize Your T-Shirt — GEN-ZZ CLUB" },
      {
        name: "description",
        content:
          "Design your own personalized T-shirt. Choose colour, size and quantity, add your text or design idea, and send it to us on WhatsApp.",
      },
      { property: "og:title", content: "Customize Your T-Shirt — GEN-ZZ CLUB" },
      {
        property: "og:description",
        content:
          "Pick your colour, size and quantity, describe your design, and send it over on WhatsApp.",
      },
      { property: "og:url", content: "/customize" },
    ],
    links: [{ rel: "canonical", href: "/customize" }],
  }),
  component: CustomizePage,
});

function CustomizePage() {
  const [colour, setColour] = useState(defaultColours[0] ?? "Black");
  const [customColour, setCustomColour] = useState("");
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [designDescription, setDesignDescription] = useState("");
  const [touched, setTouched] = useState(false);

  const isCustomColour = colour === "Other";

  const selectedColour = isCustomColour
    ? customColour.trim()
      ? `Requested colour: ${customColour.trim()}`
      : "Other colour"
    : colour;

  const hasIdea =
    customText.trim().length > 0 || designDescription.trim().length > 0;

  const showError = touched && !hasIdea;

  const message = customDesignMessage({
    colour: selectedColour,
    size,
    quantity,
    customText: customText.trim(),
    designDescription: designDescription.trim(),
  });

  return (
    <div className="section-y">
      <div className="container-page">
        <SectionHeading
          as="h1"
          eyebrow="Customize"
          title="Make it yours."
          description="Send us your idea and we'll turn it into a T-shirt. Fill this in, tap the button, and everything arrives in our chat ready to go."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-8"
            noValidate
          >
            {/* Colour */}
            <fieldset>
              <legend className="label-eyebrow text-muted-foreground">
                T-shirt colour:{" "}
                <span className="text-foreground">{selectedColour}</span>
              </legend>

              <div className="mt-3 flex flex-wrap gap-2">
                {defaultColours.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setColour(option);
                      if (option !== "Other") {
                        setCustomColour("");
                      }
                    }}
                    aria-pressed={colour === option}
                    className={cn(
                      "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                      colour === option
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground",
                    )}
                  >
                    {option}
                  </button>
                ))}

                {/* Other colour option */}
                <button
                  type="button"
                  onClick={() => setColour("Other")}
                  aria-pressed={isCustomColour}
                  className={cn(
                    "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                    isCustomColour
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground",
                  )}
                >
                  Other colour
                </button>
              </div>

              {/* Custom colour input */}
              {isCustomColour ? (
                <div className="mt-4">
                  <label
                    htmlFor="customColour"
                    className="label-eyebrow text-muted-foreground"
                  >
                    Tell us your colour
                  </label>

                  <input
                    id="customColour"
                    type="text"
                    maxLength={60}
                    value={customColour}
                    onChange={(e) => setCustomColour(e.target.value)}
                    placeholder="e.g. Red, Maroon, Sky Blue..."
                    className="mt-2 block h-12 w-full rounded-lg border border-input bg-card px-4 text-base"
                  />

                  <p className="mt-2 text-xs text-muted-foreground">
                    We'll confirm whether your requested colour is available.
                  </p>
                </div>
              ) : null}

              <p className="mt-2 text-xs text-muted-foreground">
                Colour availability is confirmed on WhatsApp before you pay.
              </p>
            </fieldset>

            {/* Size */}
            <fieldset>
              <legend className="label-eyebrow text-muted-foreground">
                Size: <span className="text-foreground">{size}</span>
              </legend>

              <div className="mt-3 flex flex-wrap gap-2">
                {defaultSizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={size === option}
                    className={cn(
                      "min-h-11 min-w-11 rounded-full border px-4 text-sm font-medium transition-colors",
                      size === option
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="label-eyebrow text-muted-foreground"
              >
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                inputMode="numeric"
                min={1}
                max={999}
                value={quantity}
                onChange={(e) => {
                  const next = Number.parseInt(e.target.value, 10);

                  setQuantity(
                    Number.isNaN(next)
                      ? 1
                      : Math.min(999, Math.max(1, next)),
                  );
                }}
                className="mt-2 block h-12 w-32 rounded-lg border border-input bg-card px-4 text-base"
              />
            </div>

            {/* Custom text */}
            <div>
              <label
                htmlFor="customText"
                className="label-eyebrow text-muted-foreground"
              >
                Custom text
              </label>

              <input
                id="customText"
                type="text"
                maxLength={120}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="A name, a date, a quote…"
                aria-describedby="customText-help"
                className="mt-2 block h-12 w-full rounded-lg border border-input bg-card px-4 text-base"
              />

              <p
                id="customText-help"
                className="mt-2 text-xs text-muted-foreground"
              >
                Optional — leave blank if your design is image-only.{" "}
                {customText.length}/120
              </p>
            </div>

            {/* Design description */}
            <div>
              <label
                htmlFor="designDescription"
                className="label-eyebrow text-muted-foreground"
              >
                Design description
              </label>

              <textarea
                id="designDescription"
                rows={5}
                maxLength={600}
                value={designDescription}
                onChange={(e) => setDesignDescription(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Describe what you want printed, where it should sit, and any colours or references."
                aria-describedby="designDescription-help"
                aria-invalid={showError || undefined}
                className={cn(
                  "mt-2 block w-full rounded-lg border bg-card p-4 text-base",
                  showError ? "border-destructive" : "border-input",
                )}
              />

              <p
                id="designDescription-help"
                className="mt-2 text-xs text-muted-foreground"
              >
                {designDescription.length}/600
              </p>
            </div>

            {/* Design image information */}
            <div>
              <div className="flex gap-3 rounded-lg bg-secondary p-4">
                <Info
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0"
                />

                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Have a design or image?
                  </span>{" "}
                  After WhatsApp opens, attach your actual image or design file
                  directly in the chat so we can see exactly what you want
                  printed.
                </p>
              </div>
            </div>

            {/* Validation message */}
            {showError ? (
              <p
                role="alert"
                className="flex items-center gap-2 text-sm font-medium text-destructive"
              >
                <AlertCircle
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />

                Add some custom text or describe your design so we know what to
                print.
              </p>
            ) : null}
          </form>

          {/* Live summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg">Your order so far</h2>

              <dl className="mt-4 space-y-3 text-sm">
                {/* Colour */}
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Colour</dt>

                  <dd className="text-right font-medium">
                    {selectedColour}
                  </dd>
                </div>

                {/* Size */}
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Size</dt>

                  <dd className="font-medium">{size}</dd>
                </div>

                {/* Quantity */}
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Quantity</dt>

                  <dd className="font-medium">{quantity}</dd>
                </div>

                {/* Custom text */}
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">Text</dt>

                  <dd className="min-w-0 truncate text-right font-medium">
                    {customText.trim() || "—"}
                  </dd>
                </div>

                {/* Design */}
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">Design</dt>

                  <dd className="min-w-0 truncate text-right font-medium">
                    {designDescription.trim() || "—"}
                  </dd>
                </div>
              </dl>

              {/* WhatsApp button */}
              <div className="mt-6">
                {hasIdea ? (
                  <WhatsAppButton
                    message={message}
                    size="lg"
                    className="w-full"
                    ariaLabel="Send my design details on WhatsApp"
                  >
                    Send my design
                  </WhatsAppButton>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTouched(true)}
                    className="inline-flex min-h-13 w-full items-center justify-center rounded-full bg-muted px-6 text-sm font-semibold tracking-wide text-muted-foreground uppercase"
                  >
                    Send my design
                  </button>
                )}

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  We'll reply with pricing and a timeline. Nothing is printed
                  until you confirm.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}