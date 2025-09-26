"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAnalyzer } from '@/hooks/useContracts'
import supabase from '@/utils/supabase'

import CardDetailContract from '@/components/Legal/CardDetailContract'
import RiskAnalysisCard from '@/components/Legal/RiskAnalysis'
import AiRecommendation from '@/components/Legal/AiRecommendation' // Pastikan nama impor sesuai nama file
import LegalNotes from '@/components/Legal/LegalNotes'

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>()
  // Pastikan hook memberikan nilai default jika datanya belum siap
  const { findings = [] } = useAnalyzer(id ?? undefined) || { findings: [] }

  const [meta, setMeta] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Ambil detail kontrak
  useEffect(() => {
    if (!id) return
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase.from('contracts').select('*').eq('id', id).single()
      if (!error) setMeta(data)
      setLoading(false)
    })()
  }, [id])

  // Ambil catatan legal
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
  // Persiapan Data untuk Komponen (Tanpa Data Dummy)
  // ==================================================================

  const penaltyFinding = findings.find((f: any) => String(f.section ?? f.title ?? '').toLowerCase().includes('penalty'))

  const contractDetails = {
    firstParty: meta?.first_party ?? '-',
    secondParty: meta?.second_party ?? '-',
    contractValue: `Rp ${Number(meta?.value_rp ?? meta?.value ?? 0).toLocaleString('id-ID')}`,
    status: meta?.status || 'On Review',
    duration: meta?.duration_months != null ? `${meta.duration_months} Bulan` : '-',
    startDate: meta?.start_date ? new Date(meta.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
    penalty: penaltyFinding?.description?.split(': ')?.[1] ?? '-',
    riskLevel: (findings.some((f: any) => f.level === 'High') ? 'High Risk' : findings.some((f: any) => f.level === 'Medium') ? 'Medium Risk' : 'Low Risk') as 'High Risk' | 'Medium Risk' | 'Low Risk',
  }

  const analysisData = (findings ?? []).map((f: any) => ({
    title: f.section ?? f.title ?? 'Clause',
    riskLevel: f.level ?? 'Low',
    description: f.description ?? 'No description available.',
    documentLink: `#${f.section ?? f.title ?? ''}`,
  }))

  // PERUBAHAN UTAMA: Data untuk AIRecommendation sekarang diambil dari properti 'recommendation_text'
  const recommendationData = {
    documentTitle: meta?.name ?? meta?.title ?? 'Rekomendasi Kontrak',
    recommendations: (findings ?? [])
      // Filter hanya temuan yang memiliki teks rekomendasi
      .filter((f: any) => f.recommendation_text) 
      .map((f: any, index: number) => ({
        // Gunakan properti `recommendation_text` dari data `finding` Anda
        title: `Recommendation ${index + 1}: ${f.section ?? f.title}`,
        content: f.recommendation_text, 
      })),
  }

  const formattedNotes = (notes ?? []).map((n: any) => ({
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
        {/* Menggunakan data yang sudah disiapkan dan props yang benar */}
        <AiRecommendations 
          documentTitle={recommendationData.documentTitle} 
          recommendations={recommendationData.recommendations} 
        />
      </div>

      <LegalNotes notes={formattedNotes} onSaveNote={handleSaveNote} />

      <div className="flex items-center justify-end gap-3">
        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
          Save Draft Notes
        </button>
        <button className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">
          Request Revision
        </button>
        <button className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700">
          Approve Contract
        </button>
      </div>
    </div>
  )
}