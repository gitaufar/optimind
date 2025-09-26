"use client"
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import { useContracts } from '@/hooks/useContracts'

const STATUS = ['All', 'Pending Review', 'Reviewed', 'Approved'] as const
const RISK = ['All', 'Low', 'Medium', 'High'] as const

type StatusFilter = typeof STATUS[number]
type RiskFilter = typeof RISK[number]

export default function LegalInbox() {
  const [status, setStatus] = useState<StatusFilter>('All')
  const [risk, setRisk] = useState<RiskFilter>('All')
  const { items, loading } = useContracts({ status, risk })

  return (
    <div className="grid gap-6">
      <Card title="Filter">
        <div className="flex flex-wrap items-center gap-3">
          <Select label="Status" value={status} options={STATUS} onChange={(e) => setStatus(e.target.value as StatusFilter)} />
          <Select label="Risk" value={risk} options={RISK} onChange={(e) => setRisk(e.target.value as RiskFilter)} />
        </div>
      </Card>

      <Card title="Contract Inbox">
        {loading ? (
          <div>Memuat...</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2">Contract Name</th>
                  <th>Parties</th>
                  <th>Contract Value</th>
                  <th>Duration</th>
                  <th>Risk Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="py-2">{c.name}</td>
                    <td>
                      {c.first_party ?? '-'} - {c.second_party ?? '-'}
                    </td>
                    <td>Rp {Number(c.value_rp || 0).toLocaleString('id-ID')}</td>
                    <td>{c.duration_months ?? '-'} bulan</td>
                    <td>{c.risk ?? '-'}</td>
                    <td>{c.status}</td>
                    <td>
                      <Link to={`/legal/contracts/${c.id}`} className="text-blue-600 underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td className="py-6 text-center text-sm text-gray-600" colSpan={7}>
                      Tidak ada kontrak dengan filter saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

function Select<T extends readonly string[]>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T
  value: T[number]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">{label}</span>
      <select className="rounded-lg border px-2 py-1" value={value} onChange={onChange}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
