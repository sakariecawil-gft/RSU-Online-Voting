import { useState, useEffect } from 'react';
import { getStore } from '../store';
import { Election, Vote } from '../types';
import { Trophy } from 'lucide-react';

export default function Results() {
  const [elections, setElections] = useState<Election[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const store = getStore();
    setElections(store.elections);
    setVotes(store.votes);
    setTotalStudents(store.users.filter(u => u.role === 'student').length);

    // In a real app, we might poll or use websockets here for live updates.
    // For local storage mock, we just poll local storage every 2 seconds to simulate "live" if multiple tabs were open.
    const interval = setInterval(() => {
       const freshStore = getStore();
       setVotes(freshStore.votes);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Election Results</h1>
        <p className="text-slate-600 text-sm">Full results and statistics for all elections.</p>
      </div>

      <div className="space-y-8">
        {elections.map(election => {
          const electionVotes = votes.filter(v => v.electionId === election.id);
          const totalValidVotes = electionVotes.length;
          const turnoutPercent = totalStudents > 0 ? Math.round((totalValidVotes / totalStudents) * 100) : 0;
          
          const isElectionActive = new Date(election.endTime) > new Date();

          // Calculate results per candidate
          const candidateResults = election.candidates.map(candidate => {
            const candidateVotes = electionVotes.filter(v => v.candidateId === candidate.id).length;
            const percentage = totalValidVotes > 0 ? Math.round((candidateVotes / totalValidVotes) * 100) : 0;
            return {
              ...candidate,
              votes: candidateVotes,
              percentage
            };
          }).sort((a, b) => b.votes - a.votes); // Sort by votes descending

          const maxVotes = candidateResults.length > 0 ? candidateResults[0].votes : 0;

          return (
            <div key={election.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-slate-900">{election.title}</h2>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    isElectionActive ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'
                  }`}>
                    {isElectionActive ? 'active' : 'concluded'}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Turnout: {turnoutPercent}% ({totalValidVotes}/{totalStudents} students voted)
                </p>
              </div>

              <div className="space-y-4">
                {candidateResults.map((candidate, index) => {
                  const isWinner = candidate.votes === maxVotes && maxVotes > 0 && index === 0;

                  return (
                    <div 
                      key={candidate.id} 
                      className={`p-4 rounded-xl border ${
                        isWinner ? 'border-amber-400 bg-amber-50/30' : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={candidate.photoUrl} 
                            alt={candidate.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="flex items-center gap-2">
                            {isWinner && <Trophy size={16} className="text-amber-500" />}
                            <span className="font-bold text-sm uppercase tracking-wide text-slate-900">{candidate.name}</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-slate-700">
                          {candidate.votes} vote{candidate.votes !== 1 ? 's' : ''} · {candidate.percentage}%
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isWinner ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${candidate.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-right">
                <span className="text-sm text-slate-600">Total valid votes: <span className="font-bold text-slate-900">{totalValidVotes}</span></span>
              </div>
            </div>
          );
        })}

        {elections.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No elections found.
          </div>
        )}
      </div>
    </div>
  );
}
