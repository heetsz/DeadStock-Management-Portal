'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'
import ReturnModal from '@/components/ReturnModal'

export default function AssignmentsPage() {
  const [activeOnly, setActiveOnly] = useState(true)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)

  const { data: assignments, isLoading, refetch } = useQuery(
    ['assignments', activeOnly],
    async () => {
      const params = new URLSearchParams()
      if (activeOnly) {
        params.append('active_only', 'true')
      }
      const res = await api.get(`/assignments?${params}`)
      return res.data
    }
  )

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
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Show Active Only</span>
          </label>
        </div>
      </div>

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
      {!activeOnly && returnedAssignments.length > 0 && (
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

