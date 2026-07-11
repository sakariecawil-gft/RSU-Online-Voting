import { useEffect, useState } from 'react';
import { getStore } from '../../store';
import { PlusCircle, Users, BarChart2 } from 'lucide-react';

interface AdminOverviewProps {
  onNavigate: (view: any) => void;
}

export default function AdminOverview({ onNavigate }: AdminOverviewProps) {
  const [stats, setStats] = useState({ elections: 0, students: 0, votes: 0 });
  const [recentElections, setRecentElections] = useState<any[]>([]);

  useEffect(() => {
    const store = getStore();
    setStats({
      elections: store.elections.length,
      students: store.users.filter(u => u.role === 'student').length,
      votes: store.votes.length
    });
    setRecentElections(store.elections.slice(0, 3));
  }, []);

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
        <p className="text-slate-600 text-sm">Overview of the RSU Voting System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
          <div className="text-4xl font-bold text-slate-900 mb-2">{stats.elections}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Elections</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
          <div className="text-4xl font-bold text-slate-900 mb-2">{stats.students}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Registered Students</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
          <div className="text-4xl font-bold text-slate-900 mb-2">{stats.votes}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Votes Cast</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Elections</h2>
          <div className="space-y-4">
            {recentElections.map(election => {
              const isActive = new Date(election.endTime) > new Date();
              return (
                <div key={election.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-medium text-slate-900">{election.title}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isActive ? 'Active' : 'Ended'}
                  </span>
                </div>
              );
            })}
            {recentElections.length === 0 && (
              <p className="text-slate-500 text-sm">No elections found.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('elections')}
              className="w-full flex items-center justify-center gap-2 p-4 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              <PlusCircle size={18} /> Add New Election
            </button>
            <button 
              onClick={() => onNavigate('students')}
              className="w-full flex items-center justify-center gap-2 p-4 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              <Users size={18} /> Register Student
            </button>
            <button 
              onClick={() => onNavigate('results')}
              className="w-full flex items-center justify-center gap-2 p-4 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              <BarChart2 size={18} /> View All Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
