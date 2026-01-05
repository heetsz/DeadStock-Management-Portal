"use client"

import { useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import api from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCcw, BarChart3, PieChart as PieChartIcon } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { fetchUserRole, Role } from "@/lib/users"

function deriveDisplayName(email: string, meta: any): string {
  const first = (meta?.first_name as string | undefined)?.toString().trim()
  const last = (meta?.last_name as string | undefined)?.toString().trim()
  const full = (meta?.full_name as string | undefined)?.toString().trim()
  const toTitle = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s
  if (first || last) {
    return [toTitle(first || ""), toTitle(last || "")].filter(Boolean).join(" ")
  }
  if (full) return full
  const local = (email || "").split("@")[0].toLowerCase()
  const parts = local.split(/[^a-zA-Z]+/).filter(Boolean)
  if (parts.length === 0) return email
  if (parts.length === 1) return toTitle(parts[0])
  return `${toTitle(parts[0])} ${toTitle(parts[1])}`
}

export default function DashboardView() {
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user
      if (!user) {
        router.replace('/login')
        return
      }
      const meta = user.user_metadata as any
      setDisplayName(deriveDisplayName(user.email || 'User', meta))
      const email = user.email
      if (email) {
        fetchUserRole(email).then(r => setRole(r)).catch(() => setRole(null))
      }
    })
  }, [router])

  const {
    data: stats,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useQuery(
    "dashboard",
    async () => {
      const res = await api.get("/reports/dashboard")
      return res.data
    },
    {
      onSuccess: () => {
        setLastUpdated(new Date())
        toast.success("Dashboard data refreshed", {
          description: `Last updated at ${new Date().toLocaleTimeString()}`,
        })
      },
      onError: (err: any) => {
        toast.error("Failed to load dashboard", {
          description: err?.response?.data?.detail ?? "Please try again",
        })
      },
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    if (!autoRefresh) return
    const id = setInterval(() => refetch(), 60_000)
    return () => clearInterval(id)
  }, [autoRefresh, refetch])

  const COLORS = useMemo(() => ({ assigned: "#3b82f6", scrapped: "#ef4444", available: "#10b981" }), [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{displayName ? `Hello, ${displayName.split(" ")[0]} 👋 ` : 'Dashboard'}</h1>
            {role && (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">Role: {role}</Badge>
            )}
          </div>
          <p className="text-gray-600">Overview of deadstock & asset metrics</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200">
            {isFetching ? "Refreshing…" : lastUpdated ? `Updated ${timeAgo(lastUpdated)}` : "Just loaded"}
          </Badge>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4"
            />
            Auto-refresh
          </label>
          <Button onClick={() => refetch()} variant="secondary" aria-label="Refresh dashboard">
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Error loading dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-600">Please check backend availability and try again.</p>
              <Button variant="destructive" onClick={() => refetch()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Assets" value={stats?.total_assets ?? 0} />
        <StatCard label="Quantity Purchased" value={stats?.total_quantity_purchased ?? 0} />
        <StatCard label="Original Cost" value={stats?.total_original_cost ?? 0} currency />
        <StatCard label="Current Cost" value={stats?.total_current_cost ?? 0} currency />
        <StatCard label="Assigned Qty" value={stats?.total_assigned_quantity ?? 0} />
        <StatCard label="Scrapped Qty" value={stats?.total_scrapped_quantity ?? 0} />
        <StatCard label="Available Qty" value={stats?.total_available_quantity ?? 0} />
        <StatCard label="Assets Shared" value={stats?.assets_with_multiple_teachers ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-indigo-600" /> Quantity Distribution
            </CardTitle>
            <Badge className="bg-gray-100 text-gray-700">Total: {(stats?.total_assigned_quantity ?? 0) + (stats?.total_scrapped_quantity ?? 0) + (stats?.total_available_quantity ?? 0)}</Badge>
          </CardHeader>
          <CardContent>
            {(() => {
              const assigned = stats?.total_assigned_quantity ?? 0
              const scrapped = stats?.total_scrapped_quantity ?? 0
              const available = stats?.total_available_quantity ?? 0
              const total = assigned + scrapped + available

              const pct = (v: number, t: number) => (t > 0 ? Math.round((v / t) * 100) : 0)

              if (total === 0) {
                return <div className="py-6 text-sm text-gray-600">No quantity data yet.</div>
              }

              return (
                <div className="space-y-4">
                  <div className="h-8 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50" role="img" aria-label={`Assigned ${assigned}, Scrapped ${scrapped}, Available ${available}`}>
                    <div className="h-full inline-block" style={{ width: `${pct(assigned, total)}%`, backgroundColor: COLORS.assigned }} title={`Assigned: ${assigned} (${pct(assigned, total)}%)`} />
                    <div className="h-full inline-block" style={{ width: `${pct(scrapped, total)}%`, backgroundColor: COLORS.scrapped }} title={`Scrapped: ${scrapped} (${pct(scrapped, total)}%)`} />
                    <div className="h-full inline-block" style={{ width: `${pct(available, total)}%`, backgroundColor: COLORS.available }} title={`Available: ${available} (${pct(available, total)}%)`} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <LegendItem color={COLORS.assigned} label="Assigned" value={assigned} percent={pct(assigned, total)} />
                    <LegendItem color={COLORS.scrapped} label="Scrapped" value={scrapped} percent={pct(scrapped, total)} />
                    <LegendItem color={COLORS.available} label="Available" value={available} percent={pct(available, total)} />
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" /> Cost Breakdown
            </CardTitle>
            <Badge className="bg-gray-100 text-gray-700">INR (₹)</Badge>
          </CardHeader>
          <CardContent>
            {(() => {
              const original = Number(stats?.total_original_cost ?? 0) || 0
              const current = Number(stats?.total_current_cost ?? 0) || 0
              const data = [
                { name: "Original", value: original },
                { name: "Current", value: current },
              ]

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <LegendItem color="#6366f1" label="Original" value={original} percent={0} />
                    <LegendItem color="#3b82f6" label="Current" value={current} percent={0} />
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(v) => formatINR(v)} />
                        <Tooltip formatter={(v) => formatINR(Number(v))} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                          <LabelList dataKey="value" position="top" formatter={(v: any) => formatINR(Number(v))} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <Card>
          <CardContent>
            <div className="py-10 text-center text-gray-600">Loading dashboard…</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatCard({ label, value, currency }: { label: string; value: number; currency?: boolean }) {
  return (
    <Card>
      <CardContent>
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-2xl font-semibold text-gray-900">
          {currency ? `₹${Number(value).toLocaleString()}` : Number(value).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}

function timeAgo(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function formatINR(v: number) {
  try {
    return `₹${Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  } catch {
    return `₹${v}`
  }
}

function LegendItem({ color, label, value, percent }: { color: string; label: string; value: number; percent: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-900">
        {value.toLocaleString()} <span className="ml-1 text-gray-500">({percent}%)</span>
      </div>
    </div>
  )
}
