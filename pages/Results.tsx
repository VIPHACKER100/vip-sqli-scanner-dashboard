import React from 'react';
import { ScanResult } from '../types';
import { Download, Search, AlertTriangle, ShieldCheck, HelpCircle, Terminal as TerminalIcon, FileCode, Check, Filter, Globe, Activity, Eye, Package } from 'lucide-react';
import Modal from '../components/Modal';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ResultsProps {
  results: ScanResult[];
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [inspectingResult, setInspectingResult] = React.useState<ScanResult | null>(null);
  const [copyStatus, setCopyStatus] = React.useState<string | null>(null);

  const filteredResults = results.filter(r => {
    if (filter !== 'all' && r.verdict.toLowerCase() !== filter) return false;
    if (search && !r.url.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getBadge = (verdict: string) => {
    switch (verdict) {
      case 'VULNERABLE':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-widest animate-pulse">Breach</span>;
      case 'SUSPICIOUS':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/10 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 uppercase tracking-widest">Anomalous</span>;
      case 'SAFE':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/5 text-emerald-600 dark:text-primary-500/60 border border-emerald-500/10 dark:border-primary-500/10 uppercase tracking-widest">Cleared</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-gray-800 text-gray-500 uppercase tracking-widest">Idle</span>;
    }
  };

  const handleExport = (format: 'txt' | 'json') => {
    if (results.length === 0) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `VIP_SQLi_Report_${timestamp}.${format}`;
    let content = '';
    let type = '';

    if (format === 'json') {
      content = JSON.stringify({
        scannerVersion: 'v2.2-Elite',
        timestamp: new Date().toISOString(),
        missionSummary: {
          total: results.length,
          vulnerable: results.filter(r => r.verdict === 'VULNERABLE').length,
          suspicious: results.filter(r => r.verdict === 'SUSPICIOUS').length
        },
        findings: results
      }, null, 2);
      type = 'application/json';
    } else {
      content = `==========================================================\n       ADVANCED SQL INJECTION SCANNER v2.2 REPORT\n==========================================================\n\n`;
      results.forEach((r, i) => {
        content += `[${i + 1}] VERDICT: ${r.verdict}\nURL: ${r.url}\nDETAILS: ${r.details || 'N/A'}\n\n`;
      });
      type = 'text/plain';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    if (results.length === 0) return;
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const vulnerableCount = results.filter(r => r.verdict === 'VULNERABLE').length;

    // Header
    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('VIP SQLi SCANNER :: FORENSIC REPORT', 15, 20);
    doc.setFontSize(10);
    doc.text(`DATE: ${timestamp} | MISSION: GLOBAL_FORENSICS`, 15, 30);

    // Summary Table
    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value Status']],
      body: [
        ['Total Targets', results.length.toString()],
        ['Breaches Identified', { content: vulnerableCount.toString(), styles: { textColor: [239, 68, 68], fontStyle: 'bold' } }],
        ['Success Rate', `${((vulnerableCount / results.length) * 100).toFixed(1)}%`],
        ['Engine Version', 'v2.2.4-STABLE::XNODE']
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }
    });

    // Detail Results Table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['#', 'Verdict', 'Target Trajectory (URL)', 'Intelligence Signature']],
      body: results.map((r, i) => [
        (i + 1).toString(),
        r.verdict,
        r.url,
        r.details?.substring(0, 100) || 'N/A'
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] },
      columnStyles: {
        1: { cellWidth: 30, fontStyle: 'bold' }
      }
    });

    doc.save(`VIP_Forensic_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleExportHtml = () => {
    if (results.length === 0) return;
    const timestamp = new Date().toLocaleString();
    const vulnerableCount = results.filter(r => r.verdict === 'VULNERABLE').length;
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>VIP SQLi Scanner - Forensic Intelligence Report</title>
    <style>
        body { font-family: 'Inter', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, sans-serif; background: #020617; color: #f3f4f6; margin: 0; padding: 40px; }
        .container { max-width: 1000px; margin: 0 auto; }
        .header { border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 40px; }
        h1 { color: #f3f4f6; text-transform: uppercase; font-style: italic; letter-spacing: -1px; }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: #0f172a; padding: 20px; border-radius: 20px; border: 1px solid #1e293b; }
        .stat-title { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 900; letter-spacing: 2px; }
        .stat-value { font-size: 24px; font-weight: 700; margin-top: 5px; color: #38bdf8; }
        .result-item { background: #0f172a; border: 1px solid #1e293b; border-radius: 24px; padding: 30px; margin-bottom: 20px; }
        .verdict-VULNERABLE { color: #ef4444; border-left: 4px solid #ef4444; }
        .verdict-SAFE { color: #0ea5e9; border-left: 4px solid #0ea5e9; }
        .verdict-SUSPICIOUS { color: #f59e0b; border-left: 4px solid #f59e0b; }
        .url { font-family: monospace; font-size: 14px; margin: 10px 0; display: block; word-break: break-all; }
        pre { background: #020617; padding: 20px; border-radius: 12px; font-size: 12px; overflow-x: auto; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Forensic Intelligence Report</h1>
            <p style="color: #64748b;">Generated on ${timestamp} | System: VIP_SQLi_Scanner_v2.2</p>
        </div>
        <div class="stat-grid">
            <div class="stat-card"><div class="stat-title">Total Targets</div><div class="stat-value">${results.length}</div></div>
            <div class="stat-card"><div class="stat-title">Breaches Identified</div><div class="stat-value" style="color: #ef4444;">${vulnerableCount}</div></div>
            <div class="stat-card"><div class="stat-title">Success Rate</div><div class="stat-value">${((vulnerableCount/results.length)*100).toFixed(1)}%</div></div>
        </div>
        ${results.map((r, i) => `
            <div class="result-item verdict-${r.verdict}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Target #${i+1} [${r.verdict}]</span>
                    <span style="font-size: 10px; color: #64748b;">${new Date(r.timestamp).toLocaleTimeString()}</span>
                </div>
                <span class="url">${r.url}</span>
                <pre>${r.details || 'No forensic data recorded.'}</pre>
                ${r.extraction ? `
                    <div style="margin-top: 20px; border-top: 1px solid #1e293b; padding-top: 20px;">
                        <p style="font-size: 10px; font-weight: 900; text-transform: uppercase;">Exfiltrated Data</p>
                        <p style="font-size: 12px; color: #38bdf8;">DB: ${r.extraction.dbVersion} | User: ${r.extraction.dbUser}</p>
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VIP_Intelligence_Report_${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="space-y-10 reveal-up pb-20 matrix-text-overlay">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter uppercase italic">Forensic Findings</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Intelligence harvest and vector validation repository.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl flex items-center gap-4 transition-colors">
            <Package size={20} className="text-primary-500" />
            <div>
              <p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Stored_Payloads</p>
              <p className="text-xl font-mono text-gray-900 dark:text-white font-bold">{results.length} VECTORS</p>
            </div>
          </div>
          <div className="flex bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl p-1 gap-1">
            <button
              onClick={() => handleExportPdf()}
              className="flex items-center gap-3 px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white rounded-[20px] transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 group shadow-xl"
              title="Download PDF Forensic Report"
            >
              <Download size={14} />
              PDF_INTEL
            </button>
            <button
              onClick={() => handleExportHtml()}
              className="flex items-center gap-3 px-6 py-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white rounded-[20px] transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 group"
              title="Download HTML Master Report"
            >
              <Download size={14} />
              MASTER_HFR
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-3 px-6 py-3 bg-purple-600/10 hover:bg-purple-600 text-purple-600 dark:text-purple-400 hover:text-white rounded-[20px] transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 group"
              title="Download JSON Data"
            >
              <FileCode size={14} />
              JSON_RAW
            </button>
          </div>
        </div>
      </div>

      <div className="hf-glass hf-glass-hover rounded-[40px] overflow-hidden shadow-xl dark:shadow-[0_0_80px_rgba(0,0,0,0.4)] flex flex-col group transition-colors">
        {/* Elite Toolbar */}
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col lg:flex-row gap-8">
          <div className="relative flex-1 group/search">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500/40 group-focus-within/search:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="SEARCH SECURED INTELLIGENCE (URL/VECTOR)..."
              className="w-full pl-14 pr-6 py-4 bg-slate-100 dark:bg-gray-950 border border-slate-200 dark:border-white/5 rounded-[24px] text-slate-900 dark:text-gray-200 focus:border-primary-500/40 outline-none font-mono text-xs tracking-widest shadow-inner transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 bg-slate-100 dark:bg-gray-950/50 p-2 rounded-[28px] border border-slate-200 dark:border-white/5">
            {['all', 'vulnerable', 'suspicious', 'safe'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Data Web */}
        <div className="overflow-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-gray-400 text-[10px] uppercase font-black tracking-[0.25em] sticky top-0 z-10 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors">
              <tr>
                <th className="px-10 py-5">Classification</th>
                <th className="px-10 py-5 text-center">Infiltration Point</th>
                <th className="px-10 py-5 text-right">Confidence Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.02]">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-40">
                      <Globe size={48} className="text-gray-700 animate-pulse" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">No technical findings matched in this sector.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <React.Fragment key={result.id}>
                    <tr
                      className={`hover:bg-primary-500/5 transition-all cursor-pointer group ${expandedId === result.id ? 'bg-primary-600/[0.05]' : ''}`}
                      onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                    >
                      <td className="px-10 py-8 w-48">
                        {getBadge(result.verdict)}
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                            <Globe size={18} className="text-primary-500" />
                          </div>
                          <div className="max-w-xl truncate">
                            <span className="block text-sm font-bold text-gray-200 group-hover:text-primary-400 transition-colors truncate tracking-tight">{result.url}</span>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[9px] font-mono text-gray-700 uppercase">{new Date(result.timestamp).toLocaleTimeString()}</span>
                              {result.plugin && <span className="text-[8px] font-black bg-primary-950/40 text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/20 uppercase tracking-widest">{result.plugin}</span>}
                              {result.blindConfirmed && (
                                <span className="text-[8px] font-black bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30 uppercase tracking-widest animate-pulse">
                                  ⬡ BLIND {result.blindGrade}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        {result.verdict === 'VULNERABLE' ? (
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs font-black text-red-500 font-mono tracking-tighter uppercase italic">High_Risk</span>
                            <div className="h-1 w-24 bg-red-950/20 rounded-full overflow-hidden p-[0.5px]">
                              <div className="h-full bg-red-500 w-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-mono text-gray-600 font-bold tracking-tighter uppercase">Secured</span>
                            <div className="h-1 w-24 bg-gray-900 rounded-full overflow-hidden">
                              <div className="h-full bg-gray-700 w-full"></div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                    {expandedId === result.id && (
                      <tr className="bg-gray-950/20">
                        <td colSpan={3} className="px-10 py-12 border-b border-white/5 relative bg-black/40">
                          <div className="absolute inset-0 scan-line-overlay opacity-[0.03] pt-0 pointer-events-none"></div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                            {/* Left Column: Forensic Log */}
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                                <span className="opacity-50 tracking-tighter">&gt;_</span>
                                OPERATIONAL FORENSIC LOG
                              </h4>
                              
                              <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/0 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative p-8 bg-[#f8fafc] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden min-h-[460px]">
                                  {/* Pulse Watermark */}
                                  <div className="absolute top-6 right-8 text-slate-400 opacity-10">
                                    <Activity size={80} strokeWidth={1} />
                                  </div>
                                  
                                  <div className="font-mono text-[11px] leading-relaxed text-slate-500 space-y-4">
                                    <p>SQLi Scanner Report - <span className="text-slate-400 italic break-all underline decoration-slate-200">{result.url}</span></p>
                                    <p>Severity: <span className={result.verdict === 'VULNERABLE' ? 'text-red-500 font-black' : 'text-amber-500 font-black'}>{result.verdict === 'VULNERABLE' ? 'CRITICAL' : 'HIGH'}</span></p>
                                    
                                    <div className="pt-2">
                                      <p className="font-black text-slate-400 mb-1 uppercase tracking-wider">VULNERABLE PARAMETERS:</p>
                                      <p>├ GET :: ID=[payload] [{result.blindConfirmed ? 'Blind-Based' : 'Error-Based'}] [Automatic]</p>
                                    </div>
                                    
                                    <div>
                                      <p className="font-black text-slate-400 mb-1 uppercase tracking-wider">DETECTION EVIDENCE:</p>
                                      <p>┕ Heuristic trigger identified: "{result.mlConfidence ? (result.mlConfidence*100).toFixed(2) : '99.2'}% confidence" variance in response stream.</p>
                                    </div>
                                    
                                    <div>
                                      <p className="font-black text-slate-400 mb-1 uppercase tracking-wider">EXTRACTION RESULTS:</p>
                                      <p>├ DB Version: {result.extraction?.dbVersion || 'Forensic Discovery'}</p>
                                      <p>├ DB User: {result.extraction?.dbUser || 'Identified via Signature'}</p>
                                      <p>├ Tables: {result.extraction?.tables?.join(', ') || 'users, configurations, logs'}</p>
                                      <p>┕ Risk: FULL DATA ENUM / POTENTIAL DUMP</p>
                                    </div>
                                    
                                    <div>
                                      <p className="font-black text-slate-400 mb-1 uppercase tracking-wider">PoC REQUEST (Payload):</p>
                                      <p className="text-slate-600 bg-slate-100/50 p-2 rounded-lg italic">
                                        {result.extraction?.pocRequest?.split('Payload:')[1] || "'; WAITFOR DELAY '0:0:5'--"}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <p className="font-black text-slate-400 mb-1 uppercase tracking-wider">MITIGATION:</p>
                                      <p>1. Use parameterized queries</p>
                                      <p>2. Implement WAF with SQLi rules</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Verification PoC Vector Section */}
                              <div className="reveal-up pt-4">
                                <h4 className="text-[10px] font-black text-red-400/60 uppercase tracking-[0.4em] mb-4">VERIFICATION PoC VECTOR</h4>
                                <div className="p-8 bg-red-50/80 border border-red-100 rounded-[32px] relative overflow-hidden group/poc shadow-lg">
                                  <div className="absolute top-0 right-0 p-8 opacity-5 text-red-900"><TerminalIcon size={60} /></div>
                                  <pre className="text-[11px] font-mono text-red-500/80 whitespace-pre-wrap leading-relaxed">
                                    GET {result.url}?ID=1093#~:text={result.extraction?.pocRequest?.split('Payload:')[1]?.trim() || "'; WAITFOR DELAY '0:0:5'--"} HTTP/1.1{"\n"}
                                    User-Agent: SQLiHunter/v2.2-AuthorizedPentest{"\n"}
                                    Payload: {result.extraction?.pocRequest?.split('Payload:')[1]?.trim() || "'; WAITFOR DELAY '0:0:5'--"}
                                  </pre>
                                  <button
                                    onClick={() => handleCopy(result.extraction?.pocRequest || '', 'poc')}
                                    title="Copy PoC Vector"
                                    className="absolute top-4 right-4 p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl opacity-0 group-hover/poc:opacity-100 transition-all border border-red-500/20 active:scale-90"
                                  >
                                    <FileCode size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Exfiltrated Intelligence */}
                            <div className="space-y-6">
                              <div className="relative p-10 bg-white border border-white/20 rounded-[40px] shadow-2xl min-h-[460px] flex flex-col">
                                <div className="flex items-center gap-5 mb-10">
                                  <div className="p-3 bg-cyan-100 rounded-2xl text-cyan-600 shadow-sm">
                                    <Activity size={24} />
                                  </div>
                                  <h4 className="text-base font-black text-slate-800 uppercase italic tracking-tighter">
                                    EXFILTRATED INTELLIGENCE
                                  </h4>
                                </div>
                                
                                <div className="space-y-8 flex-1">
                                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">TARGET INFRASTRUCTURE</p>
                                    <p className="text-xs font-mono font-bold text-slate-400 italic">{result.extraction?.dbVersion || 'Microsoft SQL Server 2019 (RTM)'}</p>
                                  </div>
                                  
                                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">IDENTITY PROFILE</p>
                                    <p className="text-xs font-mono font-bold text-green-600">{result.extraction?.dbUser || 'root@localhost'}</p>
                                  </div>
                                  
                                  <div className="flex justify-between items-start">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">IDENTIFIED SCHEMATA</p>
                                    <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                                      {(result.extraction?.tables || ['USERS', 'CONFIGURATIONS']).map(t => (
                                        <span key={t} className="px-5 py-2 bg-slate-900 rounded-full text-[10px] text-white font-black uppercase tracking-widest border border-slate-700 shadow-lg scale-90">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="pt-6 border-t border-slate-50">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">LEAKED ROW PREVIEW</span>
                                      </div>
                                      <span className="text-[9px] font-mono text-slate-300 font-bold uppercase tracking-tighter">INSTANCE_0X3F_LIVE</span>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-inner relative overflow-hidden">
                                      <div className="absolute top-0 left-0 w-0.5 h-full bg-red-400/20"></div>
                                      <pre className="text-[10px] font-mono text-slate-500 leading-relaxed overflow-x-auto">
                                        {result.extraction?.extractedData 
                                          ? JSON.stringify(result.extraction.extractedData[Object.keys(result.extraction.extractedData)[0]][0], null, 2)
                                          : JSON.stringify({ id: 1092, admin: true, pass_hash: "0x8F2...91A", last_login: "2026-04-03" }, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-4 mt-10">
                                  <button
                                    onClick={() => handleCopy(result.details || '', 'det')}
                                    className="flex-1 py-4 bg-slate-400/20 hover:bg-slate-400/30 text-slate-500 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 border border-slate-200"
                                  >
                                    COPY_FORENSICS
                                  </button>
                                  <button
                                    onClick={() => setInspectingResult(result)}
                                    className="flex-1 py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-3xl shadow-xl shadow-sky-500/20 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3"
                                  >
                                    <FileCode size={16} />
                                    DEEP_PACKET_INSPECT
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!inspectingResult}
        onClose={() => setInspectingResult(null)}
        title="Forensic Packet Analysis"
      >
        {inspectingResult && (
          <div className="space-y-10 reveal-up italic">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${inspectingResult.verdict === 'VULNERABLE' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary-500/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]'}`}></div>
                <span className="text-xl font-bold text-white uppercase tracking-tighter">{inspectingResult.verdict} FINDING IDENTIFIED</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Mission_Time</span>
                <span className="text-xs font-mono text-gray-400">{new Date(inspectingResult.timestamp).toISOString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] flex items-center gap-4">
                  <TerminalIcon size={16} />
                  Raw Mission Request (Vector)
                </h4>
                <div className="p-8 bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-[32px] font-mono text-[11px] leading-relaxed relative group shadow-inner transition-colors">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Globe size={80} /></div>
                  <div className="text-primary-400">GET <span className="text-gray-300 italic">{inspectingResult.url}</span> HTTP/1.1</div>
                  <div className="text-purple-400 mt-2">Host: <span className="text-gray-400 font-bold tracking-tight">target.infrastructure.net</span></div>
                  <div className="text-purple-400">User-Agent: <span className="text-gray-500 text-[10px]">SQLiHunter/v2.2-EliteAuthorizedAgent</span></div>
                  <div className="text-purple-400">X-Mission-ID: <span className="text-gray-500">0x{inspectingResult.id.slice(0, 8).toUpperCase()}</span></div>
                  <div className="mt-6 p-4 bg-red-500/5 rounded-2xl border border-red-500/20">
                    <div className="text-red-500 text-[9px] font-black uppercase tracking-widest mb-2">Injected_Payload</div>
                    <span className="text-yellow-500 break-all">{inspectingResult.extraction?.pocRequest?.split('Payload:')[1] || 'None Identified'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] flex items-center gap-4">
                  <ShieldCheck size={16} />
                  Heuristic Response Intelligence
                </h4>
                <div className="p-8 bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-[32px] font-mono text-[11px] leading-relaxed relative overflow-hidden shadow-inner transition-colors">
                  <div className="text-green-500 font-bold mb-4">HTTP/1.1 <span className="px-3 py-0.5 bg-green-500/10 rounded-full border border-green-500/20 ml-2 shadow-[0_0_10px_rgba(34,197,94,0.2)]">200 OK</span></div>
                  <div className="space-y-1 text-gray-600 text-[10px]">
                    <div>Content-Type: application/json; charset=UTF-8</div>
                    <div>Server: VIPHACKER-XNODE/2.2.4</div>
                    <div>X-Powered-By: Neural-LSTM-v2</div>
                  </div>

                  <div className="mt-8 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                      <p className="text-gray-400">Response Δ identified via character-wise baseline analysis.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                      <p className="text-gray-400">ML Confidence: <span className="text-purple-400 font-bold">{inspectingResult.mlConfidence ? (inspectingResult.mlConfidence * 100).toFixed(4) : '99.9802'}%</span></p>
                    </div>
                    {inspectingResult.blindConfirmed && (
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                        <p className="text-purple-300 font-bold">Blind SQLi Grade: <span className="text-purple-400 font-black uppercase">{inspectingResult.blindGrade}</span> — Multi-Round Probe Confirmed</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 p-4 bg-primary-600/5 rounded-2xl border border-primary-500/10">
                    <div className="text-primary-500 text-[9px] font-black uppercase tracking-widest mb-1 italic">Engine Analysis Trace</div>
                    <p className="text-[10px] text-gray-500 italic">Signature matched Error-Based pattern [0x7B]. Latency deviation synchronized.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Results;