export default function EcoScoreBadge({ score, size = 'md', showLabel = true }) {
    const getColor = (s) => {
        if (s >= 85) return { ring: '#22c55e', bg: '#dcfce7', text: '#15803d', label: 'Platinum' };
        if (s >= 70) return { ring: '#eab308', bg: '#fef9c3', text: '#a16207', label: 'Gold' };
        if (s >= 55) return { ring: '#94a3b8', bg: '#f1f5f9', text: '#475569', label: 'Silver' };
        if (s >= 40) return { ring: '#f97316', bg: '#fff7ed', text: '#c2410c', label: 'Bronze' };
        return { ring: '#d1d5db', bg: '#f9fafb', text: '#6b7280', label: 'Basic' };
    };

    const { ring, bg, text, label } = getColor(score);

    const sizes = {
        sm: { outer: 44, stroke: 3, font: '12px', labelFont: '9px' },
        md: { outer: 64, stroke: 4, font: '16px', labelFont: '10px' },
        lg: { outer: 88, stroke: 5, font: '22px', labelFont: '11px' },
    };

    const { outer, stroke, font, labelFont } = sizes[size] || sizes.md;
    const radius = (outer - stroke * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const center = outer / 2;

    return (
        <div className="flex flex-col items-center gap-1">
            <svg width={outer} height={outer} viewBox={`0 0 ${outer} ${outer}`} className="drop-shadow-sm">
                {/* Background circle */}
                <circle
                    cx={center} cy={center} r={radius}
                    fill={bg}
                    stroke="#e5e7eb" strokeWidth={stroke}
                />
                {/* Progress arc */}
                <circle
                    cx={center} cy={center} r={radius}
                    fill="transparent"
                    stroke={ring} strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                {/* Score number */}
                <text
                    x={center} y={center + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={text} fontWeight="700"
                    fontSize={font} fontFamily="Inter, sans-serif"
                >
                    {score}
                </text>
            </svg>
            {showLabel && (
                <span
                    className="font-semibold text-xs px-2 py-0.5 rounded-full"
                    style={{ color: text, background: bg, border: `1px solid ${ring}` }}
                >
                    {label}
                </span>
            )}
        </div>
    );
}
