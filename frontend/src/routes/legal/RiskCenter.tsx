"use client"
import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import Card from '@/components/Card'
import { useContracts } from '@/hooks/useContracts'

export default function LegalRiskCenter() {
  const { items } = useContracts()
  const [fltRisk, setFltRisk] = useState<'Low' | 'Medium' | 'High' | 'All'>('All')
  const [fltStatus, setFltStatus] = useState<'Pending Review' | 'Reviewed' | 'Revision Requested' | 'All'>('All')
  const [sortBy] = useState<'value'>('value')

  const highCount = items.filter((i) => i.risk === 'High').length
  const medCount = items.filter((i) => i.risk === 'Medium').length
  const lowCount = items.filter((i) => i.risk === 'Low').length

  const filtered = useMemo(() => {
    return items
      .filter((i) => (fltRisk === 'All' ? true : i.risk === fltRisk))
      .filter((i) => (fltStatus === 'All' ? true : i.status === fltStatus))
      .sort((a, b) => Number(b.value_rp || 0) - Number(a.value_rp || 0))
  }, [items, fltRisk, fltStatus, sortBy])

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="High Risk Clauses">
          <Big n={highCount} trend="+12%" />
        </Card>
        <Card title="Medium Risk Clauses">
          <Big n={medCount} trend="-5%" />
        </Card>
        <Card title="Low Risk Clauses">
          <Big n={lowCount} trend="+2%" />
        </Card>
      </div>

      <Card
        title="Filters"
        right={
          <button className="rounded-xl border px-3 py-1" onClick={() => exportReport()}>
            Export Report
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Select
            label="Risk Level"
            value={fltRisk}
            onChange={(e) => setFltRisk(e.target.value as typeof fltRisk)}
            options={['All', 'Low', 'Medium', 'High']}
          />
          <Select
            label="Status"
            value={fltStatus}
            onChange={(e) => setFltStatus(e.target.value as typeof fltStatus)}
            options={['All', 'Pending Review', 'Reviewed', 'Revision Requested']}
          />
          <Select label="Sort" value={sortBy} onChange={() => {}} options={['Sort by Contract Value']} />
        </div>
      </Card>

      <Card title="Contracts">
        <div className="grid gap-3">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-600">
                  {c.second_party ?? '-'} - Rp {Number(c.value_rp || 0).toLocaleString('id-ID')}
                </div>
              </div>
              <div className="text-sm">{c.risk ?? '-'}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-gray-600">Tidak ada kontrak yang cocok dengan filter.</div>
          )}
        </div>
      </Card>
    </div>
  )
}

function Big({ n, trend }: { n: number; trend: string }) {
  return (
    <div>
      <div className="text-3xl font-bold">{n}</div>
      <div className="text-xs text-gray-500">vs last month {trend}</div>
    </div>
  )
}

function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly any[]
  value: any
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">{label}</span>
      <select className="rounded-lg border px-2 py-1" value={value} onChange={onChange}>
        {options.map((o: any) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

async function exportReport() {
  alert('Export report downloaded (mock).')
}
