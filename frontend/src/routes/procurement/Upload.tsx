"use client"
import { useState } from 'react'
import type { DragEvent } from 'react'
import Card from '@/components/Card'
import { uploadContractFile } from '@/lib/uploadContractFile'
import supabase from '@/utils/supabase'
import { useAuth } from '@/auth/AuthProvider'

export default function UploadContract() {
  const { session } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [drag, setDrag] = useState(false)
  const [meta, setMeta] = useState({ name: '', type: '', value_rp: 0 })

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDrag(false)
    const incoming = e.dataTransfer.files?.[0]
    if (incoming) setFile(incoming)
  }

  async function handleSaveDraft() {
    const { data, error } = await supabase
      .from('contracts')
      .insert([
        {
          name: meta.name,
          second_party: null,
          value_rp: meta.value_rp || null,
          status: 'Draft',
          created_by: session?.user?.id ?? null,
        },
      ])
      .select('id')
      .single()
    if (error) {
      alert(error.message)
      return
    }
    const id = data.id as string
    await maybeUpload(id)
    alert('Saved to Draft')
  }

  async function handleSubmitToLegal() {
    const { data, error } = await supabase
      .from('contracts')
      .insert([
        {
          name: meta.name,
          value_rp: meta.value_rp || null,
          status: 'Pending Review',
          created_by: session?.user?.id ?? null,
        },
      ])
      .select('id')
      .single()
    if (error) {
      alert(error.message)
      return
    }
    const id = data.id as string
    await maybeUpload(id)
    alert('Submitted to Legal')
  }

  async function maybeUpload(contractId: string) {
    if (!file) return
    try {
      const { file_url } = await uploadContractFile(contractId, file)
      await supabase.from('contracts').update({ file_url }).eq('id', contractId)
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    }
  }

  return (
    <div className="grid gap-6">
      <Card title="Upload Contract">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed p-10 text-center ${drag ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
        >
          <div className="text-sm text-gray-600">Drag and drop file di sini atau pilih manual</div>
          <div className="mt-3">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          {file && <div className="mt-2 text-sm">File: {file.name}</div>}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border px-3 py-2"
            placeholder="Nama Kontrak"
            value={meta.name}
            onChange={(e) => setMeta((m) => ({ ...m, name: e.target.value }))}
          />
          <input
            className="rounded-xl border px-3 py-2"
            placeholder="Jenis Kontrak"
            value={meta.type}
            onChange={(e) => setMeta((m) => ({ ...m, type: e.target.value }))}
          />
          <input
            className="rounded-xl border px-3 py-2"
            type="number"
            placeholder="Nilai Kontrak (Rp)"
            value={meta.value_rp}
            onChange={(e) => setMeta((m) => ({ ...m, value_rp: Number(e.target.value) }))}
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button className="rounded-xl border px-4 py-2" onClick={handleSaveDraft}>
            Save to Draft
          </button>
          <button className="rounded-xl bg-gray-900 px-4 py-2 text-white" onClick={handleSubmitToLegal}>
            Submit to Legal
          </button>
        </div>
      </Card>
    </div>
  )
}
