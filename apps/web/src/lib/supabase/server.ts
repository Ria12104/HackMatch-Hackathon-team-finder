import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@pairup/shared";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server client using @supabase/ssr — reads and writes cookies via
 * next/headers. Use this in Server Components, Server Actions, and
 * Route Handlers (app/api routes).
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll is called from a Server Component where cookies()
          // is read-only; the middleware will handle the refresh.
        }
      },
    },
  });
}
