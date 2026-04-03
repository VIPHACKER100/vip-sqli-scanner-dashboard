import { IScanner, ScannerSettings, ScanConfig, ScanResult, ScanStats, LogEntry } from '../types';
import { mockScannerService as mockScanner } from './mockScanner';
import { realScannerService as realScanner } from './realScanner';

class MultiScannerService implements IScanner {
  private activeMode: 'mock' | 'real' = 'mock';

  subscribe(callback: (stats: ScanStats, newResult?: ScanResult) => void) {
    const unsubMock = mockScanner.subscribe(callback);
    const unsubReal = realScanner.subscribe(callback);
    return () => {
      unsubMock();
      unsubReal();
    };
  }

  subscribeToLogs(callback: (log: LogEntry) => void) {
    const unsubMock = mockScanner.subscribeToLogs(callback);
    const unsubReal = realScanner.subscribeToLogs(callback);
    return () => {
      unsubMock();
      unsubReal();
    };
  }

  startScan(urls: string[], config: ScanConfig, settings?: ScannerSettings) {
    this.activeMode = settings?.scannerMode || 'mock';
    
    if (this.activeMode === 'real') {
      realScanner.startScan(urls, config, settings);
    } else {
      mockScanner.startScan(urls, config, settings);
    }
  }

  stopScan() {
    if (this.activeMode === 'real') {
      realScanner.stopScan();
    } else {
      mockScanner.stopScan();
    }
  }
}

export const scannerService = new MultiScannerService();
