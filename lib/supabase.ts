import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
let serverClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || !url.startsWith("http")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Supabase] Missing or invalid environment variables. Set SUPABASE_URL and SUPABASE_ANON_KEY."
      );
    }
    return null;
  }

  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

export function getSupabaseService(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || !url.startsWith("http")) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Supabase] Missing or invalid environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
      );
    }
    return null;
  }

  if (!serverClient) {
    serverClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return serverClient;
}
