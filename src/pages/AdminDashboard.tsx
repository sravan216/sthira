import React, { useState } from 'react';
import { ProgramManager } from '../components/ProgramManager';
import { ModelRegistry } from '../components/ModelRegistry';
import { UserTable } from '../components/UserTable';
import { AuditFeed } from '../components/AuditFeed';
import { ShieldCheck, LayoutGrid, Database, Users, List, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'models' | 'users' | 'audit'>('programs');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex flex-col items-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Console</h1>
          <p className="text-xs text-slate-500 mt-1">Sthira Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('programs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'programs' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutGrid size={18} /> Support Programs
          </button>
          
          <button 
            onClick={() => setActiveTab('models')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'models' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Database size={18} /> Model Registry
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'users' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users size={18} /> User Management
          </button>

          <button 
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <List size={18} /> Audit Log
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <ChevronLeft size={16} /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'programs' && <ProgramManager />}
          {activeTab === 'models' && <ModelRegistry />}
          {activeTab === 'users' && <UserTable />}
          {activeTab === 'audit' && <AuditFeed />}
        </div>
      </main>

    </div>
  );
};
