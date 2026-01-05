"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Laptop,
  ClipboardList,
  Users,
  Settings,
  FileText,
  Trash2,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// Import existing route pages to render inside as inner views
import DashboardView from "@/components/pages/DashboardView"
import AssetsPage from "@/app/assets/page"
import AssignmentsPage from "@/app/assignments/page"
import TeachersPage from "@/app/teachers/page"
import MastersPage from "@/app/masters/page"
import ReportsPage from "@/app/reports/page"
import ScrapPage from "@/app/scrap/page"
import BackupPage from "@/app/backup/page"
import AdminPage from "@/app/admin/page"
import { fetchUserRole, Role } from "@/lib/users"

type TabKey =
  | "dashboard"
  | "assets"
  | "assignments"
  | "teachers"
  | "masters"
  | "reports"
  | "scrap"
  | "backup"
  | "admin"

type NavItem = {
  label: string
  key: TabKey
  icon: React.ElementType
}

const baseNavItems: NavItem[] = [
  { label: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { label: "Assets", key: "assets", icon: Laptop },
  { label: "Assignments", key: "assignments", icon: ClipboardList },
  { label: "Teachers", key: "teachers", icon: Users },
  { label: "Masters", key: "masters", icon: Settings },
  { label: "Reports", key: "reports", icon: FileText },
  { label: "Scrap", key: "scrap", icon: Trash2 },
  { label: "Backup", key: "backup", icon: HardDrive },
]

export default function Home() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard")
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [role, setRole] = useState<Role>("user")
  const router = useRouter()

  const navItems: NavItem[] = role === "admin"
    ? [...baseNavItems, { label: "Admin", key: "admin", icon: Settings }]
    : baseNavItems
  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      if (!data.session) {
        router.replace('/login')
      } else {
        try {
          const userEmail = data.session.user.email
          if (userEmail) {
            const r = await fetchUserRole(userEmail)
            if (mounted) setRole(r)
          }
        } catch {}
        setIsLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [router])

  // Close mobile menu when tab changes
  const handleTabChange = (key: TabKey) => {
    setActiveTab(key)
    setMobileMenuOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col md:flex-row">

      {/* Mobile Header */}
      <div className="md:hidden bg-white/90 backdrop-blur border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 shrink-0">
            <Image src="/image.png" alt="Logo" fill sizes="32px" className="rounded-lg object-cover" />
          </div>
          <span className="font-semibold text-gray-900">Deadstock Portal</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-6 w-6 text-gray-700" />
        </Button>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop Sticky / Mobile Fixed */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white/95 backdrop-blur border-r border-gray-200 shadow-xl
          transition-transform duration-300 ease-in-out
          flex flex-col
          md:sticky md:top-0 md:h-screen md:shadow-sm md:translate-x-0
          ${collapsed ? "md:w-20" : "md:w-72"}
          w-72 h-full
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-4 py-4 md:py-6 shrink-0">
          {/* Close button for mobile */}
          <div className="md:hidden w-full flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 shrink-0">
                <Image src="/image.png" alt="Logo" fill sizes="32px" className="rounded-lg" />
              </div>
              <span className="font-bold text-gray-900">Menu</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop Logo Area */}
          <button
            onClick={() => handleTabChange("dashboard")}
            className={`hidden md:flex items-center gap-3 hover:opacity-75 transition-opacity ${collapsed ? "justify-center w-full" : ""}`}
          >
            <div className="relative h-10 w-10 shrink-0">
              <Image src="/image.png" alt="Company Logo" fill priority sizes="40px" className="rounded-lg" />
            </div>
            <div className={(collapsed ? "hidden " : "") + "leading-tight text-left"}>
              <div className="text-base font-semibold text-gray-900">SPIT CE</div>
              <div className="text-xs text-gray-500">Deadstock Portal</div>
            </div>
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((c) => !c)}
            className={`
              hidden md:inline-flex ml-auto h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none
              ${collapsed ? "absolute -right-4 top-6 shadow-md bg-white z-50" : ""}
            `}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 overflow-y-auto">
          {navItems.map(({ label, key, icon: Icon }) => {
            const active = activeTab === key
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={
                  "w-full text-left flex items-center gap-3 rounded-md px-3 py-2.5 mb-1 transition-colors " +
                  (active
                    ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    : "text-gray-700 hover:bg-gray-100") +
                  (collapsed ? " md:justify-center md:px-2" : "")
                }
                title={collapsed ? label : undefined}
              >
                <Icon className={"h-5 w-5 shrink-0 " + (active ? "text-indigo-700" : "text-gray-600")} />
                <span className={`text-sm font-medium ${collapsed ? "md:hidden" : ""}`}>{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 mt-auto border-t md:border-t-0 p-4">
          <Button
            variant="destructive"
            className={`w-full ${collapsed ? "md:h-10 md:p-0" : "justify-start gap-2"}`}
            title="Sign out"
            onClick={async () => {
              await supabase.auth.signOut()
              toast.success("Signed out")
              router.replace('/login')
            }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={`${collapsed ? "md:hidden" : ""}`}>Sign out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 w-full min-w-0">
        <div className="p-4 md:p-6 lg:p-8">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "assets" && <AssetsPage />}
          {activeTab === "assignments" && <AssignmentsPage />}
          {activeTab === "teachers" && <TeachersPage />}
          {activeTab === "masters" && <MastersPage />}
          {activeTab === "reports" && <ReportsPage />}
          {activeTab === "scrap" && <ScrapPage />}
          {activeTab === "backup" && <BackupPage />}
          {activeTab === "admin" && <AdminPage />}
        </div>
      </section>
    </main>
  )
}

