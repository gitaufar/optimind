"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAnalyzer } from '@/hooks/useContracts'
import supabase from '@/utils/supabase'

import CardDetailContract from '@/components/Legal/CardDetailContract'
import RiskAnalysisCard from '@/components/Legal/RiskAnalysis'
// Ganti impor AiRecommendation dengan InteractiveDocumentViewer
import InteractiveDocumentViewer from '@/components/Legal/InteractiveDocumentViewer' 
import LegalNotes from '@/components/Legal/LegalNotes'

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>()
  const { findings = [] } = useAnalyzer(id ?? undefined) || { findings: [] }

  const [meta, setMeta] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ... (useEffect untuk mengambil meta dan notes tidak berubah) ...
  useEffect(() => {
    if (!id) return
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase.from('contracts').select('*').eq('id', id).single()
      if (!error) setMeta(data)
      setLoading(false)
    })()
  }, [id])

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const { data, error } = await supabase.from('contract_notes').select('*').eq('contract_id', id).order('created_at', { ascending: false })
      if (!error) setNotes(data ?? [])
    })()
  }, [id])

  const addNote = async (contractId: string, note: string) => {
    const { data, error } = await supabase.from('contract_notes').insert({ contract_id: contractId, note }).select('*').single()
    if (!error && data) setNotes((prev) => [data, ...prev])
  }


  // ==================================================================
  // PERSIAPAN DATA BARU UNTUK KOMPONEN INTERAKTIF
  // ==================================================================

  const contractDetails = {
    // ... (data untuk CardDetailContract tidak berubah)
    firstParty: meta?.first_party ?? '-',
    secondParty: meta?.second_party ?? '-',
    contractValue: `Rp ${Number(meta?.value_rp ?? meta?.value ?? 0).toLocaleString('id-ID')}`,
    status: meta?.status || 'On Review',
    duration: meta?.duration_months != null ? `${meta.duration_months} Bulan` : '-',
    startDate: meta?.start_date ? new Date(meta.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
    penalty: findings.find((f: any) => String(f.section ?? '').toLowerCase().includes('penalty'))?.description?.split(': ')?.[1] ?? '-',
    riskLevel: (findings.some((f: any) => f.level === 'High') ? 'High Risk' : findings.some((f: any) => f.level === 'Medium') ? 'Medium Risk' : 'Low Risk') as any,
  }

  const analysisData = (findings ?? []).map((f: any) => ({
    title: f.section ?? 'Clause',
    riskLevel: f.level ?? 'Low',
    description: f.description ?? 'No description available.',
    documentLink: `#${f.section ?? ''}`,
  }))
  
  // 1. Siapkan data 'sections' untuk menampilkan dokumen asli
  const documentSections = (findings ?? []).map((f: any) => ({
    title: `Pasal ${f.pasal_no ?? '?'} - ${f.section ?? f.title}`,
    content: f.original_text || 'Teks asli klausul tidak tersedia.', // <- Gunakan data asli
    highlight: (f.level?.toLowerCase() as 'high' | 'medium' | 'low') || undefined,
  }));

  // 2. Siapkan data 'suggestions' untuk modal pop-up
  const aiSuggestions = (findings ?? []).map((f: any) => ({
    title: `Pasal ${f.pasal_no ?? '?'} - ${f.section ?? f.title}`,
    originalContent: f.original_text || 'Teks asli klausul tidak tersedia.', // <- Gunakan data asli
    suggestedContent: f.recommendation_text || 'Saran perbaikan dari AI tidak tersedia.', // <- Gunakan data rekomendasi
    riskLevel: (f.level?.toLowerCase() as 'high' | 'medium' | 'low') || 'low',
  }));

  const formattedNotes = (notes ?? []).map((n: any) => ({ /* ... (tidak berubah) ... */ 
    id: n.id,
    author: n.author || 'Unknown',
    timestamp: n.created_at ? new Date(n.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '',
    content: n.note,
  }))

  const handleSaveNote = (newNoteContent: string) => {
    if (id) addNote(id, newNoteContent)
  }

  if (loading || !meta) {
    return <div className="p-6">Loading contract details...</div>
  }

  return (
    <div className="space-y-6">
      <CardDetailContract contract={contractDetails} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RiskAnalysisCard risks={analysisData} />
        
        {/* Gunakan komponen interaktif dengan data yang sudah disiapkan */}
        <InteractiveDocumentViewer
          documentTitle={meta?.name ?? 'Contract Document'}
          sections={documentSections}
          suggestions={aiSuggestions}
        />
      </div>

      <LegalNotes notes={formattedNotes} onSaveNote={handleSaveNote} />

      <div className="flex items-center justify-end gap-3">
        {/* ... (tombol aksi tidak berubah) ... */}
        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">Save Draft Notes</button>
        <button className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">Request Revision</button>
        <button className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700">Approve Contract</button>
      </div>
    </div>
  )
}