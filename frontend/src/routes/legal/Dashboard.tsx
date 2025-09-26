"use client"
import { useMemo } from 'react'
import Card from '@/components/Card'
import { useAnalyzer, useContracts, useLegalKPI } from '@/hooks/useContracts'

export default function LegalDashboard() {
  const { kpi } = useLegalKPI()
  const { items } = useContracts()
  const latest = useMemo(() => items[0]?.id ?? null, [items])
  const { entities, findings } = useAnalyzer(latest ?? undefined)

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Kontrak Minggu Ini">
          <Metric value={kpi?.contracts_this_week} />
        </Card>
        <Card title="High Risk Contracts">
          <Metric value={kpi?.high_risk} />
        </Card>
        <Card title="Pending Review AI">
          <Metric value={kpi?.pending_ai} />
        </Card>
      </div>

      <Card title="Contract Inbox (ringkas)">
        <div className="mb-2 grid grid-cols-4 text-xs font-semibold text-gray-500">
          <div>Contract</div>
          <div>Party</div>
          <div>Value</div>
          <div>Risk</div>
        </div>
        {items.slice(0, 5).map((c) => (
          <div key={c.id} className="grid grid-cols-4 border-t py-2 text-sm">
            <div className="truncate">{c.name}</div>
            <div className="truncate">{c.second_party ?? '-'}</div>
            <div>Rp {Number(c.value_rp || 0).toLocaleString('id-ID')}</div>
            <div>{c.risk ?? '-'}</div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-gray-600">Inbox kosong.</div>}
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="AI Contract Analyzer (Last Analyzed)">
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

        <Card title="Analyze New Contract" right={<a href="/legal/ai-analyzer" className="text-sm underline">Open Analyzer</a>}>
          <div className="text-sm text-gray-600">Klik tombol di kanan untuk menganalisis kontrak dari Inbox.</div>
        </Card>

        <Card title="Risk Radar">
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
  )
}

function Metric({ value }: { value: any }) {
  return <div className="text-3xl font-bold">{value ?? 0}</div>
}
