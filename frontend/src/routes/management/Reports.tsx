import { useState } from "react";
import RiskDistribution from "../../components/management/RiskDistribution";
import ReportsKPICard from "../../components/management/Reports/ReportsKPICard";
import ContractStatus from "../../components/management/Reports/ContractStatus";
import ExpiringContracts from "../../components/management/Reports/ExpiringContracts";

// Interface definitions
interface ContractSummaryData {
  id: string;
  name: string;
  value: number;
  status: "active" | "pending" | "expired";
  expiryDate: string;
  risk: "low" | "medium" | "high";
}



export default function Reports() {
  const [reportPeriod, setReportPeriod] = useState("Monthly");
  const [department, setDepartment] = useState("All Departments");
  const [includeRiskDetails, setIncludeRiskDetails] = useState(false);





  // Mock data untuk contracts summary table
  const contractsSummary: ContractSummaryData[] = [
    {
      id: "1",
      name: "Software License Agreement",
      value: 125000,
      status: "active",
      expiryDate: "2024-06-15",
      risk: "low",
    },
    {
      id: "2",
      name: "Consulting Services Contract",
      value: 85000,
      status: "active",
      expiryDate: "2024-04-30",
      risk: "medium",
    },
    {
      id: "3",
      name: "Office Equipment Lease",
      value: 45000,
      status: "pending",
      expiryDate: "2024-07-20",
      risk: "low",
    },
    {
      id: "4",
      name: "Marketing Services Agreement",
      value: 95000,
      status: "expired",
      expiryDate: "2024-03-15",
      risk: "high",
    },
    {
      id: "5",
      name: "Cloud Infrastructure Contract",
      value: 180000,
      status: "active",
      expiryDate: "2024-05-10",
      risk: "medium",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Generate Reports
        </h1>

        <div className="flex items-end gap-6">
          {/* Report Period */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Period
            </label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          {/* Department */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="All Departments">All Departments</option>
              <option value="IT">IT</option>
              <option value="Legal">Legal</option>
              <option value="Procurement">Procurement</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {/* Include Risk Details Checkbox */}
          <div className="flex-1 flex items-center">
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={includeRiskDetails}
                onChange={(e) => setIncludeRiskDetails(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Include Risk Details</span>
            </label>
          </div>

          {/* Export Report Button */}
          <div className="flex-shrink-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-3 rounded-lg font-medium text-sm transition-colors">
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportsKPICard
          title="Active Contracts"
          value="142"
          subtitle="+12% from last month"
          variant="active"
          trend="up"
        />

        <ReportsKPICard
          title="Expired Contracts"
          value="23"
          subtitle="Needs attention"
          variant="expired"
        />

        <ReportsKPICard
          title="Total Contract Value"
          value="$2.4M"
          subtitle="+8.2% growth"
          variant="value"
          trend="up"
        />

        <ReportsKPICard
          title="Average Risk"
          value="Medium"
          subtitle="35% of contracts"
          variant="distribution"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contract Status
          </h3>
          <ContractStatus />
        </div>

        {/* Expiring Contracts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expiring Contracts
          </h3>
          <div className="h-80">
            <ExpiringContracts />
          </div>
        </div>

        {/* Risk Distribution Chart */}
          <RiskDistribution />
      </div>

      {/* Contracts Summary Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Contracts Summary
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search contracts..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Contract Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Expiry Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody>
              {contractsSummary.map((contract) => (
                <tr
                  key={contract.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-900">{contract.name}</td>
                  <td className="py-3 px-4 text-gray-600">
                    ${contract.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.status === "active"
                          ? "bg-green-100 text-green-800"
                          : contract.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(contract.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.risk === "low"
                          ? "bg-green-100 text-green-800"
                          : contract.risk === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {contract.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Export & Share
        </h3>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export PDF
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Excel
          </button>

          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email Report
          </button>
        </div>
      </div>
    </div>
  );
}
