import React, { useState } from 'react';
import { getStore, setStore } from '../../store';
import { User } from '../../types';
import { X } from 'lucide-react';

interface StudentModalProps {
  student: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentModal({ student, onClose, onSuccess }: StudentModalProps) {
  const [studentId, setStudentId] = useState(student?.id || '');
  const [name, setName] = useState(student?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!studentId || !name) {
      setError('Please fill in all fields.');
      return;
    }

    const store = getStore();

    if (student) {
      // Edit
      if (student.id !== studentId && store.users.some(u => u.id === studentId)) {
        setError('Student ID already exists.');
        return;
      }
      const index = store.users.findIndex(u => u.id === student.id);
      if (index !== -1) {
        store.users[index] = {
          ...student,
          id: studentId,
          name
        };
      }
    } else {
      // Add
      if (store.users.some(u => u.id === studentId)) {
        setError('Student ID already exists.');
        return;
      }
      store.users.push({
        id: studentId,
        name,
        role: 'student',
        passwordHash: studentId, // password same as student id
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
          <h3 className="font-bold text-slate-900">{student ? 'Edit Student' : 'Register Student'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. bcs105"
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
              placeholder="e.g. MUSE ABDI JAMA"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          
          {!student && (
            <p className="text-xs text-slate-500 italic">Note: The default password will be the same as the Student ID.</p>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm">
              {student ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
