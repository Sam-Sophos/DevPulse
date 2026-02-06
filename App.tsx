import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DailyLogPage } from './pages/DailyLog';
import { ProjectsPage } from './pages/Projects';
import { SkillsPage } from './pages/Skills';
import { MOCK_USER } from './constants';
import { getLogs } from './services/storage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [logs] = useState(getLogs());

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={MOCK_USER} logs={logs} />;
      case 'dailylog':
        return <DailyLogPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'skills':
        return <SkillsPage />;
      case 'settings':
        return (
            <div className="text-center py-20 animate-in fade-in">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <p className="text-muted-foreground">Mock settings page. GitHub is currently simulated as "Connected".</p>
            </div>
        );
      default:
        return <Dashboard user={MOCK_USER} logs={logs} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
             {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;