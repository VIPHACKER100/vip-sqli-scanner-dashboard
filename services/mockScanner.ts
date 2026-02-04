import { ScanResult, ScanStats, Verdict, ScanConfig, LogEntry, LogLevel, ScannerSettings } from '../types';
import { PAYLOADS } from './payloads';
import { fuzzerService } from './fuzzer';

// -------------------------------------------------------------------------
// CONSTANTS & SIGNATURES (Ported from Advanced SQLi Scanner v2.0 Python Engine)
// -------------------------------------------------------------------------

const STATIC_EXTENSIONS = [
  '.css', '.js', '.min.js', '.map', '.scss', '.sass', '.less',
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.avif',
  '.bmp', '.tiff', '.svg', '.heic', '.heif',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.mp4', '.mp3', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv',
  '.wav', '.ogg', '.m4a', '.aac',
  '.zip', '.rar', '.tar', '.gz', '.7z',
  '.xml', '.json', '.txt', '.csv', '.md', '.yaml', '.yml'
];

const IMPOSSIBLE_PATHS = [
  '/wp-content/', '/wp-includes/', '/wp-admin/css/', '/wp-admin/js/',
  '/assets/', '/static/', '/public/', '/resources/',
  '/fonts/', '/css/', '/js/', '/javascript/', '/styles/',
  '/images/', '/img/', '/pics/', '/pictures/', '/media/',
  '/lib/', '/libs/', '/vendor/', '/node_modules/', '/bower_components/',
  '/dist/', '/build/', '/cache/', '/temp/', '/tmp/',
  '/uploads/', '/files/', '/downloads/',
  '/theme/', '/themes/', '/templates/', '/skins/',
  '/docs/', '/documentation/', '/manual/'
];

const HIGH_RISK_PARAMS = new Set([
  'id', 'uid', 'user_id', 'userid', 'pid', 'product_id', 'productid',
  'cat', 'catid', 'category', 'category_id', 'cid', 'course_id',
  'volume_id', 'order_id', 'orderid', 'item_id', 'itemid',
  'user', 'username', 'uname', 'login', 'email', 'password', 'pass',
  'role', 'admin', 'auth', 'account',
  'page', 'p', 'view', 'detail', 'show', 'display', 'content',
  'article', 'post', 'news', 'blog',
  'query', 'q', 'search', 's', 'keyword', 'keywords', 'find',
  'action', 'act', 'do', 'cmd', 'command', 'method', 'function',
  'file', 'filename', 'path', 'dir', 'directory', 'folder',
  'doc', 'document', 'document', 'download',
  'sort', 'order', 'orderby', 'sortby', 'filter', 'group', 'groupby',
  'ref', 'reference', 'refid', 'type', 'mode', 'status'
]);

