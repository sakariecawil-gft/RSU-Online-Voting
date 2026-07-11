import { useState, useEffect } from 'react';
import { getStore, setStore } from '../../store';
import { Election, Candidate } from '../../types';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import ElectionModal from './ElectionModal';
import CandidatesModal from './CandidatesModal';

export default function ManageElections() {
  const [elections, setElections] = useState<Election[]>([]);
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const [managingCandidatesFor, setManagingCandidatesFor] = useState<Election | null>(null);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = () => {
    const store = getStore();
    setElections(store.elections);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this election? This will also delete all associated votes.')) {
      const store = getStore();
      store.elections = store.elections.filter(e => e.id !== id);
      store.votes = store.votes.filter(v => v.electionId !== id);
      setStore(store);
      loadElections();
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Elections</h1>
          <p className="text-slate-600 text-sm">Manage elections and candidates.</p>
        </div>
        <button
          onClick={() => {
            setEditingElection(null);
            setIsElectionModalOpen(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add Election
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Start</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">End</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidates</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {elections.map(election => {
                const isActive = new Date(election.endTime) > new Date();
                const store = getStore();
                const voteCount = store.votes.filter(v => v.electionId === election.id).length;

                return (
                  <tr key={election.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{election.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(election.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(election.endTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {election.candidates.length} <span className="text-slate-400 font-normal">· {voteCount} votes</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        isActive ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'
                      }`}>
                        {isActive ? 'active' : 'concluded'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setManagingCandidatesFor(election)}
                          className="px-3 py-1.5 border border-blue-200 text-blue-700 hover:bg-blue-50 rounded text-xs font-medium transition-colors"
                        >
                          Candidates
                        </button>
                        <button
                          onClick={() => {
                            setEditingElection(election);
                            setIsElectionModalOpen(true);
                          }}
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(election.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {elections.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No elections created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isElectionModalOpen && (
        <ElectionModal 
          election={editingElection}
          onClose={() => setIsElectionModalOpen(false)}
          onSuccess={() => {
            setIsElectionModalOpen(false);
            loadElections();
          }}
        />
      )}

      {managingCandidatesFor && (
        <CandidatesModal
          election={managingCandidatesFor}
          onClose={() => setManagingCandidatesFor(null)}
          onSuccess={() => {
            loadElections();
          }}
        />
      )}
    </div>
  );
}