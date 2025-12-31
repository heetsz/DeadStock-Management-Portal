'use client'

import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'
import AssetFilters from '@/components/AssetFilters'
import AssetTable from '@/components/AssetTable'

export default function ReportsPage() {
  const [format, setFormat] = useState<'pdf' | 'csv' | 'xlsx'>('pdf')
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<any>({})
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'view' | 'export'>('view')

  // Load filters from localStorage if available
  useEffect(() => {
    const savedFilters = localStorage.getItem('assetFilters')
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters))
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  // Save filters to localStorage when they change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      localStorage.setItem('assetFilters', JSON.stringify(filters))
    }
  }, [filters])

  // Fetch filtered data for viewing
  const { data, isLoading, refetch } = useQuery(
    ['assets', filters, page],
    async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '50',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== null && v !== '')
        ),
      })
      const res = await api.get(`/assets?${params}`)
      return res.data
    },
    { enabled: viewMode === 'view' }
  )

  const handleExport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ format })
      
      // Add all filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          params.append(key, String(value))
        }
      })

      const res = await api.get(`/reports/assets?${params}`, {
        responseType: 'blob',
      })

      const blob = new Blob([res.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `asset_report_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Reports & Exports</h1>

      <div className="mb-6">
        <AssetFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* View/Export Toggle */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setViewMode('view')}
          className={`px-4 py-2 rounded ${
            viewMode === 'view'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          View Filtered Data
        </button>
        <button
          onClick={() => setViewMode('export')}
          className={`px-4 py-2 rounded ${
            viewMode === 'export'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Export Report
        </button>
      </div>

      {viewMode === 'view' && (
        <div className="mb-6">
          {isLoading ? (
            <div className="text-center py-8">Loading filtered data...</div>
          ) : data?.items?.length > 0 ? (
            <AssetTable
              data={data}
              isLoading={isLoading}
              onAssign={() => {}}
              onScrap={() => {}}
              page={page}
              onPageChange={setPage}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No assets found matching the filters.</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'export' && (
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Export Asset Report</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel (XLSX)</option>
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The report will use the filters applied above. Filters are saved and remembered.
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : `Export as ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
      )}
    </div>
  )
}

