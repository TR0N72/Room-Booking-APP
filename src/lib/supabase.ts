import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only throw error on client-side or during runtime, not at build time
let supabaseClient: any = null;

export function getSupabase() {
  // Force Mock Mode for development
  const FORCE_MOCK = true;

  if (FORCE_MOCK) {
    if (typeof window !== "undefined") {
      console.log("[Mock Mode] Supabase connection skipped.");
    }
    return null;
  }

  if (typeof window === "undefined") {
    // Server-side
    if (!supabaseUrl || !supabaseKey) {
      // console.warn("Supabase environment variables not set");
      return null;
    }
  } else {
    // Client-side debugging
    // console.log("Supabase URL:", supabaseUrl);
    if (!supabaseUrl) console.warn("Missing NEXT_PUBLIC_SUPABASE_URL (Using Mock Data)");
    if (!supabaseKey) console.warn("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (Using Mock Data)");
  }

  if (!supabaseClient && supabaseUrl && supabaseKey) {
    try {
      supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);
    } catch (e) {
      console.error("Failed to initialize Supabase client:", e);
    }
  }

  return supabaseClient;
}

// Export the createClient function
export function createClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables not set");
  }
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

// Legacy export for backward compatibility
export const supabase = getSupabase();
