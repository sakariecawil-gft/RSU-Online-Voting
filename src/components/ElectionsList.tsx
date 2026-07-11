import { useState, useEffect } from 'react';
import { User, Election, Vote } from '../types';
import { getStore } from '../store';
import { Info, Clock, CheckSquare } from 'lucide-react';
import VotingArea from './VotingArea';

interface ElectionsListProps {
  user: User;
}

export default function ElectionsList({ user }: ElectionsListProps) {
  const [elections, setElections] = useState<Election[]>([]);
  const [userVotes, setUserVotes] = useState<Vote[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);

  useEffect(() => {
    loadData();
  }, [user.id]); // Reload if user changes, though unlikely in this view

  const loadData = () => {
    const store = getStore();
    setElections(store.elections);
    setUserVotes(store.votes.filter(v => v.studentId === user.id));
  };

  const handleVoteComplete = () => {
    setSelectedElection(null);
    loadData(); // Refresh data to show updated voted status
  };

  if (selectedElection) {
    return (
      <VotingArea 
        election={selectedElection} 
        user={user} 
        onBack={() => setSelectedElection(null)} 
        onVoteComplete={handleVoteComplete}
      />
    );
  }

  const activeElections = elections.filter(e => new Date(e.endTime) > new Date());
  
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Elections</h1>
        <p className="text-slate-600 text-sm">Welcome, <span className="font-medium text-slate-900">{user.name}</span>. Cast your vote below.</p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Elections</h2>
      </div>

      {activeElections.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <Info className="mx-auto text-slate-400 mb-3" size={32} />
          <h3 className="text-lg font-medium text-slate-900">No active elections</h3>
          <p className="text-slate-500 mt-1">There are currently no elections open for voting.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeElections.map(election => {
            const hasVoted = userVotes.some(v => v.electionId === election.id);
            
            // Format date: e.g., "09 Jul 2026, 04:03"
            const endDate = new Date(election.endTime);
            const dateStr = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const timeStr = endDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={election.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col transition-shadow hover:shadow-md">
                <div className="bg-slate-900 text-white p-5">
                  <h3 className="text-lg font-bold mb-1">{election.title}</h3>
                  <p className="text-slate-300 text-xs flex items-center gap-1">
                    <Clock size={12} />
                    Ends: {dateStr}, {timeStr}
                  </p>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium">
                      <Info size={12} /> Active
                    </span>
                    <span className="text-sm text-slate-500 font-medium">{election.candidates.length} Candidates</span>
                  </div>
                  
                  <div className="mt-auto">
                    {hasVoted ? (
                      <button 
                        disabled
                        className="w-full py-2.5 rounded-lg bg-green-50 text-green-700 border border-green-200 font-medium flex items-center justify-center gap-2 cursor-not-allowed transition-colors"
                      >
                        <CheckSquare size={18} /> Voted Successfully
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedElection(election)}
                        className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors shadow-sm"
                      >
                        Vote Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
