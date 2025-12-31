"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
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
} from "lucide-react"

type TabKey =
  | "dashboard"
  | "assets"
  | "assignments"
  | "teachers"
  | "masters"
  | "reports"
  | "scrap"
  | "backup"

type NavItem = {
  label: string
  key: TabKey
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { label: "Assets", key: "assets", icon: Laptop },
  { label: "Assignments", key: "assignments", icon: ClipboardList },
  { label: "Teachers", key: "teachers", icon: Users },
  { label: "Masters", key: "masters", icon: Settings },
  { label: "Reports", key: "reports", icon: FileText },
  { label: "Scrap", key: "scrap", icon: Trash2 },
  { label: "Backup", key: "backup", icon: HardDrive },
]

// Import existing route pages to render inside as inner views
import DashboardPage from "@/app/dashboard/page"
import AssetsPage from "@/app/assets/page"
import AssignmentsPage from "@/app/assignments/page"
import TeachersPage from "@/app/teachers/page"
import MastersPage from "@/app/masters/page"
import ReportsPage from "@/app/reports/page"
import ScrapPage from "@/app/scrap/page"
import BackupPage from "@/app/backup/page"

export default function Home() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard")

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={
            "group sticky top-0 h-screen bg-white/90 backdrop-blur border-r border-gray-200 shadow-sm transition-all duration-300 " +
            (collapsed ? "w-20" : "w-72")
          }
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0">
                <Image src="/logo.svg" alt="Company Logo" fill priority sizes="40px" className="rounded-lg" />
              </div>
              <div className={(collapsed ? "hidden " : "") + "leading-tight"}>
                <div className="text-base font-semibold text-gray-900">SPIT CE</div>
                <div className="text-xs text-gray-500">Deadstock Portal</div>
              </div>
            </Link>
            <button
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((c) => !c)}
              className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <nav className="px-2 py-2">
            {navItems.map(({ label, key, icon: Icon }) => {
              const active = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={
                    "w-full text-left flex items-center gap-3 rounded-md px-3 py-2 mb-1 transition-colors " +
                    (active
                      ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      : "text-gray-700 hover:bg-gray-100")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className={"h-5 w-5 " + (active ? "text-indigo-700" : "text-gray-600")} />
                  <span className={(collapsed ? "hidden " : "") + "text-sm font-medium"}>{label}</span>
                </button>
              )
            })}
          </nav>

          {/* Footer / help */}
          <div className={(collapsed ? "hidden " : "") + "px-3 py-4 mt-auto text-xs text-gray-500"}>
            <div className="rounded-md bg-gray-50 border border-gray-200 p-3">
              <p className="font-medium text-gray-700">Need help?</p>
              <p>Use the sidebar to navigate modules.</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1">
          <div className="px-6 py-6">
            {activeTab === "dashboard" && <DashboardPage />}
            {activeTab === "assets" && <AssetsPage />}
            {activeTab === "assignments" && <AssignmentsPage />}
            {activeTab === "teachers" && <TeachersPage />}
            {activeTab === "masters" && <MastersPage />}
            {activeTab === "reports" && <ReportsPage />}
            {activeTab === "scrap" && <ScrapPage />}
            {activeTab === "backup" && <BackupPage />}
          </div>
        </section>
      </div>
    </main>
  )
}

