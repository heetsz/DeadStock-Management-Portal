'use client'

import { useQuery } from 'react-query'
import api from '@/lib/api'

export default function TeachersPage() {
  const { data: teachers, isLoading } = useQuery('teachers', async () => {
    const res = await api.get('/masters/teachers')
    return res.data
  })

  const { data: assignments } = useQuery(
    'all-assignments',
    async () => {
      const allAssignments = []
      if (teachers) {
        for (const teacher of teachers) {
          try {
            const res = await api.get(`/assignments/teachers/${teacher.teacher_id}`)
            allAssignments.push(...res.data.map((a: any) => ({ ...a, teacher_name: teacher.name })))
          } catch (e) {
            // Skip if no assignments
          }
        }
      }
      return allAssignments
    },
    { enabled: !!teachers }
  )

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Teachers & Assignments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {teachers?.map((teacher: any) => (
          <div key={teacher.teacher_id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">{teacher.name}</h2>
            <div className="text-sm text-gray-600 mb-4">
              <div>{teacher.department}</div>
              <div>{teacher.designation}</div>
            </div>
            <a
              href={`/teachers/${teacher.teacher_id}`}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Assignments →
            </a>
            <div className="mt-2 text-xs text-gray-500">
              Active: {assignments?.filter((a: any) => a.teacher_name === teacher.name && a.status === 'Active').length || 0}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">All Assignments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments?.map((assignment: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.teacher_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.asset_description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.assigned_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ₹{assignment.assigned_cost?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      assignment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

