import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RiskDistribution from "../../components/management/RiskDistribution";
import { RiskSummary } from "../../components/management/RiskHeatmap/RiskSummary";

interface Contract {
  id: string;
  name: string;
  value: string;
  counterparty: string;
  status: "Pending Review" | "Overdue" | "Active" | "Under Review";
  deadline: string;
  riskLevel: "High" | "Medium" | "Low";
}

export default function RiskHeatmap() {
  const navigate = useNavigate();
  const [selectedDivision, setSelectedDivision] = useState("All Divisions");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [searchContract, setSearchContract] = useState("");

  const handleViewContract = (contractId: string) => {
    navigate(`/management/contracts/${contractId}`);
  };

  const contracts: Contract[] = [
    {
      id: "1",
      name: "Terminal Operations Agreement",
      value: "$2.5M",
      counterparty: "Maritime Corp",
      status: "Pending Review",
      deadline: "Dec 15, 2024",
      riskLevel: "High",
    },
    {
      id: "2",
      name: "Logistics Service Contract",
      value: "$1.8M",
      counterparty: "Global Logistics",
      status: "Overdue",
      deadline: "Nov 30, 2024",
      riskLevel: "High",
    },
    {
      id: "3",
      name: "Equipment Maintenance",
      value: "$950K",
      counterparty: "TechServ Ltd",
      status: "Active",
      deadline: "Jan 20, 2025",
      riskLevel: "High",
    },
    {
      id: "4",
      name: "Security Services Agreement",
      value: "$720K",
      counterparty: "SecureGuard",
      status: "Under Review",
      deadline: "Feb 10, 2025",
      riskLevel: "High",
    },
    {
      id: "5",
      name: "IT Infrastructure Contract",
      value: "$1.3M",
      counterparty: "DataTech Solutions",
      status: "Active",
      deadline: "Mar 15, 2025",
      riskLevel: "High",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Active":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const riskSummaryData = {
    high: { count: 12, percentage: 15.8 },
    medium: { count: 28, percentage: 36.8 },
    low: { count: 36, percentage: 47.4 },
    total: 76,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Risk Heatmap</h1>
      <p className="text-gray-600">
        Monitor contract risks across your portfolio with visual insights
      </p>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Division
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option>All Divisions</option>
              <option>Legal</option>
              <option>Operations</option>
              <option>Finance</option>
              <option>IT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Contract
            </label>
            <input
              type="text"
              placeholder="Contract name..."
              value={searchContract}
              onChange={(e) => setSearchContract(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Risk Distribution */}
        <div className="lg:col-span-2">
          <RiskDistribution />
        </div>

        {/* Risk Summary */}
        <RiskSummary
          total={riskSummaryData.total}
          highRisk={riskSummaryData.high.count}
          mediumRisk={riskSummaryData.medium.count}
          lowRisk={riskSummaryData.low.count}
        />
      </div>

      {/* Contracts at High Risk Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Contracts at High Risk
          </h3>
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
                  Counterparty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contract.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.counterparty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        contract.status
                      )}`}
                    >
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.deadline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(
                        contract.riskLevel
                      )}`}
                    >
                      {contract.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewContract(contract.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Contract
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
