import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@pairup/shared";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient<Database> | null = null;

/**
 * Returns a singleton browser Supabase client.
 *
 * Uses @supabase/ssr's createBrowserClient which stores the PKCE code
 * verifier in cookies (not localStorage), so the server-side callback
 * Route Handler can read it and exchange the code reliably.
 *
 * The singleton prevents "Multiple GoTrueClient instances" warnings that
 * occur when this is called from multiple Client Components on the same page.
 *
 * Use this ONLY in Client Components ("use client").
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  _client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return _client;
}
