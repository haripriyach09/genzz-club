import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

import { bulkEnquiryMessage } from "@/utils/whatsapp";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bulk-orders")({
  head: () => ({
    meta: [
      { title: "Bulk T-Shirt Orders — GEN-ZZ CLUB" },
      {
        name: "description",
        content:
          "Custom T-shirts in bulk for college groups, friend groups, events, clubs, startups and companies. Send your requirements and get a quote on WhatsApp.",
      },
      { property: "og:title", content: "Bulk T-Shirt Orders — GEN-ZZ CLUB" },
      {
        property: "og:description",
        content: "One design for your whole crew. Get a bulk quote on WhatsApp.",
      },
      { property: "og:url", content: "/bulk-orders" },
    ],
    links: [{ rel: "canonical", href: "/bulk-orders" }],
  }),
  component: BulkOrdersPage,
});

const audiences = [
  "College groups",
  "Friend groups",
  "Events & fests",
  "Startups",
  "Companies",
  "Clubs & societies",
  "Birthday groups",
  "Farewells",
];

const orderTypes = [
  "College group",
  "Friend group",
  "Event / fest",
  "Startup or company",
  "Club or society",
  "Birthday group",
  "Farewell",
  "Something else",
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  orderType: string;
  quantity: string;
  requirements: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  orderType: orderTypes[0] ?? "",
  quantity: "",
  requirements: "",
  message: "",
};

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.name.trim()) errors.name = "Please tell us your name.";
  const digits = form.phone.replace(/\D/g, "");
  if (!form.phone.trim()) {
    errors.phone = "We need a number to reach you on.";
  } else if (digits.length < 10) {
    errors.phone = "That doesn't look like a complete phone number.";
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = "Check the email address — something looks off.";
  }
  if (!form.quantity.trim()) {
    errors.quantity = "An approximate number is enough.";
  }
  return errors;
}

function BulkOrdersPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;
  const show = (field: keyof FormState) => (submitted ? errors[field] : undefined);

  const update = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const message = bulkEnquiryMessage({
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    orderType: form.orderType,
    quantity: form.quantity.trim(),
    requirements: form.requirements.trim(),
    message: form.message.trim(),
  });

  return (
    <>
      <section className="bg-ink py-14 text-ink-foreground md:py-20">
        <div className="container-page">
          <SectionHeading
            as="h1"
            tone="ink"
            eyebrow="Bulk orders"
            title="One design. Your whole crew."
            description="Ten pieces or three hundred — same design, consistent print, one point of contact. Tell us what you need and we'll come back with a quote."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {audiences.map((item) => (
              <li
                key={item}
                className="rounded-full border border-ink-border px-4 py-2 text-sm text-ink-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
            <Reveal>
              <h2 className="text-2xl">Tell us about your order</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Nothing is stored on this website. When you submit, your details are
                turned into a WhatsApp message that you send to us.
              </p>

              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="mt-8 space-y-6"
              >
                <Field
                  id="name"
                  label="Name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  error={show("name")}
                  autoComplete="name"
                />
                <Field
                  id="phone"
                  label="Phone / WhatsApp"
                  required
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  error={show("phone")}
                  autoComplete="tel"
                />
                <Field
                  id="email"
                  label="Email"
                  hint="Optional"
                  type="email"
                  inputMode="email"
                  value={form.email}
                  onChange={update("email")}
                  error={show("email")}
                  autoComplete="email"
                />

                <div>
                  <label htmlFor="orderType" className="label-eyebrow text-muted-foreground">
                    Type of order
                  </label>
                  <select
                    id="orderType"
                    value={form.orderType}
                    onChange={(e) => update("orderType")(e.target.value)}
                    className="mt-2 block h-12 w-full rounded-lg border border-input bg-card px-3 text-base"
                  >
                    {orderTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <Field
                  id="quantity"
                  label="Approximate quantity"
                  required
                  inputMode="numeric"
                  placeholder="e.g. 40"
                  value={form.quantity}
                  onChange={update("quantity")}
                  error={show("quantity")}
                />

                <TextareaField
                  id="requirements"
                  label="T-shirt requirements"
                  hint="Colours, sizes, print placement"
                  value={form.requirements}
                  onChange={update("requirements")}
                />

                <TextareaField
                  id="message"
                  label="Message"
                  hint="Deadline, design idea, anything else"
                  value={form.message}
                  onChange={update("message")}
                />

                {submitted && !isValid ? (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive"
                  >
                    <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    Please fix the highlighted fields, then send your enquiry.
                  </p>
                ) : null}

                <div>
                  {isValid ? (
                    <WhatsAppButton
                      message={message}
                      size="lg"
                      className="w-full sm:w-auto"
                      ariaLabel="Get a bulk quote on WhatsApp"
                    >
                      Get a bulk quote
                    </WhatsAppButton>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex min-h-13 w-full items-center justify-center rounded-full bg-foreground px-7 text-base font-semibold tracking-wide text-background uppercase sm:w-auto"
                    >
                      Get a bulk quote
                    </button>
                  )}
                </div>
              </form>
            </Reveal>

            <Reveal delay={100} className="lg:pt-16">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg">What happens next</h2>
                <ol className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <li>
                    <span className="font-semibold text-foreground">1.</span> We read
                    your requirements and ask anything that's missing.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">2.</span> You get a
                    quote based on quantity, print size and finish.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">3.</span> We share a
                    design preview and confirm sizes with you.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">4.</span> Production
                    starts once you approve. We keep you posted until delivery.
                  </li>
                </ol>
                <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                  Pricing, timelines and delivery are confirmed in the chat before
                  anything is produced.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  required?: boolean;
  hint?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  placeholder?: string;
  autoComplete?: string;
};

function Field({
  id,
  label,
  value,
  onChange,
  error,
  required,
  hint,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
}: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="label-eyebrow text-muted-foreground">
        {label}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
        {hint ? <span className="ml-2 normal-case tracking-normal">({hint})</span> : null}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-2 block h-12 w-full rounded-lg border bg-card px-4 text-base",
          error ? "border-destructive" : "border-input",
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextareaField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="label-eyebrow text-muted-foreground">
        {label}
        {hint ? <span className="ml-2 normal-case tracking-normal">({hint})</span> : null}
      </label>
      <textarea
        id={id}
        rows={4}
        maxLength={600}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full rounded-lg border border-input bg-card p-4 text-base"
      />
    </div>
  );
}
