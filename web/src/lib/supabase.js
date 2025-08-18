// Legacy file - kept for compatibility
// Use the new files in lib/supabase/ for SSR support
import { createBrowserClient } from "./supabase/supabase.browser";

export const supabase = createBrowserClient();
