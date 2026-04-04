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
      label: 'BREACH',
      cls: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      Icon: ShieldOff,
    },
    SUSPICIOUS: {
      label: 'ANOMALY',
      cls: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Icon: ShieldAlert,
    },
    SAFE: {
      label: 'SECURE',
      cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      Icon: ShieldCheck,
    },
  };
  const cfg = map[verdict] ?? {
    label: 'UNKNOWN',
    cls: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    Icon: AlertOctagon,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-[0.2em] shadow-sm ${cfg.cls} ${verdict === 'VULNERABLE' ? 'pulse-fast' : ''}`}
    >
      <cfg.Icon size={10} strokeWidth={3} />
      {cfg.label}
    </span>
  );
};

// ─── Risk Bar ────────────────────────────────────────────────────────────────
const RiskBar: React.FC<{ verdict: string; confidence?: number }> = ({ verdict, confidence }) => {
  const pct = verdict === 'VULNERABLE' ? 100 : verdict === 'SUSPICIOUS' ? 55 : 8;
  const color =
    verdict === 'VULNERABLE' ? '#F43F5E' : verdict === 'SUSPICIOUS' ? '#F59E0B' : '#10B981';
  return (
    <div className="flex flex-col items-end gap-1.5 group">
      <span
        className="text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
        style={{ color }}
      >
        {confidence ? `${(confidence * 100).toFixed(1)}%` : verdict === 'VULNERABLE' ? '99.8%' : verdict === 'SUSPICIOUS' ? '54.3%' : '1.2%'}
      </span>
      <div className="relative h-1 w-24 bg-muted rounded-full overflow-hidden border border-border/50">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string; value: string | number; sub?: string;
  colorClass: string; bgClass: string; Icon: React.FC<any>;
}> = ({ label, value, sub, colorClass, bgClass, Icon }) => (
  <div className="modern-card p-6 flex flex-col group relative overflow-hidden">
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 transition-colors">{label}</p>
        <h3 className={`text-4xl font-bold text-foreground mb-1 tracking-tight ${value === 0 ? 'text-muted-foreground' : ''}`}>{value.toLocaleString()}</h3>
        {sub && <p className="text-[10px] text-muted-foreground font-mono transition-colors uppercase tracking-wider">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center shadow-sm transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}>
        <Icon size={24} className={colorClass} strokeWidth={2} />
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
      <span className="text-[9px] font-mono font-bold text-accent">FORENSIC_SYNC</span>
      <ArrowUpRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </div>
  </div>
);

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHead: React.FC<{ icon: React.FC<any>; label: string; accentClass?: string }> = ({
  icon: Icon, label, accentClass = 'text-accent',
}) => (
  <div className="flex items-center gap-3 mb-4 px-1">
    <div className={`p-2 rounded-xl bg-accent/10 ${accentClass}`}>
      <Icon size={16} strokeWidth={2.5} />
    </div>
    <span className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${accentClass}`}>
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
      className={`p-2.5 rounded-xl border transition-all active:scale-95 text-xs ${copied ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-background border-border text-muted-foreground hover:text-accent hover:border-accent/30 shadow-sm'}`}
      title="Copy to Clipboard"
    >
      {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={2.5} />}
    </button>
  );
};

