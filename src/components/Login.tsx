import React, { useState } from 'react';
import { User, Role } from '../types';
import { getStore } from '../store';
import { GraduationCap } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<Role>('student');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const store = getStore();
    const user = store.users.find(u => u.id === id && u.role === role);

    if (user && user.passwordHash === password) {
      onLogin(user);
    } else {
      setError('Invalid ID or Password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center shadow-inner">
              <GraduationCap size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Red Sea University</h1>
          <p className="text-slate-500 mt-1">Online Voting System</p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
          <button
            onClick={() => setRole('student')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              role === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Student Login
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              role === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {role === 'student' ? 'Student ID' : 'Username'}
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={role === 'student' ? 'e.g. RSU2024001' : 'Admin username'}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
