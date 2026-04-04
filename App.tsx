import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import NewScan from './pages/NewScan';
import Analytics from './pages/Analytics';
import Results from './pages/Results';
import Plugins from './pages/Plugins';
import Settings from './pages/Settings';
import Documentation from './pages/Documentation';
import CloneGuide from './pages/CloneGuide';
import About from './pages/About';
import ToastContainer, { ToastMessage } from './components/Toast';
import Terminal from './components/Terminal';
import SplashScreen from './components/SplashScreen';
import { Page, ScanResult, ScanStats, ScanConfig, ScannerSettings, LogEntry } from './types';
import { scannerService } from './services/scannerService';
import { initPayloads } from './services/payloads';
import { ShieldAlert } from 'lucide-react';

const DEFAULT_SETTINGS: ScannerSettings = {
  userAgent: 'SQLiHunter/v2.2-AuthorizedPentest',
  rateLimit: 1000,
  surfaceCoverage: {
    cookies: true,
    userAgent: true,
    referer: true,
    authHeaders: true
  },
  enabledPlugins: {
    graphql: true,
    nosql: true,
    waf: true,
    ldap: false
  },
  customPayloads: [],
  scannerMode: 'mock',
  webhookUrl: 'https://hooks.slack.com/services/SQLI/HUNTER/ALERTS',
  syncEndpointNode: 'https://vault.viphacker.internal/api/v2',
  vaultToken: 'SQ-HUNTER-XNODE-PRIME-001-ALPHA'
};

