
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PBLManager from './pages/PBLManager';
import Engagement from './pages/Engagement';
import MasterySystem from './pages/MasterySystem';
import TaskManagement from './pages/TaskManagement';
import LibraryPage from './pages/LibraryPage';
import CommunityPage from './pages/CommunityPage';
import Login from './pages/Login';
import { UserRole } from './types';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('amep_role');
    return saved ? (saved as UserRole) : null;
  });

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('amep_role', userRole);
    } else {
      localStorage.removeItem('amep_role');
    }
  }, [userRole]);

  const handleLogout = () => setUserRole(null);

  if (!userRole) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUserRole} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout userRole={userRole} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard userRole={userRole} />} />
          <Route path="/pbl" element={<PBLManager userRole={userRole} />} />
          <Route path="/engagement" element={<Engagement userRole={userRole} />} />
          <Route path="/mastery" element={<MasterySystem userRole={userRole} />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/tasks" element={<TaskManagement userRole={userRole} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
