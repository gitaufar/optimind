"use client"
import Card from '@/components/Card'
import { useContractsList, useStatusFiltering } from '@/hooks/useProcurement'
import type { StatusFilter, RiskFilter } from '@/hooks/useProcurement'

export default function StatusTracking() {
  const { rows, loading } = useContractsList()
  const { status, setStatus, risk, setRisk, q, setQ, from, setFrom, to, setTo, filtered } = useStatusFiltering(rows)

  return (
    <div className="grid gap-6">
      <Card title="Filters">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Select label="Status" value={status} options={['All', 'Pending Review', 'Approved', 'Revision Requested', 'Draft']} onChange={(val) => setStatus(val as StatusFilter)} />
          <Select label="Risk" value={risk} options={['All', 'Low', 'Medium', 'High']} onChange={(val) => setRisk(val as RiskFilter)} />
          <label className="flex items-center gap-2">
            <span className="text-gray-600">From</span>
            <input type="date" className="rounded-lg border px-2 py-1" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-gray-600">To</span>
            <input type="date" className="rounded-lg border px-2 py-1" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <input
            className="rounded-lg border px-2 py-1"
            placeholder="Search contract name / party"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </Card>

      <Card title="Contracts">
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
                  <th>Status</th>
                  <th>Risk</th>
                  <th>Last Update</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{r.name}</td>
                    <td>
                      {r.first_party ?? '-'} - {r.second_party ?? '-'}
                    </td>
                    <td>Rp {Number(r.value_rp || 0).toLocaleString('id-ID')}</td>
                    <td>{r.duration_months ?? '-'} bulan</td>
                    <td>{r.status}</td>
                    <td>{r.risk ?? '-'}</td>
                    <td>{new Date(r.created_at).toLocaleDateString('id-ID')}</td>
                    <td>
                      <a className="text-blue-600 underline" href={`/legal/contracts/${r.id}`} target="_blank" rel="noreferrer">
                        View details
                      </a>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="py-6 text-center text-sm text-gray-600" colSpan={8}>
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

function Select({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-gray-600">{label}</span>
      <select className="rounded-lg border px-2 py-1" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
