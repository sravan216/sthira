import React from 'react';
import type { DashboardAggregate } from '../api/dashboardApi';
import { Users, AlertTriangle, Activity, Database } from 'lucide-react';

interface SummaryCardsProps {
  summary: DashboardAggregate['summary'];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Total Households */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-slate-700 opacity-20">
          <Users size={100} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Users size={20} />
          </div>
          <h3 className="text-sm font-medium text-slate-400">Total Scored</h3>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">
          {summary.totalHouseholds.toLocaleString()}
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-slate-700 opacity-20">
          <AlertTriangle size={100} />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-sm font-medium text-slate-400">Risk Profile</h3>
        </div>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden w-full mb-2">
          <div style={{ width: `${summary.riskDistribution.low}%` }} className="bg-emerald-500"></div>
          <div style={{ width: `${summary.riskDistribution.medium}%` }} className="bg-amber-500"></div>
          <div style={{ width: `${summary.riskDistribution.high}%` }} className="bg-rose-500"></div>
        </div>
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-emerald-500">{summary.riskDistribution.low}% L</span>
          <span className="text-amber-500">{summary.riskDistribution.medium}% M</span>
          <span className="text-rose-500">{summary.riskDistribution.high}% H</span>
        </div>
      </div>

      {/* Avg FVS */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-slate-700 opacity-20">
          <Activity size={100} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
            <Activity size={20} />
          </div>
          <h3 className="text-sm font-medium text-slate-400">National Avg FVS</h3>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-2">
          {summary.averageFVS} <span className="text-sm font-normal text-slate-500">/ 100</span>
        </div>
      </div>

      {/* Model Metadata */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-slate-700 opacity-20">
          <Database size={100} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Database size={20} />
          </div>
          <h3 className="text-sm font-medium text-slate-400">Model Engine</h3>
        </div>
        <div className="text-lg font-bold text-white mb-1 truncate">
          {summary.modelMetadata.version}
        </div>
        <div className="flex gap-3 text-xs text-slate-400">
          <span>Acc: {(summary.modelMetadata.accuracy * 100).toFixed(1)}%</span>
          <span>RMSE: {summary.modelMetadata.rmse.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
};
