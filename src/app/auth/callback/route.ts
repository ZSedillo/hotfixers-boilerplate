import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // The 'next' param tells us where to go after login (e.g., /update-password)
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    
    // This command exchanges the "code" from the email for a real User Session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // If successful, forward the user to the "next" page
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If the code is bad or expired, send them back to login with an error
  return NextResponse.redirect(`${origin}/login?message=Auth link is invalid or expired`)
}