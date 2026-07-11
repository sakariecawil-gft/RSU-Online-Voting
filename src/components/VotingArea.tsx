import { useState } from 'react';
import { getStore, setStore } from '../store';
import { Election, User } from '../types';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface VotingAreaProps {
  election: Election;
  user: User;
  onBack: () => void;
  onVoteComplete: () => void;
}

export default function VotingArea({ election, user, onBack, onVoteComplete }: VotingAreaProps) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleVote = () => {
    if (!selectedCandidateId) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const store = getStore();
      
      // Double check if already voted to prevent double voting in concurrent scenarios
      const alreadyVoted = store.votes.some(v => v.studentId === user.id && v.electionId === election.id);
      if (alreadyVoted) {
        setError('You have already voted in this election.');
        setIsSubmitting(false);
        return;
      }

      // Record vote
      store.votes.push({
        electionId: election.id,
        studentId: user.id,
        candidateId: selectedCandidateId,
        timestamp: new Date().toISOString()
      });

      setStore(store);
      
      // Artificial delay for UX
      setTimeout(() => {
        setIsSubmitting(false);
        onVoteComplete();
      }, 600);
      
    } catch (err) {
      setError('An error occurred while casting your vote. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
      >
        <ArrowLeft size={16} /> Back to Elections
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{election.title}</h1>
        <p className="text-slate-600 text-sm">Review candidates and cast your vote carefully. This action cannot be undone.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {election.candidates.map(candidate => {
          const isSelected = selectedCandidateId === candidate.id;
          return (
            <div 
              key={candidate.id}
              onClick={() => setSelectedCandidateId(candidate.id)}
              className={`bg-white rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                isSelected ? 'border-blue-500 shadow-md ring-2 ring-blue-500 ring-opacity-20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="h-64 overflow-hidden relative bg-slate-100">
                <img 
                  src={candidate.photoUrl} 
                  alt={candidate.name}
                  className="w-full h-full object-cover object-top"
                />
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                    <CheckCircle2 size={24} />
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col h-[180px]">
                <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-wide">{candidate.name}</h3>
                <p className="text-sm text-slate-600 flex-1 overflow-y-auto mb-4">{candidate.bio}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCandidateId(candidate.id);
                  }}
                  className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                    isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isSelected ? 'SELECTED' : `VOTE ${candidate.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-medium text-slate-900">Ready to cast your vote?</h4>
          <p className="text-sm text-slate-500">Make sure you have selected the right candidate.</p>
        </div>
        <button
          onClick={handleVote}
          disabled={!selectedCandidateId || isSubmitting}
          className={`px-8 py-3 rounded-lg font-bold transition-all shadow-sm ${
            !selectedCandidateId || isSubmitting
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-amber-500/20 hover:shadow-md'
          }`}
        >
          {isSubmitting ? 'Casting Vote...' : 'Confirm & Submit Vote'}
        </button>
      </div>
    </div>
  );
}
