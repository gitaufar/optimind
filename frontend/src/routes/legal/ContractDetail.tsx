"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '@/components/Card'
import { useAnalyzer } from '@/hooks/useContracts'
import supabase from '@/utils/supabase'

export default function ContractDetail() {
  const { id } = useParams()
  const { entities, findings, notes, addNote } = useAnalyzer(id)
  const [meta, setMeta] = useState<any>(null)
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const { data } = await supabase.from('contracts').select('*').eq('id', id).single()
      setMeta(data)
    })()
  }, [id])

  return (
    <div className="grid gap-6">
      <Card title="Contract Meta Data">
        <ul className="grid gap-2 text-sm md:grid-cols-2">
          <li>
            <b>Pihak Pertama:</b> {meta?.first_party ?? '-'}
          </li>
          <li>
            <b>Pihak Kedua:</b> {meta?.second_party ?? '-'}
          </li>
          <li>
            <b>Nilai Kontrak:</b> Rp {Number(meta?.value_rp || 0).toLocaleString('id-ID')}
          </li>
          <li>
            <b>Durasi:</b> {meta?.duration_months ?? '-'} bulan
          </li>
          <li>
            <b>Denda/Penalty:</b> {entities?.penalty ?? '-'}
          </li>
          <li>
            <b>Status Kontrak:</b> {meta?.status}
          </li>
        </ul>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
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

        <Card title="Document Preview" right={meta?.file_url ? <a href={meta.file_url} target="_blank" rel="noreferrer" className="text-sm underline">Download</a> : null}>
          <div className="text-sm text-gray-600">
            Preview (embed) bisa ditambahkan dengan PDF viewer library; untuk demo gunakan link download.
          </div>
        </Card>

        <Card title="Notes & Recommendation">
          <div className="text-sm font-semibold">Legal Review Notes</div>
          <div className="mb-2">
            <textarea
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Tulis catatan..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="mt-2 flex gap-2">
              <button
                className="rounded-xl bg-gray-900 px-3 py-1 text-white"
                onClick={() => {
                  if (!id || !newNote.trim()) return
                  addNote(id, newNote)
                  setNewNote('')
                }}
              >
                Save Draft Notes
              </button>
              <button className="rounded-xl border px-3 py-1">Request Revision</button>
              <button className="rounded-xl border px-3 py-1">Approve Control</button>
            </div>
          </div>
          <div className="text-sm font-semibold">Previous Notes</div>
          <ul className="ml-5 list-disc text-sm">
            {notes.map((n) => (
              <li key={n.id}>
                <b>{n.author ?? 'legal'}:</b> {n.note}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
