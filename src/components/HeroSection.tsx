import React, { useEffect, useState } from 'react';
import { CircularGauge } from './CircularGauge';
import { ShieldAlert, Info, ShieldCheck } from 'lucide-react';
import { fetchGenAIExplanation } from '../api/householdApi';

interface HeroSectionProps {
  householdId: number;
  overrideScore?: number;
  score: number;
  riskBand: 'Low' | 'Medium' | 'High';
  features: {
    monthly_income: number;
    total_debt: number;
    essential_monthly_expenses: number;
    emergency_savings_months: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ householdId, overrideScore, score, riskBand, features }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loadingExpl, setLoadingExpl] = useState(true);

  useEffect(() => {
    setLoadingExpl(true);
    fetchGenAIExplanation(householdId, overrideScore)
      .then(res => {
        setExplanation(res);
        setLoadingExpl(false);
      })
      .catch(() => {
        setExplanation('Failed to load AI explanation. Please rely on the raw metrics.');
        setLoadingExpl(false);
      });
  }, [householdId, overrideScore]);

  let RiskIcon = ShieldAlert;
  let riskColor = 'text-rose-500';
  let riskBg = 'bg-rose-500/10';
  let riskBorder = 'border-rose-500/20';
  let protocol = "High Priority: Immediate crisis intervention required. Fast-track for NGO grants and CSR relief funds.";

  if (riskBand === 'Medium') {
    RiskIcon = Info;
    riskColor = 'text-amber-500';
    riskBg = 'bg-amber-500/10';
    riskBorder = 'border-amber-500/20';
    protocol = "Monitor: Household is surviving but fragile. Connect with skill-building and micro-credit programs.";
  } else if (riskBand === 'Low') {
    RiskIcon = ShieldCheck;
    riskColor = 'text-emerald-500';
    riskBg = 'bg-emerald-500/10';
    riskBorder = 'border-emerald-500/20';
    protocol = "Stable: Household demonstrates strong financial resilience.";
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row gap-8">
      {/* Left: Gauge and Dimension Breakdown */}
      <div className="flex flex-col items-center gap-6 md:border-r border-slate-800 md:pr-8">
        <CircularGauge score={score} riskBand={riskBand} />
        
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Income</div>
            <div className="font-semibold text-slate-200">₹{features.monthly_income.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Debt</div>
            <div className="font-semibold text-slate-200">₹{features.total_debt.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Expenses</div>
            <div className="font-semibold text-slate-200">₹{features.essential_monthly_expenses.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Savings</div>
            <div className="font-semibold text-slate-200">{features.emergency_savings_months} mo</div>
          </div>
        </div>
      </div>

      {/* Right: Risk Band and Explanation */}
      <div className="flex flex-col flex-1 gap-6">
        {/* Risk Card */}
        <div className={`p-4 rounded-xl border ${riskBg} ${riskBorder} flex items-start gap-4`}>
          <div className={`p-2 rounded-full bg-slate-900 ${riskColor}`}>
            <RiskIcon size={24} />
          </div>
          <div>
            <h2 className={`text-xl font-bold uppercase tracking-wide ${riskColor}`}>{riskBand} Risk</h2>
            <p className="text-slate-300 mt-1 text-sm">{protocol}</p>
          </div>
        </div>

        {/* GenAI Explanation */}
        <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 relative overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            AI Analysis
          </h3>
          
          {loadingExpl ? (
            <div className="space-y-3">
              <div className="h-4 bg-slate-700/50 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-slate-700/50 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-slate-700/50 rounded animate-pulse w-5/6"></div>
            </div>
          ) : (
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
