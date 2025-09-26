import { useNavigate } from "react-router-dom";
import { KPICard } from "../../components/management/KPIMonitoring/KPICard";
import RiskDistribution from "../../components/management/RiskDistribution";
import ContractExpirationGraph from "../../components/management/KPIMonitoring/ContractExpirationGraph";

export default function KPIMonitoring() {
  const navigate = useNavigate();

  const handleViewContract = (contractId: string) => {
    navigate(`/management/contracts/${contractId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            KPI Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor contract performance and risk indicators in real time
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Contracts"
          value="247"
          subtitle="+12% from last month"
          iconSrc="/management/active_contract_icon.svg"
          iconBgColor="bg-blue-100"
          trend="up"
          trendValue="+12%"
          badge={{
            label: "Active",
            color: "text-blue-800",
            bgColor: "bg-blue-100",
          }}
        />

        <KPICard
          title="Expired Contracts"
          value="18"
          subtitle="-5% from last month"
          iconSrc="/management/expired_contract_icon.svg"
          iconBgColor="bg-gray-100"
          trend="down"
          trendValue="-5%"
          badge={{
            label: "Expired",
            color: "text-gray-800",
            bgColor: "bg-gray-100",
          }}
        />

        <KPICard
          title="Contract Value"
          value="$24.7M"
          subtitle="+8.5% from last month"
          iconSrc="/management/contract_value_icon.svg"
          iconBgColor="bg-green-100"
          trend="up"
          trendValue="+8.5%"
          badge={{
            label: "Total Value",
            color: "text-green-800",
            bgColor: "bg-green-100",
          }}
        />

        <KPICard
          title="Average Risk Score"
          value="6.8/10"
          subtitle="-0.3 from last month"
          iconSrc="/management/risk_score_icon.svg"
          iconBgColor="bg-orange-100"
          trend="down"
          trendValue="-0.3"
          badge={{
            label: "Medium",
            color: "text-orange-800",
            bgColor: "bg-orange-100",
          }}
        />
      </div>

      {/* Risk Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistribution />
        <ContractExpirationGraph />
      </div>

      {/* High Priority Contracts Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            High Priority Contracts
          </h2>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    IT Infrastructure Service Agreement
                  </div>
                  <div className="text-sm text-gray-500">Masdani Solutions</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $2.5M
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    High
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Dec 15, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Dec 15, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewContract('1')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Logistics Partnership Agreement
                  </div>
                  <div className="text-sm text-gray-500">Senyum Sekarang</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $1.8M
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Medium
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Jan 25, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Jan 25, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewContract('2')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Security Consulting Service
                  </div>
                  <div className="text-sm text-gray-500">
                    Securon Seharusnya Ltd
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $800K
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Low
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Mar 10, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Mar 10, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewContract('3')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
