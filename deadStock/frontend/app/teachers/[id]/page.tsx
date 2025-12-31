'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import ReturnModal from '@/components/ReturnModal'

export default function TeacherDetailPage() {
  const params = useParams()
  const teacherId = params.id as string
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)

  const { data: teacher, isLoading: teacherLoading } = useQuery(
    ['teacher', teacherId],
    async () => {
      const res = await api.get('/masters/teachers')
      const teachers = res.data
      return teachers.find((t: any) => t.teacher_id === teacherId)
    },
    { enabled: !!teacherId }
  )

  const { data: assignments, isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery(
    ['teacher-assignments', teacherId],
    async () => {
      const res = await api.get(`/assignments/teachers/${teacherId}`)
      return res.data
    },
    { enabled: !!teacherId }
  )

  if (teacherLoading || assignmentsLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (!teacher) {
    return <div className="p-8">Teacher not found</div>
  }

  const activeAssignments = assignments?.filter((a: any) => a.status === 'Active') || []
  const returnedAssignments = assignments?.filter((a: any) => a.status === 'Returned') || []
  const totalAssignedValue = activeAssignments.reduce((sum: number, a: any) => sum + (a.assigned_cost || 0), 0)

  return (
    <div className="p-8">
      <div className="mb-6">
        <a href="/teachers" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Teachers
        </a>
        <h1 className="text-3xl font-bold">{teacher.name}</h1>
        <div className="text-gray-600 mt-2">
          <div>{teacher.department}</div>
          <div>{teacher.designation}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Active Assignments</div>
          <div className="text-3xl font-bold">{activeAssignments.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Assigned Value</div>
          <div className="text-3xl font-bold">₹{totalAssignedValue.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Returned Assignments</div>
          <div className="text-3xl font-bold">{returnedAssignments.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <h2 className="text-xl font-semibold p-6 border-b">Active Assignments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeAssignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No active assignments
                  </td>
                </tr>
              ) : (
                activeAssignments.map((assignment: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.asset_description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.assigned_quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ₹{assignment.assigned_cost?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(assignment.assignment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.current_location || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment)
                          setShowReturnModal(true)
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showReturnModal && selectedAssignment && (
        <ReturnModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowReturnModal(false)
            setSelectedAssignment(null)
            refetchAssignments()
          }}
        />
      )}

      {returnedAssignments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Returned Assignments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {returnedAssignments.map((assignment: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.asset_description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.assigned_quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ₹{assignment.assigned_cost?.toLocaleString() || 0}
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
    </div>
  )
}

