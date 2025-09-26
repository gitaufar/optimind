// components/Legal/RiskRadar.tsx

// Tipe data untuk setiap item risiko
type Finding = {
  id: string;
  level: 'High' | 'Medium' | 'Low';
  title: string;        // contoh: section/pasal
  description: string;  // contoh: judul/temuan ringkas
};

// Sub-komponen item
function RiskItem({ finding }: { finding: Finding }) {
  const styles = {
    High: { bar: 'bg-red-500', title: 'text-red-600', badge: 'bg-red-100 text-red-700' },
    Medium: { bar: 'bg-amber-400', title: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    Low: { bar: 'bg-emerald-500', title: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  } as const;
  const s = styles[finding.level] ?? styles.Low;

  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className={`w-1.5 flex-shrink-0 ${s.bar}`} />
      <div className="flex flex-grow items-center justify-between p-4">
        <div>
          <h4 className={`font-bold ${s.title}`}>{finding.title}</h4>
          <p className="mt-1 text-sm text-gray-600">{finding.description}</p>
        </div>
        <span className={`ml-4 flex-shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${s.badge}`}>
          {finding.level.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// Komponen utama
export default function RiskRadar({ findings }: { findings: Finding[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Risk Radar</h2>
      <p className="text-sm text-gray-500">High-risk clauses detected by AI</p>

      {findings.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No risks have been identified.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {findings.map((f) => (
            <RiskItem key={f.id} finding={f} />
          ))}
        </div>
      )}
    </div>
  );
}