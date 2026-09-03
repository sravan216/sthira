import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AttributionPanelProps {
  shapValues: Array<{ feature: string; impact: number }>;
}

export const AttributionPanel: React.FC<AttributionPanelProps> = ({ shapValues }) => {
  // Sort by absolute impact so the biggest drivers are at top
  const sortedData = [...shapValues].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Score Drivers</h3>
      <p className="text-sm text-slate-500 mb-6">What factors are pushing the score up (red) or down (green).</p>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="feature" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              width={120}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any) => [
                value > 0 ? `+${value} (Increases Risk)` : `${value} (Protective)`,
                'Impact'
              ]}
            />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#ef4444' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
