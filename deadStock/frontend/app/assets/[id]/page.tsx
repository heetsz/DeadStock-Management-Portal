'use client'

import { useParams } from 'next/navigation'
import { useQuery } from 'react-query'
import api from '@/lib/api'
import ReturnModal from '@/components/ReturnModal'
import AssignmentModal from '@/components/AssignmentModal'
import ScrapModal from '@/components/ScrapModal'
import { useState } from 'react'

export default function AssetDetailPage() {
  const params = useParams()
  const assetId = params.id as string
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showScrapModal, setShowScrapModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)

  const { data: asset, isLoading: assetLoading, refetch: refetchAsset } = useQuery(
    ['asset', assetId],
    async () => {
      const res = await api.get(`/assets/${assetId}`)
      return res.data
    },
    { enabled: !!assetId }
  )

  const { data: assignments, isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery(
    ['assignments', assetId],
    async () => {
      const res = await api.get(`/assignments?asset_id=${assetId}`)
      return res.data
    },
    { enabled: !!assetId }
  )

  const { data: scrapHistory } = useQuery(
    ['scrap-history', assetId],
    async () => {
      const res = await api.get(`/scrap/assets/${assetId}/history`)
      return res.data
    },
    { enabled: !!assetId }
  )

  if (assetLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (!asset) {
    return <div className="p-8">Asset not found</div>
  }

  const activeAssignments = assignments?.filter((a: any) => !a.return_date) || []
  const returnedAssignments = assignments?.filter((a: any) => a.return_date) || []

  return (
    <div className="p-8">
      <div className="mb-6">
        <a href="/assets" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Assets
        </a>
        <h1 className="text-3xl font-bold">{asset.description}</h1>
      </div>

      {/* Asset Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Quantity</div>
          <div className="text-3xl font-bold">{asset.total_quantity}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Assigned</div>
          <div className="text-3xl font-bold text-blue-600">{asset.active_assigned_quantity}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Available</div>
          <div className="text-3xl font-bold text-green-600">{asset.available_quantity}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Scrapped</div>
          <div className="text-3xl font-bold text-red-600">{asset.total_scrapped_quantity}</div>
        </div>
      </div>

      {/* Asset Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Asset Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Financial Year</div>
            <div className="font-medium">{asset.financial_year}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Purchase Date</div>
            <div className="font-medium">{new Date(asset.purchase_date).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Original Cost</div>
            <div className="font-medium">₹{Number(asset.original_total_cost).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Current Cost</div>
            <div className="font-medium">₹{Number(asset.current_total_cost).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowAssignmentModal(true)}
          disabled={asset.available_quantity === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          + Assign Asset
        </button>
        <button
          onClick={() => setShowScrapModal(true)}
          disabled={asset.available_quantity === 0}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Scrap Asset
        </button>
      </div>

      {/* Active Assignments */}
      {activeAssignments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <h2 className="text-xl font-semibold p-6 border-b">Active Assignments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                      {assignment.teacher_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.assigned_quantity}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Returned Assignments */}
      {returnedAssignments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <h2 className="text-xl font-semibold p-6 border-b">Returned Assignments (History)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {returnedAssignments.map((assignment: any) => (
                  <tr key={assignment.assignment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.teacher_name || 'N/A'}</td>
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

      {/* Scrap History */}
      {scrapHistory?.scrap_history?.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Scrap History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phase</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scrap Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scrapHistory.scrap_history.map((scrap: any) => (
                  <tr key={scrap.scrap_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{scrap.scrap_phase}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{scrap.scrapped_quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ₹{Number(scrap.scrap_value).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(scrap.scrap_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">{scrap.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showReturnModal && selectedAssignment && (
        <ReturnModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowReturnModal(false)
            setSelectedAssignment(null)
            refetchAsset()
            refetchAssignments()
          }}
        />
      )}

      {showAssignmentModal && (
        <AssignmentModal
          asset={asset}
          onClose={() => {
            setShowAssignmentModal(false)
            refetchAsset()
            refetchAssignments()
          }}
        />
      )}

      {showScrapModal && (
        <ScrapModal
          asset={asset}
          onClose={() => {
            setShowScrapModal(false)
            refetchAsset()
          }}
        />
      )}
    </div>
  )
}

