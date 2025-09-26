"use client"
import { useMemo } from 'react'
import Card from '@/components/Card'
import { useAnalyzer, useContracts, useLegalKPI } from '@/hooks/useContracts'
import ContractListLegal from '@/components/Legal/ContractListLegal'
import CardDashboard from '@/components/Legal/CardDashboard'
import { FileText, AlertTriangle, Clock, RefreshCw } from 'lucide-react'
import RiskRadar from '@/components/Legal/RiskRadar'

export default function LegalDashboard() {
  const { kpi, loading: kpiLoading, error: kpiError, refresh: refreshKPI } = useLegalKPI()
  const { items, loading: contractsLoading, error: contractsError } = useContracts()
  const latest = useMemo(() => items[0]?.id ?? null, [items])
  const { entities, findings, loading: analysisLoading } = useAnalyzer(latest ?? undefined)

  // Loading state
  const isLoading = kpiLoading || contractsLoading || analysisLoading

  // Error handling
  if (kpiError || contractsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{kpiError || contractsError}</p>
          <button
            onClick={refreshKPI}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  const contractsMapped = useMemo(
    () =>
      (items ?? []).slice(0, 10).map((it: any) => ({
        id: String(it.id),
        name: it.name ?? it.title ?? 'Untitled',
        party: [it.first_party, it.second_party].filter(Boolean).join(' → ') || it.party || it.counterparty || '-',
        value:
          typeof it.value_rp === 'number'
            ? `Rp ${it.value_rp.toLocaleString('id-ID')}`
            : typeof it.value === 'number'
            ? `Rp ${it.value.toLocaleString('id-ID')}`
            : (it.value ?? '-'),
        risk: it.risk ?? it.risk_level ?? 'low',
      })),
    [items]
  )

  const riskFindings = useMemo(
    () =>
      (findings ?? []).slice(0, 5).map((f: any) => ({
        id: String(f.id ?? `${f.section ?? 'unknown'}-${f.title ?? ''}`),
        level: ['High', 'Medium', 'Low'].includes(f.level) ? (f.level as 'High' | 'Medium' | 'Low') : 'Low',
        title: f.section ?? 'Unknown Section',
        description: f.title ?? f.description ?? '-',
      })),
    [findings]
  )


  return (
    <div className="grid gap-6">
      {/* Loading overlay */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mr-2" />
          <span className="text-sm text-gray-600">Loading dashboard data...</span>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-3">
        <CardDashboard
          title="Kontrak Minggu Ini"
          value={kpi?.contracts_this_week ?? 0}
          right={<FileText className="h-5 w-5 text-blue-600" />}
        />
        <CardDashboard
          title="High Risk Contracts"
          value={kpi?.high_risk ?? 0}
          right={<AlertTriangle className="h-5 w-5 text-red-600" />}
        />
        <CardDashboard
          title="Pending Review AI"
          value={kpi?.pending_ai ?? 0}
          right={<Clock className="h-5 w-5 text-amber-600" />}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-4'>
        <ContractListLegal
          variant="dashboard"
          contracts={contractsMapped}
        />

        <div className="grid gap-4 md:grid-rows-2">
          <Card 
            title="AI Contract Analyzer" 
            paragraph={latest ? `Analysis for latest contract (${contractsMapped[0]?.name || 'Unknown'})` : "Select a contract to view AI analysis"}
          >
            {!entities ? (
              <div className="text-sm text-gray-600">
                {latest ? "Analyzing contract..." : "Belum ada hasil."}
              </div>
            ) : (
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="font-medium">First party:</span>
                  <span className="text-gray-600">{entities.first_party ?? '-'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Second party:</span>
                  <span className="text-gray-600">{entities.second_party ?? '-'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Value:</span>
                  <span className="text-gray-600">
                    Rp {Number(entities.value_rp || 0).toLocaleString('id-ID')}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span className="text-gray-600">{entities.duration_months ?? '-'} bulan</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium mb-1">Penalty:</span>
                  <span className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {entities.penalty ?? '-'}
                  </span>
                </li>
              </ul>
            )}
          </Card>

          <RiskRadar findings={riskFindings} />
        </div>
      </div>
    </div>
  )
}
