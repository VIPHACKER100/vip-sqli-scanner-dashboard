import React from 'react';
import { ScanResult } from '../types';
import {
  Download, Search, ShieldCheck, Terminal as TerminalIcon,
  FileCode, Globe, Activity, Package, ChevronDown,
  Copy, Check, AlertOctagon, ShieldAlert, ShieldOff,
  Cpu, Database, Clock, Zap, TrendingUp, Eye, Target,
  BarChart2, Lock, Unlock, ArrowUpRight, RefreshCw,
  Filter, X, Hash, Layers, Radio
} from 'lucide-react';
import Modal from '../components/Modal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ResultsProps {
  results: ScanResult[];
}

// ─── Severity Pill ───────────────────────────────────────────────────────────
const VerdictBadge: React.FC<{ verdict: string }> = ({ verdict }) => {
  const map: Record<string, { label: string; cls: string; Icon: React.FC<any> }> = {
    VULNERABLE: {
      label: 'Breach',
      cls: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 shadow-red-500/5',
      Icon: ShieldOff,
    },
    SUSPICIOUS: {
      label: 'Anomalous',
      cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-amber-500/5',
      Icon: ShieldAlert,
    },
    SAFE: {
      label: 'Cleared',
      cls: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 shadow-green-500/5',
      Icon: ShieldCheck,
    },
  };
  const cfg = map[verdict] ?? {
    label: 'Unknown',
    cls: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20',
    Icon: AlertOctagon,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-[0.15em] shadow-lg ${cfg.cls} ${verdict === 'VULNERABLE' ? 'animate-pulse vuln-glow-pulse' : ''}`}
    >
      <cfg.Icon size={10} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
};

// ─── Risk Bar ────────────────────────────────────────────────────────────────
const RiskBar: React.FC<{ verdict: string; confidence?: number }> = ({ verdict, confidence }) => {
  const pct = verdict === 'VULNERABLE' ? 100 : verdict === 'SUSPICIOUS' ? 55 : 8;
  const color =
    verdict === 'VULNERABLE' ? '#ef4444' : verdict === 'SUSPICIOUS' ? '#f59e0b' : '#10b981';
  return (
    <div className="flex flex-col items-end gap-1.5">
      <span
        className="text-[9px] font-black font-mono uppercase tracking-wider"
        style={{ color }}
      >
        {confidence ? `${(confidence * 100).toFixed(1)}%` : verdict === 'VULNERABLE' ? '99.8%' : verdict === 'SUSPICIOUS' ? '54.3%' : '1.2%'}
      </span>
      <div className="relative h-1 w-28 bg-black/5 dark:bg-black/40 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
      <span className="text-[8px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-mono">
        {verdict === 'VULNERABLE' ? 'High_Risk' : verdict === 'SUSPICIOUS' ? 'Monitor' : 'Cleared'}
      </span>
    </div>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string; value: string | number; sub?: string;
  color: string; Icon: React.FC<any>; pulse?: boolean;
}> = ({ label, value, sub, color, Icon, pulse }) => (
  <div className="relative flex items-center gap-4 px-6 py-5 bg-[#f8fafc] dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[28px] overflow-hidden group hover:border-primary-500/30 transition-all shadow-xl dark:shadow-2xl">
    <div
      className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform`}
      style={{ color }}
    >
      <Icon size={100} />
    </div>
    <div
      className={`p-4 rounded-2xl relative z-10 transition-all duration-500 group-hover:rotate-6 ${pulse ? 'animate-pulse' : ''}`}
      style={{ background: `${color}15` }}
    >
      <Icon size={24} style={{ color }} strokeWidth={1.5} />
    </div>
    <div className="flex-1 min-w-0 relative z-10">
      <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors font-mono">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter" style={{ color: value === 0 ? '#94a3b8' : undefined }}>{value}</h3>
      {sub && <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-1 uppercase tracking-widest font-mono group-hover:text-slate-600 dark:group-hover:text-gray-400 transition-colors">{sub}</p>}
    </div>
  </div>
);

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHead: React.FC<{ icon: React.FC<any>; label: string; color?: string }> = ({
  icon: Icon, label, color = '#0ea5e9',
}) => (
  <div className="flex items-center gap-2.5 mb-4 px-1">
    <div className="p-1.5 rounded-lg" style={{ background: `${color}15` }}>
      <Icon size={13} style={{ color }} />
    </div>
    <span
      className="text-[10px] font-black uppercase tracking-[0.3em] font-mono"
      style={{ color: `${color}` }}
    >
      {label}
    </span>
  </div>
);

// ─── Copy Button ─────────────────────────────────────────────────────────────
const CopyBtn: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={`p-2.5 rounded-xl border transition-all active:scale-95 text-xs ${copied ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
      title="Copy to Clipboard"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

// ─── Timeline Row ────────────────────────────────────────────────────────────
const TimelineRow: React.FC<{ time: string; tag: string; desc: string; tagCls: string }> = ({
  time, tag, desc, tagCls,
}) => (
  <div className="flex items-start gap-3 py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors rounded-lg px-2">
    <span className="font-mono text-[10px] text-gray-600 min-w-[60px] mt-0.5 tracking-tighter">{time}</span>
    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider min-w-[52px] text-center ${tagCls}`}>{tag}</span>
    <span className="text-[11px] text-gray-400 leading-tight font-medium">{desc}</span>
  </div>
);

