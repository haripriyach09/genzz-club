import { FormEvent, useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";

import { siteConfig } from "@/config/site";
import { getSupabaseClient } from "@/lib/supabase";

type DashboardStats = {
  totalProducts: number;
  availableProducts: number;
  featuredProducts: number;
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `${siteConfig.businessName} — Owner Login` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isProductsRoute = pathname === "/admin/products";

  useEffect(() => {
    let active = true;

    try {
      const client = getSupabaseClient();

      void client.auth.getSession().then(({ data, error: sessionError }) => {
        if (!active) return;

        if (sessionError) {
          setError(sessionError.message);
        }

        setSession(data.session);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, nextSession) => {
        if (active) {
          setSession(nextSession);
        }
      });

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } catch (clientError) {
      setError(
        clientError instanceof Error
          ? clientError.message
          : "Supabase is not configured.",
      );

      setLoading(false);

      return () => {
        active = false;
      };
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSubmitting(true);

    try {
      const { error: loginError } =
        await getSupabaseClient().auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError(loginError.message);
      }
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setError(null);

    try {
      const { error: logoutError } =
        await getSupabaseClient().auth.signOut();

      if (logoutError) {
        setError(logoutError.message);
      }
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Unable to sign out.",
      );
    }
  }

  if (loading) {
    return <AdminShell>Checking owner session...</AdminShell>;
  }

  if (session) {
    return (
      <AdminShell wide={isProductsRoute}>
        <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="label-eyebrow text-accent">
              {siteConfig.businessName}
            </p>

            <h1 className="display-lg mt-3">
              {isProductsRoute ? "Products" : "Admin Dashboard"}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold tracking-wide uppercase transition-colors hover:border-foreground hover:bg-secondary"
          >
            Logout
          </button>
        </div>

        <nav
          aria-label="Admin"
          className="mt-5 flex flex-wrap gap-2"
        >
          <Link
            to="/admin"
            className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition-colors hover:bg-secondary"
            activeProps={{
              className: "bg-foreground text-background",
            }}
            activeOptions={{ exact: true }}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition-colors hover:bg-secondary"
            activeProps={{
              className: "bg-foreground text-background",
            }}
          >
            Products
          </Link>
        </nav>

        {isProductsRoute ? (
          <div className="mt-8">
            <Outlet />
          </div>
        ) : (
          <DashboardContent />
        )}

        {error ? (
          <p className="mt-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <p className="label-eyebrow text-accent">
        {siteConfig.businessName}
      </p>

      <h1 className="display-lg mt-3">
        Owner Login
      </h1>

      <form
        onSubmit={handleLogin}
        className="mt-8 space-y-5 text-left"
      >
        <div>
          <label
            htmlFor="admin-email"
            className="label-eyebrow text-muted-foreground"
          >
            Email
          </label>

          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-input bg-card px-4 text-base"
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="label-eyebrow text-muted-foreground"
          >
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-input bg-card px-4 text-base"
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold tracking-wide text-background uppercase transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </AdminShell>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    availableProducts: 0,
    featuredProducts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const client = getSupabaseClient();

        const { data, error: productsError } = await client
          .from("products")
          .select("id, availability, featured");

        if (productsError) {
          throw productsError;
        }

        if (!active) return;

        const products = data ?? [];

        setStats({
          totalProducts: products.length,

          availableProducts: products.filter(
            (product) => product.availability === true,
          ).length,

          featuredProducts: products.filter(
            (product) => product.featured === true,
          ).length,
        });
      } catch (dashboardError) {
        if (!active) return;

        setError(
          dashboardError instanceof Error
            ? dashboardError.message
            : "Unable to load dashboard information.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-8">
      <div>
        <p className="text-lg">
          Welcome, Owner
        </p>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Manage your GEN-ZZ CLUB catalogue from here.
          Products, colours, sizes, prices and availability
          can all be updated from the Products section.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <DashboardStat
          label="Total products"
          value={loading ? "—" : stats.totalProducts}
        />

        <DashboardStat
          label="Available for sale"
          value={loading ? "—" : stats.availableProducts}
        />

        <DashboardStat
          label="Featured products"
          value={loading ? "—" : stats.featuredProducts}
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <p className="label-eyebrow text-muted-foreground">
          Quick actions
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            to="/admin/products"
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground hover:bg-secondary"
          >
            <p className="text-base font-semibold">
              Manage Products
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Add, edit or remove products, colours and sizes.
            </p>

            <span className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
              Open products →
            </span>
          </Link>

          <Link
            to="/admin/products"
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground hover:bg-secondary"
          >
            <p className="text-base font-semibold">
              Add New Product
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Add a new T-shirt to the public catalogue.
            </p>

            <span className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
              Go to products →
            </span>
          </Link>
        </div>
      </div>

      {/* WhatsApp orders */}
      <div className="mt-8 rounded-xl bg-secondary p-5">
        <p className="label-eyebrow text-muted-foreground">
          Orders
        </p>

        <h2 className="mt-2 text-lg font-semibold">
          Orders arrive directly on WhatsApp
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Customers currently place orders through WhatsApp.
          Their selected product, colour, size and quantity are
          included in the message, so you can identify the order
          directly from the chat.
        </p>
      </div>

      {/* Store status */}
      <div className="mt-4 rounded-xl border border-border p-5">
        <p className="label-eyebrow text-muted-foreground">
          Store status
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span
            className="size-3 rounded-full bg-accent"
            aria-hidden="true"
          />

          <p className="text-sm font-medium">
            Your website catalogue is live
          </p>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Changes made to products in this dashboard can be
          reflected on the public website.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            Could not load dashboard statistics.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {error}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function DashboardStat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   ADMIN SHELL
========================================================= */

function AdminShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <section
        className={`w-full rounded-xl border border-border bg-card p-7 shadow-sm sm:p-10 ${
          wide ? "max-w-6xl" : "max-w-md"
        }`}
      >
        {children}
      </section>
    </div>
  );
}