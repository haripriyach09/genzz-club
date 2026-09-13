import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabasePublishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

/**
 * Shared browser client for future authenticated owner features.
 * It stays unconfigured until local Vite env values are provided.
 */
export const supabase: SupabaseClient | null =
  typeof window !== "undefined" && supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        global: {
          fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
        },
      })
    : null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return supabase;
}

export function getSupabaseProjectUrl() {
  return supabaseUrl || "unconfigured";
}
