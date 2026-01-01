'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import api from '@/lib/api'
import LabModal from '@/components/LabModal'
import VendorModal from '@/components/VendorModal'
import CategoryModal from '@/components/CategoryModal'
import TeacherModal from '@/components/TeacherModal'
import ScrapPhaseModal from '@/components/ScrapPhaseModal'

export default function MastersPage() {
  const [activeTab, setActiveTab] = useState<'labs' | 'vendors' | 'categories' | 'teachers' | 'scrap-phases'>('labs')
  const [showLabModal, setShowLabModal] = useState(false)
  const [showVendorModal, setShowVendorModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [showScrapPhaseModal, setShowScrapPhaseModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const { data: labs, refetch: refetchLabs } = useQuery('labs', async () => {
    const res = await api.get('/masters/labs')
    return res.data
  })

  const { data: vendors, refetch: refetchVendors } = useQuery('vendors', async () => {
    const res = await api.get('/masters/vendors')
    return res.data
  })

  const { data: categories, refetch: refetchCategories } = useQuery('categories', async () => {
    const res = await api.get('/masters/categories')
    return res.data
  })

  const { data: teachers, refetch: refetchTeachers } = useQuery('teachers', async () => {
    const res = await api.get('/masters/teachers')
    return res.data
  })

  const { data: scrapPhases, refetch: refetchScrapPhases } = useQuery('scrap-phases', async () => {
    const res = await api.get('/masters/scrap-phases')
    return res.data
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Master Data Management</h1>
        <a
          href="/backup"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          💾 Backup & Restore
        </a>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            {(['labs', 'vendors', 'categories', 'teachers', 'scrap-phases'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'scrap-phases' ? 'Scrap Phases' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'labs' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Labs</h2>
                <button
                  onClick={() => {
                    setSelectedItem(null)
                    setShowLabModal(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Add Lab
                </button>
              </div>
              <div className="space-y-2">
                {labs?.map((lab: any) => (
                  <div key={lab.lab_id} className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <div className="font-medium">{lab.lab_name}</div>
                      <div className="text-sm text-gray-600">Room: {lab.room_number || 'N/A'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded ${
                        lab.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lab.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedItem(lab)
                          setShowLabModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete ${lab.lab_name}?`)) {
                            try {
                              await api.delete(`/masters/labs/${lab.lab_id}`)
                              refetchLabs()
                            } catch (error: any) {
                              alert(error.response?.data?.detail || 'Failed to delete lab')
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vendors</h2>
                <button
                  onClick={() => {
                    setSelectedItem(null)
                    setShowVendorModal(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Add Vendor
                </button>
              </div>
              <div className="space-y-2">
                {vendors?.map((vendor: any) => (
                  <div key={vendor.vendor_id} className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <div className="font-medium">{vendor.vendor_name}</div>
                      <div className="text-sm text-gray-600">Bill: {vendor.bill_number || 'N/A'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(vendor)
                          setShowVendorModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete ${vendor.vendor_name}?`)) {
                            try {
                              await api.delete(`/masters/vendors/${vendor.vendor_id}`)
                              refetchVendors()
                            } catch (error: any) {
                              alert(error.response?.data?.detail || 'Failed to delete vendor')
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Categories</h2>
                <button
                  onClick={() => {
                    setSelectedItem(null)
                    setShowCategoryModal(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Add Category
                </button>
              </div>
              <div className="space-y-2">
                {categories?.map((cat: any) => (
                  <div key={cat.category_id} className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <div className="font-medium">{cat.name}</div>
                      {cat.is_special && (
                        <div className="text-xs text-orange-600">Special Hardware</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded ${
                        cat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedItem(cat)
                          setShowCategoryModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete ${cat.name}?`)) {
                            try {
                              await api.delete(`/masters/categories/${cat.category_id}`)
                              refetchCategories()
                            } catch (error: any) {
                              alert(error.response?.data?.detail || 'Failed to delete category')
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Teachers</h2>
                <button
                  onClick={() => {
                    setSelectedItem(null)
                    setShowTeacherModal(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Add Teacher
                </button>
              </div>
              <div className="space-y-2">
                {teachers?.map((teacher: any) => (
                  <div key={teacher.teacher_id} className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-sm text-gray-600">
                        {teacher.department} - {teacher.designation}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded ${
                        teacher.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {teacher.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedItem(teacher)
                          setShowTeacherModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete ${teacher.name}?`)) {
                            try {
                              await api.delete(`/masters/teachers/${teacher.teacher_id}`)
                              refetchTeachers()
                            } catch (error: any) {
                              alert(error.response?.data?.detail || 'Failed to delete teacher')
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scrap-phases' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Scrap Phases</h2>
                <button
                  onClick={() => {
                    setSelectedItem(null)
                    setShowScrapPhaseModal(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Add Scrap Phase
                </button>
              </div>
              <div className="space-y-2">
                {scrapPhases?.map((phase: any) => (
                  <div key={phase.phase_id} className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <div className="font-medium">{phase.name}</div>
                      {phase.description && (
                        <div className="text-sm text-gray-600">{phase.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded ${
                        phase.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {phase.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedItem(phase)
                          setShowScrapPhaseModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete ${phase.name}?`)) {
                            try {
                              await api.delete(`/masters/scrap-phases/${phase.phase_id}`)
                              refetchScrapPhases()
                            } catch (error: any) {
                              alert(error.response?.data?.detail || 'Failed to delete scrap phase')
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showLabModal && (
        <LabModal
          lab={selectedItem}
          onClose={() => {
            setShowLabModal(false)
            setSelectedItem(null)
          }}
          onSuccess={() => {
            refetchLabs()
          }}
        />
      )}

      {showVendorModal && (
        <VendorModal
          vendor={selectedItem}
          onClose={() => {
            setShowVendorModal(false)
            setSelectedItem(null)
          }}
          onSuccess={() => {
            refetchVendors()
          }}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          category={selectedItem}
          onClose={() => {
            setShowCategoryModal(false)
            setSelectedItem(null)
          }}
          onSuccess={() => {
            refetchCategories()
          }}
        />
      )}

      {showTeacherModal && (
        <TeacherModal
          teacher={selectedItem}
          onClose={() => {
            setShowTeacherModal(false)
            setSelectedItem(null)
          }}
          onSuccess={() => {
            refetchTeachers()
          }}
        />
      )}

      {showScrapPhaseModal && (
        <ScrapPhaseModal
          phase={selectedItem}
          onClose={() => {
            setShowScrapPhaseModal(false)
            setSelectedItem(null)
          }}
          onSuccess={() => {
            refetchScrapPhases()
          }}
        />
      )}
    </div>
  )
}

