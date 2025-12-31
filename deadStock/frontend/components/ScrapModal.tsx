'use client'

import { useState } from 'react'
import api from '@/lib/api'

interface ScrapModalProps {
  asset: any
  onClose: () => void
}

export default function ScrapModal({ asset, onClose }: ScrapModalProps) {
  const [formData, setFormData] = useState({
    scrapped_quantity: 1,
    scrap_date: new Date().toISOString().split('T')[0],
    scrap_phase: 'Phase 1',
    remarks: '',
  })

  const availableQuantity = asset.available_quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post(`/scrap/assets/${asset.asset_id}/scrap`, formData)
      alert(
        `Scrapped ${res.data.scrapped_quantity} units\n` +
        `Scrap Value (Auto-calculated): ₹${Number(res.data.scrap_value).toLocaleString()}`
      )
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to create scrap record')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">Scrap Asset</h2>

        <div className="mb-4 p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">Asset: {asset.description}</div>
          <div className="text-sm text-gray-600">Available Quantity: <strong>{availableQuantity}</strong></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantity to Scrap *</label>
            <input
              type="number"
              required
              min="1"
              max={availableQuantity}
              value={formData.scrapped_quantity}
              onChange={(e) => setFormData({ ...formData, scrapped_quantity: parseInt(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
            <div className="text-xs text-gray-500 mt-1">Max: {availableQuantity}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Scrap Phase *</label>
            <select
              required
              value={formData.scrap_phase}
              onChange={(e) => setFormData({ ...formData, scrap_phase: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Phase 4">Phase 4</option>
              <option value="Phase 5">Phase 5</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Scrap Date *</label>
            <input
              type="date"
              required
              value={formData.scrap_date}
              onChange={(e) => setFormData({ ...formData, scrap_date: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-3 rounded mb-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Scrap value will be auto-calculated</strong> based on:
              <br />
              Current Asset Value ÷ Remaining Quantity × Scrapped Quantity
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Scrap Asset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