class MockScannerService {
  private intervalId: number | null = null;
  private listeners: ((stats: ScanStats, newResult?: ScanResult) => void)[] = [];
  private logListeners: ((log: LogEntry) => void)[] = [];

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
    return log;
  }

  startScan(urls: string[], config: ScanConfig, settings?: ScannerSettings) {
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

    this.emitLog('INFO', `Mission initiated. Scanner v2.2 Engine v2.0 READY.`);
    this.emitLog('INFO', `Strategy: ${config.profile.toUpperCase()}, Threads: ${config.threads}, ML: ${config.useML ? 'Enabled' : 'Disabled'}`);

    let currentIndex = 0;
    const threadCount = config.threads || 3;
    const rateLimit = settings?.rateLimit || 1000;
    const speed = Math.max(100, Math.floor(rateLimit / threadCount));

    this.intervalId = window.setInterval(() => {
      if (currentIndex >= urls.length) {
        this.stopScan();
        return;
      }

      const url = urls[currentIndex];
      this.emitLog('INFO', `Phase 1 Discovery: Parsing ${url}`);

      try {
        const currentLogs: LogEntry[] = [];
        const logger = (level: LogLevel, msg: string, p?: string) => {
          const l = this.emitLog(level, msg, url, p);
          currentLogs.push(l);
        };

        const result = this.simulateScan(url, config, settings, logger);
        result.logs = currentLogs;

        this.stats.processed++;
        if (result.verdict === 'SAFE') this.stats.safe++;
        else if (result.verdict === 'VULNERABLE') this.stats.vulnerable++;
        else if (result.verdict === 'SUSPICIOUS') this.stats.suspicious++;
        else this.stats.errors++;

        this.notify(result);
      } catch (err: any) {
        this.emitLog('ERROR', `Mission Critical Error: ${err.message || 'Engine crash during testing'}`);
        this.stats.processed++;
        this.stats.errors++;

        const errorResult: ScanResult = {
          id: Math.random().toString(36).substring(2, 11),
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
    this.emitLog('INFO', `Mission complete. ${this.stats.vulnerable} vulnerabilities identified.`);
  }

  private getRandomPayload(categoryFilter?: string, context?: { url: string, technique?: string }): { category: string, payload: string } {
    const categories = Object.keys(PAYLOADS);
    if (categories.length === 0) {
      return { category: 'System', payload: "' OR 1=1 -- (Engine v2.0)" };
    }

    let cat: string;

    // Context-aware category selection
    if (context) {
      const urlLower = context.url.toLowerCase();

      // Database-specific payload selection
      if (urlLower.includes('mysql') || urlLower.includes('php')) {
        const mysqlCategories = ['Boolean Based', 'Error Based', 'Time Based', 'Union Based'];
        cat = mysqlCategories[Math.floor(Math.random() * mysqlCategories.length)];
      } else if (urlLower.includes('postgres') || urlLower.includes('pg')) {
        const pgCategories = ['Boolean Based', 'Time Based', 'Union Based', 'Stacked Queries'];
        cat = pgCategories[Math.floor(Math.random() * pgCategories.length)];
      } else if (urlLower.includes('mssql') || urlLower.includes('aspx') || urlLower.includes('asp')) {
        const mssqlCategories = ['Error Based', 'Time Based', 'Stacked Queries', 'Stored Procedure'];
        cat = mssqlCategories[Math.floor(Math.random() * mssqlCategories.length)];
      } else if (urlLower.includes('oracle')) {
        const oracleCategories = ['Error Based', 'Time Based', 'Union Based', 'DNS Exfiltration'];
        cat = oracleCategories[Math.floor(Math.random() * oracleCategories.length)];
      } else if (context.technique) {
        // Use specified technique
        cat = context.technique;
      } else {
        // Default progressive selection: start with Boolean, escalate to Error/Time
        const defaultCategories = ['Boolean Based', 'Error Based', 'Time Based', 'Union Based'];
        cat = defaultCategories[Math.floor(Math.random() * defaultCategories.length)];
      }
    } else if (categoryFilter && categories.find(c => c.toLowerCase().includes(categoryFilter.toLowerCase()))) {
      cat = categories.find(c => c.toLowerCase().includes(categoryFilter.toLowerCase()))!;
    } else {
      cat = categories[Math.floor(Math.random() * categories.length)];
    }

    const payloadList = PAYLOADS[cat];
    if (!payloadList || payloadList.length === 0) {
      return { category: cat, payload: "Generic Scan Vector" };
    }

    const payload = payloadList[Math.floor(Math.random() * payloadList.length)];
    return { category: cat, payload };
  }

  private simulateScan(url: string, config: ScanConfig, settings: ScannerSettings | undefined, log: (l: LogLevel, m: string, p?: string) => void): ScanResult {
    const urlLower = url.toLowerCase();

    // --- Phase 0: Connectivity Check ---
    log('INFO', `Phase 0 Connectivity: Verifying status of ${url}`);
    const pingSuccess = Math.random() > 0.05; // 95% success rate for simulation

    if (!pingSuccess) {
      log('ERROR', `Mission Aborted: Target unresponsive (Health Check Failed).`);
      return {
        id: Math.random().toString(36).substring(2, 11),
        url, verdict: 'ERROR', timestamp: new Date().toISOString(),
        details: "SQLiHunter Connectivity: Target health check failed. Host is unreachable or timing out."
      };
    }
    log('INFO', `Connectivity confirmed. Target established as UP (HTTP/200).`);

    // --- HTTPS/SSL State Check ---
    if (urlLower.startsWith('https')) {
      log('INFO', `SSL/TLS Handshake: Initiating secure negotiation with ${url}`);
      log('INFO', `Handshake Verified: TLS v1.3 established (AES-256-GCM / ECDHE_RSA).`);
    } else {
      log('WARN', `Security Alert: Unencrypted channel identified. Target lacks SSL/TLS coverage.`);
    }

    // --- Fuzzing Mode: Parameter Discovery ---
    if (config.useFuzzing && config.fuzzConfig?.enabled) {
      log('INFO', `Fuzzing Mode: Initiating parameter discovery across ${config.fuzzConfig.vectors.join(', ')} vectors...`);

      const injectionPoints = fuzzerService.discoverInjectionPoints(
        url,
        config.method,
        config.requestBody,
        undefined,
        config.fuzzConfig
      );

      if (injectionPoints.length > 0) {
        log('INFO', `Fuzzing Discovery: Identified ${injectionPoints.length} injection points`);

        const prioritized = fuzzerService.prioritizeInjectionPoints(injectionPoints);
        const highRiskPoints = prioritized.filter(p => p.isHighRisk);

        if (highRiskPoints.length > 0) {
          log('WARN', `Fuzzing Alert: ${highRiskPoints.length} high-risk parameters detected: ${highRiskPoints.map(p => p.parameter).join(', ')}`);
        }

        // Test top injection points
        const pointsToTest = config.fuzzConfig.strategy === 'smart'
          ? prioritized.slice(0, 3)
          : prioritized.slice(0, 5);

        pointsToTest.forEach((point, index) => {
          log('EXEC', `Fuzzing [${index + 1}/${pointsToTest.length}]: Testing ${point.vector} parameter "${point.parameter}" (${point.type}${point.isHighRisk ? ', HIGH-RISK' : ''})`);

          // Get payloads for this injection point
          const payloads = fuzzerService.getFuzzingPayloads(point, 3);

          payloads.forEach((payload, pIndex) => {
            // Generate mutations
            const mutations = fuzzerService.mutatePayload(payload, point, config.fuzzConfig);
            const mutation = mutations[Math.min(pIndex, mutations.length - 1)];

            const testUrl = fuzzerService.buildTestUrl(url, point, mutation.payload);
            log('EXEC', `  └─ Payload ${pIndex + 1}: ${mutation.mutation}`, mutation.payload.substring(0, 50));
          });
        });
      } else {
        log('WARN', `Fuzzing Discovery: No injectable parameters found in configured vectors`);
      }
    }

    // --- SQLiHunter Phase 1: Input Discovery ---
    let path = "/";
    let hasParams = false;
    let highRiskParamFound = false;
    let inputPoint = `${config.method} Vector`;

    if (config.method === 'GET') {
      try {
        const parsed = new URL(url.startsWith('http') ? url : `http://${url}`);
        path = parsed.pathname.toLowerCase();
        hasParams = parsed.searchParams.size > 0;
        parsed.searchParams.forEach((_, key) => {
          if (HIGH_RISK_PARAMS.has(key.toLowerCase())) {
            highRiskParamFound = true;
            inputPoint = `GET :: ${key}`;
          }
        });
      } catch {
        hasParams = url.includes('?');
      }
    } else if (config.requestBody) {
      log('INFO', `REST Intelligence: Identifying JSON structure for parameter fuzzing...`);
      try {
        const body = JSON.parse(config.requestBody);
        const keys = Object.keys(body);
        inputPoint = `JSON :: ${keys[0]}`;
        log('INFO', `Structure confirmed: { ${keys.join(', ')} }. Targeting high-risk vectors.`);
      } catch {
        log('WARN', `Structure Warning: Non-standard JSON identified. Resorting to raw body fuzzing.`);
      }
    }

    if (STATIC_EXTENSIONS.some(ext => path.endsWith(ext)) && config.method === 'GET') {
      log('INFO', `Discovery: Static asset detected (${path}). Skipping fuzzing.`);
      return {
        id: Math.random().toString(36).substring(2, 11),
        url, verdict: 'SAFE', timestamp: new Date().toISOString(),
        details: "SQLiHunter Discovery: Static asset parsing triggered. Asset identified as neutral."
      };
    }

    if (IMPOSSIBLE_PATHS.some(p => path.includes(p))) {
      log('INFO', `Discovery: Protected path identified (${path}). Applying bypass logic.`);
      return {
        id: Math.random().toString(36).substring(2, 11),
        url, verdict: 'SAFE', timestamp: new Date().toISOString(),
        details: "SQLiHunter Discovery: Endpoint resides in global bypass/safe directory list."
      };
    }

    // --- Phase 2: Payload Testing Matrix ---
    log('INFO', `Phase 2 Matrix: Initiating payloads for ${inputPoint}`);

    const SUSPICIOUS_ERRORS = [
      // MySQL Errors
      'mysql_fetch', 'mysql_query', 'mysql_num_rows', 'mysql_connect', 'mysql_select_db',
      'mysql_error', 'mysql_warning', 'mysqli_', 'You have an error in your SQL',
      'Warning: mysql', 'MySQLSyntaxErrorException', 'com.mysql.jdbc.exceptions',
      'check the manual that corresponds to your MySQL server version',

      // PostgreSQL Errors
      'PostgreSQL query failed', 'pg_query', 'pg_exec', 'pg_connect', 'pg_prepare',
      'PSQLException', 'org.postgresql.util.PSQLException', 'ERROR: syntax error at or near',
      'ERROR: column', 'ERROR: relation', 'ERROR: operator does not exist',
      'unterminated quoted string', 'invalid input syntax',

      // MSSQL Errors
      'Microsoft OLE DB', 'ODBC SQL Server Driver', 'SQLServer JDBC Driver',
      'com.microsoft.sqlserver.jdbc.SQLServerException', 'System.Data.SqlClient.SqlException',
      'Unclosed quotation mark', 'Incorrect syntax near', 'The conversion of the',
      'SqlException', 'Microsoft SQL Native Client error', 'ODBC Driver',

      // Oracle Errors
      'ORA-', 'Oracle error', 'Oracle JDBC', 'oracle.jdbc.driver.OracleDriver',
      'java.sql.SQLException: ORA-', 'ORA-00933', 'ORA-01756', 'ORA-00936',
      'ORA-00942', 'ORA-01789', 'ORA-00904', 'quoted string not properly terminated',

      // Generic SQL Errors
      'SQL syntax', 'syntax error', 'SQL Error', 'Database error', 'Query failed',
      'Invalid query', 'Unexpected end of SQL command', 'SQL statement',
      'SQLException', 'DBD::', 'SQLSTATE', 'Warning: SQL',

      // SQLite Errors
      'SQLite', 'sqlite3.OperationalError', 'sqlite3.DatabaseError', 'unrecognized token',
      'near "', 'incomplete input', 'System.Data.SQLite.SQLiteException',

      // DB2 Errors
      'DB2 SQL error', 'SQLCODE', 'DB2Exception', 'com.ibm.db2.jcc.am.SqlException',
      'CLI0', 'SQL0', 'DSNT',

      // Informix Errors  
      'Informix', 'ISAM error', 'SQLCODE=', 'com.informix.jdbc',

      // Sybase Errors
      'Sybase message', 'com.sybase.jdbc', 'SybSQLException',

      // Access Errors
      'Microsoft Access Driver', 'JET Database Engine', 'Access Database Engine',

      // Generic JDBC/ODBC
      'java.sql.SQLException', 'JDBC', 'ODBC', 'Driver', 'Connection'
    ];

    const r = Math.random();
    const isDeepDiscovery = urlLower.includes('pentest-target.io') || urlLower.includes('internal-api.secure');
    const isVulnerableTarget = urlLower.includes('test-sqli') || urlLower.includes('vulnerable') || urlLower.includes('vulnweb.com') || urlLower.includes('api.vulnerable.com') || isDeepDiscovery || (highRiskParamFound && r > 0.6);

    // High-fidelity targets always trigger success
    const isTestTarget = urlLower.includes('vulnweb.com') || urlLower.includes('test-sqli');
    const successChance = isTestTarget || isDeepDiscovery ? 1.0 : (config.profile === 'aggressive' ? 0.7 : (config.profile === 'stealth' ? 0.05 : 0.4));

    // Technical Immersion: Show actual payloads being tested
    const testCount = Math.floor(Math.random() * 3) + 3; // 3-5 tests for better coverage
    for (let i = 0; i < testCount; i++) {
      const testPayload = this.getRandomPayload(undefined, { url, technique: i === 0 ? 'Boolean Based' : undefined });
      log('EXEC', `Testing ${testPayload.category} vector...`, testPayload.payload);
      log('EXEC', `Heuristic Analysis: Comparing server response with baseline...`);

      // Integrate reference logic: Length diff simulation
      if (isVulnerableTarget) {
        const defensiveObstacles = [
          'WAF Fragmentation detected: signature neutralized.',
          'Character-drop identified in response stream.',
          'Heuristic jitter detected: baseline delta insufficient.',
          'IDS Signature match prevented payload execution.',
          'WAF Byte-Check: Neutralizing high-risk characters.',
          'ModSecurity Rule triggered: payload sanitized.',
          'CloudFlare WAF: Request blocked at edge.',
          'Imperva SecureSphere: SQL pattern detected.',
          'F5 ASM: Anomaly score threshold exceeded.'
        ];
        const obstacle = defensiveObstacles[Math.floor(Math.random() * defensiveObstacles.length)];
        log('EXEC', `Delta Detection: ${obstacle}`);
      } else {
        log('EXEC', `Delta Detection: Signature cleared. No anomalous variance identified.`);
      }
    }

    let verdict: Verdict = 'SAFE';
    let details = '';
    let plugin = undefined;

    if (isVulnerableTarget && Math.random() < successChance) {
      verdict = 'VULNERABLE';
      // Determine technique based on URL patterns and reference triggers
      const trigger = Math.random();
      let detectionEvidence = "";
      let technique = '';

      // Smart technique selection based on URL and trigger
      if (urlLower.includes('mysql') || urlLower.includes('php')) {
        const mysqlTechniques = ['Error-Based', 'Boolean Blind', 'Time-Based', 'UNION-Based'];
        technique = isDeepDiscovery ? 'UNION-Based' : mysqlTechniques[Math.floor(Math.random() * mysqlTechniques.length)];
      } else if (urlLower.includes('postgres') || urlLower.includes('pg')) {
        const pgTechniques = ['Time-Based', 'Boolean Blind', 'UNION-Based', 'Stacked Queries'];
        technique = pgTechniques[Math.floor(Math.random() * pgTechniques.length)];
      } else if (urlLower.includes('mssql') || urlLower.includes('aspx')) {
        const mssqlTechniques = ['Error-Based', 'Time-Based', 'Stacked Queries'];
        technique = mssqlTechniques[Math.floor(Math.random() * mssqlTechniques.length)];
      } else {
        const techniques = ['Boolean Blind', 'Error-Based', 'Time-Based', 'UNION-Based', 'Stacked Queries'];
        technique = isDeepDiscovery ? 'UNION-Based' : techniques[Math.floor(Math.random() * techniques.length)];
      }

      if (trigger > 0.7 || technique === 'Error-Based') {
        const err = SUSPICIOUS_ERRORS[Math.floor(Math.random() * SUSPICIOUS_ERRORS.length)];
        detectionEvidence = `Error-based trigger identified: "${err}" found in response stream.`;
        technique = 'Error-Based';
      } else if (trigger > 0.4 || technique === 'Time-Based') {
        const delay = (Math.random() * 2 + 4).toFixed(2);
        detectionEvidence = `Time-based trigger: Response latched at ${delay}s (Threshold >4s exceeded).`;
        technique = 'Time-Based';
      } else {
        const lengthDiff = Math.floor(Math.random() * 500 + 100);
        detectionEvidence = `Boolean-blind trigger: Response length variance detected (Δ${lengthDiff} bytes) with AND 1=1/1=2 vectors.`;
        technique = 'Boolean Blind';
      }

      // Database fingerprinting based on URL patterns
      let dbType = 'MySQL 8.0.32';
      if (urlLower.includes('postgres') || urlLower.includes('pg')) {
        dbType = 'PostgreSQL 15.2 (Debian)';
      } else if (urlLower.includes('mssql') || urlLower.includes('aspx') || urlLower.includes('asp')) {
        dbType = 'Microsoft SQL Server 2019 (RTM)';
      } else if (urlLower.includes('oracle')) {
        dbType = 'Oracle Database 19c Enterprise Edition';
      } else if (urlLower.includes('sqlite')) {
        dbType = 'SQLite 3.40.1';
      } else if (isDeepDiscovery) {
        dbType = 'PostgreSQL 15.2 (Debian)';
      }

      const attack = this.getRandomPayload(technique.split(' ')[0], { url, technique: technique.split(' ')[0] });

      // Screen & Check Logic Simulation
      log('EXEC', `Winning Vector Identified: ${technique} payload triggered response Δ.`);
      log('INFO', `Primary Trigger: ${detectionEvidence}`);

      if (technique === 'UNION-Based') {
        log('EXEC', `Engine Phase::Enumerating Columns (Boolean Binary Search)...`);
        for (let c = 1; c <= 4; c++) {
          log('EXEC', `Testing ORDER BY ${c}...`, `ORDER BY ${c} --`);
          log('EXEC', `Response Check: Successful. Baseline match confirmed.`);
        }
        log('EXEC', `Column count confirmed: 4. Establishing UNION select baseline...`);
      } else if (technique === 'Boolean Blind') {
        log('EXEC', `Engine Phase::Character-wise extraction initiated...`);
        log('EXEC', `Fuzzing bit 0 of user()...`, `AND (SELECT BIT_LENGTH(USER())>0)`);
      }

      log('VULN', `VULNERABILITY CONFIRMED: ${technique} detected on ${inputPoint}`);

      // Extraction (Phase 3)
      log('INFO', `Phase 3 Intelligence: Running data extraction for ${dbType}`);
      const tables = ['users', 'configurations', 'admin_logs', 'secrets', 'api_keys', 'financial_records', 'audit_trail', 'vault_metadata'];
      const extractedUser = isDeepDiscovery ? 'admin_service_account' : (r > 0.5 ? 'root@localhost' : 'db_admin_web');
      const selectedTables = isDeepDiscovery ? tables.slice(0, 6) : tables.slice(0, Math.floor(Math.random() * 3) + 2);

      selectedTables.forEach(t => log('INFO', `Extracted table identity: ${t}`));

      // Note: Mock data extraction removed - real scanner would extract actual data
      const extractedPayload = {};

      details = `SQLi Scanner Report - ${url}\nSeverity: CRITICAL\n\n`;
      details += `VULNERABLE PARAMETERS:\n├── ${inputPoint}=[payload] [${technique}] [${dbType.split(' ')[0]}]\n\n`;
      details += `DETECTION EVIDENCE:\n└── ${detectionEvidence}\n\n`;
      details += `EXTRACTION RESULTS:\n├── DB Version: ${dbType}\n├── DB User: ${extractedUser}\n├── Tables: ${selectedTables.join(', ')}\n`;
      details += `└── Risk: FULL DATA ENUM / POTENTIAL DUMP\n\n`;

      if (Object.keys(extractedPayload).length > 0) {
        details += `EXTRACTED DATA (PREVIEW):\n`;
        Object.keys(extractedPayload).forEach(table => {
          details += `[Table: ${table}]\n${JSON.stringify(extractedPayload[table][0], null, 2)}\n`;
        });
        details += `\n`;
      }

      details += `PoC REQUEST (Payload):\n${attack.payload}\n\n`;
      details += `MITIGATION:\n1. Use parameterized queries\n2. Implement WAF with SQLi rules`;

      return {
        id: Math.random().toString(36).substring(2, 11),
        url, verdict, timestamp: new Date().toISOString(), details,
        mlConfidence: config.useML ? (0.94 + (Math.random() * 0.05)) : undefined,
        extraction: {
          dbVersion: dbType,
          dbUser: extractedUser,
          tables: selectedTables,
          extractedData: extractedPayload,
          pocRequest: `GET ${url} HTTP/1.1\nUser-Agent: ${settings?.userAgent || 'SQLiHunter/v2.2'}\nPayload: ${attack.payload}`
        }
      };
    } else if (config.useML && r > 0.85) {
      log('WARN', `ML-Engine Flag: Anomalous variance detected in response size.`);
      verdict = 'SUSPICIOUS';
      details = "SQLiHunter Detection Matrix: ML Engine flagged anomalous response timing. Boolean condition yielded partial diff (Δ length). Investigate for production-stealth variants.";
    } else if (config.usePlugins) {
      if (urlLower.includes('graphql') && settings?.enabledPlugins.graphql) {
        log('EXEC', `Module::GraphQL_Intel: Initiating schematic introspection...`);
        log('EXEC', `Module::GraphQL_Intel: Analyzing __schema for field disclosure...`);
        verdict = 'VULNERABLE';
        plugin = 'GraphQL Intel';
        details = `SQLiHunter Intelligence: Deep schematic disclosure confirmed.\n├── Plugin: ${plugin}\n├── Vector: __schema { queryType { name } }\n└── Result: High-fidelity introspection baseline established.`;
        log('VULN', `VULNERABILITY CONFIRMED: GraphQL Schematic Hijacking detected.`);
      } else if ((urlLower.includes('$') || urlLower.includes('nosql')) && settings?.enabledPlugins.nosql) {
        log('EXEC', `Module::NoSQLi_Hunt: Injecting BSON operator vectors ($ne, $gt)...`);
        log('EXEC', `Module::NoSQLi_Hunt: Verifying response Δ for $regex bypass...`);
        verdict = 'VULNERABLE';
        plugin = 'NoSQLi Hunt';
        details = `SQLiHunter Intelligence: NoSQL operator bypass identified.\n├── Plugin: ${plugin}\n├── Vector: {"$regex": ".*"}\n└── Result: Session hijacking via operator bypass confirmed.`;
        log('VULN', `VULNERABILITY CONFIRMED: NoSQL Filter Bypass (BSON Operator Injection).`);
      } else if (settings?.enabledPlugins.waf && (r > 0.4 || config.profile === 'stealth')) {
        log('EXEC', `Module::WAF_Stealth: Identifying firewall signature (Rule-0 Detection)...`);
        log('EXEC', `Module::WAF_Stealth: Applying Hex-Encoding & Fragmentation baseline...`);
        log('INFO', `WAF Evasion: Fragmented payload successfully transited firewall.`);
        // Note: WAF stealth isn't a vulnerability itself, but a tool to find them
        // If it's a vulnerable target, it helps find it
      } else if (urlLower.includes('ldap') && settings?.enabledPlugins.ldap) {
        log('EXEC', `Module::LDAP_Forge: Testing directory structure filter bypass...`);
        log('EXEC', `Module::LDAP_Forge: Injecting *(objectClass=*) vectors...`);
        verdict = 'VULNERABLE';
        plugin = 'LDAP Forge';
        details = `SQLiHunter Intelligence: LDAP Directory Service Injection detected.\n├── Plugin: ${plugin}\n├── Vector: (&(user=*)(objectClass=*))\n└── Result: Full directory tree enumeration possible.`;
        log('VULN', `VULNERABILITY CONFIRMED: LDAP Structure Bypass identified.`);
      }
    }

    if (verdict === 'SAFE') {
      log('INFO', `Clearing parameter ${inputPoint}. No injection signatures identified.`);
    }

    return {
      id: Math.random().toString(36).substring(2, 11),
      url, verdict, timestamp: new Date().toISOString(), details, plugin
    };
  }
}

export const scannerService = new MockScannerService();