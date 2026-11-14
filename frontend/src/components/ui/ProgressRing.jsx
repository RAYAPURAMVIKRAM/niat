import React, { useEffect, useState } from 'react';

export default function ProgressRing({
  percentage = 85,
  size = 64,
  strokeWidth = 6,
  label = 'Match',
  className = '',
}) {
  const [displayValue, setDisplayValue] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    // Smooth number counter
    let start = 0;
    const end = Math.min(100, Math.max(0, percentage));
    const duration = 1000;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = (end - start) / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [percentage]);

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`ring-gradient-${percentage}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#ring-gradient-${percentage})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={targetOffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Centered Percentage Number and Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-black text-slate-900 leading-none tabular-nums font-tech">
          {displayValue}%
        </span>
        {label && (
          <span className="text-[9px] font-bold text-emerald-700 leading-none mt-0.5 tracking-tight uppercase">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
