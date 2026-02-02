export type ScanStatus = 'idle' | 'running' | 'paused' | 'completed';

export type Verdict = 'SAFE' | 'VULNERABLE' | 'SUSPICIOUS' | 'ERROR';

export interface ScanResult {
  id: string;
  url: string;
  verdict: Verdict;
  timestamp: string;
  details?: string;
  plugin?: string; // e.g., 'GraphQL', 'NoSQL'
  mlConfidence?: number;
}

export interface ScanStats {
  total: number;
  processed: number;
  safe: number;
  vulnerable: number;
  suspicious: number;
  errors: number;
  startTime?: number;
  endTime?: number;
}

export interface ScanConfig {
  targetUrls: string;
  profile: 'aggressive' | 'balanced' | 'stealth';
  useML: boolean;
  usePlugins: boolean;
  threads: number;
}

export enum Page {
  DASHBOARD = 'dashboard',
  NEW_SCAN = 'new_scan',
  RESULTS = 'results',
  PLUGINS = 'plugins',
  SETTINGS = 'settings'
}