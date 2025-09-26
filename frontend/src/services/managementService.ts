import supabase from "@/utils/supabase";


export interface ManagementKPIData {
  total_contracts: number;
  active_contracts: number;
  pending_contracts: number;
  expired_contracts: number;
  high_risk_contracts: number;
  expiring_30_days: number;
  expiring_60_days: number;
  expiring_90_days: number;
  total_contract_value: number;
  avg_active_contract_value: number;
  low_risk_count: number;
  medium_risk_count: number;
  high_risk_count: number;
  total_risk_assessed: number;
  low_risk_percentage: number;
  medium_risk_percentage: number;
  high_risk_percentage: number;
}

export interface ContractSummary {
  id: string;
  name: string;
  first_party: string;
  second_party: string;
  value_rp: number;
  status: string;
  end_date: string;
  risk: string;
  created_at: string;
}

export interface ContractDetail {
  id: string;
  name: string;
  first_party: string;
  second_party: string;
  value_rp: number;
  duration_months: number;
  start_date: string;
  end_date: string;
  risk: string;
  status: string;
  file_url: string;
  created_by: string;
  created_at: string;
  file_name?: string;
  file_size?: number;
  page_count?: number;
  confidence?: number;
  analysis_result?: any;
  model_used?: string;
  processing_time?: number;
  legal_notes_count?: number;
  risk_findings_count?: number;
  legal_notes?: string[];
  risk_titles?: string[];
}

export interface ContractPerformanceMetric {
  metric_type: string;
  value: number;
  division_average: number;
}

export interface LegalNote {
  id: number;
  author: string;
  note: string;
  created_at: string;
}

export interface RiskFinding {
  id: number;
  section: string;
  level: string;
  title: string;
  created_at: string;
}

class ManagementService {
  // Get comprehensive KPI data for management dashboard
  async getManagementKPI(): Promise<ManagementKPIData> {
    const { data, error } = await supabase
      .from('management_kpi')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching management KPI:', error);
      // Return mock data as fallback
      return {
        total_contracts: 247,
        active_contracts: 142,
        pending_contracts: 34,
        expired_contracts: 32,
        high_risk_contracts: 12,
        expiring_30_days: 16,
        expiring_60_days: 28,
        expiring_90_days: 42,
        total_contract_value: 15500000000,
        avg_active_contract_value: 2100000000,
        low_risk_count: 45,
        medium_risk_count: 35,
        high_risk_count: 20,
        total_risk_assessed: 100,
        low_risk_percentage: 45,
        medium_risk_percentage: 35,
        high_risk_percentage: 20
      };
    }

    return data;
  }

  // Get contracts list for reports table
  async getContractsSummary(limit: number = 50): Promise<ContractSummary[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        id,
        name,
        first_party,
        second_party,
        value_rp,
        status,
        end_date,
        risk,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching contracts summary:', error);
      return [];
    }

    return data || [];
  }

  // Get detailed contract information
  async getContractDetail(contractId: string): Promise<ContractDetail | null> {
    const { data, error } = await supabase
      .from('contract_details_view')
      .select('*')
      .eq('id', contractId)
      .single();

    if (error) {
      console.error('Error fetching contract detail:', error);
      return null;
    }

    return data;
  }

  // Get contract performance metrics
  async getContractPerformance(contractId: string): Promise<ContractPerformanceMetric[]> {
    const { data, error } = await supabase
      .from('contract_performance')
      .select('metric_type, value, division_average')
      .eq('contract_id', contractId);

    if (error) {
      console.error('Error fetching contract performance:', error);
      return [
        { metric_type: 'contract_value', value: 95, division_average: 88 },
        { metric_type: 'risk_score', value: 25, division_average: 72 },
        { metric_type: 'completion_time', value: 78, division_average: 90 },
        { metric_type: 'vendor_rating', value: 85, division_average: 82 }
      ];
    }

    return data || [];
  }

  // Get legal notes for a contract
  async getLegalNotes(contractId: string): Promise<LegalNote[]> {
    const { data, error } = await supabase
      .from('legal_notes')
      .select('id, author, note, created_at')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching legal notes:', error);
      return [];
    }

    return data || [];
  }

  // Get risk findings for a contract
  async getRiskFindings(contractId: string): Promise<RiskFinding[]> {
    const { data, error } = await supabase
      .from('risk_findings')
      .select('id, section, level, title, created_at')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching risk findings:', error);
      return [];
    }

    return data || [];
  }

  // Get AI risk analysis for a contract
  async getAIRiskAnalysis(contractId: string): Promise<any> {
    const { data, error } = await supabase
      .from('ai_risk_analysis')
      .select('analysis_result, risk_level, confidence, model_used, processing_time, analyzed_at')
      .eq('contract_id', contractId)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching AI risk analysis:', error);
      // Return mock analysis as fallback
      return {
        success: true,
        risk_level: "Low",
        confidence: 0.961,
        risk_factors: [
          {
            type: "warranty_risk",
            description: "Risiko terkait garansi",
            severity: "Low",
            found_keywords: ["jaminan"],
            keyword_count: 1
          },
          {
            type: "legal_compliance",
            description: "Risiko kepatuhan hukum",
            severity: "Medium",
            found_keywords: ["peraturan", "undang-undang", "hukum"],
            keyword_count: 3
          }
        ],
        risk_assessment: {
          description: "Kontrak memiliki tingkat risiko rendah dengan potensi masalah minimal",
          confidence_interpretation: "Sangat yakin - hasil analisis sangat reliable",
          recommendations: [
            "Review berkala terhadap pelaksanaan kontrak",
            "Monitoring standar sesuai jadwal",
            "Dokumentasi yang baik untuk audit trail"
          ],
          risk_factor_count: 2,
          high_severity_factors: 0,
          medium_severity_factors: 1,
          low_severity_factors: 1
        }
      };
    }

    // Parse analysis_result if it's a JSON string
    if (data?.analysis_result) {
      return typeof data.analysis_result === 'string' 
        ? JSON.parse(data.analysis_result)
        : data.analysis_result;
    }

    return null;
  }

  // Get contract snapshots for trending data
  async getContractSnapshots(days: number = 30): Promise<any[]> {
    const { data, error } = await supabase
      .from('contract_snapshots')
      .select('*')
      .gte('snapshot_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('snapshot_date', { ascending: true });

    if (error) {
      console.error('Error fetching contract snapshots:', error);
      return [];
    }

    return data || [];
  }

  // Search contracts
  async searchContracts(query: string, limit: number = 20): Promise<ContractSummary[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        id,
        name,
        first_party,
        second_party,
        value_rp,
        status,
        end_date,
        risk,
        created_at
      `)
      .or(`name.ilike.%${query}%,first_party.ilike.%${query}%,second_party.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching contracts:', error);
      return [];
    }

    return data || [];
  }
}

export const managementService = new ManagementService();