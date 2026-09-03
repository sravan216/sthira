import React, { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../api/adminApi';
import type { AuditLogEntry } from '../api/adminApi';
import { Activity, Database, FileEdit, ShieldAlert } from 'lucide-react';

export const AuditFeed: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs().then(res => {
      setLogs(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading audit logs...</div>;

  const getActionIcon = (action: string) => {
    if (action.includes('MODEL')) return <Database size={16} className="text-emerald-400" />;
    if (action.includes('PROGRAM')) return <FileEdit size={16} className="text-indigo-400" />;
    return <Activity size={16} className="text-slate-400" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <ShieldAlert size={20} className="text-rose-400" /> System Audit Log
          </h2>
          <p className="text-sm text-slate-400">Immutable record of administrative actions.</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
        <div className="relative border-l border-slate-700 ml-4 space-y-8 pb-4">
          {logs.map((log) => (
            <div key={log.id} className="relative pl-6">
              {/* Timeline Dot */}
              <div className="absolute -left-3 top-1 bg-slate-900 border border-slate-700 p-1 rounded-full z-10">
                {getActionIcon(log.action)}
              </div>
              
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <div>
                    <span className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded font-mono border border-slate-600">
                      {log.action}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-2">{log.details}</p>
                
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  Actor: <span className="font-medium text-slate-400">{log.admin_email}</span>
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="pl-6 text-sm text-slate-500 italic">No audit records found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
