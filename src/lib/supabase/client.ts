import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  isValidUrl(supabaseUrl) && !!supabaseKey && supabaseKey !== "your_supabase_anon_key";

type NlocodingClient = ReturnType<typeof buildClient>;
let cached: NlocodingClient | null = null;

function buildClient() {
  return createSupabaseClient(supabaseUrl!, supabaseKey!, {
    db: { schema: "nlocoding" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Browser Supabase client using the `nlocoding` schema.
 * Used exclusively for anonymous lead submissions via RLS-protected tables.
 */
export function getSupabase(): NlocodingClient | null {
  if (!isSupabaseConfigured) return null;
  if (cached) return cached;
  cached = buildClient();
  return cached;
}
