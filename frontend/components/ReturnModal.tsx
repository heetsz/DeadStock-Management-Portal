'use client'

import { useState } from 'react'
import api from '@/lib/api'

interface ReturnModalProps {
  assignment: any
  onClose: () => void
}

export default function ReturnModal({ assignment, onClose }: ReturnModalProps) {
  const [formData, setFormData] = useState({
    return_date: new Date().toISOString().split('T')[0],
    remarks: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`/assignments/${assignment.assignment_id}/return`, formData)
      alert('Asset returned successfully!')
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to return asset')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto m-4">
        <h2 className="text-2xl font-bold mb-6">Return Asset</h2>

        <div className="mb-4 p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Asset:</strong> {assignment.asset_description || 'N/A'}</div>
            <div><strong>Teacher:</strong> {assignment.teacher_name || 'N/A'}</div>
            <div><strong>Quantity:</strong> {assignment.assigned_quantity}</div>
            <div><strong>Assigned Date:</strong> {new Date(assignment.assignment_date).toLocaleDateString()}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Return Date *</label>
            <input
              type="date"
              required
              value={formData.return_date}
              onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Return Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Optional remarks about the return..."
            />
          </div>

          <div className="bg-yellow-50 p-3 rounded mb-4">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Note:</strong> This will mark the assignment as returned. The quantity will become available again.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Return Asset
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

