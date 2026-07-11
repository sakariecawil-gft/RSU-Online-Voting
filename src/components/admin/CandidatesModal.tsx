import { useState } from 'react';
import { getStore, setStore } from '../../store';
import { Election, Candidate } from '../../types';
import { X, Trash2 } from 'lucide-react';

interface CandidatesModalProps {
  election: Election;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CandidatesModal({ election, onClose, onSuccess }: CandidatesModalProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(election.candidates);
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !photoUrl || !bio) {
      setError('Please fill in all fields.');
      return;
    }

    const newCandidate: Candidate = {
      id: `c_${Date.now()}`,
      name,
      photoUrl,
      bio
    };

    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    
    // Save to store
    const store = getStore();
    const eIndex = store.elections.findIndex(e => e.id === election.id);
    if (eIndex !== -1) {
      store.elections[eIndex].candidates = updatedCandidates;
      setStore(store);
      onSuccess();
    }

    // Reset form
    setName('');
    setPhotoUrl('');
    setBio('');
    setError('');
  };

  const handleDelete = (id: string) => {
    const updatedCandidates = candidates.filter(c => c.id !== id);
    setCandidates(updatedCandidates);

    const store = getStore();
    const eIndex = store.elections.findIndex(e => e.id === election.id);
    if (eIndex !== -1) {
      store.elections[eIndex].candidates = updatedCandidates;
      // Note: In a real app we'd also handle orphaned votes if candidate is deleted.
      // For this prototype, we'll let them exist.
      setStore(store);
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Users size={18} /> Manage Candidates
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col md:flex-row gap-8">
          {/* Add Candidate Form */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 mb-4">Add New Candidate</h4>
              
              <form onSubmit={handleAdd} className="space-y-4">
                {error && <div className="text-red-600 text-xs font-medium">{error}</div>}
                
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Photo URL</label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Short Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded transition-colors text-sm shadow-sm">
                  Add Candidate
                </button>
              </form>
            </div>
          </div>

          {/* Candidate List */}
          <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden border border-slate-200 rounded-xl bg-slate-50">
            <div className="p-4 border-b border-slate-200 bg-white">
               <h4 className="font-bold text-sm text-slate-900">Current Candidates</h4>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {candidates.map(candidate => (
                <div key={candidate.id} className="bg-white border border-slate-200 rounded p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={candidate.photoUrl} alt={candidate.name} className="w-10 h-10 rounded-full object-cover border border-slate-100 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <div className="text-sm font-bold text-slate-900 uppercase truncate">{candidate.name}</div>
                      <div className="text-xs text-slate-500 truncate">{candidate.bio}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(candidate.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {candidates.length === 0 && (
                <div className="text-center text-sm text-slate-500 py-8">No candidates added yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Needed imports
import { Users } from 'lucide-react';