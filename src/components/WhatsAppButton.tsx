import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/utils/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

type Variant = "solid" | "outline" | "ink";
type Size = "md" | "lg";

type WhatsAppButtonProps = {
  /** Pre-filled chat message. */
  message: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Accessible name when the visible label needs more context. */
  ariaLabel?: string;
};

const variants: Record<Variant, string> = {
  solid: "bg-whatsapp text-whatsapp-foreground hover:brightness-95",
  outline:
    "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
  ink: "border-2 border-ink-border bg-transparent text-ink-foreground hover:bg-ink-foreground hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

/** Every WhatsApp CTA on the site routes through this component. */
export function WhatsAppButton({
  message,
  children,
  variant = "solid",
  size = "md",
  className,
  ariaLabel,
}: WhatsAppButtonProps) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-wide uppercase transition-[background-color,color,transform] duration-200 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      <WhatsAppIcon className="size-5 shrink-0" />
      <span>{children}</span>
    </a>
  );
}
