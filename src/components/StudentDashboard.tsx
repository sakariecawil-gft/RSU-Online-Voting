import { useState } from 'react';
import { User } from '../types';
import { GraduationCap, LogOut, KeyRound, CheckSquare, BarChart2 } from 'lucide-react';
import ElectionsList from './ElectionsList';
import Results from './Results';
import ChangePasswordModal from './ChangePasswordModal';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

type View = 'elections' | 'results';

export default function StudentDashboard({ user, onLogout, onUserUpdate }: StudentDashboardProps) {
  const [activeView, setActiveView] = useState<View>('elections');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-900 text-white shadow-md z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-slate-900 p-1.5 rounded flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight">Red Sea University</span>
              <span className="text-amber-500 text-xs font-medium uppercase tracking-wider">Voting</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-medium uppercase tracking-wide">{user.name}</span>
              <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Student</span>
            </div>
            <div className="w-px h-6 bg-slate-700 mx-2 hidden md:block"></div>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded flex items-center gap-2"
            >
              <KeyRound size={16} />
              <span className="hidden md:inline">Password</span>
            </button>
            <button 
              onClick={onLogout}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-slate-200 py-6 pr-6 hidden md:block">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Student Portal</h2>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('elections')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'elections' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CheckSquare size={18} />
              Elections
            </button>
            <button
              onClick={() => setActiveView('results')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'results' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BarChart2 size={18} />
              Live Results
            </button>
          </nav>
        </aside>

        {/* Mobile Navigation (Bottom bar or simpler top bar) - Kept simple for prototype */}
        <div className="md:hidden flex bg-white border-b border-slate-200 w-full mb-4 px-2 py-2 gap-2">
          <button
            onClick={() => setActiveView('elections')}
            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded text-sm font-medium ${
              activeView === 'elections' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
            }`}
          >
            <CheckSquare size={16} /> Elections
          </button>
          <button
            onClick={() => setActiveView('results')}
            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded text-sm font-medium ${
              activeView === 'results' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
            }`}
          >
            <BarChart2 size={16} /> Results
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 py-6 px-4 md:px-8">
          {activeView === 'elections' ? (
            <ElectionsList user={user} />
          ) : (
            <Results />
          )}
        </main>
      </div>

      {isPasswordModalOpen && (
        <ChangePasswordModal 
          user={user} 
          onClose={() => setIsPasswordModalOpen(false)} 
          onSuccess={onUserUpdate}
        />
      )}
    </div>
  );
}
