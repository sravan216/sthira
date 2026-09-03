import React, { useEffect, useState } from 'react';

interface CircularGaugeProps {
  score: number;
  riskBand: 'Low' | 'Medium' | 'High';
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({ score, riskBand }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let color = 'text-emerald-500';
  if (riskBand === 'Medium') color = 'text-amber-500';
  if (riskBand === 'High') color = 'text-rose-500';

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      {/* Background circle */}
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-700"
        />
        {/* Animated circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-white">{animatedScore}</span>
        <span className="text-xs uppercase tracking-wider text-slate-400">Score</span>
      </div>
    </div>
  );
};
