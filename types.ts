export type ScanStatus = 'idle' | 'running' | 'paused' | 'completed';

export type Verdict = 'SAFE' | 'VULNERABLE' | 'SUSPICIOUS' | 'ERROR';

export type LogLevel = 'INFO' | 'EXEC' | 'WARN' | 'VULN' | 'ERROR';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  url?: string;
  payload?: string;
}

export interface ScanResult {
  id: string;
  url: string;
  verdict: Verdict;
  timestamp: string;
  details?: string;
  plugin?: string; // e.g., 'GraphQL', 'NoSQL'
  mlConfidence?: number;
  extraction?: {
    dbVersion?: string;
    dbUser?: string;
    dbName?: string;
    tables?: string[];
    pocRequest?: string;
    extractedData?: any;
  };
  logs?: LogEntry[];
}

export interface ScannerSettings {
  userAgent: string;
  rateLimit: number;
  surfaceCoverage: {
    cookies: boolean;
    userAgent: boolean;
    referer: boolean;
    authHeaders: boolean;
  };
  enabledPlugins: {
    graphql: boolean;
    nosql: boolean;
    waf: boolean;
    ldap: boolean;
  };
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

export interface FuzzConfig {
  enabled: boolean;
  vectors: ('GET' | 'POST' | 'HEADERS' | 'COOKIES' | 'PATH')[];
  strategy: 'sequential' | 'parallel' | 'smart' | 'recursive';
  payloadMutation: boolean;
  encodingVariants: boolean;
  maxDepth: number;
  maxPayloadsPerParam: number;
}

export interface ScanConfig {
  targetUrls: string;
  method: 'GET' | 'POST' | 'PUT';
  requestBody?: string;
  profile: 'aggressive' | 'balanced' | 'stealth';
  useML: boolean;
  usePlugins: boolean;
  useFuzzing: boolean;
  fuzzConfig?: FuzzConfig;
  threads: number;
}

export enum Page {
  DASHBOARD = 'dashboard',
  NEW_SCAN = 'new_scan',
  ANALYTICS = 'analytics',
  RESULTS = 'results',
  PLUGINS = 'plugins',
  SETTINGS = 'settings',
  DOCS = 'docs',
  ABOUT = 'about'
}