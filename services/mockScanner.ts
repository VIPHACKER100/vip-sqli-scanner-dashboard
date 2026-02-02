import { ScanResult, ScanStats, Verdict, ScanConfig } from '../types';
import { PAYLOADS } from './payloads';

// Simulates the WebSocket behavior described in Phase 4
class MockScannerService {
  private intervalId: number | null = null;
  private listeners: ((stats: ScanStats, newResult?: ScanResult) => void)[] = [];
  
  private stats: ScanStats = {
    total: 0,
    processed: 0,
    safe: 0,
    vulnerable: 0,
    suspicious: 0,
    errors: 0
  };

  private isRunning = false;

  subscribe(callback: (stats: ScanStats, newResult?: ScanResult) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify(newResult?: ScanResult) {
    this.listeners.forEach(cb => cb({ ...this.stats }, newResult));
  }

  startScan(urls: string[], config: ScanConfig) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.stats = {
      total: urls.length,
      processed: 0,
      safe: 0,
      vulnerable: 0,
      suspicious: 0,
      errors: 0,
      startTime: Date.now()
    };
    this.notify();

    let currentIndex = 0;
    
    // Calculate speed based on threads. 
    // 1 thread = ~1000ms delay, 20 threads = ~50ms delay.
    // Ensure we don't go below 50ms for browser performance.
    // Default to 5 threads as per configuration requirements.
    const threadCount = config.threads || 5;
    const speed = Math.max(50, Math.floor(1000 / threadCount));

    this.intervalId = window.setInterval(() => {
      if (currentIndex >= urls.length) {
        this.stopScan();
        return;
      }

      const url = urls[currentIndex];
      
      try {
        const result = this.simulateScan(url, config);
        
        this.stats.processed++;
        if (result.verdict === 'SAFE') this.stats.safe++;
        else if (result.verdict === 'VULNERABLE') this.stats.vulnerable++;
        else if (result.verdict === 'SUSPICIOUS') this.stats.suspicious++;
        else this.stats.errors++;

        this.notify(result);
      } catch (err: any) {
        // Log the unexpected error
        console.error(`[Scanner] Unexpected error scanning ${url}:`, err);
        
        // Update stats
        this.stats.processed++;
        this.stats.errors++;
        
        // Generate an error result so the UI knows
        const errorResult: ScanResult = {
            id: Math.random().toString(36).substr(2, 9),
            url: url,
            verdict: 'ERROR',
            timestamp: new Date().toISOString(),
            details: `Scanner Exception: ${err.message || 'Unknown error'}`
        };
        
        this.notify(errorResult);
      }

      currentIndex++;

    }, speed);
  }

  stopScan() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.stats.endTime = Date.now();
    this.notify();
  }

  private getRandomPayload(categoryFilter?: string): { category: string, payload: string } {
    const categories = Object.keys(PAYLOADS);
    
    // Safe fallback if payloads haven't loaded yet or are empty
    if (categories.length === 0) {
        return { category: 'System', payload: "' OR 1=1 -- (Fallback Signature)" };
    }
    
    // If a filter is provided (e.g., 'Time'), try to find that category, otherwise random
    let cat = categoryFilter && categories.find(c => c.includes(categoryFilter)) 
              ? categories.find(c => c.includes(categoryFilter))! 
              : categories[Math.floor(Math.random() * categories.length)];

    const payloadList = PAYLOADS[cat];
    
    // Handle case where specific category might be empty due to load error
    if (!payloadList || payloadList.length === 0) {
         return { category: cat, payload: "Generic Test Payload" };
    }

    const payload = payloadList[Math.floor(Math.random() * payloadList.length)];
    return { category: cat, payload };
  }

  private simulateScan(url: string, config: ScanConfig): ScanResult {
    const r = Math.random();

    // Simulate unexpected runtime errors (5% chance)
    if (r < 0.05) {
        throw new Error("Connection reset by peer");
    }

    let verdict: Verdict = 'SAFE';
    let details = '';
    let plugin = undefined;
    let mlConfidence = undefined;

    // Simulate finding vulnerabilities based on random chance and keywords
    if (url.includes("'") || url.includes("UNION") || r > 0.85) {
      if (config.useML && r > 0.95) {
        verdict = 'SUSPICIOUS';
        mlConfidence = 0.89 + (Math.random() * 0.1); // Random confidence 0.89 - 0.99
        
        // Use WAF Bypass or Hybrid payloads for suspicious ML detection
        const attack = this.getRandomPayload('WAF');
        details = `ML Engine detected anomalous pattern matching ${attack.category} signature. Payload: "${attack.payload}"`;
      } else {
        verdict = 'VULNERABLE';
        
        // Pick a payload relevant to the URL if possible, otherwise random
        let attack;
        if (url.includes("UNION")) {
            attack = this.getRandomPayload('Union');
        } else if (url.includes("SLEEP")) {
            attack = this.getRandomPayload('Time');
        } else {
            attack = this.getRandomPayload();
        }
        
        details = `${attack.category} injection successful. Vector: "${attack.payload}"`;
      }
    } else if (config.usePlugins && url.includes("graphql")) {
        verdict = 'VULNERABLE';
        plugin = 'GraphQL Injection';
        details = 'Introspection query successful. Schema leaked.';
    } else {
       verdict = 'SAFE';
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      url,
      verdict,
      timestamp: new Date().toISOString(),
      details,
      plugin,
      mlConfidence
    };
  }
}

export const scannerService = new MockScannerService();