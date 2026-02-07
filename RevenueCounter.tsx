
import React, { useEffect, useState } from 'react';

interface RevenueCounterProps {
  value: number;
}

const RevenueCounter: React.FC<RevenueCounterProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = (value - displayValue) / steps;
    
    let current = displayValue;
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= value) || (increment < 0 && current <= value)) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-start">
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 mb-1">Vibe Protected</span>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black font-mono text-white tracking-tighter drop-shadow-[0_0_15px_rgba(236,72,153,0.2)]">
          ${displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

export default RevenueCounter;