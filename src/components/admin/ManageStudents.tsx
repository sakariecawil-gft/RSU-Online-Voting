import { useState, useEffect } from 'react';
import { getStore, setStore } from '../../store';
import { User } from '../../types';
import { Edit2, Trash2, UserPlus, Upload } from 'lucide-react';
import StudentModal from './StudentModal';
import ImportExcelModal from './ImportExcelModal';

export default function ManageStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const store = getStore();
    setStudents(store.users.filter(u => u.role === 'student'));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this student?')) {
      const store = getStore();
      store.users = store.users.filter(u => u.id !== id);
      setStore(store);
      loadStudents();
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Students</h1>
          <p className="text-slate-600 text-sm">Manage registered students.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingStudent(null);
              setIsStudentModalOpen(true);
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <UserPlus size={18} /> Register Student
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Upload size={18} /> Import Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Password</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{student.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded font-mono">
                      {student.passwordChanged ? '***changed***' : student.passwordHash}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingStudent(student);
                          setIsStudentModalOpen(true);
                        }}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No students registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isStudentModalOpen && (
        <StudentModal
          student={editingStudent}
          onClose={() => setIsStudentModalOpen(false)}
          onSuccess={() => {
            setIsStudentModalOpen(false);
            loadStudents();
          }}
        />
      )}

      {isImportModalOpen && (
        <ImportExcelModal
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => {
            setIsImportModalOpen(false);
            loadStudents();
          }}
        />
      )}
    </div>
  );
}
