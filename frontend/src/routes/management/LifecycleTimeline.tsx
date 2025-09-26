import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LifecycleKPICard from '../../components/management/LifecycleTimeline/LifecycleKPICard'
import ContractLifecycleTimeline from '../../components/management/LifecycleTimeline/ContractLifecycleTimeline'
import ContractsExpiring from '../../components/management/LifecycleTimeline/ContractsExpiring'

interface Contract {
  id: string
  name: string
  value: string
  vendor: string
  timeline: {
    start: string
    end: string
    duration: number // in months
    currentMonth: number
  }
  status: 'active' | 'expiring-soon' | 'critical' | 'expired'
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk'
  daysToExpiry?: number
}

interface ContractExpiringCard {
  title: string
  value: string
  vendor: string
  daysToExpiry: number
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk'
}

export default function LifecycleTimeline() {
  const navigate = useNavigate()
  const [selectedDivision, setSelectedDivision] = useState('All Divisions')
  const [selectedPeriod, setSelectedPeriod] = useState('Next 90 Days')
  const [isHighRiskOnly, setIsHighRiskOnly] = useState(false)

  const handleViewContract = (contractId?: string) => {
    if (contractId) {
      navigate(`/management/contracts/${contractId}`)
    }
  }

  const handleViewAllContracts = () => {
    navigate('/management/reports')
  }

  // KPI Data
  const kpiData = {
    activeContracts: 247,
    expiring30Days: 12,
    expiring60Days: 28,
    expired: 8
  }

  // Timeline Data
  const timelineContracts: Contract[] = [
    {
      id: '1',
      name: 'Cloud Infrastructure',
      value: '$2.5M',
      vendor: 'Tech Corp',
      timeline: { start: 'Jan', end: 'Dec', duration: 12, currentMonth: 9 },
      status: 'active',
      riskLevel: 'Low Risk'
    },
    {
      id: '2', 
      name: 'Security Services',
      value: '$800K',
      vendor: 'SecureTech',
      timeline: { start: 'Mar', end: 'Aug', duration: 6, currentMonth: 5 },
      status: 'expiring-soon',
      riskLevel: 'Medium Risk'
    },
    {
      id: '3',
      name: 'Office Supplies',
      value: '$150K', 
      vendor: 'Supply Co',
      timeline: { start: 'Jun', end: 'Sep', duration: 4, currentMonth: 3 },
      status: 'critical',
      riskLevel: 'High Risk'
    },
    {
      id: '4',
      name: 'Software Licenses',
      value: '$1.2M',
      vendor: 'SoftCorp',
      timeline: { start: 'Jan', end: 'Dec', duration: 12, currentMonth: 9 },
      status: 'active',
      riskLevel: 'Low Risk'
    },
    {
      id: '5',
      name: 'Maintenance Contract',
      value: '$500K',
      vendor: 'MaintCorp',
      timeline: { start: 'Apr', end: 'Sep', duration: 6, currentMonth: 5 },
      status: 'expiring-soon',
      riskLevel: 'Medium Risk'
    }
  ]

  const expiringContracts: ContractExpiringCard[] = [
    {
      title: 'Office Supplies Contract',
      value: '$150,000',
      vendor: 'ABC Supplies Ltd',
      daysToExpiry: 15,
      riskLevel: 'High Risk'
    },
    {
      title: 'Security Services',
      value: '$800,000',
      vendor: 'SecureTech Solutions',
      daysToExpiry: 45,
      riskLevel: 'Medium Risk'
    },
    {
      title: 'Maintenance Contract',
      value: '$500,000', 
      vendor: 'TechMaint Corp',
      daysToExpiry: 92,
      riskLevel: 'Low Risk'
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <LifecycleKPICard
          title="Active Contracts"
          value={kpiData.activeContracts}
          variant="active"
        />
        <LifecycleKPICard
          title="Expiring ≤30 Days"
          value={kpiData.expiring30Days}
          variant="expiring-30"
        />
        <LifecycleKPICard
          title="Expiring ≤60 Days"
          value={kpiData.expiring60Days}
          variant="expiring-60"
        />
        <LifecycleKPICard
          title="Expired"
          value={kpiData.expired}
          variant="expired"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Lifecycle Timeline */}
        <div className="lg:col-span-2">
          <ContractLifecycleTimeline
            contracts={timelineContracts}
            selectedDivision={selectedDivision}
            selectedPeriod={selectedPeriod}
            isHighRiskOnly={isHighRiskOnly}
            onDivisionChange={setSelectedDivision}
            onPeriodChange={setSelectedPeriod}
            onHighRiskToggle={setIsHighRiskOnly}
          />
        </div>

        {/* Contracts Expiring Soon */}
        <ContractsExpiring
          contracts={expiringContracts}
          onViewContract={handleViewContract}
          onViewAllContracts={handleViewAllContracts}
        />
      </div>
    </div>
  )
}