import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create a lazy-initialized client that won't error during static builds
let _supabase: SupabaseClient | null = null;

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      if (!supabaseUrl || !supabaseAnonKey) {
        // During static build, return a no-op that won't crash
        if (typeof window === "undefined") {
          return () => ({ data: null, error: { message: "Supabase not configured", code: "NOT_CONFIGURED" } });
        }
        throw new Error("Supabase URL and Key are required");
      }
      _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_supabase as any)[prop as string];
  },
});

export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase URL and Service Role Key are required");
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
