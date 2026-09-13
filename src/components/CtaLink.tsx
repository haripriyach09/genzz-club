import { cn } from "@/lib/utils";

/** Shared class strings for non-WhatsApp call-to-action links and buttons. */

export const ctaSolid =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold tracking-wide text-background uppercase transition-[background-color,color,transform] duration-200 hover:bg-accent hover:text-accent-foreground active:scale-[0.98]";

export const ctaOutline =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-foreground px-6 text-sm font-semibold tracking-wide uppercase transition-[background-color,color,transform] duration-200 hover:bg-foreground hover:text-background active:scale-[0.98]";

export const ctaOnInk =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold tracking-wide text-accent-foreground uppercase transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]";

export const ctaOutlineOnInk =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-ink-border px-6 text-sm font-semibold tracking-wide text-ink-foreground uppercase transition-colors duration-200 hover:bg-ink-foreground hover:text-ink active:scale-[0.98]";

export { cn };
