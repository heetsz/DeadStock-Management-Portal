'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'

interface AssetModalProps {
  onClose: () => void
}

export default function AssetModal({ onClose }: AssetModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    category_id: '',
    is_special_hardware: false,
    total_quantity: 1,
    purchase_date: new Date().toISOString().split('T')[0],
    vendor_id: '',
    original_total_cost: '',
    lab_id: '',
    physical_location: '',
    remarks: '',
  })

  const { data: categories } = useQuery('categories', async () => {
    const res = await api.get('/masters/categories')
    return res.data
  })

  const { data: vendors } = useQuery('vendors', async () => {
    const res = await api.get('/masters/vendors')
    return res.data
  })

  const { data: labs } = useQuery('labs', async () => {
    const res = await api.get('/masters/labs')
    return res.data
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/assets', formData)
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to create asset')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <h2 className="text-2xl font-bold mb-6">Add New Asset</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories?.map((cat: any) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Quantity *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.total_quantity}
                onChange={(e) => setFormData({ ...formData, total_quantity: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Date *</label>
              <input
                type="date"
                required
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Original Cost *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.original_total_cost}
                onChange={(e) => setFormData({ ...formData, original_total_cost: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vendor</label>
              <select
                value={formData.vendor_id}
                onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Vendor</option>
                {vendors?.map((vendor: any) => (
                  <option key={vendor.vendor_id} value={vendor.vendor_id}>
                    {vendor.vendor_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lab</label>
              <select
                value={formData.lab_id}
                onChange={(e) => setFormData({ ...formData, lab_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Lab</option>
                {labs?.map((lab: any) => (
                  <option key={lab.lab_id} value={lab.lab_id}>
                    {lab.lab_name} ({lab.room_number})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Physical Location</label>
            <input
              type="text"
              value={formData.physical_location}
              onChange={(e) => setFormData({ ...formData, physical_location: e.target.value })}
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
              Create Asset
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

