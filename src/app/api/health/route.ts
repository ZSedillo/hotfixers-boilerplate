import { NextResponse } from "next/server";

export async function GET() {
  // This is where you would do backend logic (database calls, secret keys, etc.)
  
  return NextResponse.json({ 
    status: "ok",
    message: "Hotfixers Server is running!", 
    timestamp: new Date().toISOString()
  });
}