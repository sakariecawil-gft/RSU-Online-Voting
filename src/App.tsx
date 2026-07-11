import { useState, useEffect } from 'react';
import { getStore } from './store';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import type { User as UserType } from './types';

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Check for logged in user in session storage to persist across reloads
    const loggedInUserId = sessionStorage.getItem('loggedInUser');
    if (loggedInUserId) {
      const store = getStore();
      const foundUser = store.users.find(u => u.id === loggedInUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, []);

  const handleLogin = (user: UserType) => {
    sessionStorage.setItem('loggedInUser', user.id);
    setUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    setUser(null);
  };

  const handleUserUpdate = (updatedUser: UserType) => {
    setUser(updatedUser);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <StudentDashboard 
      user={user} 
      onLogout={handleLogout} 
      onUserUpdate={handleUserUpdate} 
    />
  );
}
