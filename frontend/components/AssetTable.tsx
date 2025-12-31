'use client'

interface AssetTableProps {
  data: any
  isLoading: boolean
  onAssign: (asset: any) => void
  onScrap: (asset: any) => void
  page: number
  onPageChange: (page: number) => void
}

export default function AssetTable({
  data,
  isLoading,
  onAssign,
  onScrap,
  page,
  onPageChange,
}: AssetTableProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!data?.items?.length) {
    return <div className="text-center py-8">No assets found</div>
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scrapped</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">FY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.items.map((asset: any) => (
              <tr key={asset.asset_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    <a
                      href={`/assets/${asset.asset_id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {asset.description}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.total_quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.active_assigned_quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.available_quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.total_scrapped_quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.financial_year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ₹{Number(asset.current_total_cost).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAssign(asset)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={asset.available_quantity === 0}
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => onScrap(asset)}
                      className="text-red-600 hover:text-red-800"
                      disabled={asset.available_quantity === 0}
                    >
                      Scrap
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {((page - 1) * 50) + 1} to {Math.min(page * 50, data.total)} of {data.total} assets
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= data.pages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

