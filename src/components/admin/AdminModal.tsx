import React, { useState } from 'react';
import { getStore, setStore } from '../../store';
import { User } from '../../types';
import { X } from 'lucide-react';

interface AdminModalProps {
  admin: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminModal({ admin, onClose, onSuccess }: AdminModalProps) {
  const [username, setUsername] = useState(admin?.id || '');
  const [name, setName] = useState(admin?.name || '');
  const [password, setPassword] = useState(admin?.passwordHash || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !name || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const store = getStore();

    if (admin) {
      // Edit
      if (admin.id !== username && store.users.some(u => u.id === username)) {
        setError('Username already exists.');
        return;
      }
      const index = store.users.findIndex(u => u.id === admin.id);
      if (index !== -1) {
        store.users[index] = {
          ...admin,
          id: username,
          name,
          passwordHash: password
        };
      }
    } else {
      // Add
      if (store.users.some(u => u.id === username)) {
        setError('Username already exists.');
        return;
      }
      store.users.push({
        id: username,
        name,
        role: 'admin',
        passwordHash: password,
        passwordChanged: false
      });
    }

    setStore(store);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{admin ? 'Edit Admin' : 'Register Admin'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin123"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. System Admin"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Temporary password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm">
              {admin ? 'Save Changes' : 'Register Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
