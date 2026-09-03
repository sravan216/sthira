import React, { useState } from 'react';
import type { DashboardAggregate } from '../api/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { LayoutGrid, Table } from 'lucide-react';

interface RegionalHeatmapProps {
  data: DashboardAggregate['regionalHeatmap'];
}

export const RegionalHeatmap: React.FC<RegionalHeatmapProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  // Sort by average FVS descending for the chart
  const sortedData = [...data].sort((a, b) => b.averageFVS - a.averageFVS);

  const getBarColor = (fvs: number) => {
    if (fvs >= 75) return '#ef4444'; // Red
    if (fvs >= 50) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-200">Regional Vulnerability</h3>
          <p className="text-sm text-slate-400">Average FVS by Region</p>
        </div>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
          <button 
            onClick={() => setViewMode('chart')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'chart' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Table size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        {viewMode === 'chart' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis 
                dataKey="region" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#e2e8f0', fontSize: 12 }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                formatter={(value: any, name: any) => [
                  name === 'averageFVS' ? value : value.toLocaleString(),
                  name === 'averageFVS' ? 'Avg Score' : 'Households'
                ]}
              />
              <Bar dataKey="averageFVS" radius={[0, 4, 4, 0]} maxBarSize={40}>
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.averageFVS)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Region</th>
                  <th className="px-4 py-3">Households Scored</th>
                  <th className="px-4 py-3 rounded-tr-lg">Avg Score (FVS)</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{row.region}</td>
                    <td className="px-4 py-3">{row.householdCount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        row.averageFVS >= 75 ? 'bg-rose-500/20 text-rose-400' :
                        row.averageFVS >= 50 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {row.averageFVS}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
