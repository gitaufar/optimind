"use client"
import { useState } from 'react'
import { useAnalyzer, useContracts } from '@/hooks/useContracts'
import { UploadCloud, Trash2, Save, Download, ZoomIn, ZoomOut, FileText } from 'lucide-react'
import ButtonBlue from '@/components/ButtonBlue' // Asumsi Anda punya komponen ini

// Impor komponen baru
import RiskRadarCard from '@/components/Legal/RiskRadar'
import ContractEntitiesCard from '@/components/Legal/ContractEntitiesCard'

export default function LegalAnalyzer() {
  const { items } = useContracts()
  const [selected, setSelected] = useState<string | null>(items[0]?.id ?? null)
  const { entities, findings, runAnalysis, loading } = useAnalyzer(selected ?? undefined)

  return (
    <div className="space-y-6 bg-gray-50 p-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Contract Analyzer</h1>
        <p className="text-sm text-gray-600">Analyze contracts automatically with AI-powered risk assessment</p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Upload Box */}
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center">
          <UploadCloud className="mb-2 h-10 w-10 text-gray-400" />
          <p className="font-semibold text-gray-700">Drag & Drop Contract File</p>
          <p className="text-xs text-gray-500">Upload PDF or DOCX files up to 10MB</p>
          <ButtonBlue text="Browse Files" className="mt-4" />
        </div>
        
        {/* Select from Inbox */}
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <p className="font-semibold text-gray-700">Or Select from Inbox</p>
          <select 
            value={selected || ''} 
            onChange={(e) => setSelected(e.target.value)}
            className="mt-2 w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {items.map((c) => (
              <option key={c.id} value={c.id}>{c.name} - {c.second_party ?? '-'}</option>
            ))}
          </select>
          <ButtonBlue 
            text={loading ? 'Analyzing...' : 'Run Analysis'} 
            onClick={() => selected && runAnalysis(selected)}
            disabled={!selected || loading}
            className="mt-4 w-full" 
          />
        </div>
      </div>

      {/* Document Preview */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold text-gray-800">Contract Document Preview</h3>
          <div className="flex items-center gap-4 text-gray-500">
            <button className="hover:text-gray-800"><ZoomOut size={18} /></button>
            <button className="hover:text-gray-800"><ZoomIn size={18} /></button>
            <button className="hover:text-gray-800"><Download size={18} /></button>
          </div>
        </div>
        <div className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
          <FileText className="h-12 w-12 text-gray-300" />
          <p className="mt-2 font-semibold text-gray-500">Contract document will appear here</p>
          <p className="text-sm text-gray-400">Risk clauses will be automatically highlighted</p>
        </div>
      </div>
      
      {/* Results Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContractEntitiesCard entities={entities} />
        <RiskRadarCard findings={findings.map(f => ({
          id: f.id.toString(),
          level: f.level,
          section: f.section || '',
          title: f.title || undefined
        }))} />
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <Trash2 size={16} /> Discard
        </button>
        <ButtonBlue text="Save to Inbox" iconRight={<Save size={16}/>} />
      </div>
    </div>
  )
}