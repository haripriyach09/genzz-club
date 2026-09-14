import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
import { siteConfig } from "@/config/site";
import { generalEnquiryMessage } from "@/utils/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/customize", label: "Customize" },
  { to: "/bulk-orders", label: "Bulk Orders" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu covers the screen.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-border bg-ink text-ink-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-foreground"
      >
        Skip to content
      </a>

      <nav aria-label="Main" className="container-page">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl leading-none tracking-tight uppercase md:text-2xl"
            aria-label={`${siteConfig.businessName} — home`}
          >
            <img src={logoMark} alt="" aria-hidden="true" className="size-7 shrink-0 object-contain md:size-8" />
            GEN-ZZ<span className="text-accent">&nbsp;CLUB</span>
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "text-accent" }}
                  inactiveProps={{ className: "text-ink-muted hover:text-ink-foreground" }}
                  className="text-[0.8125rem] font-medium tracking-[0.14em] uppercase transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <WhatsAppButton
              message={generalEnquiryMessage()}
              className="hidden sm:inline-flex"
              ariaLabel={`Order on WhatsApp — chat with ${siteConfig.businessName}`}
            >
              Order on WhatsApp
            </WhatsAppButton>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-11 items-center justify-center rounded-full border border-ink-border text-ink-foreground transition-colors hover:bg-ink-foreground/10 lg:hidden"
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          "border-t border-ink-border bg-ink lg:hidden",
          open && "animate-in fade-in slide-in-from-top-2 duration-200",
        )}
      >
        <ul className="container-page flex flex-col py-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-accent" }}
                inactiveProps={{ className: "text-ink-foreground" }}
                className="block border-b border-ink-border py-4 font-display text-lg uppercase last:border-0"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="py-4">
            <WhatsAppButton
              message={generalEnquiryMessage()}
              size="lg"
              className="w-full"
              ariaLabel={`Order on WhatsApp — chat with ${siteConfig.businessName}`}
            >
              Order on WhatsApp
            </WhatsAppButton>
          </li>
        </ul>
      </div>
    </header>
  );
}
