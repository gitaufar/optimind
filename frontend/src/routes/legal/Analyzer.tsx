"use client"
import { useState } from 'react'
import Card from '@/components/Card'
import { useAnalyzer, useContracts } from '@/hooks/useContracts'

export default function LegalAnalyzer() {
  const { items, setRisk } = useContracts()
  const [selected, setSelected] = useState<string | null>(items[0]?.id ?? null)
  const { entities, findings, runAnalysis } = useAnalyzer(selected ?? undefined)

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Contract Document Preview" right={<small className="text-gray-500">Preview PDF bisa ditambahkan</small>}>
          <div className="text-sm text-gray-600">Pilih dokumen dari Inbox di panel kanan, lalu jalankan analisis.</div>
        </Card>

        <Card title="Select from Inbox">
          <div className="grid gap-2">
            {items.map((c) => (
              <label key={c.id} className="flex items-center gap-2">
                <input type="radio" name="pick" checked={selected === c.id} onChange={() => setSelected(c.id)} />
                <span className="text-sm">
                  {c.name} - {c.second_party ?? '-'}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="rounded-xl bg-gray-900 px-3 py-1 text-white"
              onClick={() => selected && runAnalysis(selected)}
            >
              Run Analysis
            </button>
            <button
              className="rounded-xl border px-3 py-1"
              onClick={() => selected && setRisk(selected, 'Low')}
            >
              Mark Low Risk
            </button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Contract Entities">
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
              <li>
                <b>Initial risk status:</b> {entities.initial_risk ?? '-'}
              </li>
            </ul>
          )}
        </Card>

        <Card title="Risk Radar">
          {findings.length === 0 ? (
            <div className="text-sm text-gray-600">Belum ada temuan.</div>
          ) : (
            <ul className="space-y-1 text-sm">
              {findings.map((f) => (
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
