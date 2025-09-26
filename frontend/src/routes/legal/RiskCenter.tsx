"use client"
import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import Card from '@/components/Card'
import { useContracts } from '@/hooks/useContracts'
import { AlertTriangle, AlertCircle, Info, Download } from 'lucide-react'
import CardDashboard from '@/components/Legal/CardDashboard'
import ButtonBlue from '@/components/ButtonBlue'
import ContractListLegal from '@/components/Legal/ContractListLegal'

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

   const contractsMapped = useMemo(
    () =>
      (filtered ?? []).map((c: any) => ({
        id: String(c.id),
        name: c.name ?? c.title ?? 'Untitled',
        party: [c.first_party, c.second_party].filter(Boolean).join(' - ') || '-',
        risk: c.risk ?? c.risk_level ?? 'Low',
        clause: c.clause ?? c.clause_text ?? c.issue ?? '-',
        section: c.section ?? c.clause_number ?? '-',
        status: c.status ?? c.review_status ?? 'Pending Review',
      })),
    [filtered]
  )

  return (
    <div className="grid gap-6">
      <div className="flex flex-row items-center justify-between mb-4">
      {/* Bagian Kiri: Judul dan Subjudul */}
      <div>
        <div className="text-3xl font-bold">
          Risk Center
        </div>
        <div className='text-sm text-gray-600'>
          Monitor and manage contract clauses with potential risks
        </div>
      </div>

      {/* Bagian Kanan: Tombol Export */}
      <div>
        <ButtonBlue
          text="Export Report"
          onClick={() => exportReport()}
          iconRight={<Download size={16} />} // 2. Tambahkan ikon di sini
        />
      </div>
    </div>

      <div className="grid gap-4 md:grid-cols-3">
        <CardDashboard
          title="High Risk Clauses"
          value={highCount}
          right={<AlertTriangle className="h-5 w-5 text-red-600" />}
        />
        <CardDashboard
          title="Medium Risk Clauses"
          value={medCount}
          right={<AlertCircle className="h-5 w-5 text-amber-600" />}
        />
        <CardDashboard
          title="Low Risk Clauses"
          value={lowCount}
          right={<Info className="h-5 w-5 text-blue-600" />}
        />
      </div>

      <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label="Risk Level:"
              value={fltRisk}
              onChange={(e) => setFltRisk(e.target.value as typeof fltRisk)}
              options={['All', 'Low', 'Medium', 'High']}
            />
            <Select
              label="Status:"
              value={fltStatus}
              onChange={(e) => setFltStatus(e.target.value as typeof fltStatus)}
              options={['All', 'Pending Review', 'Reviewed', 'Revision Requested']}
            />
            <Select label="Sort:" value={sortBy} onChange={() => {}} options={['Sort by Contract Value']} />
          </div>
      </Card>

      <ContractListLegal
        variant="riskCenter"
        contracts={contractsMapped}
      />
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
