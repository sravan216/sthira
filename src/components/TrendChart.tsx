import React from 'react';
import type { DashboardAggregate } from '../api/dashboardApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: DashboardAggregate['trends'];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-200">National Vulnerability Trend</h3>
        <p className="text-sm text-slate-400">12-Month Average Score Trajectory</p>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            
            <Line 
              type="monotone" 
              dataKey="fvs" 
              name="Avg FVS"
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#1e293b' }}
              activeDot={{ r: 6, fill: '#6366f1', stroke: '#1e293b' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
