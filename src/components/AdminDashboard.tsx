import { useState } from 'react';
import { User } from '../types';
import { LogOut, LayoutDashboard, Settings, Users, UserCog, BarChart2 } from 'lucide-react';
import AdminOverview from './admin/AdminOverview';
import ManageElections from './admin/ManageElections';
import ManageStudents from './admin/ManageStudents';
import ManageAdmins from './admin/ManageAdmins';
import Results from './Results';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type AdminView = 'dashboard' | 'elections' | 'students' | 'admins' | 'results';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminOverview onNavigate={setActiveView} />;
      case 'elections':
        return <ManageElections />;
      case 'students':
        return <ManageStudents />;
      case 'admins':
        return <ManageAdmins />;
      case 'results':
        return <div className="max-w-4xl"><Results /></div>;
      default:
        return <AdminOverview onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-900 text-white shadow-md z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight">Red Sea University</span>
              <span className="text-amber-500 text-xs font-medium uppercase tracking-wider">Voting</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-medium uppercase tracking-wide">Administrator</span>
              <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Admin</span>
            </div>
            <div className="w-px h-6 bg-slate-700 mx-2 hidden md:block"></div>
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
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Admin Panel</h2>
          <nav className="space-y-1 mb-8">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'dashboard' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
          </nav>

          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Management</h2>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('elections')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'elections' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings size={18} />
              Elections
            </button>
            <button
              onClick={() => setActiveView('students')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'students' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users size={18} />
              Students
            </button>
            <button
              onClick={() => setActiveView('admins')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'admins' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <UserCog size={18} />
              Admins
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
              Results
            </button>
          </nav>
        </aside>

        <main className="flex-1 py-6 px-4 md:px-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