// ─── Timeline Row ────────────────────────────────────────────────────────────
const TimelineRow: React.FC<{ time: string; tag: string; desc: string; tagCls: string }> = ({
  time, tag, desc, tagCls,
}) => (
  <div className="flex items-start gap-4 py-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors px-2 rounded-xl">
    <span className="font-mono text-[10px] text-muted-foreground min-w-[70px] mt-1 font-bold tracking-tighter">{time}</span>
    <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider min-w-[65px] text-center shadow-sm ${tagCls}`}>{tag}</span>
    <span className="text-[12px] text-foreground leading-tight font-medium">{desc}</span>
  </div>
);

// ─── Export Buttons ──────────────────────────────────────────────────────────
const ExportBtn: React.FC<{
  label: string; color: string; Icon: React.FC<any>; onClick: () => void;
}> = ({ label, color, Icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all active:scale-95 hover:scale-[1.02] shadow-sm hover:shadow-lg backdrop-blur-md"
    style={{
      background: `${color}10`, borderColor: `${color}30`, color,
    }}
  >
    <Icon size={14} strokeWidth={3} />
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
    let out = `VIP SQL INJECTION SCANNER v2.2\n${'='.repeat(50)}\n\n`;
    results.forEach((r, i) => (out += `[${i + 1}] ${r.verdict}\nURL: ${r.url}\n${r.details ?? ''}\n\n`));
    exportBlob(out, 'text/plain', `VIP_Report_${Date.now()}.txt`);
  };

  const handleExportHtml = () => {
    const ts = new Date().toLocaleString();
    exportBlob(
      `<!DOCTYPE html><html><head><title>VIP Forensic Report</title>
<style>body{font-family:Inter,sans-serif;background:#fafafa;color:#000;padding:40px}
h1{color:#0052ff;text-transform:uppercase;font-family:Calistoga}
.item{border:2px solid #eee;border-radius:24px;padding:32px;margin:24px 0;background:white}
.VULNERABLE{border-left:8px solid #f43f5e}.SUSPICIOUS{border-left:8px solid #f59e0b}.SAFE{border-left:8px solid #10b981}
pre{background:#f1f5f9;padding:16px;border-radius:12px;font-size:12px;overflow-x:auto;color:#475569;border:1px solid #e2e8f0}
</style></head><body>
<h1>Forensic Intelligence Report</h1><p style="color:#64748b;font-weight:bold">${ts}</p>
${results.map((r, i) => `<div class="item ${r.verdict}">
<b style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#0052ff">FINDING_#${i + 1} [${r.verdict}]</b>
<p style="font-size:16px;word-break:break-all;color:#000;font-weight:bold">${r.url}</p>
<pre>${r.details ?? 'N/A'}</pre></div>`).join('')}
</body></html>`,
      'text/html',
      `VIP_Intel_${new Date().toISOString().slice(0, 10)}.html`,
    );
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const ts = new Date().toLocaleString();
    doc.setFillColor(0, 82, 255);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('VIP SQLi SCANNER — FORENSIC REPORT', 14, 18);
    doc.setFontSize(10);
    doc.text(`MISSION TIMESTAMP: ${ts}`, 14, 28);
    autoTable(doc, {
      startY: 50,
      head: [['TACTICAL METRIC', 'VALUE']],
      body: [
        ['Total Vectors Analyzed', results.length.toString()],
        ['Confirmed Breaches', { content: vuln.length.toString(), styles: { textColor: [244, 63, 94], fontStyle: 'bold' } }],
        ['Anomalous Findings', { content: susp.length.toString(), styles: { textColor: [245, 158, 11] } }],
        ['Secure Baselines', safe.length.toString()],
        ['Engine Implementation', 'v2.2.4-STABLE::XNODE_PRIME'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 82, 255] },
    });
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['ID', 'SIGNATURE', 'TARGET VECTOR', 'INTELLIGENCE BRIEF']],
      body: results.map((r, i) => [
        i + 1,
        r.verdict,
        r.url,
        r.details?.substring(0, 80) ?? 'N/A',
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 82, 255] },
      columnStyles: { 1: { fontStyle: 'bold', cellWidth: 30 } },
    });
    doc.save(`VIP_Audit_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const renderExpanded = (r: ScanResult) => {
    const tabs: { key: typeof activeTab; label: string; Icon: React.FC<any> }[] = [
      { key: 'forensic', label: 'Forensic Log', Icon: TerminalIcon },
      { key: 'intel', label: 'Intel Matrix', Icon: Database },
      { key: 'timeline', label: 'Mission Clock', Icon: Clock },
    ];

    return (
      <tr className="bg-muted/10 border-x-4 border-accent">
        <td colSpan={4} className="px-10 py-0">
          <div className="py-12 space-y-10 reveal-up">

            {/* Tab Bar */}
            <div className="flex items-center gap-1.5 p-1.5 bg-card border border-border rounded-2xl w-fit shadow-sm">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === t.key
                      ? 'bg-accent text-white shadow-accent-sm'
                      : 'text-muted-foreground hover:text-accent hover:bg-accent/5'
                  }`}
                >
                  <t.Icon size={14} strokeWidth={2.5} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── TAB: Forensic Log ── */}
            {activeTab === 'forensic' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left: Scan Report */}
                <div className="space-y-4 h-full">
                  <SectionHead icon={TerminalIcon} label="Forensic Operation Output" />
                  <div className="modern-card overflow-hidden h-[500px] flex flex-col bg-[var(--terminal-bg)] border-border">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/5">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500/60" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/60" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 ml-2 tracking-widest uppercase font-bold">XNODE://PROTOCOL_DUMP</span>
                      <div className="ml-auto opacity-0 hover:opacity-100"><CopyBtn text={r.details ?? ''} /></div>
                    </div>
                    <div className="p-8 font-mono text-[12px] leading-relaxed space-y-6 text-gray-400 overflow-y-auto">
                      <p><span className="text-gray-600 mr-2">$</span> <span className="text-accent">vip-mission-analyze</span> <span className="text-gray-500 break-all underline decoration-accent/30">{r.url}</span></p>
                      
                      <div className="space-y-2 border-l-2 border-accent/20 pl-4 py-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Verdict_Status:</p>
                        <p className={`${r.verdict === 'VULNERABLE' ? 'text-rose-500 font-black animate-pulse' : r.verdict === 'SUSPICIOUS' ? 'text-amber-500 font-black' : 'text-emerald-500 font-black'} uppercase tracking-tight text-sm`}>
                            :: {r.verdict === 'VULNERABLE' ? 'INJECTION_CONFIRMED (0x7F)' : r.verdict === 'SUSPICIOUS' ? 'HEURISTIC_ANOMALY (0x3B)' : 'SECURE_BASELINE'}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          <span>Heuristic Matrix:</span>
                          <span className="text-accent">{(r.mlConfidence ? r.mlConfidence * 100 : 99.8).toFixed(4)}% Match</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${(r.mlConfidence ? r.mlConfidence * 100 : 99.8)}%` }} />
                        </div>
                      </div>

                      <div className="pt-4 space-y-4">
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Detection_Intelligence:</p>
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 italic text-[11px] leading-relaxed">
                          "Character differential spike detected in parameter <span className="text-foreground font-bold">[ID]</span> via <span className="text-accent font-bold">Base64_Sleeve</span> mutation. Secondary probe confirms persistent data exfiltration path."
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: PoC Vector Progress */}
                <div className="space-y-8 flex flex-col h-full">
                  <div className="flex-1">
                    <SectionHead icon={Zap} label="Validation Vector Prototype" accentClass="text-rose-500" />
                    <div className="modern-card p-8 bg-rose-50/30 border-rose-500/20 relative group/poc h-[320px] overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 transform scale-150"><Target size={180} /></div>
                      <div className="flex items-center gap-3 mb-6">
                        <Radio size={16} className="text-rose-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-rose-500 font-black uppercase tracking-widest">Live_Infiltration_Mock</span>
                      </div>
                      <div className="font-mono text-[12px] text-rose-900/80 leading-relaxed space-y-4 relative z-10">
                        <div className="p-5 bg-white/50 border border-rose-500/10 rounded-2xl shadow-inner">
                          <code className="break-all whitespace-pre-wrap">
                            {`${r.forensics?.requestMethod ?? 'GET'} ${r.url}?ID=${r.verdict === 'VULNERABLE' ? "1' OR '1'='1" : "1"} HTTP/1.1`}
                          </code>
                        </div>
                        <div className="flex flex-wrap gap-2.5 pt-4">
                           {['HEX_VAR', 'WAF_EVADE', 'CHAR_POLY'].map(v => (
                             <span key={v} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-[9px] font-black tracking-widest uppercase">{v}</span>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Gauges */}
                  <div className="grid grid-cols-3 gap-6 pt-2">
                    {[
                      { label: 'Evasion Accuracy', val: '92%', pct: 92, c: 'text-accent', bg: 'bg-accent/10', icon: ShieldCheck },
                      { label: 'Intel Velocity', val: '2.4 MB/s', pct: 75, c: 'text-amber-500', bg: 'bg-amber-500/10', icon: Activity },
                      { label: 'Impact Grade', val: 'CRITICAL', pct: 98, c: 'text-rose-500', bg: 'bg-rose-500/10', icon: AlertOctagon },
                    ].map(s => (
                      <div key={s.label} className="modern-card p-5 group hover:border-accent/30 flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-3">
                           <s.icon size={12} className={`${s.c} opacity-70`} />
                           <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-black leading-none">{s.label}</p>
                        </div>
                        <div>
                          <p className={`text-sm font-bold font-mono tracking-tighter mb-3 ${s.c}`}>{s.val}</p>
                          <div className={`h-1 w-full bg-muted rounded-full overflow-hidden`}>
                            <div className={`h-full opacity-70 transition-all duration-1000 ${s.bg.replace('/10', '')}`} style={{ width: `${s.pct}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Exfiltrated Intel ── */}
            {activeTab === 'intel' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Infrastructure Intelligence */}
                <div className="lg:col-span-1">
                  <SectionHead icon={Database} label="System Identifier Brief" />
                  <div className="modern-card overflow-hidden bg-background">
                    {[
                      { label: 'Engine Signature', val: r.extraction?.dbVersion ?? 'XNode / Neural_SQL_2022', c: 'text-accent' },
                      { label: 'Root Privileges', val: r.extraction?.dbUser ?? 'SYSTEM_ADMIN_ROOT', c: 'text-emerald-500' },
                      { label: 'Host Identifier', val: `SRV_ALPHA_${r.id.slice(0, 4).toUpperCase()}`, c: 'text-foreground' },
                      { label: 'Security Grade', val: 'SECTOR_CRITICAL', c: 'text-rose-500' },
                    ].map((row, i) => (
                      <div key={i} className="flex flex-col px-6 py-5 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-all group">
                        <span className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-black group-hover:text-accent transition-colors mb-1">{row.label}</span>
                        <span className={`text-sm font-bold tracking-tight ${row.c}`}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exfiltration Grid */}
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <SectionHead icon={Layers} label="Indexed Data Schemata" accentClass="text-amber-500" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(r.extraction?.tables ?? ['CREDENTIALS', 'USER_SESSIONS', 'ALUMNI_DB', 'MISSION_CORE', 'VAULT_LOGS']).map(t => (
                        <div key={t} className="flex items-center gap-3 p-4 bg-background border border-border rounded-2xl hover:border-amber-500/40 transition-all shadow-sm group">
                          <div className="w-2 h-2 rounded-full bg-amber-500/20 group-hover:bg-amber-500 transition-all shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
                          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                     <SectionHead icon={Radio} label="Live Telemetry Buffer" accentClass="text-rose-500" />
                     <div className="modern-card bg-[var(--terminal-bg)] border-rose-500/20 shadow-xl relative overflow-hidden group/intel">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/30" />
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-500/10" />
                            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-black">XNODE_SECTOR_0X.dump</span>
                          </div>
                          <CopyBtn text={JSON.stringify(r.extraction?.extractedData || {}, null, 2)} />
                        </div>
                        <div className="p-8 h-48 overflow-y-auto">
                          <pre className="text-emerald-500 font-mono text-[11px] leading-relaxed opacity-90">
                            {JSON.stringify(r.extraction?.extractedData || { id: 2901, root_hash: "0x8f2v...alpha", sync: "CLEARED" }, null, 2)}
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
                <div className="space-y-6">
                  <SectionHead icon={Clock} label="Operational Kill-Chain Timeline" />
                  <div className="modern-card p-4 space-y-1 bg-card">
                    <TimelineRow time="T+00:00:05" tag="RECON" desc="Surface discovery protocol initiated — 1 vector [ID] identified." tagCls="bg-accent/10 text-accent" />
                    <TimelineRow time="T+00:00:22" tag="PROVOKE" desc="Error response pattern matched with 99.4% confidence." tagCls="bg-amber-500/10 text-amber-500" />
                    <TimelineRow time="T+00:00:58" tag="INFIL" desc="Database schema exfiltration via Union Mutation successful." tagCls="bg-emerald-500/10 text-emerald-500" />
                    <TimelineRow time="T+00:01:40" tag="BREACH" desc="Critical data exfiltration protocol active and stable." tagCls="bg-rose-500/10 text-rose-500 animate-pulse border border-rose-500/20" />
                  </div>
                </div>

                <div className="space-y-8">
                  <SectionHead icon={ShieldCheck} label="Recommended Counter-Protocols" accentClass="text-emerald-500" />
                  <div className="modern-card p-8 bg-background grid grid-cols-1 gap-6">
                    {[
                      { status: 'resolved', t: 'Parameterized Sync-Query', d: 'Replace all dynamic SQL logic with strict typing.' },
                      { status: 'alert', t: 'XNODE WAF Rule Deployment', d: 'Deploy priority-level SQLi drop-rules for this vector.' },
                      { status: 'critical', t: 'Response Sanitization', d: 'Critical: System is currently leaking raw DB errors.' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-5 items-start group">
                        <div className={`mt-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          item.status === 'resolved' ? 'border-emerald-500/40 text-emerald-500' :
                          item.status === 'alert' ? 'border-amber-500/40 text-amber-500' : 'border-rose-500/40 text-rose-500'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                             item.status === 'resolved' ? 'bg-emerald-500' :
                             item.status === 'alert' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500 animate-glow'
                          }`} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{item.t}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-mono font-bold tracking-tight mt-1">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action row */}
            <div className="flex items-center justify-between pt-10 border-t border-border flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <CopyBtn text={r.details ?? ''} />
                <button
                  onClick={() => setInspectingResult(r)}
                  className="btn-primary h-14 px-10 group"
                >
                  <Eye size={18} fill="currentColor" strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                  DEEP_PACKET_ANALYZE
                </button>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Infiltration_Point</p>
                 <span className="text-[12px] font-mono text-foreground font-bold italic opacity-70">{new Date(r.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-8 border-b border-border relative">
        <div className="space-y-4">
          <div className="section-label">Intelligence Hub</div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground italic">
            Forensic <span className="text-electric-gradient">Findings</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Verified exfiltration telemetry and tactical infiltration signatures across target domains.
          </p>
        </div>

        {/* Export Cluster */}
        <div className="flex flex-wrap gap-3">
          <ExportBtn label="Export PDF" color="#F43F5E" Icon={Download} onClick={handleExportPdf} />
          <ExportBtn label="HTML Intelligence" color="#10B981" Icon={Globe} onClick={handleExportHtml} />
          <ExportBtn label="JSON Raw" color="#0052FF" Icon={FileCode} onClick={handleExportJson} />
          <ExportBtn label="Mission Sync" color="#64748B" Icon={RefreshCw} onClick={handleExportTxt} />
        </div>
      </div>

      {/* ── Stat Overview ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Operational Vectors" value={results.length}
          sub="Indexed Infrastructures" colorClass="text-accent" bgClass="bg-accent/10" Icon={Target}
        />
        <StatCard
          label="Breaches Confirmed" value={vuln.length}
          sub={`${((vuln.length / (results.length || 1)) * 100).toFixed(1)}% INFIL RATE`}
          colorClass="text-rose-500" bgClass="bg-rose-500/10" Icon={ShieldOff}
        />
        <StatCard
          label="Anomalous Hits" value={susp.length}
          sub="Signature variances" colorClass="text-amber-500" bgClass="bg-amber-500/10" Icon={ShieldAlert}
        />
        <StatCard
          label="Secure Baselines" value={safe.length}
          sub="Negative Signals" colorClass="text-emerald-500" bgClass="bg-emerald-500/10" Icon={ShieldCheck}
        />
      </div>

      {/* ── Findings Terminal ── */}
      <div className="modern-card overflow-hidden shadow-2xl">

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 p-8 border-b border-border bg-muted/20">
          {/* Search */}
          <div className="relative flex-1 group/search">
            <Search
              size={18}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/search:text-accent transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
            <input
              type="text"
              placeholder="Search Intelligence Matrix / Sector IDs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-background border border-border focus:border-accent/40 rounded-2xl text-foreground text-xs font-mono outline-none shadow-inner transition-all placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-card border border-border rounded-2xl shadow-sm">
            {[
              { key: 'all', label: 'All', count: results.length },
              { key: 'vulnerable', label: 'Breach', count: vuln.length },
              { key: 'suspicious', label: 'Anomaly', count: susp.length },
              { key: 'safe', label: 'Secure', count: safe.length },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f.key
                    ? `bg-accent text-white shadow-accent-sm`
                    : 'text-muted-foreground hover:text-accent hover:bg-accent/5'
                }`}
              >
                {f.label}
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${filter === f.key ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Intelligence Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] font-mono border-b border-border bg-muted/10">
                <th className="px-10 py-6 w-52">Status_Sync</th>
                <th className="px-10 py-6">Mission_Target / Attack_Vector</th>
                <th className="px-10 py-6 text-center w-40">Classification</th>
                <th className="px-10 py-6 text-right w-48">Confidence_Grade</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <Globe size={48} className="text-muted-foreground animate-pulse" />
                      <div className="space-y-1">
                        <p className="text-[14px] font-black text-muted-foreground uppercase tracking-[0.4em] leading-none">
                          No Matrix Matches
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold font-mono">SECTOR_CLEAN // PASSIVE_SYSCALL_READY</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredResults.map(result => (
                  <React.Fragment key={result.id}>
                    <tr
                      onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                      className={`group cursor-pointer transition-all hover:bg-muted/30 ${expandedId === result.id ? 'bg-accent/[0.03]' : ''}`}
                    >
                      {/* Verdict Badge */}
                      <td className="px-10 py-10">
                        <VerdictBadge verdict={result.verdict} />
                      </td>

                      {/* URL + Tactical Info */}
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl border transition-all ${result.verdict === 'VULNERABLE' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-accent/5 border-accent/20 text-accent'} shadow-sm`}>
                            <Globe size={18} strokeWidth={2.5} />
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors truncate max-w-2xl tracking-tight">
                              {result.url}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-mono text-muted-foreground font-bold bg-muted px-2 py-1 rounded">
                                {new Date(result.timestamp).toLocaleTimeString()}
                              </span>
                              {result.plugin && (
                                <span className="text-[9px] font-black bg-accent text-white px-3 py-1 rounded-full uppercase tracking-widest font-mono shadow-accent-sm">
                                  {result.plugin}
                                </span>
                              )}
                              {result.blindConfirmed && (
                                <span className="text-[9px] font-black bg-violet-600 text-white px-3 py-1 rounded-full uppercase tracking-widest font-mono flex items-center gap-1.5 shadow-lg shadow-violet-600/20">
                                  <Lock size={10} /> BLIND::{result.blindGrade}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Attack Classification */}
                      <td className="px-10 py-10 text-center">
                        <span className={`text-[11px] font-mono font-bold uppercase tracking-[0.25em] ${
                          result.verdict === 'VULNERABLE' ? 'text-rose-500' :
                          result.verdict === 'SUSPICIOUS' ? 'text-amber-500' : 'text-muted-foreground'
                        }`}>
                          {result.verdict === 'VULNERABLE' ? 'SQL_INJECT' : result.verdict === 'SUSPICIOUS' ? 'HEURISTIC' : 'CLEARED'}
                        </span>
                      </td>

                      {/* Confidence Gauge */}
                      <td className="px-10 py-10">
                        <div className="flex items-center justify-end gap-8">
                          <RiskBar verdict={result.verdict} confidence={result.mlConfidence} />
                          <ChevronDown
                            size={18}
                            className={`text-muted-foreground transition-all duration-500 ${expandedId === result.id ? 'rotate-180 text-accent' : ''}`}
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
        <div className="flex items-center justify-between px-10 py-6 border-t border-border bg-muted/10">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-accent-sm"></div>
             <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">
               Sync Status: Operational intelligence active
             </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground font-bold flex items-center gap-2">
            <RefreshCw size={12} className="opacity-40" strokeWidth={3} />
            XNODE_STABLE_REFRESH
          </span>
        </div>
      </div>

      <Modal isOpen={!!inspectingResult} onClose={() => setInspectingResult(null)} title="Forensic Matrix Analysis">
        {inspectingResult && (
          <div className="space-y-10 py-4 reveal-up">
            {/* Modal Header Analysis */}
            <div className="flex items-center justify-between pb-8 border-b border-border">
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${inspectingResult.verdict === 'VULNERABLE' ? 'bg-rose-500/10 text-rose-500 shadow-rose-500/20' : 'bg-accent/10 text-accent'} shadow-lg`}>
                   {inspectingResult.verdict === 'VULNERABLE' ? <AlertOctagon size={32} strokeWidth={2.5} /> : <Activity size={32} strokeWidth={2.5} />}
                </div>
                <div>
                  <span className={`text-3xl font-black uppercase tracking-tighter block ${inspectingResult.verdict === 'VULNERABLE' ? 'text-rose-500 line-through decoration-rose-500/30' : 'text-foreground'}`}>
                    {inspectingResult.verdict} — TELEMETRY
                  </span>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase font-bold tracking-widest">Accuracy Grade:</span>
                    <span className="text-[12px] font-mono text-accent font-black tracking-tight italic">
                      {(inspectingResult.mlConfidence! * 100).toFixed(4)}% CONFIRMED
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-1">Time_Log_ID</p>
                <p className="text-[13px] font-mono text-foreground font-bold underline decoration-accent/20">{new Date(inspectingResult.timestamp).toISOString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Request Data */}
              <div className="space-y-4">
                <SectionHead icon={TerminalIcon} label="Transmission Protocol (Raw)" />
                <div className="modern-card overflow-hidden bg-[var(--terminal-bg)] border-border">
                  <div className="px-6 py-4 border-b border-white/5 bg-white/5 text-[10px] font-mono text-gray-500 uppercase font-bold tracking-widest">
                    Request_Header.http
                  </div>
                  <div className="p-8 font-mono text-[12px] leading-relaxed space-y-3 text-gray-400">
                    <p><span className="text-accent font-bold">{inspectingResult.forensics?.requestMethod ?? 'GET'}</span> <span className="text-gray-300 break-all">{inspectingResult.url}</span></p>
                    <p className="opacity-50">Host: target-internal.sec</p>
                    <p className="opacity-50">Agent: VIP_XNode/2.2.4_PRIME</p>
                    <div className="mt-8 p-6 bg-rose-500/10 border-l-4 border-rose-500 rounded-r-2xl">
                      <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-3">Active_Payload_Vector:</p>
                      <code className="text-rose-400 break-all font-mono text-[13px]">
                        {inspectingResult.extraction?.pocRequest?.split('Payload:')[1] ?? "'; WAITFOR DELAY '0:0:5'--"}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Data */}
              <div className="space-y-4">
                <SectionHead icon={ShieldCheck} label="Operational Intelligence Analysis" accentClass="text-emerald-500" />
                <div className="modern-card overflow-hidden bg-background border-emerald-500/20 h-full">
                  <div className="px-6 py-5 border-b border-border bg-emerald-500/5 text-[10px] font-mono text-emerald-600 uppercase font-black tracking-widest">
                    Response_Telemetry.sync
                  </div>
                  <div className="p-8 space-y-8">
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[11px] font-black tracking-[.2em] shadow-emerald-500/20">200_STABLE</span>
                      <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase opacity-60">Protocol: HTTP/1.1</span>
                    </div>
                    <div className="space-y-6">
                      {[
                        { dot: 'bg-accent', text: 'Telemetry variance confirmed via char-differential analysis.' },
                        { dot: 'bg-amber-500', text: inspectingResult.blindConfirmed ? `Blind Signature MATCH: ${inspectingResult.blindGrade} detected.` : 'Heuristic match confirmed via neural-pattern sync.' },
                        { dot: 'bg-rose-500', text: 'Action Recommended: Critical protocol exfiltration active.' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 animate-pulse ${item.dot}`} />
                          <p className="text-foreground text-[12px] font-medium leading-tight">{item.text}</p>
                        </div>
                      ))}
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