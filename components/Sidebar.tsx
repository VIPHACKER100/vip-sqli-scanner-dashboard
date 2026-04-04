import React from 'react';
import { 
  BarChart3, 
  Settings as SettingsIcon, 
  Shield, 
  FileText, 
  Info, 
  LayoutDashboard, 
  Search, 
  Puzzle, 
  Sun, 
  Moon,
  Zap,
  Terminal as TerminalIcon,
  X
} from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  setPage: (page: Page) => void;
  payloadCount: number;
  isSystemReady: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, payloadCount, isSystemReady, theme, toggleTheme, isOpen, onClose }) => {
  const isDark = theme === 'dark';

  const menuItems = [
    { id: Page.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
    { id: Page.NEW_SCAN, label: 'New Vector', icon: Search },
    { id: Page.RESULTS, label: 'Intelligence', icon: Shield },
    { id: Page.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: Page.PLUGINS, label: 'Extensions', icon: Puzzle },
    { id: Page.SETTINGS, label: 'Settings', icon: SettingsIcon },
  ];

  const secondaryItems = [
    { id: Page.DOCS, label: 'Protocols', icon: FileText },
    { id: Page.CLONE_GUIDE, label: 'Terminal', icon: TerminalIcon },
    { id: Page.ABOUT, label: 'System Info', icon: Info },
  ];

  return (
    <aside className={`w-64 h-full fixed left-0 top-0 bg-background dark:bg-background-alt border-r border-border flex flex-col z-40 transition-all duration-500 transform lg:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/20' : '-translate-x-full'}`}>
      
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-6 right-6 p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close Sidebar"
      >
        <X size={20} />
      </button>

      {/* Logo Section */}
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setPage(Page.DASHBOARD); onClose(); }}>
          <div className="w-10 h-10 rounded-xl bg-electric-gradient flex items-center justify-center text-white shadow-accent transition-transform group-hover:scale-105">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display text-xl text-foreground leading-tight">VIP HUNTER</h1>
            <p className="text-[10px] font-mono font-bold text-accent tracking-[0.2em]">v2.2 PRIME</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="px-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Operations</p>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive 
                    ? 'bg-accent/10 text-accent border border-accent/20 shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'} />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent pulsing-dot" />}
              </button>
            );
          })}
        </div>

        <div className="pt-8 mb-6">
          <p className="px-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Intelligence</p>
          <div className="space-y-1">
            {secondaryItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setPage(item.id); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                    isActive 
                      ? 'bg-accent/10 text-accent border border-accent/20 shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer System Status */}
      <div className="p-6 mt-auto">
        <div className="p-5 rounded-2xl bg-muted border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">Payloads</span>
            <span className="text-xs font-bold text-foreground">{payloadCount.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`h-1.5 flex-1 rounded-full overflow-hidden bg-white dark:bg-slate-900 border border-border`}>
              <div 
                className={`h-full bg-accent transition-all duration-1000 ${isSystemReady ? 'w-full' : 'w-1/3 animate-pulse'}`}
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-accent">{isSystemReady ? 'READY' : 'INIT'}</span>
          </div>

          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all text-xs font-bold shadow-sm active:scale-95"
            aria-label={isDark ? "Switch to Light Protocol" : "Switch to Dark Protocol"}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            {isDark ? 'Light Protocol' : 'Dark Protocol'}
          </button>
        </div>

        <div className="mt-6 px-2 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[9px] font-mono font-bold text-muted-foreground tracking-tighter uppercase">© 2026 VIP_HACKER</p>
          <div className="flex items-center gap-1.5 text-accent font-mono text-[9px] font-bold">
            <div className="w-1 h-1 rounded-full bg-accent pulsing-dot" />
            LIVE_LINK
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;