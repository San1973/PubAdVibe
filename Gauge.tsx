
import React from 'react';

interface GaugeProps {
  score: number;
  label: string;
}

const Gauge: React.FC<GaugeProps> = ({ score, label }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s > 75) return '#10B981'; // Emerald
    if (s > 40) return '#F59E0B'; // Amber
    return '#EF4444'; // Crimson
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-48 h-48 group">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="#1e293b"
          strokeWidth="8"
          fill="transparent"
          className="transition-all duration-500"
        />
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke={getColor(score)}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold font-mono tracking-tighter" style={{ color: getColor(score) }}>
          {Math.round(score)}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">
          {label}
        </span>
      </div>
    </div>
  );
};

export default Gauge;
