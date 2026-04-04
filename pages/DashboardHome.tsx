import React from 'react';
import { ScanStats, ScanResult } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Activity, CheckCircle, AlertTriangle, ShieldCheck, Cpu, Target, Network, FileSearch, Terminal, Database, Globe, ArrowUpRight } from 'lucide-react';

interface DashboardHomeProps {
  stats: ScanStats;
  scanHistory: any[];
  results: ScanResult[];
  theme: 'light' | 'dark';
}

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, subtext }: any) => (
  <div className="modern-card p-6 group relative overflow-hidden">
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 transition-colors">{title}</p>
        <h3 className="text-4xl font-bold text-foreground mb-1 tracking-tight">{value.toLocaleString()}</h3>
        {subtext && <p className="text-[10px] text-muted-foreground font-mono transition-colors uppercase tracking-wider">{subtext}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center text-accent shadow-sm transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}>
        <Icon size={24} className={colorClass} strokeWidth={2} />
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
      <span className="text-[9px] font-mono font-bold text-accent">OPERATIONAL</span>
      <ArrowUpRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </div>
  </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ stats, scanHistory, results, theme }) => {
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
  const labelColor = isDark ? '#94A3B8' : '#64748B';
  const tooltipBg = 'var(--card-elevated)';
  const tooltipBorder = 'var(--border)';
  const progress = stats.total > 0 ? (stats.processed / stats.total) * 100 : 0;
  const isScanning = stats.total > 0 && stats.processed < stats.total;
  const vulnerableResults = results.filter(r => r.verdict === 'VULNERABLE').slice(0, 4);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
        <div className="space-y-4">
          <div className="section-label">Command Center</div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground max-w-2xl leading-[1.1]">
            Mission <span className="text-electric-gradient italic">Intelligence</span> Hub
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Real-time tactical metrics and high-value exfiltration telemetry for active protocol execution.
          </p>
        </div>
        
        {isScanning && (
          <div className="flex items-center gap-5 bg-accent/5 border border-accent/20 px-6 py-4 rounded-2xl shadow-accent-sm backdrop-blur-md">
            <div className="pulsing-dot" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-accent tracking-[0.2em] uppercase block">Mission Phase: Active</span>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-32 bg-accent/10 rounded-full overflow-hidden border border-accent/10">
                  <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs font-mono font-bold text-foreground">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Target Vectors" value={stats.total} subtext={`${stats.processed} Processed`} icon={Target} colorClass="text-accent" bgClass="bg-accent/10" />
        <StatCard title="System Cleared" value={stats.safe} subtext="Negative Signals" icon={ShieldCheck} colorClass="text-emerald-500" bgClass="bg-emerald-500/10" />
        <StatCard title="Breaches Active" value={stats.vulnerable} subtext="Critical Findings" icon={AlertTriangle} colorClass="text-rose-500" bgClass="bg-rose-500/10" />
        <StatCard title="ML Anomalies" value={stats.suspicious} subtext="Signature Hits" icon={Activity} colorClass="text-violet-500" bgClass="bg-violet-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Section */}
          <div className="modern-card p-8">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">Operations Timeline</h3>
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Real-time detection velocity baseline</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Stable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent pulse-fast" />
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Critical</span>
                </div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scanHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVulnDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSafeDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="time" stroke={labelColor} fontSize={10} tickLine={false} axisLine={false} dy={10} fontStyle="italic" />
                  <YAxis stroke={labelColor} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBg, 
                      borderColor: tooltipBorder, 
                      borderRadius: '1rem', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      fontWeight: '700'
                    }} 
                  />
                  <Area type="monotone" dataKey="vulnerable" stroke="#0052FF" strokeWidth={4} fill="url(#colorVulnDash)" animationDuration={2000} />
                  <Area type="monotone" dataKey="safe" stroke="#10B981" strokeWidth={3} fill="url(#colorSafeDash)" strokeDasharray="6 6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Intelligence Feed */}
          <div className="modern-card overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <Terminal size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Critical Intelligence Matrix</h3>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">High-value breach telemetry</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest pulsing-dot">Active</span>
              </div>
            </div>
            <div className="p-6">
              {vulnerableResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vulnerableResults.map((vuln) => (
                    <div key={vuln.id} className="group p-4 bg-card border border-border rounded-2xl hover:border-accent/40 transition-all flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                          <ShieldCheck size={16} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-rose-500">EXFILTRATED</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-mono font-bold text-foreground truncate">{vuln.url}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Heuristic Sync</span>
                          <span className="text-[9px] font-mono text-accent font-bold">{(vuln.mlConfidence! * 100).toFixed(1)}% Match</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <AlertTriangle size={32} />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Passive Monitoring Active :: No Critical Hits</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Engineering precision */}
          <div className="modern-card p-8 flex flex-col group relative overflow-hidden h-[420px]">
            <div className="absolute -right-10 -top-10 text-accent opacity-5 group-hover:scale-125 transition-transform duration-1000">
              <Cpu size={240} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-10 flex items-center gap-3 relative z-10 font-display italic">
              <Cpu size={18} className="text-accent" />
              Telemetric Precision
            </h3>
            <div className="space-y-8 flex-1 flex flex-col justify-center relative z-10">
              {[
                { label: "Engine Throughput", value: isScanning ? 88 : 0, color: "bg-accent", icon: Activity },
                { label: "WAF Evasion Mean", value: isScanning ? 94 : 100, color: "bg-emerald-500", icon: Globe },
                { label: "ML Signal Sync", value: isScanning ? 91 : 0, color: "bg-violet-500", icon: Cpu },
                { label: "Storage Capacity", value: 42, color: "bg-amber-500", icon: Database }
              ].map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <item.icon size={12} className="text-accent" />
                      {item.label}
                    </span>
                    <span className="text-foreground font-bold">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out shadow-accent-sm`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-6 border-t border-border flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-accent pulsing-dot' : 'bg-muted'}`} />
                <span className="text-[10px] font-mono font-bold text-foreground">{isScanning ? 'MISSION_ACTIVE' : 'READY_STANDBY'}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono font-bold">07:24:12</span>
            </div>
          </div>

          {/* Node Explorer */}
          <div className="modern-card p-8">
            <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3 font-display italic">
              <Target size={18} className="text-rose-500" />
              Vector Intelligence Map
            </h3>
            <div className="grid grid-cols-4 gap-3 h-32 mb-10">
              {Array.from({ length: 12 }).map((_, i) => {
                const isNodeVuln = results[i]?.verdict === 'VULNERABLE';
                const isNodeSafe = results[i]?.verdict === 'SAFE';
                const isNodeLoading = !results[i] && isScanning && i < stats.processed + 2;

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl border-2 transition-all duration-500 relative group/node ${
                      isNodeVuln ? 'bg-rose-500/10 border-rose-500 shadow-md shadow-rose-500/20 pulse-fast' :
                      isNodeSafe ? 'bg-emerald-500/5 border-emerald-500/30' :
                      isNodeLoading ? 'bg-accent/5 border-accent/20 animate-pulse' :
                      'bg-card border-border'
                    }`}
                  >
                    {results[i] && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-mono font-bold rounded-lg opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none shadow-xl">
                        {results[i].url}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { subject: 'Stealth', A: 120, fullMark: 150 },
                  { subject: 'Precision', A: 130, fullMark: 150 },
                  { subject: 'Bypass', A: 140, fullMark: 150 },
                  { subject: 'Velocity', A: 90, fullMark: 150 },
                  { subject: 'Extraction', A: 110, fullMark: 150 },
                ]}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: labelColor, fontSize: 9, fontWeight: '800' }} />
                  <Radar name="Engine" dataKey="A" stroke="#0052FF" fill="#0052FF" fillOpacity={0.1} strokeWidth={3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button
            onClick={() => (window as any).setPage('new_scan')}
            className="btn-primary w-full h-16 shadow-accent-lg"
          >
            <Target size={20} fill="currentColor" />
            Infiltrate New Vector
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;