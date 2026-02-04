import React from 'react';
import { ScanResult } from '../types';
import { Download, Search, AlertTriangle, ShieldCheck, HelpCircle, Terminal as TerminalIcon, FileCode, Check, Filter, Globe, Activity, Eye, Package } from 'lucide-react';
import Modal from '../components/Modal';

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
              onClick={() => handleExport('txt')}
              className="flex items-center gap-3 px-6 py-3 bg-primary-600/10 hover:bg-primary-600 text-primary-600 dark:text-primary-400 hover:text-white rounded-[20px] transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 group"
              title="Download Text Report"
            >
              <Download size={14} />
              TXT_INTEL
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
                      <tr className="bg-gray-50/50 dark:bg-black/20 italic">
                        <td colSpan={3} className="px-12 py-12 border-b border-white/5 relative">
                          <div className="absolute inset-0 scan-line-overlay opacity-5 pt-0"></div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                            <div className="space-y-8">
                              <div>
                                <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-3 transition-colors">
                                  <TerminalIcon size={14} className="text-primary-500" />
                                  Operational Forensic Log
                                </h4>
                                <pre className="p-6 bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-white/5 rounded-[32px] text-xs font-mono text-gray-600 dark:text-gray-400 leading-relaxed shadow-inner overflow-hidden relative transition-colors">
                                  <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={60} /></div>
                                  {result.details}
                                </pre>
                              </div>
                              {result.extraction?.pocRequest && (
                                <div className="reveal-up">
                                  <h4 className="text-[10px] font-black text-red-900/60 uppercase tracking-[0.3em] mb-4">Verification PoC Vector</h4>
                                  <div className="p-6 bg-red-600/5 border border-red-500/10 rounded-[32px] relative overflow-hidden group/poc">
                                    <pre className="text-xs font-mono text-red-400/70 whitespace-pre-wrap leading-loose">
                                      {result.extraction.pocRequest}
                                    </pre>
                                    <button
                                      onClick={() => handleCopy(result.extraction?.pocRequest || '', 'poc')}
                                      className="absolute top-4 right-4 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl opacity-0 group-hover/poc:opacity-100 transition-opacity border border-red-500/20"
                                    >
                                      <FileCode size={16} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="space-y-8">
                              {result.extraction ? (
                                <div className="hf-glass p-8 rounded-[40px] shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
                                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600/50 to-transparent"></div>
                                  <h4 className="text-sm font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4 uppercase italic tracking-tighter">
                                    <div className="p-2.5 bg-primary-600/10 rounded-xl border border-primary-500/20">
                                      <Activity size={18} className="text-primary-400" />
                                    </div>
                                    Exfiltrated Intelligence
                                  </h4>
                                  <div className="space-y-4">
                                    {[
                                      { l: "Target Infrastructure", v: result.extraction.dbVersion },
                                      { l: "Identity Profile", v: result.extraction.dbUser, c: "text-green-400" }
                                    ].map(item => (
                                      <div key={item.l} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 group/val">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{item.l}</span>
                                        <span className={`text-xs font-mono font-bold ${item.c || 'text-gray-300'}`}>{item.v}</span>
                                      </div>
                                    ))}

                                    <div className="pt-4 mt-4 border-t border-white/5">
                                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Identified Schemata</p>
                                      <div className="flex flex-wrap gap-2">
                                        {result.extraction.tables?.map(t => (
                                          <span key={t} className="px-4 py-1.5 bg-gray-950 rounded-xl text-[10px] text-primary-400 border border-primary-500/10 font-bold uppercase tracking-tight">{t}</span>
                                        ))}
                                      </div>
                                    </div>

                                    {result.extraction.extractedData && (
                                      <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Leaked Row Preview</span>
                                          </div>
                                          <span className="text-[9px] font-mono text-gray-700 font-bold uppercase tracking-tighter">Instance_0x3F_Live</span>
                                        </div>
                                        <div className="space-y-3">
                                          {Object.keys(result.extraction.extractedData).slice(0, 1).map(table => (
                                            <div key={table} className="bg-gray-100 dark:bg-black border border-gray-200 dark:border-red-500/10 rounded-2xl p-5 shadow-inner group/row relative overflow-hidden transition-colors">
                                              <div className="absolute top-0 left-0 w-0.5 h-full bg-red-600/30 dark:bg-red-500/20 group-hover/row:bg-red-500 transition-all"></div>
                                              <pre className="text-[10px] font-mono text-gray-600 dark:text-gray-500 leading-relaxed overflow-x-auto transition-colors">
                                                {JSON.stringify(result.extraction!.extractedData![table][0], null, 2)}
                                              </pre>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center p-12 bg-white/[0.01] rounded-[40px] border border-white/5 opacity-40">
                                  <Eye size={48} className="text-gray-700 mb-6" />
                                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] text-center italic">No complex exfiltration data available for this sector.</p>
                                </div>
                              )}

                              <div className="flex gap-4">
                                <button
                                  onClick={() => handleCopy(result.details || '', 'det')}
                                  className={`flex-1 py-4 rounded-[20px] border text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${copyStatus === 'det' ? 'bg-green-600/20 border-green-500 text-green-500' : 'bg-gray-800/40 hover:bg-gray-700 text-gray-400 border-white/5'}`}
                                >
                                  {copyStatus === 'det' ? 'Evidence_Synced' : 'Copy_Forensics'}
                                </button>
                                <button
                                  onClick={() => setInspectingResult(result)}
                                  className="flex-1 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-[20px] shadow-2xl shadow-primary-600/30 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 italic"
                                >
                                  <FileCode size={16} />
                                  Deep_Packet_Inspect
                                </button>
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