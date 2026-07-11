import { useState, useEffect } from 'react';
import { getStore, setStore } from '../../store';
import { User } from '../../types';
import { UserPlus, Edit2, Trash2 } from 'lucide-react';
import AdminModal from './AdminModal';

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    const store = getStore();
    setAdmins(store.users.filter(u => u.role === 'admin'));
  };

  const handleDelete = (id: string) => {
    if (admins.length <= 1) {
      alert('Cannot remove the last administrator.');
      return;
    }
    if (confirm('Are you sure you want to remove this admin?')) {
      const store = getStore();
      store.users = store.users.filter(u => u.id !== id);
      setStore(store);
      loadAdmins();
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Administrators</h1>
          <p className="text-slate-600 text-sm">Manage system administrators.</p>
        </div>
        <button
          onClick={() => {
            setEditingAdmin(null);
            setIsAdminModalOpen(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <UserPlus size={18} /> Add Admin
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Password</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.map(admin => (
                <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{admin.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        {admin.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded font-mono">
                      {admin.passwordChanged ? '***changed***' : admin.passwordHash}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingAdmin(admin);
                          setIsAdminModalOpen(true);
                        }}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdminModalOpen && (
        <AdminModal
          admin={editingAdmin}
          onClose={() => setIsAdminModalOpen(false)}
          onSuccess={() => {
            setIsAdminModalOpen(false);
            loadAdmins();
          }}
        />
      )}
    </div>
  );
}