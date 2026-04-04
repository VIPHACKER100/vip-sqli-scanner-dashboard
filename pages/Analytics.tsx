import React from 'react';
import { ScanResult, ScanStats } from '../types';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, ScatterChart, Scatter, ZAxis, AreaChart, Area
} from 'recharts';
import { 
  ShieldCheck, AlertTriangle, Target, Activity, Cpu, Zap, BarChart3, TrendingUp, 
  Fingerprint, Network, ArrowUpRight, Globe, Layers, Database
} from 'lucide-react';

interface AnalyticsProps {
    results: ScanResult[];
    stats: ScanStats;
    theme: 'light' | 'dark';
}

const AnalyticsCard = ({ title, children, icon: Icon, subtitle, accentClass = 'text-accent' }: any) => (
    <div className="modern-card group p-10 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
            <Icon size={140} />
        </div>
        <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
                <h3 className="font-display text-xl text-foreground italic flex items-center gap-4">
                    <div className={`p-3 bg-background border border-border rounded-2xl shadow-sm transition-all group-hover:border-accent/30 ${accentClass}`}>
                        <Icon size={20} strokeWidth={2} />
                    </div>
                    {title}
                </h3>
                {subtitle && <p className="text-[9px] font-black text-muted-foreground uppercase mt-3 tracking-[0.2em] opacity-60">{subtitle}</p>}
            </div>
            <div className="flex gap-2 opacity-10">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-foreground" />)}
            </div>
        </div>
        <div className="h-80 relative z-10">
            {children}
        </div>
    </div>
);

