import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import NewScan from './pages/NewScan';
import Results from './pages/Results';
import Plugins from './pages/Plugins';
import Settings from './pages/Settings';
import ToastContainer, { ToastMessage } from './components/Toast';
import { Page, ScanResult, ScanStats, ScanConfig } from './types';
import { scannerService } from './services/mockScanner';
import { initPayloads } from './services/payloads';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isSystemReady, setSystemReady] = useState(false);
  const [payloadCount, setPayloadCount] = useState(0);
  
  const [stats, setStats] = useState<ScanStats>({
    total: 0,
    processed: 0,
    safe: 0,
    vulnerable: 0,
    suspicious: 0,
    errors: 0
  });

  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanHistory, setScanHistory] = useState<any[]>([
    { time: '10:00', safe: 120, vulnerable: 2 },
    { time: '10:05', safe: 250, vulnerable: 5 },
    { time: '10:10', safe: 380, vulnerable: 8 },
    { time: '10:15', safe: 510, vulnerable: 8 },
    { time: '10:20', safe: 640, vulnerable: 12 },
  ]);

  // Alert State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const addToast = (title: string, message: string, type: 'error' | 'warning') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // Auto-dismiss
    setTimeout(() => {
        dismissToast(id);
    }, 6000);
  };

  const dismissToast = (id: string) => {
      setToasts((prev) => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    // Initialize System
    const bootSequence = async () => {
        try {
            const count = await initPayloads();
            setPayloadCount(count);
            setSystemReady(true);
        } catch (e) {
            console.error("System initialization failed:", e);
            addToast("System Error", "Failed to load attack signatures", "error");
        }
    };
    
    bootSequence();

    // Subscribe to scanner updates
    const unsubscribe = scannerService.subscribe((newStats, newResult) => {
      setStats(newStats);
      if (newResult) {
        setResults(prev => [newResult, ...prev]);
        
        // Update charts dynamically (simplified mock logic)
        if (newStats.processed % 5 === 0) {
            const now = new Date();
            const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            setScanHistory(prev => {
                const newHistory = [...prev, { time: timeLabel, safe: newStats.safe, vulnerable: newStats.vulnerable }];
                return newHistory.slice(-10); // Keep last 10 points
            });
        }

        // Trigger Real-time Alerts
        if (newResult.verdict === 'VULNERABLE') {
            addToast('Critical Vulnerability Detected', newResult.url, 'error');
        } else if (newResult.verdict === 'SUSPICIOUS') {
            addToast('Suspicious Activity Detected', newResult.url, 'warning');
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleStartScan = (config: ScanConfig) => {
    if (!isSystemReady) {
        addToast("Scanner Not Ready", "Payload database is still initializing...", "warning");
        return;
    }

    // Clear previous results
    setResults([]);
    setScanHistory([]);
    
    // Parse URLs (simple split)
    const urls = config.targetUrls.split('\n').filter(u => u.trim().length > 0);
    
    // Start service
    scannerService.startScan(urls, config);
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <DashboardHome stats={stats} scanHistory={scanHistory} />;
      case Page.NEW_SCAN:
        return <NewScan onStartScan={handleStartScan} setPage={setCurrentPage} />;
      case Page.RESULTS:
        return <Results results={results} />;
      case Page.PLUGINS:
        // Force re-render of Plugins when payload count changes to show updated stats
        return <Plugins key={payloadCount} />;
      case Page.SETTINGS:
        return <Settings />;
      default:
        return <DashboardHome stats={stats} scanHistory={scanHistory} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans relative">
      <Sidebar activePage={currentPage} setPage={setCurrentPage} />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center text-sm text-gray-500">
             <span className="capitalize">{currentPage.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
             {!isSystemReady && (
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/20 rounded-full border border-amber-900/50">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-amber-500">Initializing Database...</span>
                 </div>
             )}
             <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700">
                <span className={`w-2 h-2 rounded-full ${stats.processed < stats.total && stats.total > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                <span className="text-xs font-medium text-gray-300">
                    {stats.processed < stats.total && stats.total > 0 ? 'Scanner Running' : 'Scanner Idle'}
                </span>
             </div>
             <img src="https://picsum.photos/32/32" alt="User" className="w-8 h-8 rounded-full border border-gray-600" />
          </div>
        </header>

        <div className="p-8">
           {renderContent()}
        </div>
      </main>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;