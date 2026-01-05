"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setHasSession(!!data.session)
      if (!data.session) {
        // Give a moment in case URL processing is pending, then re-check
        setTimeout(async () => {
          const { data: again } = await supabase.auth.getSession()
          if (!mounted) return
          setHasSession(!!again.session)
        }, 500)
      }
    })()
    return () => { mounted = false }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error("Password too short", { description: "Use at least 8 characters" })
      return
    }
    if (password !== confirm) {
      toast.error("Passwords do not match")
      return
    }
    try {
      setSubmitting(true)
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success("Password updated")
      router.replace("/login")
    } catch (err: any) {
      toast.error("Could not update password", { description: err?.message ?? "Try requesting a new link" })
    } finally {
      setSubmitting(false)
    }
  }

  if (hasSession === null) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><div className="text-gray-700">Preparing reset…</div></div>
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card>
          <CardHeader>
            <CardTitle>Invalid or expired link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">Please request a new password reset from the login page.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Re-enter password"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Updating…" : "Update Password"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
