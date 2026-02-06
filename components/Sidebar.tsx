import React from 'react';
import { LayoutDashboard, BookOpen, Layers, Zap, Settings, Code } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dailylog', label: 'Daily Log', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'skills', label: 'Skills & Growth', icon: Zap },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="p-2 bg-primary rounded-lg">
          <Code className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-foreground tracking-tight">DevPulse</h1>
          <p className="text-xs text-muted-foreground">Track Real Growth</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
           onClick={() => onNavigate('settings')}
           className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
            currentPage === 'settings' 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <div className="mt-4 px-4 py-2">
           <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              GitHub Connected
           </div>
        </div>
      </div>
    </div>
  );
};