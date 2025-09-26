"use client"

import { useMemo } from 'react'
import type { ChangeEvent, InputHTMLAttributes } from 'react'
import { useContractsList, useStatusFiltering } from '@/hooks/useProcurement'
import type { ContractRow, Risk, Status } from '@/types/procurement'

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Pending Review', label: 'Pending Review' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Revision Requested', label: 'Revision Requested' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Active', label: 'Active' },
  { value: 'Expired', label: 'Expired' },
]

const RISK_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'All', label: 'All Risk Levels' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]

const STATUS_BADGE: Partial<Record<Status, string>> = {
  'Pending Review': 'bg-amber-100 text-amber-700 border border-amber-200',
  Approved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'Revision Requested': 'bg-rose-100 text-rose-700 border border-rose-200',
  Draft: 'bg-slate-100 text-slate-600 border border-slate-200',
  Active: 'bg-blue-100 text-blue-700 border border-blue-200',
  Expired: 'bg-slate-200 text-slate-600 border border-slate-300',
  Rejected: 'bg-rose-100 text-rose-700 border border-rose-200',
}

const RISK_BADGE: Partial<Record<Risk, string>> = {
  Low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  High: 'bg-rose-100 text-rose-700 border border-rose-200',
}

const DATE_DISPLAY_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function StatusTracking() {
  const { rows, loading } = useContractsList()
  const { status, setStatus, risk, setRisk, q, setQ, from, setFrom, to, setTo, filtered } = useStatusFiltering(rows)

  const summary = useMemo(() => ({
    total: rows.length,
    visible: filtered.length,
  }), [rows.length, filtered.length])

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Status Tracking</h1>
        <p className="text-sm text-slate-500">Monitor and track all contract statuses and progress.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="grid gap-3 md:grid-cols-5">
          <FilterSelect
            label="Filter by Status"
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
            options={STATUS_OPTIONS}
          />
          <FilterSelect
            label="Filter by Risk"
            value={risk}
            onChange={(event) => setRisk(event.target.value as typeof risk)}
            options={RISK_OPTIONS}
          />
          <FilterInput
            label="Start Date"
            type="date"
            value={from}
            placeholder="Start date"
            onChange={(event) => setFrom(event.target.value)}
          />
          <FilterInput
            label="End Date"
            type="date"
            value={to}
            placeholder="End date"
            onChange={(event) => setTo(event.target.value)}
          />
          <div className="space-y-2">
            <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">Search</span>
            <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:border-[#357ABD] focus-within:ring-2 focus-within:ring-[#357ABD]/20">
              <svg
                aria-hidden
                className="h-4 w-4 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
              <input
                className="ml-2 flex-1 border-0 bg-transparent text-sm text-slate-700 outline-none"
                placeholder="Search contract name or party..."
                value={q}
                onChange={(event) => setQ(event.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">Contract Name</th>
                <th className="px-6 py-3">Parties</th>
                <th className="px-6 py-3">Contract Value</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Risk</th>
                <th className="px-6 py-3">Last Update</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading && (
                <tr>
                  <td className="px-6 py-10 text-center text-slate-500" colSpan={8}>
                    Loading contracts...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-slate-500" colSpan={8}>
                    No contracts match the selected filters.
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((row) => <StatusRow key={row.id} row={row} />)}
            </tbody>
          </table>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 text-xs text-slate-500">
          <span>
            Showing {Math.min(summary.visible, summary.total)} of {summary.total} contracts
          </span>
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Real-time updates enabled
          </div>
        </footer>
      </section>
    </div>
  )
}

function StatusRow({ row }: { row: ContractRow }) {
  const statusClass = STATUS_BADGE[row.status] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
  const riskClass = row.risk ? RISK_BADGE[row.risk] ?? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-slate-100 text-slate-400 border border-slate-200'

  return (
    <tr className="align-top">
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-900">{row.name || 'Unnamed Contract'}</div>
        <div className="text-xs text-slate-500">Contract #{row.id.slice(0, 8).toUpperCase()}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-slate-800">{row.first_party ?? '—'}</div>
        <div className="text-xs text-slate-500">{row.second_party ?? '—'}</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-800">{formatValueShort(row.value_rp)}</div>
      </td>
      <td className="px-6 py-4 text-slate-600">
        {formatDuration(row)}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
          {formatStatusLabel(row.status)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${riskClass}`}>
          {row.risk ?? '—'}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-500">{formatRelativeTime(row.updated_at ?? row.created_at)}</td>
      <td className="px-6 py-4 text-right">
        <a
          href={`/legal/contracts/${row.id}`}
          className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-[#357ABD] transition hover:bg-[#357ABD]/10"
        >
          View Details
        </a>
      </td>
    </tr>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <select
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#357ABD] focus:ring-2 focus:ring-[#357ABD]/20"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function FilterInput({ label, ...inputProps }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <input
        {...inputProps}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#357ABD] focus:ring-2 focus:ring-[#357ABD]/20"
      />
    </div>
  )
}

function formatStatusLabel(status: Status): string {
  return status.replace(/_/g, ' ')
}

function formatDate(value: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return DATE_DISPLAY_FORMATTER.format(date)
}

function formatValueShort(value: number | null): string {
  if (!value) return '—'
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`
  }
  return `Rp ${value.toLocaleString('id-ID')}`
}

function formatDuration(row: ContractRow): string {
  if (row.start_date && row.end_date) {
    return `${formatDate(row.start_date)} – ${formatDate(row.end_date)}`
  }
  if (row.duration_months) {
    return `${row.duration_months} months`
  }
  return '—'
}

function formatRelativeTime(isoDate: string): string {
  if (!isoDate) return '—'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '—'
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
}



