'use client'

import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'
import ReturnModal from '@/components/ReturnModal'
import AssignmentFilters from '@/components/AssignmentFilters'

export default function AssignmentsPage() {
  const [filters, setFilters] = useState<any>({ active_only: true })
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const { data: assignments, isLoading, refetch } = useQuery(
    ['assignments', filters],
    async () => {
      const params = new URLSearchParams()
      if (filters.active_only) {
        params.append('active_only', 'true')
      }
      if (filters.teacher_id) {
        params.append('teacher_id', filters.teacher_id)
      }
      if (filters.asset_id) {
        params.append('asset_id', filters.asset_id)
      }
      const res = await api.get(`/assignments?${params}`)
      return res.data
    }
  )

  // Save filters to localStorage
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    localStorage.setItem('assignmentFilters', JSON.stringify(newFilters))
  }

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('assignmentFilters')
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters))
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  const handleExport = async (exportFormat: 'pdf' | 'csv' | 'xlsx') => {
    setExportLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('format', exportFormat)
      if (filters.teacher_id) params.append('teacher_id', filters.teacher_id)
      if (filters.lab_id) params.append('lab_id', filters.lab_id)
      if (filters.category_id) params.append('category_id', filters.category_id)
      if (filters.active_only) params.append('active_only', 'true')
      if (filters.assignment_date_from) params.append('assignment_date_from', filters.assignment_date_from)
      if (filters.assignment_date_to) params.append('assignment_date_to', filters.assignment_date_to)

      const res = await api.get(`/reports/assignments?${params}`, {
        responseType: 'blob',
      })

      const blob = new Blob([res.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `assignment_report_${new Date().toISOString().split('T')[0]}.${exportFormat === 'xlsx' ? 'xlsx' : exportFormat}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert('Assignment report downloaded successfully!')
      setShowExportMenu(false)
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to export assignments')
    } finally {
      setExportLoading(false)
    }
  }

  const handleReturn = (assignment: any) => {
    setSelectedAssignment(assignment)
    setShowReturnModal(true)
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  const activeAssignments = assignments?.filter((a: any) => !a.return_date) || []
  const returnedAssignments = assignments?.filter((a: any) => a.return_date) || []

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              📥 Export
              {exportLoading && <span className="ml-2">...</span>}
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                <button
                  onClick={() => handleExport('pdf')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                >
                  📄 Export as PDF
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  📊 Export as CSV
                </button>
                <button
                  onClick={() => handleExport('xlsx')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                >
                  📈 Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AssignmentFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Active Assignments */}
      {activeAssignments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <h2 className="text-xl font-semibold p-6 border-b bg-green-50">Active Assignments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeAssignments.map((assignment: any) => (
                  <tr key={assignment.assignment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {assignment.asset_description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {assignment.teacher_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.assigned_quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(assignment.assignment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.current_location || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleReturn(assignment)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Returned Assignments */}
      {!filters.active_only && returnedAssignments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b bg-gray-50">Returned Assignments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {returnedAssignments.map((assignment: any) => (
                  <tr key={assignment.assignment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {assignment.asset_description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {assignment.teacher_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.assigned_quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(assignment.assignment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(assignment.return_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {assignments?.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No assignments found</p>
        </div>
      )}

      {showReturnModal && selectedAssignment && (
        <ReturnModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowReturnModal(false)
            setSelectedAssignment(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}

