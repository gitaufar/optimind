// components/Legal/RiskRadarCard.tsx

type Finding = {
  id: string;
  level: 'High' | 'Medium' | 'Low';
  section: string;
  title?: string;
};

// Sub-komponen untuk setiap item risiko
function RiskItem({ finding }: { finding: Finding }) {
  const styles = {
    High: { border: 'border-red-500', bg: 'bg-red-100', text: 'text-red-700' },
    Medium: { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-700' },
    Low: { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-700' },
  };
  const currentStyle = styles[finding.level] || styles.Low;

  return (
    <div className={`flex items-center justify-between rounded-md border-l-4 ${currentStyle.border} ${currentStyle.bg} p-3`}>
      <div>
        <p className="font-semibold text-gray-800">{finding.title || finding.section}</p>
        <p className="text-xs text-gray-500">{finding.section}</p>
      </div>
      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${currentStyle.text} ${currentStyle.bg}`}>
        {finding.level.toUpperCase()} RISK
      </span>
    </div>
  );
}

// Komponen utama RiskRadarCard
export default function RiskRadarCard({ findings }: { findings: Finding[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-gray-800">🚨 Risk Radar</h3>
      {findings.length === 0 ? (
        <p className="text-sm text-gray-500">Run analysis to see risk findings.</p>
      ) : (
        <div className="space-y-2">
          {findings.map((f) => (
            <RiskItem key={f.id} finding={f} />
          ))}
        </div>
      )}
    </div>
  );
}