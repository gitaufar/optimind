import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { managementService, type ContractDetail as ContractDetailType } from "../../services/managementService";

interface LegalNote {
  id: string;
  author: string;
  role: string;
  date: string;
  time: string;
  content: string;
  type: "warning" | "info";
}

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractData, setContractData] = useState<ContractDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const detail = await managementService.getContractDetail(id);
        setContractData(detail);
      } catch (error) {
        console.error('Error fetching contract detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Loading contract details...</div>
      </div>
    );
  }

  if (!contractData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Contract not found</div>
      </div>
    );
  }

  const legalNotes: LegalNote[] = [
    {
      id: "1",
      author: "Sarah Legal Manager",
      role: "Legal Manager",
      date: "14 Jan 2024",
      time: "16:45",
      content: "Contract requires significant revision before approval. The termination clause is too vague and could expose us to unexpected costs. Recommend requesting vendor to provide more specific termination procedures.",
      type: "warning"
    },
    {
      id: "2",
      author: "David Procurement Lead",
      role: "Procurement Lead", 
      date: "13 Jan 2024",
      time: "10:30",
      content: "Vendor pricing is competitive and within budget. However, agree with legal concerns about liability clauses. Suggest negotiating liability caps at 12 months of contract value.",
      type: "info"
    }
  ];

  // Data berdasarkan response AI
  const riskAnalysis = {
    success: true,
    risk_level: "Low",
    confidence: 0.961,
    risk_factors: [
      {
        type: "warranty_risk",
        description: "Risiko terkait garansi",
        severity: "Low" as "Low" | "Medium" | "High",
        found_keywords: ["jaminan"],
        keyword_count: 1
      },
      {
        type: "legal_compliance",
        description: "Risiko kepatuhan hukum", 
        severity: "Medium" as "Low" | "Medium" | "High",
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

  // Performance data untuk chart
  const performanceData = [
    { category: "Contract Value", thisContract: 95, divisionAverage: 88 },
    { category: "Risk Score", thisContract: 25, divisionAverage: 72 },
    { category: "Completion Time", thisContract: 78, divisionAverage: 90 },
    { category: "Vendor Rating", thisContract: 85, divisionAverage: 82 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace('IDR', 'Rp');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (action: string) => {
    // Implementasi action sesuai kebutuhan
    console.log(`Action: ${action}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header dengan tombol back */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reports
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contract Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {contractData.name}
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Contract Parties</span>
                    <div className="mt-1">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">First Party:</span> {contractData.first_party}
                      </div>
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Second Party:</span> {contractData.second_party}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">Contract Value</span>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(contractData.value_rp)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                    <div className="text-sm text-gray-900">{contractData.duration_months} months ({new Date(contractData.start_date).toLocaleDateString()} - {new Date(contractData.end_date).toLocaleDateString()})</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contractData.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                          {contractData.status === 'pending' ? 'Pending Review' : contractData.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">Risk Level</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(contractData.risk)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                          {contractData.risk === 'high' ? 'High Risk' : contractData.risk}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-500">
                    <div>Contract ID: {contractData.id}</div>
                    <div>Last Updated: {new Date(contractData.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contract Performance vs Division Average
            </h3>
            
            <div className="space-y-4">
              {performanceData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.category}</span>
                    <div className="flex gap-4">
                      <span className="text-blue-600">{item.thisContract}%</span>
                      <span className="text-green-600">{item.divisionAverage}%</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex gap-1 h-6">
                      {/* This Contract Bar */}
                      <div className="flex-1 bg-gray-100 rounded">
                        <div 
                          className="h-full bg-blue-500 rounded"
                          style={{ width: `${item.thisContract}%` }}
                        ></div>
                      </div>
                      {/* Division Average Bar */}
                      <div className="flex-1 bg-gray-100 rounded">
                        <div 
                          className="h-full bg-green-500 rounded"
                          style={{ width: `${item.divisionAverage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">This Contract</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Division Average</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Team Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Team Notes</h3>
            
            <div className="space-y-4">
              {legalNotes.map((note) => (
                <div key={note.id} className={`border-l-4 pl-4 py-3 ${note.type === 'warning' ? 'border-orange-400 bg-orange-50' : 'border-blue-400 bg-blue-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-gray-900">{note.author}</span>
                      <span className="text-sm text-gray-500 ml-2">{note.role}</span>
                    </div>
                    <span className="text-sm text-gray-500">{note.date}, {note.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Contract Document */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contract Document</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
            </div>
            
            <div className="flex flex-col items-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-red-600 font-bold text-lg">PDF</span>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">IT_Infrastructure_Contract_2024.pdf</div>
                <div className="text-sm text-gray-500">24 pages • 2.3 MB</div>
              </div>
            </div>
          </div>

          {/* Risk Analysis Results */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              AI Risk Analysis
            </h3>
            
            {/* Risk Level & Confidence */}
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Risk Level:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  riskAnalysis.risk_level === 'Low' ? 'bg-green-100 text-green-800' :
                  riskAnalysis.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {riskAnalysis.risk_level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Confidence:</span>
                <span className="text-sm font-semibold text-green-700">
                  {(riskAnalysis.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Risk Factors:</h4>
              {riskAnalysis.risk_factors.map((factor, index) => (
                <div key={index} className="border-l-4 pl-3 py-2" style={{
                  borderColor: factor.severity === 'High' ? '#ef4444' : 
                              factor.severity === 'Medium' ? '#f59e0b' : '#10b981'
                }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {factor.type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      factor.severity === 'High' ? 'bg-red-100 text-red-800' :
                      factor.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {factor.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {factor.found_keywords.map((keyword, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {riskAnalysis.risk_assessment.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Contract Status:</span> Pending Manager Review
            <br />
            <span className="font-medium">Next Action Required:</span> Decision by Manager
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleAction('hold')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hold Decision
            </button>
            
            <button 
              onClick={() => handleAction('clarification')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Request Clarification
            </button>
            
            <button 
              onClick={() => handleAction('approve')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve Contract
            </button>
          </div>
        </div>
      </div>

      {/* Bottom padding to prevent content being hidden behind fixed buttons */}
      <div className="h-24"></div>
    </div>
  );
}