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
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activePage: Page;
  setPage: (page: Page) => void;
  payloadCount: number;
  isSystemReady: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, payloadCount, isSystemReady }) => {
  const menuItems = [
    { id: Page.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: Page.NEW_SCAN, label: 'New Scan', icon: ScanSearch },
    { id: Page.ANALYTICS, label: 'Analytics', icon: LineChart },
    { id: Page.RESULTS, label: 'Scan Results', icon: FileText },
    { id: Page.PLUGINS, label: 'Plugins', icon: Zap },
    { id: Page.SETTINGS, label: 'Settings', icon: Settings },
    { id: Page.DOCS, label: 'Protocols', icon: BookOpen },
  ];

  return (
    <div className="w-64 bg-gray-950/40 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-4 border-b border-white/5 bg-white/[0.02]">
        <div className="bg-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-600/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white leading-none tracking-tight">ADVANCED SQLi</h1>
          <span className="text-[10px] text-primary-500 font-mono font-bold mt-1 block tracking-wider uppercase">v2.2 Engine</span>
          <p className="text-[8px] text-gray-400 mt-1.5 font-mono tracking-widest uppercase">by VIPHACKER.100</p>
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
                : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
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

      <div className="p-4 border-t border-white/5 bg-black/10">
        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 shadow-inner">
          <p className="font-bold text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
            System Status
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-medium">Detection Engine</span>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isSystemReady ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{isSystemReady ? 'Online' : 'Loading'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-[10px] text-gray-400">Payload Sync</span>
              <span className="text-[10px] text-primary-400 font-bold bg-primary-400/10 px-1.5 py-0.5 rounded border border-primary-400/20">
                {payloadCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-medium">Telemetry Hub</span>
              <span className="text-[10px] font-bold text-green-500 animate-pulse">0xFD::ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;