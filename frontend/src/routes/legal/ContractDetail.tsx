"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAnalyzer } from '@/hooks/useContracts'
import supabase from '@/utils/supabase'

import CardDetailContract from '@/components/Legal/CardDetailContract'
import RiskAnalysisCard from '@/components/Legal/RiskAnalysis'
import LegalNotes from '@/components/Legal/LegalNotes'
import InteractiveDocumentViewer from '@/components/Legal/AIRecommendation'

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>()
  // Pastikan hook memberikan nilai default jika datanya belum siap
  const { findings = [] } = useAnalyzer(id ?? undefined) || { findings: [] }

  const [meta, setMeta] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
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

  // Ambil AI analysis results
  useEffect(() => {
    if (!id) return
    ;(async () => {
      const { data, error } = await supabase
        .from('ai_risk_analysis')
        .select('analysis_result')
        .eq('contract_id', id)
        .single()
      
      if (!error && data?.analysis_result) {
        try {
          const parsedAnalysis = typeof data.analysis_result === 'string' 
            ? JSON.parse(data.analysis_result) 
            : data.analysis_result
          setAiAnalysis(parsedAnalysis)
        } catch (parseError) {
          console.error('Error parsing AI analysis:', parseError)
          setAiAnalysis(null)
        }
      }
    })()
  }, [id])

  // Ambil catatan legal dari legal_notes
  useEffect(() => {
    if (!id) return
    ;(async () => {
      const { data, error } = await supabase.from('legal_notes').select('*').eq('contract_id', id).order('created_at', { ascending: false })
      if (!error) setNotes(data ?? [])
    })()
  }, [id])

  const addNote = async (contractId: string, note: string) => {
    const { data, error } = await supabase.from('legal_notes').insert({ 
      contract_id: contractId, 
      note,
      author: 'legal@ilcs.co.id'
    }).select('*').single()
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
    penalty: penaltyFinding?.title?.split(': ')?.[1] ?? '-',
    // Menggunakan risk_level dari AI analysis, fallback ke risk_findings
    riskLevel: (aiAnalysis?.risk_level ? `${aiAnalysis.risk_level} Risk` : 
               (findings.some((f: any) => f.level === 'High') ? 'High Risk' : 
                findings.some((f: any) => f.level === 'Medium') ? 'Medium Risk' : 'Low Risk')) as 'High Risk' | 'Medium Risk' | 'Low Risk',
  }

  // Helper function untuk mengubah snake_case menjadi Title Case
  const formatRiskType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Risk Analysis data dari ai_risk_analysis.analysis_result
  const analysisData = aiAnalysis?.risk_factors?.map((factor: any) => ({
    title: formatRiskType(factor.type), // Mengubah force_majeure menjadi Force Majeure
    riskLevel: factor.severity || 'Low', // Menggunakan severity dari AI analysis
    description: factor.description || 'No description available.',
    documentLink: `#${factor.type}`, // Link berdasarkan type
    // Tambahan data untuk display yang lebih kaya
    keywordCount: factor.keyword_count || 0,
    foundKeywords: factor.found_keywords || []
  })) || []

  // AI Recommendation data dari ai_risk_analysis.analysis_result
  const aiRecommendationData = {
    riskLevel: aiAnalysis?.risk_level || 'Unknown',
    confidence: aiAnalysis?.confidence || 0,
    riskFactors: aiAnalysis?.risk_factors || [],
    riskAssessment: aiAnalysis?.risk_assessment || {},
    modelUsed: aiAnalysis?.model_used || 'AI Model',
    processingTime: aiAnalysis?.processing_time || 0,
    analysisTimestamp: aiAnalysis?.analysis_timestamp || new Date().toISOString(),
    recommendations: aiAnalysis?.risk_assessment?.recommendations || [],
    // Format untuk komponen sections
    sections: [
      {
        title: 'Risk Assessment',
        content: aiAnalysis?.risk_assessment?.description || 'No risk assessment available',
        highlight: (aiAnalysis?.risk_level?.toLowerCase() === 'high' ? 'high' : 
                   aiAnalysis?.risk_level?.toLowerCase() === 'medium' ? 'medium' : 'low') as 'low' | 'medium' | 'high'
      },
      {
        title: 'Confidence Level', 
        content: `${Math.round((aiAnalysis?.confidence || 0) * 100)}% - ${aiAnalysis?.risk_assessment?.confidence_interpretation || 'No confidence data'}`,
        highlight: 'low' as const
      },
      {
        title: 'Model Information',
        content: `Analysis by: ${aiAnalysis?.model_used || 'AI Model'} | Processing time: ${aiAnalysis?.processing_time?.toFixed(2) || 0}s`,
        highlight: 'low' as const
      },
      ...aiAnalysis?.risk_factors?.map((factor: any) => ({
        title: `${factor.type.replace(/_/g, ' ').toUpperCase()} Risk`,
        content: `${factor.description} (Severity: ${factor.severity}) - Found ${factor.keyword_count} related keywords: ${factor.found_keywords?.join(', ') || 'N/A'}`,
        highlight: (factor.severity?.toLowerCase() === 'high' ? 'high' : 
                   factor.severity?.toLowerCase() === 'medium' ? 'medium' : 'low') as 'low' | 'medium' | 'high'
      })) || []
    ],
    // Format untuk komponen suggestions 
    suggestions: aiAnalysis?.risk_assessment?.recommendations?.map((rec: string, index: number) => ({
      title: `Recommendation ${index + 1}`,
      originalContent: `Based on ${aiAnalysis?.model_used || 'AI'} analysis, this contract requires attention in ${aiAnalysis?.risk_assessment?.risk_factor_count || 0} areas`,
      suggestedContent: rec,
      riskLevel: (aiAnalysis?.risk_level?.toLowerCase() === 'high' ? 'high' : 
                 aiAnalysis?.risk_level?.toLowerCase() === 'medium' ? 'medium' : 'low') as 'low' | 'medium' | 'high'
    })) || []
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
        {/* AI Recommendation dari ai_risk_analysis.analysis_result */}
        <InteractiveDocumentViewer
          documentTitle={`AI Risk Analysis - ${aiRecommendationData.riskLevel} Risk (${Math.round((aiRecommendationData.confidence || 0) * 100)}% confidence)`}
          sections={aiRecommendationData.sections}
          suggestions={aiRecommendationData.suggestions}
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