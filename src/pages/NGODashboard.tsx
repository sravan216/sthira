import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Phone, Calendar, ChevronLeft, Building2, ExternalLink } from 'lucide-react';

export const NGODashboard: React.FC = () => {
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sthira_ngo_referrals');
      if (stored) {
        setReferrals(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load referrals", e);
    }
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    const updated = referrals.map(ref => 
      ref.id === id ? { ...ref, status: newStatus } : ref
    );
    setReferrals(updated);
    localStorage.setItem('sthira_ngo_referrals', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Nav Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center mb-8 sticky top-0 z-10 shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft size={16} /> Back to Directory
        </Link>
        <h1 className="ml-auto text-xl font-bold text-slate-800 flex items-center gap-3">
          <HeartHandshake className="text-rose-600" /> 
          NGO Provider Dashboard
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Active Referrals Pipeline</h2>
              <p className="text-sm text-slate-500 mt-1">Manage incoming household referrals matched to your programs.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 flex gap-4 text-sm font-medium">
              <span className="text-slate-500">Total: <strong className="text-slate-800">{referrals.length}</strong></span>
              <span className="text-amber-500">Pending: <strong className="text-amber-700">{referrals.filter(r => r.status === 'Pending').length}</strong></span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {referrals.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <HeartHandshake size={48} className="mx-auto text-slate-300 mb-4" />
                <p>No referrals have been received yet.</p>
                <p className="text-sm mt-1">When households are referred from the Household Dashboard, they will appear here.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold text-slate-500">
                    <th className="p-4 pl-6">Reference ID</th>
                    <th className="p-4">Household / Contact</th>
                    <th className="p-4">Program Matched</th>
                    <th className="p-4">Match Score</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 pl-6">
                        <span className="font-mono text-xs font-bold text-slate-700">{ref.id}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                          Household #{String(ref.householdId).split('_')[0]}
                          {String(ref.householdId).includes('_sim_') && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded ml-1 border border-slate-200">SIM</span>}
                          <Link 
                            to={`/household/${String(ref.householdId).split('_')[0]}${String(ref.householdId).includes('_sim_') ? `?override=${String(ref.householdId).split('_')[2]}` : ''}`} 
                            className="text-indigo-400 hover:text-indigo-600 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium">
                          <Phone size={12} /> {ref.householdPhone}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-sm">{ref.programName}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <Building2 size={12} /> {ref.providerType}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {ref.matchScore}%
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-slate-400" />
                          {new Date(ref.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          ref.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          ref.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <select 
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                          value={ref.status}
                          onChange={(e) => updateStatus(ref.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Mark Contacted</option>
                          <option value="Accepted">Accept Case</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
