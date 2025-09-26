"use client"

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProcurementKPI, useContractsList } from '@/hooks/useProcurement'
import type { ContractRow, Status } from '@/types/procurement'

const STATUS_BADGE: Partial<Record<Status, string>> = {
  Approved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'Pending Review': 'bg-amber-100 text-amber-700 border border-amber-200',
  'Revision Requested': 'bg-rose-100 text-rose-700 border border-rose-200',
  Draft: 'bg-slate-100 text-slate-600 border border-slate-200',
  Active: 'bg-blue-100 text-blue-700 border border-blue-200',
}

const STATUS_FILTERS: Array<{ id: 'all' | 'approved' | 'review' | 'new'; label: string }> = [
  { id: 'all', label: 'All Status' },
  { id: 'approved', label: 'Approved' },
  { id: 'review', label: 'On Review' },
  { id: 'new', label: 'New Contract' },
]

const numberFormatter = new Intl.NumberFormat('id-ID')
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export default function ProcurementDashboard() {
  const navigate = useNavigate()
  const { kpi, deltaPct } = useProcurementKPI()
  const { rows } = useContractsList()
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'review' | 'new'>('all')

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

  const latestRows = useMemo(() => filteredRows.slice(0, 4), [filteredRows])

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Procurement Dashboard</h1>
        <p className="text-sm text-slate-500">Manage contracts and monitor approval status.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="New Contracts"
          value={kpi?.new_this_month ?? 0}
          helper={formatDelta(deltaPct)}
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
          iconClass="bg-blue-50 text-blue-600"
        />
        <MetricCard
          title="Pending Legal Review"
          value={kpi?.pending_legal_review ?? 0}
          helper="Awaiting action"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
          iconClass="bg-amber-50 text-amber-600"
        />
        <MetricCard
          title="Approved Contracts"
          value={kpi?.approved_cnt ?? 0}
          helper={`${formatApprovalRate(kpi?.approval_rate_pct ?? 0)} approval rate`}
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          }
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Contract Status Tracking</h2>
            <p className="text-sm text-slate-500">Latest updates from your ongoing procurement contracts.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#357ABD] focus:ring-2 focus:ring-[#357ABD]/20"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            >
              {STATUS_FILTERS.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-[#357ABD] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2e6dad]"
              onClick={() => navigate('/procurement/draft')}
            >
              + Create Contract
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Contract ID</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {latestRows.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-500" colSpan={6}>
                    No contracts found for this filter.
                  </td>
                </tr>
              )}
              {latestRows.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  title,
  value,
  helper,
  icon,
  iconClass,
}: {
  title: string
  value: number
  helper: string
  icon: React.ReactNode
  iconClass: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-emerald-600">{helper}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${iconClass}`}>{icon}</span>
      </div>
    </div>
  )
}

function Row({ row }: { row: ContractRow }) {
  const statusClass = STATUS_BADGE[row.status] ?? 'bg-slate-100 text-slate-600 border border-slate-200'

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-900">{row.id.slice(0, 12).toUpperCase()}</div>
        <div className="text-xs text-slate-500">{row.name || 'Untitled contract'}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-slate-800">{row.first_party || 'N/A'}</div>
        <div className="text-xs text-slate-500">{row.second_party || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 font-semibold text-slate-800">{formatValue(row.value_rp)}</td>
      <td className="px-6 py-4 text-slate-600">{formatDate(row.created_at)}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
          {formatStatus(row.status)}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <a
          href={`/legal/contracts/${row.id}`}
          className="inline-flex items-center rounded-full bg-[#357ABD]/10 px-3 py-1 text-xs font-semibold text-[#357ABD] transition hover:bg-[#357ABD]/20"
        >
          View Details
        </a>
      </td>
    </tr>
  )
}

function formatDelta(value: number): string {
  if (!Number.isFinite(value)) return '+0% from last month'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}% from last month`
}

function formatApprovalRate(rate: number): string {
  return `${Math.round(rate)}%`
}

function formatValue(value: number | null): string {
  if (!value) return 'Rp 0'
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`
  }
  return `Rp ${numberFormatter.format(value)}`
}

function formatDate(value: string): string {
  if (!value) return '�'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '�'
  return dateFormatter.format(date)
}

function formatStatus(status: Status): string {
  return status.replace(/_/g, ' ')
}
