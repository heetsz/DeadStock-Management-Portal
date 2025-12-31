'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'

interface AssignmentModalProps {
  asset: any
  onClose: () => void
}

export default function AssignmentModal({ asset, onClose }: AssignmentModalProps) {
  const [formData, setFormData] = useState({
    teacher_id: '',
    assigned_quantity: 1,
    assignment_date: new Date().toISOString().split('T')[0],
    current_location: '',
    remarks: '',
  })

  const { data: teachers } = useQuery('teachers', async () => {
    const res = await api.get('/masters/teachers')
    return res.data
  })

  const availableQuantity = asset.available_quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post(`/assignments/assets/${asset.asset_id}/assign`, formData)
      alert('Asset assigned successfully!')
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to assign asset')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">Assign Asset</h2>

        <div className="mb-4 p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">Asset: {asset.description}</div>
          <div className="text-sm text-gray-600">Available Quantity: <strong>{availableQuantity}</strong></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Teacher *</label>
            <select
              required
              value={formData.teacher_id}
              onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Teacher</option>
              {teachers?.map((teacher: any) => (
                <option key={teacher.teacher_id} value={teacher.teacher_id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity to Assign *</label>
            <input
              type="number"
              required
              min="1"
              max={availableQuantity}
              value={formData.assigned_quantity}
              onChange={(e) => setFormData({ ...formData, assigned_quantity: parseInt(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
            <div className="text-xs text-gray-500 mt-1">Max: {availableQuantity}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Assignment Date *</label>
            <input
              type="date"
              required
              value={formData.assignment_date}
              onChange={(e) => setFormData({ ...formData, assignment_date: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Current Location</label>
            <input
              type="text"
              value={formData.current_location}
              onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
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

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Assign
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

