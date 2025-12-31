'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface LabModalProps {
  lab?: any
  onClose: () => void
  onSuccess: () => void
}

export default function LabModal({ lab, onClose, onSuccess }: LabModalProps) {
  const [formData, setFormData] = useState({
    lab_name: '',
    room_number: '',
    status: 'ACTIVE',
  })

  useEffect(() => {
    if (lab) {
      setFormData({
        lab_name: lab.lab_name || '',
        room_number: lab.room_number || '',
        status: lab.status || 'ACTIVE',
      })
    }
  }, [lab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (lab) {
        await api.put(`/masters/labs/${lab.lab_id}`, formData)
      } else {
        await api.post('/masters/labs', formData)
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to save lab')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">{lab ? 'Edit Lab' : 'Add New Lab'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lab Name *</label>
            <input
              type="text"
              required
              value={formData.lab_name}
              onChange={(e) => setFormData({ ...formData, lab_name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Lab 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Room Number</label>
            <input
              type="text"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="602"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {lab ? 'Update' : 'Create'}
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

