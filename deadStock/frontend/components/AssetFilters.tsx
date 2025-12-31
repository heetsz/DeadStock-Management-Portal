'use client'

import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'

interface AssetFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
}

export default function AssetFilters({ filters, onFiltersChange }: AssetFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  // Sync localFilters when filters prop changes
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const { data: labs } = useQuery('labs', async () => {
    const res = await api.get('/masters/labs')
    return res.data
  })

  const { data: categories } = useQuery('categories', async () => {
    const res = await api.get('/masters/categories')
    return res.data
  })

  const { data: vendors } = useQuery('vendors', async () => {
    const res = await api.get('/masters/vendors')
    return res.data
  })

  const { data: teachers } = useQuery('teachers', async () => {
    const res = await api.get('/masters/teachers')
    return res.data
  })

  const financialYears = []
  for (let year = 2020; year <= new Date().getFullYear() + 1; year++) {
    financialYears.push(`${year}-${year + 1}`)
  }

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value || null }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    const emptyFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Financial Year</label>
          <select
            value={localFilters.financial_year || ''}
            onChange={(e) => updateFilter('financial_year', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Years</option>
            {financialYears.map((fy) => (
              <option key={fy} value={fy}>
                {fy}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lab</label>
          <select
            value={localFilters.lab_id || ''}
            onChange={(e) => updateFilter('lab_id', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Labs</option>
            {labs?.map((lab: any) => (
              <option key={lab.lab_id} value={lab.lab_id}>
                {lab.lab_name} ({lab.room_number})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={localFilters.category_id || ''}
            onChange={(e) => updateFilter('category_id', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories?.map((cat: any) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vendor</label>
          <select
            value={localFilters.vendor_id || ''}
            onChange={(e) => updateFilter('vendor_id', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Vendors</option>
            {vendors?.map((vendor: any) => (
              <option key={vendor.vendor_id} value={vendor.vendor_id}>
                {vendor.vendor_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Issued Status</label>
          <select
            value={localFilters.issued_status || ''}
            onChange={(e) => updateFilter('issued_status', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="issued_only">Issued Only</option>
            <option value="not_issued">Not Issued</option>
            <option value="partially_issued">Partially Issued</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scrap Status</label>
          <select
            value={localFilters.scrap_status || ''}
            onChange={(e) => updateFilter('scrap_status', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Include All</option>
            <option value="scrapped_only">Scrapped Only</option>
            <option value="exclude_scrapped">Exclude Scrapped</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teacher</label>
          <select
            value={localFilters.teacher_id || ''}
            onChange={(e) => updateFilter('teacher_id', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Teachers</option>
            {teachers?.map((teacher: any) => (
              <option key={teacher.teacher_id} value={teacher.teacher_id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            value={localFilters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search description, remarks, vendor..."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Purchase Date From</label>
          <input
            type="date"
            value={localFilters.purchase_date_from || ''}
            onChange={(e) => updateFilter('purchase_date_from', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Purchase Date To</label>
          <input
            type="date"
            value={localFilters.purchase_date_to || ''}
            onChange={(e) => updateFilter('purchase_date_to', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Min Total Cost</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={localFilters.cost_min || ''}
            onChange={(e) => updateFilter('cost_min', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="0.00"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Total Cost</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={localFilters.cost_max || ''}
            onChange={(e) => updateFilter('cost_max', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="0.00"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Min Scrapped Cost</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={localFilters.scrap_cost_min || ''}
            onChange={(e) => updateFilter('scrap_cost_min', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="0.00"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Scrapped Cost</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={localFilters.scrap_cost_max || ''}
            onChange={(e) => updateFilter('scrap_cost_max', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="0.00"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

