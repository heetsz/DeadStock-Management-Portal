'use client'

import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'
import AssetFilters from '@/components/AssetFilters'
import AssetTable from '@/components/AssetTable'
import AssetModal from '@/components/AssetModal'
import AssignmentModal from '@/components/AssignmentModal'
import ScrapModal from '@/components/ScrapModal'

export default function AssetsPage() {
  const [filters, setFilters] = useState<any>({})
  const [showAssetModal, setShowAssetModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showScrapModal, setShowScrapModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [showExportMenu, setShowExportMenu] = useState(false)

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
    }
  )

  const handleAssign = (asset: any) => {
    setSelectedAsset(asset)
    setShowAssignmentModal(true)
  }

  const handleScrap = (asset: any) => {
    setSelectedAsset(asset)
    setShowScrapModal(true)
  }

  // Save filters to localStorage
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    localStorage.setItem('assetFilters', JSON.stringify(newFilters))
  }

  // Load filters from localStorage on mount
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

  const handleExport = async (exportFormat: 'pdf' | 'csv' | 'xlsx') => {
    try {
      const params = new URLSearchParams({ format: exportFormat })
      
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
      a.download = `asset_report_${new Date().toISOString().split('T')[0]}.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Failed to generate report')
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Assets</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowExportMenu(!showExportMenu)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
            >
              Export ▼
            </button>
            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-20 border">
                  <button
                    onClick={() => {
                      handleExport('pdf')
                      setShowExportMenu(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => {
                      handleExport('csv')
                      setShowExportMenu(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => {
                      handleExport('xlsx')
                      setShowExportMenu(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b"
                  >
                    Excel
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setShowAssetModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            + Add Asset
          </button>
        </div>
      </div>

      <AssetFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <AssetTable
        data={data}
        isLoading={isLoading}
        onAssign={handleAssign}
        onScrap={handleScrap}
        page={page}
        onPageChange={setPage}
      />

      {showAssetModal && (
        <AssetModal
          onClose={() => {
            setShowAssetModal(false)
            refetch()
          }}
        />
      )}

      {showAssignmentModal && selectedAsset && (
        <AssignmentModal
          asset={selectedAsset}
          onClose={() => {
            setShowAssignmentModal(false)
            setSelectedAsset(null)
            refetch()
          }}
        />
      )}

      {showScrapModal && selectedAsset && (
        <ScrapModal
          asset={selectedAsset}
          onClose={() => {
            setShowScrapModal(false)
            setSelectedAsset(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}

