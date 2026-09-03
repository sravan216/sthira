import React, { useState, useEffect } from 'react';
import { fetchModels } from '../api/adminApi';
import type { ModelVersion } from '../api/adminApi';
import { Database, TrendingUp, CheckCircle2 } from 'lucide-react';

export const ModelRegistry: React.FC = () => {
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels().then(res => {
      setModels(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading registry...</div>;

  const activeModel = models.find(m => m.is_active);
  const inactiveModels = models.filter(m => !m.is_active);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-200">Model Registry</h2>
        <p className="text-sm text-slate-400">Visibility into ML models driving vulnerability scores.</p>
      </div>

      {activeModel && (
        <div className="bg-slate-800 border border-emerald-500/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded">
              <CheckCircle2 size={14} /> Production Active
            </span>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-900 rounded-lg text-emerald-400">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-200">{activeModel.version}</h3>
              <p className="text-sm text-slate-400">Deployed: {new Date(activeModel.deployed_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Accuracy</div>
              <div className="text-lg font-bold text-slate-200">{(activeModel.metrics.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">F1 Score</div>
              <div className="text-lg font-bold text-slate-200">{activeModel.metrics.f1.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">RMSE</div>
              <div className="text-lg font-bold text-slate-200">{activeModel.metrics.rmse.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">MAE</div>
              <div className="text-lg font-bold text-slate-200">{activeModel.metrics.mae.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">R²</div>
              <div className="text-lg font-bold text-slate-200">{activeModel.metrics.r2.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-2">
          <TrendingUp size={18} className="text-slate-400" />
          <h3 className="font-bold text-slate-200">Version History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Version</th>
                <th className="px-6 py-3">Deployed</th>
                <th className="px-6 py-3">Accuracy</th>
                <th className="px-6 py-3">F1</th>
                <th className="px-6 py-3">RMSE</th>
              </tr>
            </thead>
            <tbody>
              {inactiveModels.map(m => (
                <tr key={m.version} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="px-6 py-4 font-medium text-slate-300">{m.version}</td>
                  <td className="px-6 py-4">{new Date(m.deployed_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{(m.metrics.accuracy * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4">{m.metrics.f1.toFixed(2)}</td>
                  <td className="px-6 py-4">{m.metrics.rmse.toFixed(2)}</td>
                </tr>
              ))}
              {inactiveModels.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No historical models found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
