"use client"
import { useMemo } from 'react'
import Card from '@/components/Card'
import { useAnalyzer, useContracts, useLegalKPI } from '@/hooks/useContracts'
import ContractListLegal from '@/components/Legal/ContractListLegal'
import CardDashboard from '@/components/Legal/CardDashboard'
import { FileText, AlertTriangle, Clock } from 'lucide-react'

export default function LegalDashboard() {
  const { kpi } = useLegalKPI()
  const { items } = useContracts()
  const latest = useMemo(() => items[0]?.id ?? null, [items])
  const { entities, findings } = useAnalyzer(latest ?? undefined)

  const contractsMapped = useMemo(
    () =>
      (items ?? []).slice(0, 10).map((it: any) => ({
        id: String(it.id),
        name: it.name ?? it.title ?? 'Untitled',
        party: it.party ?? it.counterparty ?? '-',
        value:
          typeof it.value === 'number'
            ? `Rp ${it.value.toLocaleString('id-ID')}`
            : (it.value ?? '-'),
        risk: it.risk ?? it.risk_level ?? 'Low',
      })),
    [items]
  )

  return (
    <div className="grid gap-6">
      
        <div className="grid gap-4 md:grid-cols-3">
          <CardDashboard
            title="Kontrak Minggu Ini"
            value={kpi?.contracts_this_week}
            right={<FileText className="h-5 w-5 text-blue-600" />}
          />
          <CardDashboard
            title="High Risk Contracts"
            value={kpi?.high_risk}
            right={<AlertTriangle className="h-5 w-5 text-red-600" />}
          />
          <CardDashboard
            title="Pending Review AI"
            value={kpi?.pending_ai}
            right={<Clock className="h-5 w-5 text-amber-600" />}
          />
        </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-4'>
        <ContractListLegal
          variant="dashboard"
          contracts={contractsMapped}
        />

        <div className="grid gap-4 md:grid-rows-2">
          <Card title="AI Contract Analyzer" paragraph="Automated Contract Entity Extraction and Risk Findings">
            {!entities ? (
              <div className="text-sm text-gray-600">Belum ada hasil.</div>
            ) : (
              <ul className="space-y-1 text-sm">
                <li>
                  <b>First party:</b> {entities.first_party ?? '-'}
                </li>
                <li>
                  <b>Second party:</b> {entities.second_party ?? '-'}
                </li>
                <li>
                  <b>Value:</b> Rp {Number(entities.value_rp || 0).toLocaleString('id-ID')}
                </li>
                <li>
                  <b>Duration:</b> {entities.duration_months ?? '-'} bulan
                </li>
                <li>
                  <b>Penalty:</b> {entities.penalty ?? '-'}
                </li>
              </ul>
            )}
          </Card>

          <Card title="Risk Radar" paragraph="High-risk clauses detected by AI">
            {findings.length === 0 ? (
              <div className="text-sm text-gray-600">Belum ada temuan.</div>
            ) : (
              <ul className="space-y-1 text-sm">
                {findings.slice(0, 5).map((f) => (
                  <li key={f.id}>
                    <b>{f.section ?? 'Section ?'}</b> - {f.level} Risk
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function Metric({ value }: { value: any }) {
  return <div className="text-3xl font-bold">{value ?? 0}</div>
}
