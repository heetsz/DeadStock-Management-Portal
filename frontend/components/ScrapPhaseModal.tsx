'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface ScrapPhaseModalProps {
  phase?: any
  onClose: () => void
  onSuccess: () => void
}

export default function ScrapPhaseModal({ phase, onClose, onSuccess }: ScrapPhaseModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  })

  useEffect(() => {
    if (phase) {
      setFormData({
        name: phase.name || '',
        description: phase.description || '',
        is_active: phase.is_active !== undefined ? phase.is_active : true,
      })
    }
  }, [phase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (phase) {
        await api.put(`/masters/scrap-phases/${phase.phase_id}`, formData)
      } else {
        await api.post('/masters/scrap-phases', formData)
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to save scrap phase')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">{phase ? 'Edit Scrap Phase' : 'Add New Scrap Phase'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phase Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., Phase 1, Phase 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Optional description for this scrap phase"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Active</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {phase ? 'Update' : 'Create'}
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

