import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { siteConfig } from "@/config/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <p className="display-xl">404</p>
        <h1 className="mt-2 text-2xl">This page doesn't exist</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has moved or never existed. Everything we make
          is still one tap away.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-full bg-foreground px-6 text-sm font-semibold tracking-wide text-background uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Go home
          </Link>
          <Link
            to="/shop"
            className="inline-flex min-h-11 items-center rounded-full border-2 border-foreground px-6 text-sm font-semibold tracking-wide uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            Shop tees
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <h1 className="text-2xl">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong on our end. Try again, or message us on WhatsApp and
          we'll help you place the order directly.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center rounded-full bg-foreground px-6 text-sm font-semibold tracking-wide text-background uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border-2 border-foreground px-6 text-sm font-semibold tracking-wide uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GEN-ZZ CLUB — Custom T-Shirt Printing in India" },
      {
        name: "description",
        content:
          "Customized T-shirts made to your idea. Personalized text, photo, couple, friendship, birthday, college and event tees. Order on WhatsApp.",
      },
      { name: "author", content: siteConfig.businessName },
      { property: "og:site_name", content: siteConfig.businessName },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0d0d0c" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.businessName,
          description:
            "Customized T-shirt printing and personalized apparel, ordered over WhatsApp.",
          email: siteConfig.email,
          sameAs: [siteConfig.instagramUrl],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        {isAdminRoute ? null : <Navbar />}
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        {isAdminRoute ? null : <Footer />}
        {isAdminRoute ? null : <FloatingWhatsApp />}
      </div>
    </QueryClientProvider>
  );
}
