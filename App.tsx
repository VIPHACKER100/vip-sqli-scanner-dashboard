import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import NewScan from './pages/NewScan';
import Analytics from './pages/Analytics';
import Results from './pages/Results';
import Plugins from './pages/Plugins';
import Settings from './pages/Settings';
import Documentation from './pages/Documentation';
import About from './pages/About';
import ToastContainer, { ToastMessage } from './components/Toast';
import Terminal from './components/Terminal';
import SplashScreen from './components/SplashScreen';
import { Page, ScanResult, ScanStats, ScanConfig, ScannerSettings, LogEntry } from './types';
import { scannerService } from './services/mockScanner';
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
  }
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isSystemReady, setSystemReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [payloadCount, setPayloadCount] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<ScannerSettings>(() => {
    const saved = localStorage.getItem('sqli_hunter_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
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
    switch (currentPage) {
      case Page.DASHBOARD:
        return <DashboardHome stats={stats} scanHistory={scanHistory} results={results} theme={theme} />;
      case Page.NEW_SCAN:
        return <NewScan onStartScan={handleStartScan} setPage={setCurrentPage} theme={theme} />;
      case Page.ANALYTICS:
        return <Analytics results={results} stats={stats} theme={theme} />;
      case Page.RESULTS:
        return <Results results={results} theme={theme} />;
      case Page.PLUGINS:
        return <Plugins settings={settings} setSettings={setSettings} theme={theme} />;
      case Page.SETTINGS:
        return <Settings settings={settings} setSettings={setSettings} theme={theme} />;
      case Page.DOCS:
        return <Documentation theme={theme} />;
      case Page.ABOUT:
        return <About />;
      default:
        return <DashboardHome stats={stats} scanHistory={scanHistory} results={results} theme={theme} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-gray-100 font-sans relative transition-colors duration-500">
      <Sidebar
        activePage={currentPage}
        setPage={setCurrentPage}
        payloadCount={payloadCount}
        isSystemReady={isSystemReady}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 ml-64 min-h-screen relative overflow-x-hidden pb-12">
        <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/40 dark:bg-gray-950/40 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between transition-colors">
          <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors">
            <span className="text-[10px]">{currentPage.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
            {!isSystemReady && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/20 rounded-full border border-amber-900/50">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-medium text-amber-500">Initializing Database...</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700">
              <span className={`w-2 h-2 rounded-full ${stats.processed < stats.total && stats.total > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
              <span className="text-xs font-medium text-gray-300">
                {stats.processed < stats.total && stats.total > 0 ? 'Scanner Running' : 'Scanner Idle'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full border border-primary-500/30 bg-primary-900/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-primary-400" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>

        <Terminal logs={logs} onClear={() => setLogs([])} />
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;