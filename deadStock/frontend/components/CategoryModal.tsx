'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface CategoryModalProps {
  category?: any
  onClose: () => void
  onSuccess: () => void
}

export default function CategoryModal({ category, onClose, onSuccess }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    is_special: false,
    is_active: true,
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        is_special: category.is_special || false,
        is_active: category.is_active !== undefined ? category.is_active : true,
      })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (category) {
        await api.put(`/masters/categories/${category.category_id}`, formData)
      } else {
        await api.post('/masters/categories', formData)
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to save category')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">{category ? 'Edit Category' : 'Add New Category'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_special}
              onChange={(e) => setFormData({ ...formData, is_special: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Special Hardware</label>
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
              {category ? 'Update' : 'Create'}
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