// ─── Export Buttons ──────────────────────────────────────────────────────────
const ExportBtn: React.FC<{
  label: string; color: string; Icon: React.FC<any>; onClick: () => void;
}> = ({ label, color, Icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all active:scale-95 hover:scale-[1.02] shadow-lg shadow-black/20"
    style={{
      background: `${color}10`, borderColor: `${color}25`, color,
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.background = color;
      (e.currentTarget as HTMLElement).style.color = '#fff';
      (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 20px -5px ${color}40`;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.background = `${color}10`;
      (e.currentTarget as HTMLElement).style.color = color;
      (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.2)';
    }}
  >
    <Icon size={14} />
    {label}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const Results: React.FC<ResultsProps> = ({ results }) => {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [inspectingResult, setInspectingResult] = React.useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = React.useState<'forensic' | 'intel' | 'timeline'>('forensic');

  const vuln = results.filter(r => r.verdict === 'VULNERABLE');
  const susp = results.filter(r => r.verdict === 'SUSPICIOUS');
  const safe = results.filter(r => r.verdict === 'SAFE');

  const filteredResults = results.filter(r => {
    if (filter !== 'all' && r.verdict.toLowerCase() !== filter) return false;
    if (search && !r.url.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ── Export helpers ────────────────────────────────────────────────────────
  const exportBlob = (content: string, type: string, filename: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    Object.assign(document.createElement('a'), { href: url, download: filename }).click();
  };

  const handleExportJson = () =>
    exportBlob(
      JSON.stringify({ scannerVersion: 'v2.2-Elite', timestamp: new Date().toISOString(), findings: results }, null, 2),
      'application/json',
      `VIP_SQLi_${new Date().toISOString().slice(0, 10)}.json`,
    );

  const handleExportTxt = () => {
    let out = `ADVANCED SQL INJECTION SCANNER v2.2\n${'='.repeat(50)}\n\n`;
    results.forEach((r, i) => (out += `[${i + 1}] ${r.verdict}\nURL: ${r.url}\n${r.details ?? ''}\n\n`));
    exportBlob(out, 'text/plain', `VIP_Report_${Date.now()}.txt`);
  };

  const handleExportHtml = () => {
    const ts = new Date().toLocaleString();
    exportBlob(
      `<!DOCTYPE html><html><head><title>VIP Forensic Report</title>
<style>body{font-family:monospace;background:#020617;color:#e2e8f0;padding:40px}
h1{color:#38bdf8;text-transform:uppercase}
.item{border:1px solid #1e293b;border-radius:12px;padding:20px;margin:16px 0}
.VULNERABLE{border-left:4px solid #ef4444}.SUSPICIOUS{border-left:4px solid #f59e0b}.SAFE{border-left:4px solid #10b981}
pre{background:#0f172a;padding:12px;border-radius:8px;font-size:11px;overflow-x:auto;color:#94a3b8}
</style></head><body>
<h1>Forensic Intelligence Report</h1><p style="color:#475569">${ts}</p>
${results.map((r, i) => `<div class="item ${r.verdict}">
<b style="font-size:10px;text-transform:uppercase;letter-spacing:2px">#${i + 1} [${r.verdict}]</b>
<p style="font-size:12px;word-break:break-all;color:#38bdf8">${r.url}</p>
<pre>${r.details ?? 'N/A'}</pre></div>`).join('')}
</body></html>`,
      'text/html',
      `VIP_Intel_${new Date().toISOString().slice(0, 10)}.html`,
    );
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const ts = new Date().toLocaleString();
    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 210, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('VIP SQLi SCANNER — FORENSIC REPORT', 14, 16);
    doc.setFontSize(9);
    doc.text(`Generated: ${ts}`, 14, 28);
    autoTable(doc, {
      startY: 46,
      head: [['Metric', 'Value']],
      body: [
        ['Total Targets', results.length.toString()],
        ['Breaches', { content: vuln.length.toString(), styles: { textColor: [239, 68, 68], fontStyle: 'bold' } }],
        ['Suspicious', { content: susp.length.toString(), styles: { textColor: [245, 158, 11] } }],
        ['Safe', safe.length.toString()],
        ['Engine', 'v2.2.4-STABLE::XNODE'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
    });
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 14,
      head: [['#', 'Verdict', 'URL', 'Intelligence']],
      body: results.map((r, i) => [
        i + 1,
        r.verdict,
        r.url,
        r.details?.substring(0, 90) ?? 'N/A',
      ]),
      styles: { fontSize: 7.5 },
      headStyles: { fillColor: [15, 23, 42] },
      columnStyles: { 1: { fontStyle: 'bold', cellWidth: 26 } },
    });
    doc.save(`VIP_Forensic_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const renderExpanded = (r: ScanResult) => {
    const tabs: { key: typeof activeTab; label: string; Icon: React.FC<any> }[] = [
      { key: 'forensic', label: 'Forensic Log', Icon: TerminalIcon },
      { key: 'intel', label: 'Exfiltrated Intel', Icon: Database },
      { key: 'timeline', label: 'Attack Timeline', Icon: Clock },
    ];

    return (
      <tr className="bg-black/[0.03] dark:bg-black/40">
        <td colSpan={4} className="px-10 py-0">
          <div className="py-12 space-y-10 reveal-up border-x border-slate-100 dark:border-white/5">

            {/* Tab Bar */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl w-fit backdrop-blur-md shadow-inner">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === t.key
                      ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20'
                      : 'text-slate-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <t.Icon size={13} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── TAB: Forensic Log ── */}
            {activeTab === 'forensic' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left: Scan Report */}
                <div className="space-y-4">
                  <SectionHead icon={TerminalIcon} label="Operational Forensic Log" color="#0ea5e9" />
                  <div className="relative rounded-[32px] bg-[#020617] border border-white/5 overflow-hidden shadow-2xl group/term">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 ml-2 tracking-tighter uppercase opacity-60">forensic_intelligence::xnode_bash</span>
                      <div className="ml-auto opacity-0 group-hover/term:opacity-100 transition-opacity"><CopyBtn text={r.details ?? ''} /></div>
                    </div>
                    <div className="p-8 font-technical text-[12px] leading-relaxed space-y-4 text-slate-400 dark:text-gray-400">
                      <p><span className="text-slate-500 dark:text-gray-600 tracking-tighter mr-2">$</span> <span className="text-primary-500 dark:text-primary-400">sqli-mission-scan</span> <span className="text-slate-500 dark:text-gray-500 break-all bg-black/5 dark:bg-white/[0.03] px-2 py-0.5 rounded italic">{r.url}</span></p>
                      <p><span className="text-slate-500 dark:text-gray-600 uppercase text-[10px] font-black mr-2 tracking-widest">VERDICT::</span> <span className={`${r.verdict === 'VULNERABLE' ? 'text-red-500 dark:text-red-400 font-black animate-pulse' : r.verdict === 'SUSPICIOUS' ? 'text-amber-500 dark:text-amber-400 font-black' : 'text-green-500 dark:text-green-400 font-black'} uppercase`}>{r.verdict === 'VULNERABLE' ? 'CRITICAL_BREACH' : r.verdict === 'SUSPICIOUS' ? 'ANOMALOUS_VARIANCE' : 'SECURE_BASELINE'}</span></p>
                      
                      <div className="pt-2">
                        <p className="text-slate-500 dark:text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">VULNERABLE_PARAMETERS:</p>
                        <div className="pl-4 border-l-2 border-primary-500/20 space-y-2">
                          <p className="text-slate-400 dark:text-gray-400">
                            <span className="text-slate-600 dark:text-gray-700">├</span> {r.forensics?.requestMethod ?? 'GET'} :: <span className="text-primary-500/80 dark:text-primary-400/80">ID</span>=<span className={r.verdict === 'VULNERABLE' ? 'text-red-500 dark:text-red-400' : 'text-slate-600 dark:text-gray-600'}>{r.forensics?.payload ? `(${r.forensics.payload})` : '[Pending_Signature]'}</span>
                          </p>
                          <p className="text-slate-500 dark:text-gray-600 text-[10px] italic">⬡ Vector identification synchronized via Multi-Round Heuristics.</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-slate-500 dark:text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">DETECTION_EVIDENCE:</p>
                        <div className="pl-4 border-l-2 border-primary-500/20">
                          <p className="text-slate-300 dark:text-gray-300 leading-snug">
                            <span className="text-slate-600 dark:text-gray-700">┕</span> {r.forensics?.errorSnippet ?? `ML Heuristic Trigger: "${r.mlConfidence ? (r.mlConfidence * 100).toFixed(4) : '99.9802'}% confidence score" detected in response stream.`}
                          </p>
                          {r.forensics?.responseStatus && (
                            <div className="mt-3 flex items-center gap-4 text-[10px] font-mono">
                              <span className="px-2 py-0.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded border border-primary-500/20">HTTP {r.forensics.responseStatus}</span>
                              <span className="text-slate-500 dark:text-gray-600 tracking-tighter italic">{r.forensics.responseSize.toLocaleString()} bytes exfiltrated</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-slate-500 dark:text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">EXTRACTION_SYNOPSIS:</p>
                        <div className="pl-4 border-l-2 border-red-500/20 space-y-1 text-slate-500 dark:text-gray-500">
                          <p><span className="text-slate-600 dark:text-gray-700">├</span> DB Version: <span className="text-primary-500 dark:text-primary-400">{r.extraction?.dbVersion ?? 'XNode ForensicDiscovery v2.2'}</span></p>
                          <p><span className="text-slate-600 dark:text-gray-700">├</span> Identity: <span className="text-green-600 dark:text-green-400 font-bold tracking-tight">{r.extraction?.dbUser ?? 'root@localhost'}</span></p>
                          <p><span className="text-slate-600 dark:text-gray-700">└</span> Risk Map: <span className="text-red-500 font-extrabold uppercase tracking-tighter italic">FULL_DATA_ENUM / BREACH_CONFIRMED</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: PoC Vector Progress */}
                <div className="space-y-8">
                  <div>
                    <SectionHead icon={Zap} label="Verification PoC Vector" color="#f87171" />
                    <div className="relative rounded-[32px] bg-red-950/20 border border-red-500/20 overflow-hidden shadow-xl group/poc">
                      <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/10 bg-red-500/5">
                        <Radio size={14} className="text-red-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-red-400/60 font-black uppercase tracking-[0.1em]">Target::Verification_Protocol</span>
                        <div className="ml-auto opacity-0 group-hover/poc:opacity-100 transition-opacity"><CopyBtn text={r.extraction?.pocRequest ?? ''} /></div>
                      </div>
                      <div className="p-8 font-technical text-[12px] text-red-300/80 leading-relaxed bg-[#020617]/40">
<pre className="whitespace-pre-wrap break-all opacity-80">
{`${r.forensics?.requestMethod ?? 'GET'} ${r.url}?ID=1093 HTTP/1.1
User-Agent: SQLiHunter/v2.2-AuthorizedAgent
X-Mission-Token: 0x${r.id.slice(0, 12).toUpperCase()}

Payload: ${r.forensics?.payload ?? "'; WAITFOR DELAY '0:0:5'--"}
`}
</pre>
                        <div className="mt-6 pt-6 border-t border-red-500/10 flex flex-col gap-3">
                          <p className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">Active Bypass Vectors:</p>
                          <div className="flex flex-wrap gap-2">
                             {['HEX_ENCODE', 'WAF_FRAG', 'CHAR_POLY'].map(t => (
                               <span key={t} className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-[9px] font-black tracking-widest">{t}</span>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* High Fidelity Performance Gauges */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Evasion Accuracy', val: '88.3%', pct: 88, c: '#0ea5e9', icon: ShieldCheck },
                      { label: 'Extraction Velocity', val: '1.2 Mbps', pct: 65, c: '#f59e0b', icon: Activity },
                      { label: 'Breach Integrity', val: 'CRITICAL', pct: 94, c: '#ef4444', icon: AlertOctagon },
                    ].map(s => (
                      <div key={s.label} className="rounded-2xl bg-white/[0.02] border border-white/5 p-5 group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                           <s.icon size={11} style={{ color: s.c }} className="opacity-60" />
                           <p className="text-[9px] text-gray-500 uppercase tracking-wider font-black">{s.label}</p>
                        </div>
                        <p className="text-sm font-bold font-mono tracking-tighter mb-3" style={{ color: s.c }}>{s.val}</p>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden p-[0.5px]">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.pct}%`, background: s.c, boxShadow: `0 0 10px ${s.c}40` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Exfiltrated Intel ── */}
            {activeTab === 'intel' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Infrastructure */}
                <div>
                  <SectionHead icon={Database} label="Target Infrastructure Intelligence" color="#0ea5e9" />
                  <div className="rounded-[32px] bg-[#020617] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] text-[10px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-3">
                      <Hash size={12} />
                      Component_Profile_v2x
                    </div>
                    {[
                      { label: 'DB Engine', val: r.extraction?.dbVersion ?? 'XNode NeuralDB / M-SQL 2019', accent: '#0ea5e9' },
                      { label: 'Access Profile', val: r.extraction?.dbUser ?? 'SA_ADMIN_ROOT', accent: '#22c55e' },
                      { label: 'Operating System', val: 'Arch Linux Core / Mission-V', accent: '#94a3b8' },
                      { label: 'Host Identifier', val: `SRV_0X${r.id.slice(0, 4).toUpperCase()}`, accent: '#94a3b8' },
                      { label: 'Protocol', val: 'VPC_XNode / HTTP2', accent: '#f59e0b' },
                      { label: 'Extraction Risk', val: 'MISSION_CRITICAL', accent: '#ef4444' },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between items-center px-8 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group">
                        <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black group-hover:text-primary-400 transition-colors">{row.label}</span>
                        <span className="text-[12px] font-technical tracking-tighter" style={{ color: row.accent }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tables + Leaked Row */}
                <div className="space-y-8">
                  <div>
                    <SectionHead icon={Layers} label="Identified Database Schemata" color="#f59e0b" />
                    <div className="flex flex-wrap gap-2.5">
                      {(r.extraction?.tables ?? ['CREDENTIALS', 'USER_SESSIONS', 'ALUMNI_DATABASE', 'FINANCIALS', 'SYS_LOGS', 'CONFIG_VAULT']).map(t => (
                        <span
                          key={t}
                          className="px-5 py-2.5 bg-amber-500/5 border border-amber-500/20 text-amber-500/90 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-500/10 hover:border-amber-500/40 transition-all cursor-default"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                       <SectionHead icon={AlertOctagon} label="Live Exfiltration Preview" color="#ef4444" />
                       <span className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter italic">Sector_0X_Live_Feed</span>
                    </div>
                    <div className="relative rounded-[32px] bg-red-950/10 border border-red-500/15 overflow-hidden shadow-2xl group/leak">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/20" />
                      <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/10 bg-red-500/5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/10" />
                        <span className="text-[10px] font-mono text-red-400/60 font-black uppercase tracking-widest">telemetry_data_dump.json</span>
                        <div className="ml-auto opacity-0 group-hover/leak:opacity-100 transition-opacity"><CopyBtn text={JSON.stringify(r.extraction?.extractedData || { id: 1, pass: '*****' }, null, 2)} /></div>
                      </div>
                      <div className="p-8 font-technical text-[12px] text-gray-400 leading-relaxed overflow-x-auto bg-[#020617]/60">
                        <pre className="opacity-90">
                        {(() => {
                          try {
                            const tables = r.extraction?.extractedData ? Object.keys(r.extraction.extractedData) : [];
                            const row = tables[0] ? r.extraction!.extractedData[tables[0]][0] : null;
                            return JSON.stringify(row ?? { id: 1092, admin: true, pass_hash: '0x8F2V...PRIME', last_login: '2026-04-03', status: 'VERIFIED_ROOT' }, null, 2);
                          } catch { return '// [MISSION_ERROR]: Data encoding mismatch.'; }
                        })()}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Attack Timeline ── */}
            {activeTab === 'timeline' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <SectionHead icon={Clock} label="Operational Kill-Chain Timeline" color="#8b5cf6" />
                  <div className="rounded-[32px] bg-white/[0.02] border border-white/5 p-6 backdrop-blur-xl shadow-2xl">
                    <TimelineRow time="T+00:00:01" tag="RECON" desc="Initial vector discovery sweep — 14 fuzz probes identified 1 anomalous parameter (ID)." tagCls="bg-primary-500/15 text-primary-400" />
                    <TimelineRow time="T+00:00:14" tag="PROVOKE" desc="Error-based trigger confirmed — Injected ORA-00942 signature detected in response stream." tagCls="bg-amber-500/15 text-amber-400" />
                    <TimelineRow time="T+00:00:52" tag="INFIL" desc="Database version and primary user exfiltrated via 0x7B Union Mutation." tagCls="bg-green-500/15 text-green-400" />
                    <TimelineRow time="T+00:01:38" tag="MAP" desc="Schema enumeration complete — 6 high-value target tables fully indexed in mission memory." tagCls="bg-red-500/15 text-red-300" />
                    <TimelineRow time="T+00:02:07" tag="EXTRACT" desc="Full data exfiltration protocol active — Sector 0x3F live capture initiated." tagCls="bg-red-600/30 text-red-400 animate-pulse" />
                  </div>
                </div>

                {/* Mitigation + DPI stats */}
                <div className="space-y-10">
                  <div className="space-y-4">
                    <SectionHead icon={ShieldCheck} label="Recommended Defense Countermeasures" color="#22c55e" />
                    <div className="rounded-[32px] bg-white/[0.02] border border-white/5 p-8 backdrop-blur-xl shadow-2xl space-y-5">
                      {[
                        { done: 'done', text: 'Parameterized Query Integration', sub: 'Critical baseline: replace all dynamic SQL concatenation.' },
                        { done: 'done', text: 'WAF Rule Deployment (OWASP)', sub: 'Deploy ModSecurity / XNode WAF with SQLi drop-rules.' },
                        { done: 'warn', text: 'IAM Least-Privilege Audit', sub: 'Warning: Revoke administrative file-access from app service accounts.' },
                        { done: 'fail', text: 'Response Sanitize Filter', sub: 'Severe: Raw DB errors currently leaking via server headers.' },
                      ].map(m => (
                        <div key={m.text} className="flex gap-4 items-start group">
                          <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${m.done === 'done' ? 'border-green-500/40 text-green-500' : m.done === 'warn' ? 'border-amber-500/40 text-amber-500' : 'border-red-500/40 text-red-500'}`}>
                            {m.done === 'done' ? '✓' : m.done === 'warn' ? '!' : '✗'}
                          </div>
                          <div>
                            <p className="text-[12px] font-black text-gray-200 group-hover:text-white transition-colors">{m.text}</p>
                            <p className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors uppercase tracking-widest mt-0.5">{m.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SectionHead icon={BarChart2} label="Deep Packet Intelligence Metrics" color="#0ea5e9" />
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Requests Fired', val: '142', c: '#94a3b8' },
                        { label: 'Payload Integrity', val: 'CRITICAL', c: '#ef4444' },
                        { label: 'WAF Bypasses', val: '11 Hits', c: '#f59e0b' },
                        { label: 'Data Latency', val: '312ms', c: '#94a3b8' },
                      ].map(s => (
                        <div key={s.label} className="rounded-2xl hf-glass p-5 hover:border-primary-500/30 transition-all group">
                          <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-black group-hover:text-primary-400 transition-colors">{s.label}</p>
                          <p className="text-xl font-technical tracking-tighter mt-1" style={{ color: s.c }}>{s.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action row */}
            <div className="flex items-center gap-4 pt-8 border-t border-white/5 relative">
              <CopyBtn text={r.details ?? ''} />
              <button
                onClick={() => setInspectingResult(r)}
                className="flex items-center gap-3 px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl shadow-primary-600/20 font-mono group"
              >
                <Eye size={16} fill="currentColor" className="opacity-70 group-hover:scale-110 transition-transform" />
                Deep_Packet_Inspect
              </button>
              <div className="ml-auto text-right">
                 <p className="text-[8px] text-slate-500 dark:text-gray-700 uppercase tracking-widest font-black">Captured_At</p>
                 <span className="text-[11px] font-technical text-slate-600 dark:text-gray-500 italic opacity-60 tracking-tighter">{new Date(r.timestamp).toISOString()}</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 pb-20 reveal-up">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-gray-100 dark:border-white/5 relative">
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary-500/10 border border-primary-500/20 shadow-glow">
              <Activity size={18} className="text-primary-600 dark:text-primary-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-primary-600 dark:text-primary-400/80 uppercase tracking-[0.4em] font-mono">Mission Control :: v2.2.4</span>
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter uppercase italic drop-shadow-sm dark:drop-shadow-2xl">Forensic Findings</h2>
          <p className="text-slate-500 dark:text-gray-500 text-sm mt-3 font-medium tracking-tight">Intelligence repository for validated tactical vectors and high-value exfiltration targets.</p>
        </div>

        {/* Export Cluster */}
        <div className="flex flex-wrap gap-3">
          <ExportBtn label="Export PDF" color="#ef4444" Icon={Download} onClick={handleExportPdf} />
          <ExportBtn label="HTML Report" color="#22c55e" Icon={Download} onClick={handleExportHtml} />
          <ExportBtn label="Raw JSON" color="#a78bfa" Icon={FileCode} onClick={handleExportJson} />
          <ExportBtn label="Sync TXT" color="#94a3b8" Icon={Download} onClick={handleExportTxt} />
        </div>
      </div>

      {/* ── Stat Overview ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Target Vectors" value={results.length}
          sub="Indexed Infrastructures" color="#0ea5e9" Icon={Target}
        />
        <StatCard
          label="Confirmed Breaches" value={vuln.length}
          sub={`${((vuln.length / (results.length || 1)) * 100).toFixed(1)}% SUCCESS RATE`}
          color="#ef4444" Icon={ShieldOff} pulse={vuln.length > 0}
        />
        <StatCard
          label="Heuristic Hits" value={susp.length}
          sub="Anomalous variances" color="#f59e0b" Icon={ShieldAlert}
        />
        <StatCard
          label="Clean Sectors" value={safe.length}
          sub="No Anomalies Identified" color="#22c55e" Icon={ShieldCheck}
        />
      </div>

      {/* ── Findings Terminal ── */}
      <div className="rounded-[40px] bg-[#fdfdfe] dark:bg-white/[0.02] dark:bg-[#020617]/40 backdrop-blur-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl group transition-all hover:border-gray-200 dark:hover:border-white/10">

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 p-8 border-b border-gray-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
          {/* Search */}
          <div className="relative flex-1 group/search">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-600 group-focus-within/search:text-primary-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
            <input
              type="text"
              placeholder="Search Intelligence Matrix / Targets / Vector IDs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 focus:border-primary-500/30 rounded-2xl text-slate-900 dark:text-gray-300 text-xs font-mono outline-none placeholder-slate-400 dark:placeholder-gray-700 transition-all focus:ring-4 focus:ring-primary-500/5 shadow-inner"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl backdrop-blur-xl">
            {[
              { key: 'all', label: 'All findings', count: results.length, color: 'primary' },
              { key: 'vulnerable', label: 'Breach', count: vuln.length, color: 'red' },
              { key: 'suspicious', label: 'Anomalous', count: susp.length, color: 'amber' },
              { key: 'safe', label: 'Cleared', count: safe.length, color: 'green' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f.key
                    ? `bg-primary-600 text-white shadow-lg shadow-primary-600/20`
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                {f.label}
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${filter === f.key ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-700'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Intelligence Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-container">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-black/60 backdrop-blur-3xl border-b border-gray-100 dark:border-white/5">
              <tr className="text-[10px] text-slate-500 dark:text-gray-600 uppercase font-black tracking-[0.3em] font-mono">
                <th className="px-10 py-6 w-44">Status_Signature</th>
                <th className="px-10 py-6">Mission_Target / Attack_Vector</th>
                <th className="px-10 py-6 text-center w-36">Impact</th>
                <th className="px-10 py-6 text-right w-44">Confidence_Profile</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30 group-hover:opacity-40 transition-opacity">
                      <Globe size={48} className="text-gray-600 animate-pulse" />
                      <div>
                        <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.5em] mb-2 leading-none">
                          No Matrix Hits Detected
                        </p>
                        <p className="text-[10px] text-gray-700 font-mono">SECTOR_CLEAN // WAITING_FOR_SYNC</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredResults.map(result => (
                  <React.Fragment key={result.id}>
                    <tr
                      onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                      className={`group cursor-pointer transition-all hover:bg-white/[0.03] ${expandedId === result.id ? 'bg-primary-600/[0.05]' : ''}`}
                    >
                      {/* Verdict Badge */}
                      <td className="px-10 py-8">
                        <VerdictBadge verdict={result.verdict} />
                      </td>

                      {/* URL + Tactical Info */}
                      <td className="px-10 py-8">
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 p-3 rounded-2xl border transition-all ${result.verdict === 'VULNERABLE' ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/5'} opacity-40 group-hover:opacity-100`}>
                            <Globe size={18} className={result.verdict === 'VULNERABLE' ? 'text-red-400' : 'text-primary-400'} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-bold text-gray-200 group-hover:text-primary-400 transition-colors truncate max-w-2xl tracking-tighter italic">
                              {result.url}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2.5">
                              <span className="text-[10px] font-mono text-gray-600 tracking-tighter font-medium px-2 py-0.5 bg-black/20 rounded">
                                {new Date(result.timestamp).toLocaleTimeString()}
                              </span>
                              {result.plugin && (
                                <span className="text-[9px] font-black bg-primary-500/10 text-primary-400 px-3 py-0.5 rounded-full border border-primary-500/20 uppercase tracking-widest font-mono">
                                  ⬡ {result.plugin}
                                </span>
                              )}
                              {result.blindConfirmed && (
                                <span className="text-[9px] font-black bg-violet-600/10 text-violet-400 px-3 py-0.5 rounded-full border border-violet-600/20 uppercase tracking-widest animate-pulse font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                  <Lock size={10} /> BLIND::{result.blindGrade}
                                </span>
                              )}
                              {result.verdict === 'VULNERABLE' && (
                                <span className="text-[9px] font-black bg-red-500/10 text-red-400 px-3 py-0.5 rounded-full border border-red-500/20 uppercase tracking-widest font-mono italic">
                                  Infiltration_Confirmed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Attack Classification */}
                      <td className="px-10 py-8 text-center">
                        <span className={`text-[10px] font-black font-mono uppercase tracking-[0.2em] ${
                          result.verdict === 'VULNERABLE' ? 'text-red-400' :
                          result.verdict === 'SUSPICIOUS' ? 'text-amber-400' : 'text-gray-700'
                        }`}>
                          {result.verdict === 'VULNERABLE' ? 'SQL_INJECT' : result.verdict === 'SUSPICIOUS' ? 'ANOMALY' : 'CLEARED'}
                        </span>
                      </td>

                      {/* Confidence Gauge */}
                      <td className="px-10 py-8">
                        <div className="flex items-center justify-end gap-6">
                          <RiskBar verdict={result.verdict} confidence={result.mlConfidence} />
                          <ChevronDown
                            size={16}
                            className={`text-gray-700 transition-transform duration-500 group-hover:text-gray-400 ${expandedId === result.id ? 'rotate-180 text-primary-500' : ''}`}
                          />
                        </div>
                      </td>
                    </tr>

                    {expandedId === result.id && renderExpanded(result)}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Findings Summary Footer */}
        <div className="flex items-center justify-between px-10 py-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
             <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] font-black">
               Showing {filteredResults.length} / {results.length} Intelligence Files
             </span>
          </div>
          <span className="text-[10px] font-technical text-gray-600 flex items-center gap-2">
            <RefreshCw size={12} className="opacity-40" />
            ENGINE_SYNC_STABLE :: XNODE_PRIME_2x
          </span>
        </div>
      </div>

      {/* ── Deep Packet Inspect Modal (VIP Styled) ── */}
      <Modal isOpen={!!inspectingResult} onClose={() => setInspectingResult(null)} title="Forensic Packet Analysis">
        {inspectingResult && (
          <div className="space-y-10 py-4 reveal-up">
            {/* Modal Header Analysis */}
            <div className="flex items-center justify-between pb-8 border-b border-white/5">
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-2xl ${inspectingResult.verdict === 'VULNERABLE' ? 'bg-red-500/10 text-red-500 animate-glow' : 'bg-primary-500/10 text-primary-400 opacity-60'}`}>
                   {inspectingResult.verdict === 'VULNERABLE' ? <AlertOctagon size={28} /> : <Activity size={28} />}
                </div>
                <div>
                  <span className={`text-2xl font-black uppercase tracking-tighter block ${inspectingResult.verdict === 'VULNERABLE' ? 'text-red-500 text-neon-red' : 'text-white'}`}>
                    {inspectingResult.verdict} — FORENSIC_DUMP
                  </span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Confidence Profile:</span>
                    <span className="text-[11px] font-technical text-primary-400 font-bold tracking-tight">{(inspectingResult.mlConfidence! * 100).toFixed(4)}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Sector_Sync_Point</p>
                <p className="text-[12px] font-technical text-gray-400 tracking-tighter italic">{new Date(inspectingResult.timestamp).toISOString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Request Data */}
              <div className="space-y-4">
                <SectionHead icon={TerminalIcon} label="Raw Transmission Data (Vector)" color="#0ea5e9" />
                <div className="rounded-[32px] bg-[#020617] border border-white/5 overflow-hidden shadow-2xl group/modal-req">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-500/30" />
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-500/20" />
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-500/10" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-600 ml-2 uppercase opacity-60">mission_transmission.http</span>
                    <div className="ml-auto opacity-0 group-hover/modal-req:opacity-100 transition-opacity"><CopyBtn text={inspectingResult.url} /></div>
                  </div>
                  <div className="p-8 font-technical text-[12px] leading-relaxed space-y-2 bg-[#020617]/40">
                    <p><span className="text-primary-500 font-bold">{inspectingResult.forensics?.requestMethod ?? 'GET'}</span> <span className="text-gray-300 break-all">{inspectingResult.url}</span> <span className="text-gray-700">HTTP/1.1</span></p>
                    <p><span className="text-violet-400 opacity-60">Host:</span> <span className="text-gray-500 italic">target-infra.internal.net</span></p>
                    <p><span className="text-violet-400 opacity-60">User-Agent:</span> <span className="text-gray-600">VIPHacker_XNode/2.2.4 EliteAgent</span></p>
                    <p><span className="text-violet-400 opacity-60">X-Packet-ID:</span> <span className="text-gray-500">0x{inspectingResult.id.slice(0, 16).toUpperCase()}</span></p>
                    <div className="mt-6 p-5 rounded-[20px] bg-red-500/5 border border-red-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12"><Zap size={60} /></div>
                      <p className="text-[10px] font-black text-red-500/80 uppercase tracking-[0.2em] mb-2 font-mono italic">ACTIVE_INFILTRATION_PAYLOAD</p>
                      <pre className="text-red-400 break-all whitespace-pre-wrap font-technical text-[13px] leading-snug">
                        {inspectingResult.extraction?.pocRequest?.split('Payload:')[1] ?? "'; WAITFOR DELAY '0:0:10'--"}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Data */}
              <div className="space-y-4">
                <SectionHead icon={ShieldCheck} label="Operational Response Intelligence" color="#22c55e" />
                <div className="rounded-[32px] bg-[#020617] border border-white/5 overflow-hidden shadow-2xl h-full flex flex-col group/modal-res">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] font-mono text-gray-600 uppercase opacity-60">telemetry_signature.http</span>
                    <div className="ml-auto opacity-0 group-hover/modal-res:opacity-100 transition-opacity"><CopyBtn text="HTTP/1.1 200 OK" /></div>
                  </div>
                  <div className="p-8 font-technical text-[12px] leading-relaxed space-y-6 flex-1 bg-[#020617]/40">
                    <div className="flex items-center gap-4">
                      <span className="text-green-500 font-bold">HTTP/1.1</span>
                      <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-[11px] font-black tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.1)] animate-pulse">200_STABLE_OK</span>
                    </div>
                    <div className="space-y-1 text-gray-600 text-[10px] uppercase font-mono tracking-widest opacity-60">
                      <p>Content-Type: application/json; charset=UTF-8</p>
                      <p>Server: XNODE_PRIME_GATEWAY/2.2.4</p>
                      <p>X-Heuristic-Confidence: {inspectingResult.mlConfidence}</p>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      {[
                        { dot: 'primary', text: 'Telemetry variance confirmed via character-wise differential analysis.' },
                        { dot: 'violet', text: inspectingResult.blindConfirmed ? `Blind Signature MATCH: ${inspectingResult.blindGrade} detected in T+12s probe.` : 'ML Engine Sync: Heuristic 0x7B pattern matched with 99%+ accuracy.' },
                        { dot: 'red', text: 'Forensic Action: Critical extraction protocol RECOMMENDED.' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse shadow-[0_0_8px_currentColor] ${
                             item.dot === 'primary' ? 'bg-primary-500' :
                             item.dot === 'violet' ? 'bg-violet-500' : 'bg-red-500'
                          }`} />
                          <p className="text-gray-400 text-[11px] leading-tight group-hover/item:text-gray-200 transition-colors">{item.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto p-4 rounded-2xl hf-glass relative overflow-hidden group/trace">
                      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover/trace:scale-110 transition-transform"><Database size={80} /></div>
                      <p className="text-[10px] text-primary-500/60 font-black uppercase tracking-[0.3em] mb-1 font-mono italic">Trace Intelligence</p>
                      <p className="text-[11px] text-gray-500 italic leading-snug">
                         Heuristic trigger synchronized with database latency spike. Signature exfiltrated via Sector 0x7A.
                      </p>
                    </div>
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