import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/supabase.server";
import * as Routes from "@/lib/routes";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  if (code) {
    const supabase = await createServerClient();
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(Routes.HOME.getPath(), request.url));
} 