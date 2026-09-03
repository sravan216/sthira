import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play } from 'lucide-react';
import { simulateCliff } from '../api/householdApi';

interface CliffSimulatorProps {
  householdId: number;
  overrideScore?: number;
}

export const CliffSimulator: React.FC<CliffSimulatorProps> = ({ householdId, overrideScore }) => {
  const [shockType, setShockType] = useState('job_loss');
  const [magnitude, setMagnitude] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await simulateCliff(householdId, { shock_type: shockType, magnitude }, overrideScore);
      setResult(res);
    } catch (err) {
      console.error('Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Cliff Simulator</h3>
          <p className="text-sm text-slate-500">Project risk trajectory under hypothetical shocks.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Shock Type</label>
          <select 
            value={shockType} 
            onChange={(e) => setShockType(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="job_loss">Job Loss</option>
            <option value="medical_expense">Medical Emergency</option>
            <option value="rent_increase">Rent Spike</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
            Magnitude: {magnitude}%
          </label>
          <input 
            type="range" 
            min="10" max="100" step="10" 
            value={magnitude} 
            onChange={(e) => setMagnitude(Number(e.target.value))}
            className="w-full mt-2 accent-indigo-600"
          />
        </div>
        <div className="flex items-end">
          <button 
            onClick={handleSimulate}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <span className="animate-pulse">Running...</span> : <><Play size={16} /> Run</>}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative">
        {!result ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
            Configure shock parameters and run simulation to project trajectory.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.trajectory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tickFormatter={(val) => `Mo ${val}`} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => `Month ${label}`}
              />
              
              {result.tipping_point && (
                <ReferenceLine 
                  x={result.tipping_month} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3"
                  label={{ position: 'top', value: 'Tipping Point', fill: '#ef4444', fontSize: 12 }} 
                />
              )}
              
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#4f46e5" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
