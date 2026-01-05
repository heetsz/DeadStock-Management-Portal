"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { fetchUserRole, createUser, listUsers, Role } from "@/lib/users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function AdminPage() {
  const [role, setRole] = useState<Role>("user")
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [newRole, setNewRole] = useState<Role>("user")
  const [users, setUsers] = useState<Array<{ user_id: string; email: string; role: Role }>>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase.auth.getUser()
        const authedEmail = data.user?.email
        if (authedEmail) {
          const r = await fetchUserRole(authedEmail)
          if (!mounted) return
          setRole(r)
          if (r === "admin") {
            const list = await listUsers()
            if (!mounted) return
            setUsers(list)
          }
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (role !== "admin") return
    setSubmitting(true)
    try {
      const trimmed = email.trim()
      if (!/@spit\.ac\.in$/i.test(trimmed)) {
        toast.error("Use SPIT email only", { description: "Please enter an @spit.ac.in email." })
        return
      }
      await createUser(trimmed, newRole)
      toast.success("User added")
      setEmail("")
      const list = await listUsers()
      setUsers(list)
    } catch (err: any) {
      toast.error("Failed to add user", { description: err?.response?.data?.detail ?? "Please try again" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-gray-600">Loading…</div>
  }

  if (role !== "admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">You don't have permission to view this page.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@spit.ac.in"
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <Button type="submit" disabled={submitting}>{submitting ? "Adding…" : "Add User"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-700">
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id} className="border-t">
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 capitalize">{u.role}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-gray-500">No users yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
