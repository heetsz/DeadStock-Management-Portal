'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'

export default function ScrapPage() {
  const [filters, setFilters] = useState({
    scrap_phase: '',
    financial_year: '',
  })

  const { data: scrapData, isLoading } = useQuery(
    ['scrap', filters],
    async () => {
      const params = new URLSearchParams()
      if (filters.scrap_phase) params.append('scrap_phase', filters.scrap_phase)
      if (filters.financial_year) params.append('financial_year', filters.financial_year)
      const res = await api.get(`/scrap?${params}`)
      return res.data
    }
  )

  const { data: phaseSummary } = useQuery('scrap-phase-summary', async () => {
    const res = await api.get('/scrap/summary-by-phase')
    return res.data
  })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Scrap Management</h1>

      {/* Phase Summary */}
      {phaseSummary && phaseSummary.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Scrap Summary by Phase</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {phaseSummary.map((phase: any) => (
              <div key={phase.scrap_phase} className="border rounded p-4">
                <div className="font-semibold mb-2">{phase.scrap_phase}</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Assets: {phase.assets_count}</div>
                  <div>Quantity: {phase.total_quantity_scrapped}</div>
                  <div>Value: ₹{Number(phase.total_scrap_value).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Scrap Phase</label>
            <select
              value={filters.scrap_phase}
              onChange={(e) => setFilters({ ...filters, scrap_phase: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Phases</option>
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Phase 4">Phase 4</option>
              <option value="Phase 5">Phase 5</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Financial Year</label>
            <input
              type="text"
              value={filters.financial_year}
              onChange={(e) => setFilters({ ...filters, financial_year: e.target.value })}
              placeholder="2024-2025"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Scrap Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scrap Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : scrapData?.items?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">No scrap records found</td>
                </tr>
              ) : (
                scrapData?.items?.map((scrap: any) => (
                  <tr key={scrap.scrap_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{scrap.asset_description || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{scrap.scrap_phase}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{scrap.scrapped_quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ₹{Number(scrap.scrap_value).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(scrap.scrap_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">{scrap.remarks || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

