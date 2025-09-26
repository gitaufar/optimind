"use client"

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useContractsList } from '@/hooks/useProcurement'
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  Info, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  Upload,
  ArrowLeft,
  FileText
} from 'lucide-react'

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { rows } = useContractsList()
  
  // Find the contract by ID
  const contract = rows.find(row => row.id === id)
  
  if (!contract) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Contract Not Found</h2>
          <p className="text-gray-500">The requested contract could not be found.</p>
          <button
            onClick={() => navigate('/procurement/status')}
            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Back to Status Tracking
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Revision Requested':
        return 'bg-red-100 text-red-700 border border-red-200'
      case 'Submitted':
        return 'bg-gray-100 text-gray-600 border border-gray-300'
      case 'Reviewed':
        return 'bg-orange-100 text-orange-700 border border-orange-200'
      case 'Approved':
        return 'bg-green-100 text-green-700 border border-green-200'
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-300'
    }
  }

  const getProgressSteps = () => {
    const steps = [
      { name: 'Draft', status: 'completed' },
      { name: 'Legal Review', status: 'completed' },
      { name: 'Revision', status: contract.status === 'Revision Requested' ? 'current' : 'pending' },
      { name: 'Approved Manager', status: contract.status === 'Approved' ? 'completed' : 'pending' }
    ]
    return steps
  }

  const formatValue = (value: number | null) => {
    if (!value) return 'Rp 0'
    return `Rp ${value.toLocaleString('id-ID')}`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const progressSteps = getProgressSteps()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contract.name || 'Untitled Contract'}</h1>
            <p className="text-sm text-gray-500">Contract ID: #{contract.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <button
            onClick={() => navigate('/procurement/status')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to Status Tracking
          </button>
        </div>

        {/* Contract Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Contract Info */}
          <div className="space-y-6">
            {/* Parties */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Contract Parties</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pihak Pertama</p>
                    <p className="text-sm text-gray-600">{contract.first_party || 'PT ILCS'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pihak Kedua</p>
                    <p className="text-sm text-gray-600">{contract.second_party || 'PT Teknologi Maju Indonesia'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Contract Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nilai Kontrak</p>
                    <p className="text-sm text-gray-600">{formatValue(contract.value_rp)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Durasi Kontrak</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status Saat Ini</p>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Progress & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Status */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Progress Status</h3>
              <div className="flex items-center">
                {progressSteps.map((step, index) => (
                  <div key={step.name} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        step.status === 'completed' ? 'bg-blue-500' :
                        step.status === 'current' ? 'bg-red-500' : 'bg-gray-300'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : step.status === 'current' ? (
                          <AlertCircle className="h-5 w-5 text-white" />
                        ) : (
                          <Clock className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-xs font-medium text-gray-900">{step.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{step.status}</p>
                      </div>
                    </div>
                    {index < progressSteps.length - 1 && (
                      <div className={`h-0.5 w-16 mx-4 ${
                        step.status === 'completed' ? 'bg-blue-500' :
                        step.status === 'current' ? 'bg-red-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Feedback */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Legal Feedback</h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Legal Officer</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Terdapat beberapa klausul yang perlu diperbaiki pada bagian force majeure dan liability limitation. 
                    Silakan revisi sesuai dengan template standar perusahaan yang telah dikirimkan via email.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">Legal Officer</span>
                    <span className="text-xs text-gray-500">5 days ago</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Dokumen kontrak telah direview. Secara keseluruhan sudah baik, namun ada beberapa poin yang 
                    memerlukan klarifikasi lebih lanjut.
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Document */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Uploaded Document</h3>
              <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <FileText className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Kontrak_Pengadaan_Server_IT_2024.pdf</p>
                  <p className="text-sm text-gray-500">2.4 MB • Uploaded 3 days ago</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600">
                    <Download size={16} />
                    Download
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Eye size={16} />
                    Open Viewer
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
                <Upload size={16} />
                Upload Revisi Kontrak
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
