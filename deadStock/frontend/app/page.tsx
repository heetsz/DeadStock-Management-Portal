'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Deadstock & Asset Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Computer Engineering Department - SPIT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link href="/dashboard" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <p className="text-gray-600">View statistics and metrics</p>
          </Link>

          <Link href="/assets" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💻</div>
            <h2 className="text-xl font-semibold mb-2">Assets</h2>
            <p className="text-gray-600">Manage assets and inventory</p>
          </Link>

          <Link href="/assignments" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-semibold mb-2">Assignments</h2>
            <p className="text-gray-600">View and return assignments</p>
          </Link>

          <Link href="/teachers" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h2 className="text-xl font-semibold mb-2">Teachers</h2>
            <p className="text-gray-600">View teacher assignments</p>
          </Link>

          <Link href="/masters" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-xl font-semibold mb-2">Masters</h2>
            <p className="text-gray-600">Manage labs, vendors, categories</p>
          </Link>

          <Link href="/reports" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📄</div>
            <h2 className="text-xl font-semibold mb-2">Reports</h2>
            <p className="text-gray-600">Generate and export reports</p>
          </Link>

          <Link href="/scrap" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold mb-2">Scrap</h2>
            <p className="text-gray-600">Manage scrap records</p>
          </Link>

          <Link href="/backup" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💾</div>
            <h2 className="text-xl font-semibold mb-2">Backup & Restore</h2>
            <p className="text-gray-600">Export and restore system data</p>
          </Link>
        </div>
      </div>
    </main>
  )
}

