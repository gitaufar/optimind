"use client"
import { useEffect, useState, useCallback } from 'react'
import supabase from '@/utils/supabase'
import type { Contract, LegalKPI, ContractEntity, RiskFinding, LegalNote } from '@/types/db'

export function useLegalKPI() {
  const [kpi, setKpi] = useState<LegalKPI | null>(null)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('legal_kpi').select('*').single()
      setKpi(data as LegalKPI)
    })()
  }, [])

  return { kpi }
}

export function useContracts(filter?: { status?: string; risk?: string }) {
  const [items, setItems] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    let query = supabase.from('contracts').select('*').order('created_at', { ascending: false })
    if (filter?.status && filter.status !== 'All') {
      query = query.eq('status', filter.status)
    }
    if (filter?.risk && filter.risk !== 'All') {
      query = query.eq('risk', filter.risk)
    }

    const { data, error } = await query
    if (error) {
      setError(error.message)
    } else {
      setItems((data ?? []) as Contract[])
    }
    setLoading(false)
  }, [filter?.risk, filter?.status])

  useEffect(() => {
    fetchAll()
    const ch = supabase
      .channel('contracts-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, fetchAll)
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [fetchAll])

  const updateStatus = useCallback(async (id: string, status: Contract['status']) => {
    await supabase.from('contracts').update({ status }).eq('id', id)
  }, [])

  const setRisk = useCallback(async (id: string, risk: Contract['risk']) => {
    await supabase.from('contracts').update({ risk }).eq('id', id)
  }, [])

  return { items, loading, error, updateStatus, setRisk }
}

export function useAnalyzer(contractId?: string) {
  const [entities, setEntities] = useState<ContractEntity | null>(null)
  const [findings, setFindings] = useState<RiskFinding[]>([])
  const [notes, setNotes] = useState<LegalNote[]>([])

  const refresh = useCallback(async () => {
    if (!contractId) return

    const { data: ent } = await supabase
      .from('contract_entities')
      .select('*')
      .eq('contract_id', contractId)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    setEntities(ent as ContractEntity | null)

    const { data: rf } = await supabase
      .from('risk_findings')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })
    setFindings((rf ?? []) as RiskFinding[])

    const { data: ln } = await supabase
      .from('legal_notes')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })
    setNotes((ln ?? []) as LegalNote[])
  }, [contractId])

  useEffect(() => {
    refresh()
    if (!contractId) return

    const ch = supabase
      .channel(`legal-${contractId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contract_entities', filter: `contract_id=eq.${contractId}` },
        refresh,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'risk_findings', filter: `contract_id=eq.${contractId}` },
        refresh,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'legal_notes', filter: `contract_id=eq.${contractId}` },
        refresh,
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ch)
    }
  }, [contractId, refresh])

  const runAnalysis = useCallback(
    async (id: string, seed?: Partial<ContractEntity>) => {
      await supabase.from('contract_entities').insert([
        {
          contract_id: id,
          first_party: seed?.first_party ?? 'PT Integrasi Logistik Cipta Solusi (ILCS)',
          second_party: seed?.second_party ?? 'PT Supplier A',
          value_rp: seed?.value_rp ?? 2_500_000_000,
          duration_months: seed?.duration_months ?? 12,
          penalty: seed?.penalty ?? 'Denda 0,5%/hari, maks 5%',
          initial_risk: seed?.initial_risk ?? 'High',
        },
      ])

      await supabase.from('risk_findings').insert([
        { contract_id: id, section: 'Section 8.2', level: 'High', title: 'Termination for Convenience' },
        { contract_id: id, section: 'Section 12.1', level: 'Medium', title: 'SLA tidak spesifik' },
      ])

      await supabase.from('contracts').update({ risk: 'High', status: 'Reviewed' }).eq('id', id)
      await refresh()
    },
    [refresh],
  )

  const addNote = useCallback(
    async (id: string, note: string) => {
      await supabase.from('legal_notes').insert([{ contract_id: id, note }])
      await refresh()
    },
    [refresh],
  )

  return { entities, findings, notes, runAnalysis, addNote }
}
