interface ExpiringContractsProps {}

export default function ExpiringContracts({}: ExpiringContractsProps) {
  // Mock data berdasarkan screenshot
  const data = [
    { period: "30 Days", count: 16 },
    { period: "60 Days", count: 28 },
    { period: "90 Days", count: 42 },
  ];

  // Chart dimensions - lebih besar untuk sesuai screenshot
  const chartWidth = 320;
  const chartHeight = 280;
  const margin = { top: 30, right: 30, bottom: 80, left: 60 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  // Scales
  const maxValue = 50;
  const yScale = (value: number) => innerHeight - (value / maxValue) * innerHeight;
  const xScale = (index: number) => (index / (data.length - 1)) * innerWidth;

  // Generate path for line
  const pathData = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.count);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(" ");

  return (
    <div className="w-full h-full flex flex-col">
      <svg width={chartWidth} height={chartHeight} className="mx-auto">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines horizontal */}
          {[0, 10, 20, 30, 40, 50].map((value) => (
            <g key={value}>
              <line
                x1={0}
                y1={yScale(value)}
                x2={innerWidth}
                y2={yScale(value)}
                stroke="#e5e7eb"
                strokeWidth={1}
                opacity={0.7}
              />
              <text
                x={-10}
                y={yScale(value)}
                textAnchor="end"
                dy="0.35em"
                className="text-sm fill-gray-500"
                fontSize="12"
              >
                {value}
              </text>
            </g>
          ))}

          {/* Y-axis label */}
          <text
            x={-40}
            y={innerHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90, -40, ${innerHeight / 2})`}
            className="text-sm fill-gray-700 font-medium"
            fontSize="12"
          >
            Contracts Expiring
          </text>

          {/* X-axis */}
          <line
            x1={0}
            y1={innerHeight}
            x2={innerWidth}
            y2={innerHeight}
            stroke="#e5e7eb"
            strokeWidth={1}
          />

          {/* Y-axis */}
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={innerHeight}
            stroke="#e5e7eb"
            strokeWidth={1}
          />

          {/* Line path */}
          <path
            d={pathData}
            fill="none"
            stroke="#f97316"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.count)}
              r={5}
              fill="#f97316"
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={xScale(i)}
              y={innerHeight + 20}
              textAnchor="middle"
              className="text-sm fill-gray-600"
              fontSize="12"
            >
              {d.period}
            </text>
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-orange-500 rounded"></div>
          <span className="text-sm text-gray-600 font-medium">Expiring Contracts</span>
        </div>
      </div>
    </div>
  );
}