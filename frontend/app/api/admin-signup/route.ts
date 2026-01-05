import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function deriveNamesFromEmail(email: string) {
  const local = email.split("@")[0].toLowerCase()
  const parts = local.split(/[^a-zA-Z]+/).filter(Boolean)
  const first = parts[0] || "user"
  const last = parts[1] || ""
  return { first_name: first, last_name: last }
}

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({
      error: "Supabase not configured",
      missing: { NEXT_PUBLIC_SUPABASE_URL: !url, SUPABASE_SERVICE_ROLE_KEY: !serviceKey },
    }, { status: 500 })
  }
  const supabase = createClient(url, serviceKey)

  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 })
  }

  const defaultPassword = process.env.DEFAULT_INVITE_PASSWORD || "Temp#123456"

  try {
    // Use Admin API to create and confirm user without sending emails
    const metadata = deriveNamesFromEmail(email)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: metadata,
    })
    if (error) {
      return NextResponse.json({ error: "signup failed", detail: error.message }, { status: 502 })
    }
    return NextResponse.json({ status: "signed_up", user: data?.user ?? null, defaultPassword, metadata })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unexpected error" }, { status: 500 })
  }
}