import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isSystemReady, setSystemReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [payloadCount, setPayloadCount] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<ScannerSettings>(() => {
    const saved = localStorage.getItem('sqli_hunter_settings');
    if (!saved) return DEFAULT_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        surfaceCoverage: { ...DEFAULT_SETTINGS.surfaceCoverage, ...(parsed.surfaceCoverage || {}) },
        enabledPlugins: { ...DEFAULT_SETTINGS.enabledPlugins, ...(parsed.enabledPlugins || {}) }
      };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('sqli_hunter_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sqli_hunter_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const [stats, setStats] = useState<ScanStats>({
    total: 0,
    processed: 0,
    safe: 0,
    vulnerable: 0,
    suspicious: 0,
    errors: 0
  });

  const [results, setResults] = useState<ScanResult[]>(() => {
    const saved = localStorage.getItem('sqli_hunter_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [scanHistory, setScanHistory] = useState<any[]>([
    { time: '10:00', safe: 120, vulnerable: 2 },
    { time: '10:05', safe: 250, vulnerable: 5 },
    { time: '10:10', safe: 380, vulnerable: 8 },
    { time: '10:15', safe: 510, vulnerable: 8 },
    { time: '10:20', safe: 640, vulnerable: 12 },
  ]);

  // Alert State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('sqli_hunter_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sqli_hunter_results', JSON.stringify(results.slice(0, 100)));
  }, [results]);

  useEffect(() => {
    const init = async () => {
      const count = await initPayloads();
      setPayloadCount(count);
      setSystemReady(true);
    };
    init();

    const unsubscribeStats = scannerService.subscribe((newStats, newResult) => {
      setStats(newStats);
      if (newResult) {
        setResults((prev) => [newResult, ...prev]);
        setScanHistory(prev => {
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const last = prev[prev.length - 1];
          if (last && last.time === time) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...last,
              safe: newStats.safe,
              vulnerable: newStats.vulnerable
            };
            return updated;
          }
          return [...prev, { time, safe: newStats.safe, vulnerable: newStats.vulnerable }].slice(-10);
        });
      }
    });

    const unsubscribeLogs = scannerService.subscribeToLogs((log) => {
      setLogs((prev) => [...prev, log].slice(-500));
    });

    return () => {
      unsubscribeStats();
      unsubscribeLogs();
    };
  }, []);

  const addToast = (title: string, message: string, type: 'error' | 'warning') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => dismissToast(id), 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    (window as any).setPage = setCurrentPage;
    (window as any).clearHistory = () => {
      if (window.confirm("Are you sure you want to purge all exfiltrated intelligence data? This action is irreversible.")) {
        setResults([]);
        localStorage.removeItem('sqli_hunter_results');
        addToast("Data Purged", "Mission history and intelligence data has been wiped.", "warning");
      }
    };
    (window as any).factoryReset = () => {
      if (window.confirm("CRITICAL ACTION: This will wipe all settings, exfiltrated data, and session logs. Revert instance to factory defaults?")) {
        setResults([]);
        setLogs([]);
        setSettings(DEFAULT_SETTINGS);
        localStorage.clear();
        addToast("Factory Reset", "System has been restored to factory baseline. All mission data purged.", "error");
        setTimeout(() => window.location.reload(), 1500);
      }
    };
  }, []);

  const handleStartScan = (config: ScanConfig) => {
    if (!isSystemReady) {
      addToast("Scanner Not Ready", "Payload database is still initializing...", "warning");
      return;
    }
    setResults([]);
    setLogs([]);
    const urls = config.targetUrls.split('\n').filter(u => u.trim().length > 0);
    scannerService.startScan(urls, config, settings);
  };

  const renderContent = () => {
    const pageProps = { theme };
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          onClick={() => isSidebarOpen && setSidebarOpen(false)}
        >
          {(() => {
            switch (currentPage) {
              case Page.DASHBOARD:
                return <DashboardHome stats={stats} scanHistory={scanHistory} results={results} {...pageProps} />;
              case Page.NEW_SCAN:
                return <NewScan onStartScan={handleStartScan} setPage={setCurrentPage} {...pageProps} />;
              case Page.ANALYTICS:
                return <Analytics results={results} stats={stats} {...pageProps} />;
              case Page.RESULTS:
                return <Results results={results} {...pageProps} />;
              case Page.PLUGINS:
                return <Plugins settings={settings} setSettings={setSettings} {...pageProps} />;
              case Page.SETTINGS:
                return <Settings settings={settings} setSettings={setSettings} {...pageProps} />;
              case Page.DOCS:
                return <Documentation {...pageProps} />;
              case Page.CLONE_GUIDE:
                return <CloneGuide />;
              case Page.ABOUT:
                return <About />;
              default:
                return <DashboardHome stats={stats} scanHistory={scanHistory} results={results} {...pageProps} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (

    <div className="flex min-h-screen bg-background text-foreground font-sans relative transition-colors duration-500 overflow-x-hidden">
      <Sidebar
        activePage={currentPage}
        setPage={(p) => { setCurrentPage(p); setSidebarOpen(false); }}
        payloadCount={payloadCount}
        isSystemReady={isSystemReady}
        theme={theme}
        toggleTheme={toggleTheme}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[25] lg:hidden animate-in fade-in duration-300"
          />
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 min-h-screen relative overflow-x-hidden pb-12 transition-all duration-500 bg-background">
        <header className="h-20 border-b border-border bg-[var(--header-bg)] backdrop-blur-md sticky top-0 z-20 px-6 sm:px-10 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-muted border border-border text-foreground shadow-sm active:scale-95 transition-all hf-glass-hover"
              aria-label="Toggle Sidebar"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-current rounded-full transition-all ${isSidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`h-0.5 w-full bg-current rounded-full transition-all ${isSidebarOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-0.5 w-full bg-current rounded-full transition-all ${isSidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
              {currentPage.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            {!isSystemReady && (
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Syncing Database</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-muted rounded-full border border-border">
              <span className={`w-2 h-2 rounded-full ${stats.processed < stats.total && stats.total > 0 ? 'bg-accent animate-pulse-fast' : 'bg-slate-400'}`}></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                {stats.processed < stats.total && stats.total > 0 ? 'Scanner Active' : 'System Idle'}
              </span>
            </div>
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 items-center justify-center text-accent shadow-sm">
              <ShieldAlert size={20} />
            </div>
          </div>
        </header>

        <div className="px-6 py-10 sm:px-10 sm:py-16">
          {renderContent()}
        </div>

        <Terminal logs={logs} onClear={() => setLogs([])} />
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;