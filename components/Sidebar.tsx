import React from 'react';
import { Page } from '../types';
import {
  LayoutDashboard,
  ScanSearch,
  LineChart,
  FileText,
  Settings,
  Zap,
  ShieldAlert,
  BookOpen,
  Sun,
  Moon,
  User
} from 'lucide-react';

interface SidebarProps {
  activePage: Page;
  setPage: (page: Page) => void;
  payloadCount: number;
  isSystemReady: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, payloadCount, isSystemReady, theme, toggleTheme }) => {
  const menuItems = [
    { id: Page.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: Page.NEW_SCAN, label: 'New Scan', icon: ScanSearch },
    { id: Page.ANALYTICS, label: 'Analytics', icon: LineChart },
    { id: Page.RESULTS, label: 'Scan Results', icon: FileText },
    { id: Page.SETTINGS, label: 'Settings', icon: Settings },
    { id: Page.DOCS, label: 'Protocols', icon: BookOpen },
    { id: Page.ABOUT, label: 'Operative', icon: User },
  ];

  return (
    <div className="w-64 hf-glass border-r flex flex-col h-screen fixed left-0 top-0 z-10 transition-all duration-500">
      <div className="p-6 flex items-center gap-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="bg-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-600/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-none tracking-tight">ADVANCED SQLi</h1>
          <span className="text-[10px] text-primary-600 dark:text-primary-500 font-mono font-bold mt-1 block tracking-wider uppercase">v2.2 Engine</span>
          <p className="text-[8px] text-gray-500 dark:text-gray-300 mt-1.5 font-mono tracking-widest uppercase">by VIPHACKER.100</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${isActive
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
            >
              <item.icon size={20} className={`${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="font-semibold text-sm">{item.label}</span>
              {isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/10">
        <div className="mb-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-gray-300"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Theme Mode</span>
            {theme === 'dark' ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-primary-600" />}
          </button>
        </div>
        <div className="bg-slate-100/50 dark:bg-white/[0.03] rounded-2xl p-4 border border-slate-200 dark:border-white/5 shadow-inner transition-colors">
          <p className="font-bold text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
            System Status
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">Detection Engine</span>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isSystemReady ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tighter">{isSystemReady ? 'Online' : 'Loading'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-[10px] text-gray-600 dark:text-gray-300">Payload Sync</span>
              <span className="text-[10px] text-primary-600 dark:text-primary-400 font-bold bg-primary-600/10 dark:bg-primary-400/10 px-1.5 py-0.5 rounded border border-primary-600/20 dark:border-primary-400/20">
                {payloadCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">Telemetry Hub</span>
              <span className="text-[10px] font-bold text-green-600 animate-pulse">0xFD::ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;