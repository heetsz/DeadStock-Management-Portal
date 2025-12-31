'use client'

import { useState } from 'react'
import api from '@/lib/api'

export default function BackupPage() {
  const [loading, setLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [restoreFile, setRestoreFile] = useState<File | null>(null)

  const handleBackup = async () => {
    setLoading(true)
    try {
      const res = await api.get('/backup/export', {
        responseType: 'blob',
      })

      const blob = new Blob([res.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `deadstock_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert('Backup downloaded successfully!')
    } catch (error) {
      alert('Failed to create backup')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    if (!restoreFile) {
      alert('Please select a backup file')
      return
    }

    if (!confirm('WARNING: This will replace ALL existing data! Are you sure you want to continue?')) {
      return
    }

    setRestoreLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', restoreFile)

      const res = await api.post('/backup/restore', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      alert(
        `Backup restored successfully!\n\n` +
        `Labs: ${res.data.labs}\n` +
        `Vendors: ${res.data.vendors}\n` +
        `Categories: ${res.data.categories}\n` +
        `Teachers: ${res.data.teachers}\n` +
        `Assets: ${res.data.assets}\n` +
        `Assignments: ${res.data.assignments}\n` +
        `Scraps: ${res.data.scraps}`
      )
      
      // Reload page to refresh data
      window.location.reload()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to restore backup')
    } finally {
      setRestoreLoading(false)
      setRestoreFile(null)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Backup & Restore</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Export Backup</h2>
          <p className="text-gray-600 mb-4">
            Create a complete backup of all system data including:
            Labs, Vendors, Categories, Teachers, Assets, Assignments, and Scrap records.
          </p>
          <button
            onClick={handleBackup}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating Backup...' : 'Download Backup'}
          </button>
        </div>

        {/* Restore Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Restore Backup</h2>
          <p className="text-gray-600 mb-4">
            <strong className="text-red-600">WARNING:</strong> This will replace ALL existing data with the backup file.
            Make sure you have a current backup before restoring.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Backup File</label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              onClick={handleRestore}
              disabled={restoreLoading || !restoreFile}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {restoreLoading ? 'Restoring...' : 'Restore Backup'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
        <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
          <li>Backup files are in JSON format and contain all system data</li>
          <li>Regular backups are recommended before making major changes</li>
          <li>Restore will completely replace all existing data</li>
          <li>Backup files can be large if you have many records</li>
          <li>Keep backup files in a safe location</li>
        </ul>
      </div>
    </div>
  )
}

