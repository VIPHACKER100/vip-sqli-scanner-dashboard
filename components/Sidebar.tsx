import React from 'react';
import { Page } from '../types';
import { 
  LayoutDashboard, 
  ScanSearch, 
  FileText, 
  Settings, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';

interface SidebarProps {
  activePage: Page;
  setPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage }) => {
  const menuItems = [
    { id: Page.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: Page.NEW_SCAN, label: 'New Scan', icon: ScanSearch },
    { id: Page.RESULTS, label: 'Scan Results', icon: FileText },
    { id: Page.PLUGINS, label: 'Plugins', icon: Zap },
    { id: Page.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="bg-primary-600 p-2 rounded-lg">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white leading-none">VIP SQLi</h1>
          <span className="text-xs text-primary-500 font-mono">v2</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-600/10 text-primary-500 border border-primary-600/20 shadow-sm' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-500">
          <p className="font-semibold text-gray-400">System Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>ML Engine Ready</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
             <span className="w-2 h-2 rounded-full bg-green-500"></span>
             <span>Plugins Loaded (3)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;