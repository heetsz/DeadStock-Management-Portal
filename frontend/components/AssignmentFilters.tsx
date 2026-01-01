'use client'

import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'

interface AssignmentFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
}

export default function AssignmentFilters({ filters, onFiltersChange }: AssignmentFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

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

  const { data: teachers } = useQuery('teachers', async () => {
    const res = await api.get('/masters/teachers')
    return res.data
  })

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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Assignments</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                {lab.lab_name}
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
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={localFilters.active_only !== undefined ? (localFilters.active_only ? 'active' : 'all') : 'all'}
            onChange={(e) => updateFilter('active_only', e.target.value === 'active')}
            className="w-full border rounded px-3 py-2"
          >
            <option value="all">All Assignments</option>
            <option value="active">Active Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assignment Date From</label>
          <input
            type="date"
            value={localFilters.assignment_date_from || ''}
            onChange={(e) => updateFilter('assignment_date_from', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assignment Date To</label>
          <input
            type="date"
            value={localFilters.assignment_date_to || ''}
            onChange={(e) => updateFilter('assignment_date_to', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  )
}

