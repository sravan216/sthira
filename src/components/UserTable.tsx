import React, { useState, useEffect } from 'react';
import { fetchUsers, updateUserRole, toggleUserStatus } from '../api/adminApi';
import type { UserAdmin } from '../api/adminApi';
import { Users, Shield, UserX, UserCheck } from 'lucide-react';

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setLoading(true);
    fetchUsers().then(res => {
      setUsers(res);
      setLoading(false);
    });
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    await updateUserRole(id, newRole);
    load();
  };

  const handleToggleStatus = async (id: number) => {
    await toggleUserStatus(id);
    load();
  };

  if (loading && users.length === 0) return <div className="p-8 text-slate-400">Loading users...</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-200">User Management</h2>
          <p className="text-sm text-slate-400">Control platform access and role assignments.</p>
        </div>
        <div className="bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm text-slate-300 border border-slate-700">
          <Users size={16} className="text-indigo-400" /> Total Users: {users.length}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-500 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={`border-b border-slate-700/50 transition-colors ${u.status === 'Deactivated' ? 'bg-slate-900/30 opacity-75' : 'hover:bg-slate-700/20'}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{u.email}</div>
                    <div className="text-xs text-slate-500">ID: {u.id}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className={u.role === 'admin' ? 'text-rose-400' : 'text-slate-500'} />
                      <select 
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        disabled={u.status === 'Deactivated'}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                      >
                        <option value="household">Household</option>
                        <option value="ngo">NGO</option>
                        <option value="csr">CSR</option>
                        <option value="government">Government</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleToggleStatus(u.id)}
                      className={`p-1.5 rounded transition-colors ${
                        u.status === 'Active' ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                      title={u.status === 'Active' ? 'Deactivate User' : 'Reactivate User'}
                    >
                      {u.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
