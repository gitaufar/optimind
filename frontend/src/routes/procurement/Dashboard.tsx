"use client"
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/Card'
import { useProcurementKPI, useContractsList } from '@/hooks/useProcurement'
import type { ContractRow } from '@/types/procurement'

const STATUS_COLORS: Record<string, string> = {
  Approved: 'bg-emerald-100 text-emerald-700',
  'Pending Review': 'bg-amber-100 text-amber-700',
  'Revision Requested': 'bg-rose-100 text-rose-700',
  Draft: 'bg-slate-200 text-slate-700',
}

type StatusFilterKey = 'all' | 'approved' | 'review' | 'new'

export default function ProcurementDashboard() {
  const navigate = useNavigate()
  const { kpi, deltaPct } = useProcurementKPI()
  const { rows } = useContractsList()
  const [statusFilter, setStatusFilter] = useState<StatusFilterKey>('all')

  const filteredRows = useMemo(() => {
    switch (statusFilter) {
      case 'approved':
        return rows.filter((row) => row.status === 'Approved')
      case 'review':
        return rows.filter((row) => row.status === 'Pending Review' || row.status === 'Revision Requested')
      case 'new':
        return rows.filter((row) => row.status === 'Draft')
      default:
        return rows
    }
  }, [rows, statusFilter])

  const latestRows = useMemo(() => filteredRows.slice(0, 5), [filteredRows])

  const formatDelta = (value: number) => {
    if (!Number.isFinite(value)) return '+0% dari bulan lalu'
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value}% dari bulan lalu`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Procurement Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola kontrak dan pantau status persetujuan</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Kontrak Baru Dibuat"
          value={kpi?.new_this_month ?? 0}
          helper={formatDelta(deltaPct)}
          icon="8"
        />
        <KPICard
          title="Menunggu Review Legal"
          value={kpi?.pending_legal_review ?? 0}
          helper="Perlu tindakan"
          icon="8"
          helperClass="text-amber-600"
        />
        <KPICard
          title="Kontrak Disetujui"
          value={kpi?.approved_cnt ?? 0}
          helper={`Approval rate ${(kpi?.approval_rate_pct ?? 0).toFixed(2)}%`}
          icon="8"
        />
      </div>

      <Card title="Status Tracking Kontrak" className="border-none bg-white shadow">
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilterKey)}
          >
            <option value="all">Semua Status</option>
            <option value="approved">Approved</option>
            <option value="review">On Review</option>
            <option value="new">New Contract</option>
          </select>
          <button
            className="inline-flex items-center rounded-xl bg-[#357ABD] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2C6AA2]"
            onClick={() => navigate('/procurement/draft')}
          >
            + Kontrak Baru
          </button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2">No. Kontrak</th>
                <th>Vendor</th>
                <th>Nilai</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {latestRows.map((row) => (
                <TableRow key={row.id} row={row} />
              ))}
              {latestRows.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-slate-500" colSpan={6}>
                    Belum ada data kontrak untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function KPICard({
  title,
  value,
  helper,
  icon,
  helperClass = 'text-emerald-600',
}: {
  title: string
  value: number
  helper: string
  icon: string
  helperClass?: string
}) {
  return (
    <Card className="border-none bg-white shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          <p className={`mt-1 text-xs ${helperClass}`}>{helper}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#357ABD]/15 text-[#357ABD] text-lg">{icon}</div>
      </div>
    </Card>
  )
}

function TableRow({ row }: { row: ContractRow }) {
  return (
    <tr className="border-t">
      <td className="py-2 font-medium text-slate-700">{row.id.slice(0, 8).toUpperCase()}</td>
      <td className="text-slate-600">{row.second_party ?? '-'}</td>
      <td className="text-slate-600">Rp {Number(row.value_rp ?? 0).toLocaleString('id-ID')}</td>
      <td className="text-slate-600">{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
      <td>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_COLORS[row.status] ?? 'bg-slate-200 text-slate-600'
          }`}
        >
          {row.status}
        </span>
      </td>
      <td>
        <a href={`/legal/contracts/${row.id}`} className="text-[#357ABD] hover:underline">
          Lihat
        </a>
      </td>
    </tr>
  )
}
