'use client'

import { useQuery } from 'react-query'
import api from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery('dashboard', async () => {
    const res = await api.get('/reports/dashboard')
    return res.data
  })

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Assets</div>
          <div className="text-3xl font-bold">{stats?.total_assets || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Quantity Purchased</div>
          <div className="text-3xl font-bold">{stats?.total_quantity_purchased || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Original Cost</div>
          <div className="text-3xl font-bold">₹{stats?.total_original_cost?.toLocaleString() || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Current Cost</div>
          <div className="text-3xl font-bold">₹{stats?.total_current_cost?.toLocaleString() || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Assigned Quantity</div>
          <div className="text-3xl font-bold">{stats?.total_assigned_quantity || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Scrapped Quantity</div>
          <div className="text-3xl font-bold">{stats?.total_scrapped_quantity || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Available Quantity</div>
          <div className="text-3xl font-bold">{stats?.total_available_quantity || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Assets Shared</div>
          <div className="text-3xl font-bold">{stats?.assets_with_multiple_teachers || 0}</div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quantity Distribution</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={[
                { name: 'Assigned', value: stats?.total_assigned_quantity || 0 },
                { name: 'Scrapped', value: stats?.total_scrapped_quantity || 0 },
                { name: 'Available', value: stats?.total_available_quantity || 0 },
              ]}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {[0, 1, 2].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
          <BarChart width={400} height={300} data={[
            { name: 'Original', value: stats?.total_original_cost || 0 },
            { name: 'Current', value: stats?.total_current_cost || 0 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </div>
      </div>
    </div>
  )
}

