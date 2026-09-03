import React, { useState, useEffect } from 'react';
import { fetchPrograms, saveProgram } from '../api/adminApi';
import type { SupportProgram } from '../api/adminApi';
import { Plus, Edit2, Trash2, Save, PlusCircle } from 'lucide-react';

export const ProgramManager: React.FC = () => {
  const [programs, setPrograms] = useState<SupportProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SupportProgram>>({});

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setLoading(true);
    fetchPrograms().then(res => {
      setPrograms(res);
      setLoading(false);
    });
  };

  const handleEdit = (p: SupportProgram) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const handleNew = () => {
    setEditingId(0);
    setEditForm({
      name: '',
      provider_type: 'NGO',
      description: '',
      region_coverage: [],
      min_score: 50,
      max_score: 100,
      eligibility_criteria: { and: [] }
    });
  };

  const handleSave = async () => {
    await saveProgram(editForm);
    setEditingId(null);
    load();
  };

  const addRule = () => {
    const currentRules = editForm.eligibility_criteria?.and || [];
    setEditForm({
      ...editForm,
      eligibility_criteria: {
        and: [...currentRules, { field: 'num_children', operator: '>=', value: 0 }]
      }
    });
  };

  const updateRule = (index: number, key: string, val: any) => {
    const currentRules = [...(editForm.eligibility_criteria?.and || [])];
    currentRules[index] = { ...currentRules[index], [key]: val };
    setEditForm({
      ...editForm,
      eligibility_criteria: { and: currentRules }
    });
  };

  const removeRule = (index: number) => {
    const currentRules = [...(editForm.eligibility_criteria?.and || [])];
    currentRules.splice(index, 1);
    setEditForm({
      ...editForm,
      eligibility_criteria: { and: currentRules }
    });
  };

  if (loading && programs.length === 0) return <div className="p-8 text-slate-400">Loading programs...</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Support Programs</h2>
          <p className="text-sm text-slate-400">Manage the catalog of matched support programs.</p>
        </div>
        <button onClick={handleNew} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} /> New Program
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {programs.map(p => (
          <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
            {editingId === p.id ? null : (
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-200 text-lg">{p.name}</h3>
                    <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded uppercase tracking-wide">{p.provider_type}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{p.description}</p>
                  <div className="flex gap-4 text-xs font-semibold text-slate-500">
                    <span className="bg-slate-900 px-2 py-1 rounded">Score Range: {p.min_score} - {p.max_score}</span>
                    <span className="bg-slate-900 px-2 py-1 rounded">Rules: {p.eligibility_criteria?.and?.length || 0} active</span>
                  </div>
                </div>
                <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded transition-colors">
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Editor Form Inline */}
        {editingId !== null && (
          <div className="bg-slate-800 border border-indigo-500/50 rounded-xl p-6 shadow-xl relative mt-4">
            <h3 className="text-lg font-bold text-slate-200 mb-4">{editingId === 0 ? 'Create Program' : 'Edit Program'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Program Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Provider Type</label>
                <select value={editForm.provider_type} onChange={e => setEditForm({...editForm, provider_type: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option>NGO</option><option>Government</option><option>CSR</option><option>Scholarship</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <input type="text" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="mb-6 p-4 border border-slate-700 rounded-lg bg-slate-900/50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-slate-300">Eligibility Rules (AND)</h4>
                <button onClick={addRule} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
                  <PlusCircle size={14} /> Add Rule
                </button>
              </div>
              
              <div className="space-y-3">
                {editForm.eligibility_criteria?.and?.length === 0 && (
                  <p className="text-xs text-slate-500 italic">No rules defined. Program applies to all households in score range.</p>
                )}
                {editForm.eligibility_criteria?.and?.map((rule: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <select value={rule.field} onChange={e => updateRule(idx, 'field', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 flex-1">
                      <option value="num_children">num_children</option>
                      <option value="total_debt">total_debt</option>
                      <option value="monthly_income">monthly_income</option>
                    </select>
                    <select value={rule.operator} onChange={e => updateRule(idx, 'operator', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 w-20">
                      <option>{'>='}</option><option>{'<='}</option><option>{'=='}</option>
                    </select>
                    <input type="number" value={rule.value} onChange={e => updateRule(idx, 'value', Number(e.target.value))} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 w-24" />
                    <button onClick={() => removeRule(idx)} className="text-slate-500 hover:text-rose-400 p-1"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
              <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                <Save size={16} /> Save Program
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
