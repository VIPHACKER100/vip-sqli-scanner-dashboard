import React, { useState } from 'react';
import { 
  Database, Share2, Globe, Server, Check, Shield, Terminal, Search, Cpu, Zap, 
  Activity, Info, BarChart3, Fingerprint, ToggleRight, Radio, ShieldCheck, 
  ArrowUpRight, Layers, Hexagon, Search as SearchIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { PAYLOADS } from '../services/payloads';
import { ScannerSettings } from '../types';

interface PluginsProps {
    settings: ScannerSettings;
    setSettings: (settings: ScannerSettings) => void;
    theme: 'light' | 'dark';
}

const PluginCard = ({ name, version, desc, active, onToggle, icon: Icon, stats, colorClass }: any) => (
    <div className={`modern-card group p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 ${active ? 'border-accent/40 bg-accent/[0.02]' : ''}`}>
        {active && (
          <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
            <Icon size={140} />
          </div>
        )}

        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className={`p-4 rounded-2xl border transition-all duration-500 shadow-sm ${active ? `bg-accent text-white border-accent shadow-accent-sm` : 'bg-background-alt border-border text-muted-foreground'}`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-end gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={active} onChange={onToggle} />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:shadow-sm after:transition-all peer-checked:after:translate-x-5 transition-colors"></div>
                </label>
            </div>
        </div>

        <div className="space-y-8 relative z-10">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h3 className={`font-display text-xl transition-colors italic ${active ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>{name}</h3>
                    <span className="text-[9px] font-black text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border uppercase tracking-widest leading-none">
                      {version || 'V2.2'}
                    </span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed font-medium transition-colors line-clamp-2">
                  {desc}
                </p>
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Efficiency</p>
                    <p className={`text-lg font-mono font-bold tracking-tighter ${active ? 'text-accent' : 'text-muted-foreground opacity-40'}`}>
                      {active ? stats.success : '0.0%'}
                    </p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Heuristic Δ</p>
                    <p className={`text-lg font-mono font-bold tracking-tighter ${active ? 'text-foreground' : 'text-muted-foreground opacity-40'}`}>
                      {active ? stats.latency : '0ms'}
                    </p>
                </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${active ? 'bg-accent w-full animate-pulse' : 'bg-muted-foreground/10 w-0'}`} />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-opacity ${active ? 'text-emerald-500' : 'opacity-0'}`}>
                  LIVE_SYNC
                </span>
            </div>
        </div>
    </div>
);

const Plugins: React.FC<PluginsProps> = ({ settings, setSettings, theme }) => {
    const isDark = theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    const labelColor = isDark ? '#94A3B8' : '#64748B';
    const tooltipBg = 'var(--card-elevated)';
    const tooltipBorder = 'var(--border)';
    const [searchTerm, setSearchTerm] = useState('');
    const totalPayloads = Object.values(PAYLOADS).reduce((acc, curr) => acc + curr.length, 0);

    const radarData = [
        { subject: 'Stealth', A: 120, B: 110, fullMark: 150 },
        { subject: 'Precision', A: 130, B: 130, fullMark: 150 },
        { subject: 'Velocity', A: 86, B: 130, fullMark: 150 },
        { subject: 'Bypass', A: 99, B: 100, fullMark: 150 },
        { subject: 'ML_Conf', A: 85, B: 90, fullMark: 150 },
        { subject: 'Exfil', A: 65, B: 85, fullMark: 150 },
    ];

    const handleTogglePlugin = (key: keyof ScannerSettings['enabledPlugins']) => {
        setSettings({
            ...settings,
            enabledPlugins: {
                ...settings.enabledPlugins,
                [key]: !settings.enabledPlugins[key]
            }
        });
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-border relative">
              <div className="space-y-4">
                <div className="section-label">Intelligence Network</div>
                <h2 className="font-display text-5xl md:text-6xl text-foreground italic">
                  Intelligence <span className="text-electric-gradient">Modules</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                    Deploy specialized telemetry units for deep infrastructure fingerprinting and polymorphic injection validation.
                </p>
              </div>
              
              <div className="flex items-center gap-5 bg-background-alt px-8 py-5 rounded-3xl border border-border shadow-sm group">
                <Fingerprint size={24} className="text-accent group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Active Matrix</span>
                  <span className="text-sm font-mono text-foreground font-black tracking-tighter">
                    {Object.values(settings.enabledPlugins).filter(Boolean).length} / 4 UNITS DEPLOYED
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <PluginCard
                    name="GraphQL Intel"
                    desc="Schematic metadata hijacking and deep-nested injection vectors."
                    active={settings.enabledPlugins.graphql}
                    onToggle={() => handleTogglePlugin('graphql')}
                    icon={Share2}
                    colorClass="text-accent"
                    stats={{ success: '94.2%', latency: '112ms' }}
                />
                <PluginCard
                    name="NoSQLi Hunt"
                    desc="BSON operator fuzzing and session logic bypass for document stores."
                    active={settings.enabledPlugins.nosql}
                    onToggle={() => handleTogglePlugin('nosql')}
                    icon={Database}
                    colorClass="text-accent"
                    stats={{ success: '88.7%', latency: '145ms' }}
                />
                <PluginCard
                    name="WAF Stealth"
                    desc="Polymorphic encoding and fragmentation for IDS/WAF bypass."
                    active={settings.enabledPlugins.waf}
                    onToggle={() => handleTogglePlugin('waf')}
                    icon={Shield}
                    colorClass="text-accent"
                    stats={{ success: '91.0%', latency: '24ms' }}
                />
                <PluginCard
                    name="LDAP Forge"
                    desc="Experimental directory filter forge for enterprise infrastructure."
                    version="v0.9A-EXP"
                    active={settings.enabledPlugins.ldap}
                    onToggle={() => handleTogglePlugin('ldap')}
                    icon={Server}
                    colorClass="text-accent"
                    stats={{ success: '65.4%', latency: '310ms' }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                <div className="lg:col-span-2 modern-card p-10 group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
                      <BarChart3 size={240} />
                    </div>
                    
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <h3 className="font-display text-2xl text-foreground italic flex items-center gap-4">
                                <div className="p-3 bg-accent/10 text-accent rounded-2xl border border-accent/20 shadow-sm">
                                  <Activity size={20} strokeWidth={2.5} />
                                </div>
                                Extraction Precision Matrix
                            </h3>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] mt-3 opacity-60">
                              Heuristic Baseline vs Active Deployment
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2.5 px-4 py-2 bg-background border border-border rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-[#0052FF]" />
                                <span className="text-[9px] font-mono text-muted-foreground font-black uppercase">LEGACY</span>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-2 bg-accent/5 border border-accent/20 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-accent-sm" />
                                <span className="text-[9px] font-mono text-accent font-black uppercase">V2.2_XNODE</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-85 relative z-10 flex items-center justify-center py-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke={gridColor} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: labelColor, fontSize: 10, fontWeight: '900', letterSpacing: '0.1em' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Legacy" dataKey="A" stroke="var(--border-strong)" fill="var(--muted)" fillOpacity={0.1} strokeWidth={2} />
                                <Radar name="V2.2" dataKey="B" stroke="#0052FF" fill="#0052FF" fillOpacity={0.15} strokeWidth={4} />
                                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '1.25rem', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="modern-card p-10 flex flex-col justify-between group transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
                    <div className="space-y-12">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 shadow-sm relative overflow-hidden group-hover:scale-110 transition-transform">
                                <div className="absolute inset-0 bg-rose-500/5 animate-pulse" />
                                <Zap size={24} strokeWidth={2.5} className="relative z-10" />
                            </div>
                            <div>
                                <h3 className="font-display text-2xl text-foreground italic">Signature DB</h3>
                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">Encrypted Payload Cache</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-4">Unit Integrity</p>
                                <div className="flex items-end justify-between mb-3">
                                    <div className="flex items-baseline gap-2">
                                      <p className="text-5xl font-bold text-foreground tracking-tighter font-mono">{totalPayloads.toLocaleString()}</p>
                                      <span className="text-[10px] font-black text-muted-foreground uppercase">Vectors</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">SECURED_0x1</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-background border border-border rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-accent rounded-full w-[98.4%] shadow-accent-sm transition-all duration-2000" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Zero-Day Hits</p>
                                    <p className="text-2xl font-bold text-foreground font-mono tracking-tighter">412</p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last Update</p>
                                    <p className="text-2xl font-bold text-accent font-mono tracking-tighter italic">2M_AGO</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="btn-primary w-full h-18 mt-12 group">
                        <Activity size={18} fill="currentColor" strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                        SYNCHRONIZE_MATRIX
                    </button>
                </div>
            </div>

            <div className="modern-card p-12 shadow-2xl relative overflow-hidden group border-t-4 border-t-accent">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 pointer-events-none">
                  <Terminal size={220} />
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-12 relative z-10">
                    <div className="space-y-4">
                        <h3 className="font-display text-3xl text-foreground italic flex items-center gap-5">
                            <Database size={28} className="text-accent" strokeWidth={2.5} />
                            Elite Extraction Matrix
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed font-medium">
                          The v2.2 extraction core employs multi-threaded asynchronous tunneling. Upon validation of an injection vector, the engine fingerprints the target environment and establishes a persistent intelligence feed across Sector 0x9.
                        </p>
                    </div>
                    
                    <div className="relative w-full lg:w-105 group/search">
                        <SearchIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/search:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="OPERATIONAL VECTOR SEARCH..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border text-foreground text-xs font-mono font-bold rounded-2xl pl-14 pr-6 py-4.5 focus:border-accent/40 outline-none transition-all tracking-widest shadow-sm placeholder:text-muted-foreground/30"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {Object.keys(PAYLOADS).filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 12).map((cat) => (
                        <div key={cat} className="p-6 bg-background-alt/50 border border-border rounded-2xl hover:border-accent/30 hover:bg-background transition-all cursor-default shadow-sm group/item">
                            <div className="flex justify-between items-center mb-5">
                                <span className="text-[10px] font-black text-muted-foreground group-hover/item:text-accent transition-colors uppercase tracking-widest">{cat}</span>
                                <div className="text-[9px] font-mono font-black text-foreground bg-accent/10 px-2 py-0.5 rounded border border-accent/20">{PAYLOADS[cat].length}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-accent/40 group-hover/item:bg-accent transition-all duration-700 shadow-accent-sm" style={{ width: `${Math.min(100, (PAYLOADS[cat].length / 50) * 100)}%` }}></div>
                                </div>
                                <span className="text-[9px] font-black text-muted-foreground uppercase opacity-40">
                                  {(Math.min(100, (PAYLOADS[cat].length / 50) * 100)).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    ))}
                    {Object.keys(PAYLOADS).filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <div className="col-span-full py-24 flex flex-col items-center gap-6 opacity-20">
                            <Hexagon size={48} strokeWidth={1.5} className="animate-spin-slow" />
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] font-mono text-center">
                              No specialized vectors identified in sector query.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Plugins;