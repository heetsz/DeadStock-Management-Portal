import { NextResponse } from "next/server"

export async function POST() {
  // Disabled: We no longer send invite links. Use /api/admin-signup instead.
  return NextResponse.json({ error: "Invite route disabled. Use /api/admin-signup." }, { status: 410 })
}
