import React, { useState, useEffect } from 'react';
import { X, Calculator, Activity, History, ArrowRight } from 'lucide-react';
import { simulateScore } from '../api/householdApi';

interface ManualScoreModalProps {
  householdId: number;
  onClose: () => void;
  onApply: (result: any) => void;
}

export const ManualScoreModal: React.FC<ManualScoreModalProps> = ({ householdId, onClose, onApply }) => {
  const [formData, setFormData] = useState<{
    household_size: number | string;
    num_children: number | string;
    num_elderly_dependents: number | string;
    has_chronic_illness_dependent: boolean;
    monthly_income: number | string;
    income_type: string;
    income_volatility_score: number | string;
    total_debt: number | string;
    monthly_debt_repayment: number | string;
    rent: number | string;
    essential_monthly_expenses: number | string;
    medical_expenses_monthly: number | string;
    education_expenses_monthly: number | string;
    has_emergency_savings: boolean;
    emergency_savings_months: number | string;
    has_insurance: boolean;
  }>({
    household_size: 4,
    num_children: 2,
    num_elderly_dependents: 0,
    has_chronic_illness_dependent: false,
    
    monthly_income: 15000,
    income_type: 'Informal',
    income_volatility_score: 50,
    
    total_debt: 50000,
    monthly_debt_repayment: 2000,
    rent: 3000,
    essential_monthly_expenses: 12000,
    medical_expenses_monthly: 500,
    education_expenses_monthly: 1000,
    
    has_emergency_savings: false,
    emergency_savings_months: 0,
    has_insurance: false,
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(`sthira_history_${householdId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load history");
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'results' | 'history'>('results');

  useEffect(() => {
    localStorage.setItem(`sthira_history_${householdId}`, JSON.stringify(history));
  }, [history, householdId]);

  const handleCompute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await simulateScore({
        household_size: Number(formData.household_size) || 0,
        num_children: Number(formData.num_children) || 0,
        num_elderly_dependents: Number(formData.num_elderly_dependents) || 0,
        has_chronic_illness_dependent: formData.has_chronic_illness_dependent,
        monthly_income: Number(formData.monthly_income) || 0,
        income_type: formData.income_type,
        income_volatility_score: Number(formData.income_volatility_score) || 0,
        total_debt: Number(formData.total_debt) || 0,
        monthly_debt_repayment: Number(formData.monthly_debt_repayment) || 0,
        rent: Number(formData.rent) || 0,
        essential_monthly_expenses: Number(formData.essential_monthly_expenses) || 0,
        medical_expenses_monthly: Number(formData.medical_expenses_monthly) || 0,
        education_expenses_monthly: Number(formData.education_expenses_monthly) || 0,
        has_emergency_savings: formData.has_emergency_savings,
        emergency_savings_months: Number(formData.emergency_savings_months) || 0,
        has_insurance: formData.has_insurance
      });
      const newItem = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        inputs: { ...formData },
        result: res
      };
      
      setResult(res);
      setActiveTab('results');
      setHistory(prev => [newItem, ...prev]);
      onApply(newItem);
    } catch (e) {
      console.error("Simulation failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleVolatilityChange = (months: string) => {
    // 0 months -> 0 score, 6 months -> 100 score
    const score = (parseInt(months || '0') / 6) * 100;
    setFormData({ ...formData, income_volatility_score: score });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-2/3 p-6 overflow-y-auto border-r border-slate-100 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calculator size={18} className="text-indigo-600" /> Comprehensive Score Check
            </h2>
            <button onClick={onClose} className="md:hidden p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCompute} className="space-y-6 flex-1">
            
            {/* Dependency Burden */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">Dependency Burden</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Household Size</label>
                  <input type="number" value={formData.household_size} onChange={e => setFormData({ ...formData, household_size: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Children</label>
                  <input type="number" value={formData.num_children} onChange={e => setFormData({ ...formData, num_children: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Elderly Dependents</label>
                  <input type="number" value={formData.num_elderly_dependents} onChange={e => setFormData({ ...formData, num_elderly_dependents: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={formData.has_chronic_illness_dependent} onChange={e => setFormData({ ...formData, has_chronic_illness_dependent: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                    Has Dependent with Chronic Illness
                  </label>
                </div>
              </div>
            </div>

            {/* Income Stability */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">Income Stability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Monthly Income (₹)</label>
                  <input type="number" value={formData.monthly_income} onChange={e => setFormData({ ...formData, monthly_income: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Income Type</label>
                  <select value={formData.income_type} onChange={e => setFormData({ ...formData, income_type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="Formal">Formal</option>
                    <option value="Informal">Informal</option>
                    <option value="Daily Wage">Daily Wage</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Income Volatility</label>
                  <p className="text-xs text-slate-400 mb-2">How many of the last 6 months did your income vary by more than 20%?</p>
                  <select onChange={e => handleVolatilityChange(e.target.value)} defaultValue="3" className="w-full border rounded-lg px-3 py-2 text-sm">
                    {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} months</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Expenditure Stress */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">Expenditure Stress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Total Debt (₹)</label>
                  <input type="number" value={formData.total_debt} onChange={e => setFormData({ ...formData, total_debt: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Monthly Debt Repayment (₹)</label>
                  <input type="number" value={formData.monthly_debt_repayment} onChange={e => setFormData({ ...formData, monthly_debt_repayment: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Rent (₹)</label>
                  <input type="number" value={formData.rent} onChange={e => setFormData({ ...formData, rent: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Total Essential Expenses (₹)</label>
                  <input type="number" value={formData.essential_monthly_expenses} onChange={e => setFormData({ ...formData, essential_monthly_expenses: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Medical Expenses (₹)</label>
                  <input type="number" value={formData.medical_expenses_monthly} onChange={e => setFormData({ ...formData, medical_expenses_monthly: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Education Expenses (₹)</label>
                  <input type="number" value={formData.education_expenses_monthly} onChange={e => setFormData({ ...formData, education_expenses_monthly: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
              </div>
            </div>

            {/* Shock Resilience */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">Shock Resilience</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Savings Buffer (Months)</label>
                  <input type="number" step="0.5" value={formData.emergency_savings_months} onChange={e => setFormData({ ...formData, emergency_savings_months: Number(e.target.value), has_emergency_savings: Number(e.target.value) > 0 })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={formData.has_insurance} onChange={e => setFormData({ ...formData, has_insurance: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                    Has Health Insurance
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="animate-pulse">Computing ML Score...</span> : 'Compute Vulnerability Score'}
            </button>
          </form>
        </div>

        {/* Right Side: Results & History */}
        <div className="w-full md:w-1/3 bg-slate-50 p-0 border-l border-slate-100 flex flex-col min-h-0 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 ${activeTab === 'results' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Activity size={16} /> Results
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <History size={16} /> History
            </button>
            <button onClick={onClose} className="hidden md:block px-4 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 min-h-0">
            {activeTab === 'results' ? (
              result ? (
                <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm animate-in slide-in-from-right-2">
                  <p className="text-sm text-slate-500 font-medium mb-1">Vulnerability Score</p>
                  <div className="text-4xl font-black text-slate-800 mb-2">{result.score}</div>
                  <div className="flex justify-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${result.risk_band === 'High' ? 'bg-rose-100 text-rose-700' : result.risk_band === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {result.risk_band} Risk
                    </span>
                  </div>
                  
                  {result.shap_values && result.shap_values.length > 0 && (
                    <div className="text-left mt-4 border-t pt-4">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Top Impact Drivers</p>
                      <ul className="space-y-2">
                        {result.shap_values.map((s: any, i: number) => (
                          <li key={i} className="flex justify-between items-center text-xs">
                            <span className="text-slate-600">{s.feature}</span>
                            <span className={`font-bold ${s.impact > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {s.impact > 0 ? '+' : ''}{s.impact}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-sm text-slate-400 italic py-10">
                  Run a manual check to see the ML results here.
                </div>
              )
            ) : (
              <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="text-center text-sm text-slate-400 italic py-10">
                    No past checks found.
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg p-3 text-xs shadow-sm animate-in fade-in">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400">{item.timestamp}</span>
                        <span className="font-bold text-indigo-600">Score: {item.result.score}</span>
                      </div>
                      <button onClick={() => { onApply(item); onClose(); }} className="mt-2 w-full bg-slate-50 hover:bg-indigo-50 border border-slate-100 text-indigo-600 py-1.5 rounded flex items-center justify-center gap-1 transition-colors">
                        Apply to Dashboard <ArrowRight size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
