import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  // 1. Initialize Supabase Client (ADDED 'await' HERE)
  const supabase = await createClient(); 
  
  // 2. Try to fetch 0 rows just to test connection
  const { data, error } = await supabase.auth.getUser();

  if (error && error.status === 500) {
     return NextResponse.json({ 
      status: "error", 
      message: "Supabase connection failed. Check API Keys." 
    }, { status: 500 });
  }

  return NextResponse.json({ 
    status: "ok", 
    service: "Supabase Connected",
    message: "Hotfixers Server is running!",
    timestamp: new Date().toISOString()
  });
}