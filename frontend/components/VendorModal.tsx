'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface VendorModalProps {
  vendor?: any
  onClose: () => void
  onSuccess: () => void
}

export default function VendorModal({ vendor, onClose, onSuccess }: VendorModalProps) {
  const [formData, setFormData] = useState({
    vendor_name: '',
    bill_number: '',
    contact_info: '',
  })

  useEffect(() => {
    if (vendor) {
      setFormData({
        vendor_name: vendor.vendor_name || '',
        bill_number: vendor.bill_number || '',
        contact_info: vendor.contact_info || '',
      })
    }
  }, [vendor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (vendor) {
        await api.put(`/masters/vendors/${vendor.vendor_id}`, formData)
      } else {
        await api.post('/masters/vendors', formData)
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to save vendor')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">{vendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vendor Name *</label>
            <input
              type="text"
              required
              value={formData.vendor_name}
              onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bill Number</label>
            <input
              type="text"
              value={formData.bill_number}
              onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Info</label>
            <textarea
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {vendor ? 'Update' : 'Create'}
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