const Analytics: React.FC<AnalyticsProps> = ({ results, stats, theme }) => {
    const isDark = theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    const labelColor = isDark ? '#94A3B8' : '#64748B';
    const tooltipBg = 'var(--card-elevated)';
    const tooltipBorder = 'var(--border)';
    const dotStroke = 'var(--card)';

    // Process Data for Vulnerability Distribution
    const vulnerabilityTypes: Record<string, number> = {};
    results.filter(r => r.verdict === 'VULNERABLE').forEach(r => {
        const type = r.details?.split('[')[1]?.split(']')[0] || 'Unknown';
        vulnerabilityTypes[type] = (vulnerabilityTypes[type] || 0) + 1;
    });

    const typeData = Object.keys(vulnerabilityTypes).map(name => ({
        name,
        value: vulnerabilityTypes[name]
    })).sort((a, b) => b.value - a.value);

    // Process ML Confidence Trend
    const mlTrend = results
        .filter(r => r.mlConfidence)
        .slice(-12)
        .map((r, i) => ({
            index: i + 1,
            confidence: (r.mlConfidence! * 100).toFixed(1),
            val: r.mlConfidence
        }));

    // Process Precision Stats
    const avgML = results.filter(r => r.mlConfidence).reduce((acc, r) => acc + r.mlConfidence!, 0) / (results.filter(r => r.mlConfidence).length || 1);
    const successRate = stats.total > 0 ? (stats.vulnerable / stats.total) * 100 : 0;

    const COLORS = ['#0052FF', '#10B981', '#F43F5E', '#F59E0B', '#8B5CF6'];

    return (
        <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-border relative">
              <div className="space-y-4">
                <div className="section-label">Technical Intelligence</div>
                <h2 className="font-display text-5xl md:text-6xl text-foreground italic">
                  Intelligence <span className="text-electric-gradient">Analytics</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                    Deep-sector technical metrics, vulnerability distribution landscape, and neural baseline accuracy trends.
                </p>
              </div>
              
              <div className="flex items-center gap-12">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Engine Precision</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground font-mono tracking-tighter">{(avgML * 100).toFixed(2)}</span>
                    <span className="text-[10px] font-black text-accent uppercase">%</span>
                  </div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Breach Ratio</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-accent font-mono tracking-tighter">{successRate.toFixed(1)}</span>
                    <span className="text-[10px] font-black text-accent uppercase">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <AnalyticsCard title="Vector Distribution" subtitle="Active injection signature hits" icon={Zap} accentClass="text-accent">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={typeData.length > 0 ? typeData : [{ name: 'SAFE', value: 1 }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={110}
                                paddingAngle={6}
                                dataKey="value"
                                stroke="none"
                            >
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                {typeData.length === 0 && <Cell fill="#f1f5f9" />}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '1.25rem', boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)', border: '1px solid var(--border)' }}
                                itemStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
                            />
                            <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '9px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.2em', color: 'var(--muted-foreground)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                <AnalyticsCard title="Confidence Baseline" subtitle="Neural Network Accuracy Trend" icon={Cpu} accentClass="text-emerald-500">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mlTrend}>
                            <defs>
                                <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0052FF" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis dataKey="index" stroke={labelColor} fontSize={9} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke={labelColor} fontSize={9} tickLine={false} axisLine={false} domain={[90, 100]} dx={-10} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '1.25rem', boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)' }}
                              itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="confidence" stroke="#0052FF" strokeWidth={5} fillOpacity={1} fill="url(#colorConf)" dot={{ r: 5, fill: '#0052FF', strokeWidth: 3, stroke: dotStroke }} activeDot={{ r: 7, strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                <div className="lg:col-span-2">
                    <AnalyticsCard title="Sector Exposure Map" subtitle="Infrastructure Risk Intensity Analysis" icon={Target} accentClass="text-rose-500">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={results.slice(0, 24).map((r, i) => ({
                                name: `T-${i + 1}`,
                                risk: r.verdict === 'VULNERABLE' ? 100 : (r.verdict === 'SUSPICIOUS' ? 55 : 12),
                                id: r.id,
                                verdict: r.verdict
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="name" stroke={labelColor} fontSize={9} tickLine={false} axisLine={false} dy={12} fontStyle="bold" />
                                <YAxis stroke={labelColor} fontSize={9} tickLine={false} axisLine={false} hide />
                                <Tooltip
                                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '1.25rem', boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="risk" radius={[10, 10, 0, 0]} barSize={24}>
                                    {results.slice(0, 24).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.verdict === 'VULNERABLE' ? '#F43F5E' : (entry.verdict === 'SUSPICIOUS' ? '#F59E0B' : '#0052FF')}
                                            fillOpacity={0.8}
                                            className="hover:fill-opacity-100 transition-all duration-300"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </AnalyticsCard>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { title: "Coverage Baseline", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "8,200+ active signatures. Zero-day heuristic coverage established for high-integrity missions." },
                    { title: "Exfiltration Load", icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10", desc: "High-value breach proximity detected. Adjusting fuzzing velocity for maximum technical data harvest." },
                    { title: "Node Persistence", icon: Network, color: "text-accent", bg: "bg-accent/10", desc: "Real-time extraction tunnels established. Persistent intelligence cached in localized Instance 0x3F." }
                ].map((item, i) => (
                    <div key={i} className="modern-card p-10 group hover:border-accent/30 transition-all relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:scale-110 transition-transform pointer-events-none">
                            <item.icon size={120} />
                        </div>
                        <div className="flex items-center gap-5 relative z-10 mb-8">
                            <div className={`p-3.5 rounded-2xl border border-border shadow-sm group-hover:border-accent/20 ${item.color} ${item.bg}`}>
                                <item.icon size={22} strokeWidth={2.5} />
                            </div>
                            <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.25em] font-mono">{item.title}</h4>
                        </div>
                        <p className="text-[13px] text-muted-foreground leading-relaxed font-medium group-hover:text-foreground transition-colors relative z-10">
                            {item.desc}
                        </p>
                        <div className="mt-8 pt-8 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                          <span className="text-[9px] font-mono font-bold text-accent">SYNC_LAYER_0{i+1}</span>
                          <ArrowUpRight size={14} className="text-muted-foreground" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Tactical Heatmap Representation */}
            <div className="modern-card p-16 relative overflow-hidden group shadow-2xl flex flex-col items-center border-t-4 border-t-accent bg-background-alt/50">
                <div className="absolute inset-0 dot-pattern opacity-[0.03] pointer-events-none" />
                
                <div className="text-center space-y-6 mb-12 relative z-10">
                    <div className="flex items-center justify-center gap-5">
                        <Fingerprint className="text-accent" size={32} strokeWidth={2.5} />
                        <h3 className="font-display text-3xl text-foreground italic uppercase">Mission Intensity Map</h3>
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] font-mono">
                      Real-time Sector Risk Distribution // 2.2.4-STABLE
                    </p>
                </div>
                
                <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-2.5 w-full max-w-4xl relative z-10">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-lg border transition-all duration-700 hover:scale-125 hover:z-20 hover:shadow-xl ${
                              i % 11 === 0 ? 'bg-rose-500 border-rose-600 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)]' :
                              i % 13 === 0 ? 'bg-amber-500 border-amber-600' :
                              i % 7 === 0 ? 'bg-accent border-accent/80' :
                              'bg-background border-border shadow-sm'
                            }`}
                        />
                    ))}
                </div>
                
                <div className="mt-12 flex items-center gap-10 opacity-40">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Critical Breach</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Active Vector</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-background border border-border" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Secure Node</span>
                  </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
