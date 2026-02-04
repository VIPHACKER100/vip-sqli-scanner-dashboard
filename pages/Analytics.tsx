import React from 'react';
import { ScanResult, ScanStats } from '../types';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, ScatterChart, Scatter, ZAxis, AreaChart, Area
} from 'recharts';
import { ShieldCheck, AlertTriangle, Target, Activity, Cpu, Zap, BarChart3, TrendingUp, Fingerprint, Network } from 'lucide-react';

interface AnalyticsProps {
    results: ScanResult[];
    stats: ScanStats;
}

const AnalyticsCard = ({ title, children, icon: Icon, subtitle }: any) => (
    <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 shadow-2xl transition-all hover:border-white/10 group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Icon size={120} />
        </div>
        <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-xl">
                        <Icon size={16} className="text-primary-500" />
                    </div>
                    {title}
                </h3>
                {subtitle && <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest">{subtitle}</p>}
            </div>
            <div className="flex gap-1.5">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>)}
            </div>
        </div>
        <div className="h-72 relative z-10">
            {children}
        </div>
    </div>
);

const Analytics: React.FC<AnalyticsProps> = ({ results, stats }) => {
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

    const COLORS = ['#3b82f6', '#a855f7', '#ef4444', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-10 reveal-up pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl font-bold text-white tracking-tighter italic uppercase">Intelligence Analytics</h2>
                    <p className="text-gray-400 text-sm mt-2">Deep-sector technical metrics and vulnerability distribution landscape.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Engine Precision</p>
                        <p className="text-2xl font-bold text-white font-mono tracking-tighter">{(avgML * 100).toFixed(2)}%</p>
                    </div>
                    <div className="h-10 w-px bg-white/10"></div>
                    <div className="flex flex-col items-end">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Breach Ratio</p>
                        <p className="text-2xl font-bold text-primary-400 font-mono tracking-tighter">{successRate.toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnalyticsCard title="Vector Distribution" subtitle="Active injection signature hits" icon={Zap}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={typeData.length > 0 ? typeData : [{ name: 'SAFE', value: 1 }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                {typeData.length === 0 && <Cell fill="#1e293b" />}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#020617', borderColor: '#ffffff10', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                <AnalyticsCard title="Confidence Baseline" subtitle="Neural Network Accuracy Trend" icon={Cpu}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mlTrend}>
                            <defs>
                                <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="index" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={[90, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#ffffff10', borderRadius: '1rem' }} />
                            <Area type="monotone" dataKey="confidence" stroke="#a855f7" strokeWidth={4} fillOpacity={1} fill="url(#colorConf)" dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#020617' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                <div className="lg:col-span-2">
                    <AnalyticsCard title="Sector Exposure Map" subtitle="Infrastructure Risk Intensity Analysis" icon={Target}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={results.slice(0, 20).map((r, i) => ({
                                name: `T-${i + 1}`,
                                risk: r.verdict === 'VULNERABLE' ? 100 : (r.verdict === 'SUSPICIOUS' ? 50 : 10),
                                id: r.id
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} hide />
                                <Tooltip
                                    cursor={{ fill: '#ffffff03' }}
                                    contentStyle={{ backgroundColor: '#020617', borderColor: '#ffffff10', borderRadius: '1rem' }}
                                />
                                <Bar dataKey="risk" radius={[8, 8, 0, 0]}>
                                    {results.slice(0, 20).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.verdict === 'VULNERABLE' ? '#ef4444' : (entry.verdict === 'SUSPICIOUS' ? '#f59e0b' : '#3b82f6')}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Coverage Baseline", icon: ShieldCheck, color: "text-green-500", desc: "7,500+ active signatures. Zero-day heuristic coverage established for high-integrity missions." },
                    { title: "Exfiltration Load", icon: TrendingUp, color: "text-red-500", desc: "High-value breach proximity detected. Adjusting fuzzing velocity for maximum technical data harvest." },
                    { title: "Node Persistence", icon: Network, color: "text-primary-500", desc: "Real-time extraction tunnels established. Persistent intelligence cached in localized Instance 0x3F." }
                ].map((item, i) => (
                    <div key={i} className="p-8 bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] space-y-6 group hover:border-white/10 transition-all relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:scale-110 transition-transform">
                            <item.icon size={100} />
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`p-3 bg-white/5 rounded-2xl border border-white/5 ${item.color}`}>
                                <item.icon size={20} />
                            </div>
                            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">{item.title}</h4>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed uppercase font-bold tracking-[0.1em] opacity-80 group-hover:opacity-100 transition-opacity">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* Tactical Heatmap Representation */}
            <div className="bg-gray-950/40 border border-white/5 rounded-[40px] p-12 relative overflow-hidden group shadow-inner flex flex-col items-center">
                <div className="text-center space-y-4 mb-10">
                    <div className="flex items-center justify-center gap-4">
                        <Fingerprint className="text-primary-500" size={24} />
                        <h3 className="text-2xl font-bold text-white italic tracking-tighter uppercase">Mission Intensity Map</h3>
                    </div>
                    <div className="h-0.5 w-32 bg-primary-500/20 mx-auto"></div>
                </div>
                <div className="grid grid-cols-10 gap-2 w-full max-w-2xl">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-md border transition-all duration-700 ${i % 7 === 0 ? 'bg-red-500/30 border-red-500/50 animate-pulse' :
                                i % 13 === 0 ? 'bg-amber-500/20 border-amber-500/30' :
                                    'bg-primary-500/10 border-white/5'
                                }`}
                        />
                    ))}
                </div>
                <p className="mt-8 text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] font-mono">Real-time Sector Risk Distribution // 2.2.4-STABLE</p>
            </div>
        </div>
    );
};

export default Analytics;
