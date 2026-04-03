import React, { useState } from 'react';
import { Database, Share2, Globe, Server, Check, Shield, Terminal, Search, Cpu, Zap, Activity, Info, BarChart3, Fingerprint } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { PAYLOADS } from '../services/payloads';
import { ScannerSettings } from '../types';

interface PluginsProps {
    settings: ScannerSettings;
    setSettings: (settings: ScannerSettings) => void;
    theme: 'light' | 'dark';
}

const PluginCard = ({ name, version, desc, active, onToggle, icon: Icon, stats, colorClass }: any) => (
    <div className={`relative overflow-hidden ${active ? 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-500/30 shadow-xl dark:shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'hf-glass'} rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] group transition-colors shadow-lg dark:shadow-2xl`}>
        {active && <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity dark:text-white"><Icon size={120} /></div>}

        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className={`p-4 rounded-2xl ${active ? `bg-primary-600/10 ${colorClass} shadow-lg shadow-primary-600/5` : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-600'} transition-all duration-500`}>
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-end gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={active} onChange={onToggle} />
                    <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none transition-all duration-500 ${active ? 'bg-primary-600 shadow-lg shadow-primary-600/30' : 'bg-slate-200 dark:bg-gray-800'} after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:shadow-md after:transition-all ${active ? 'after:translate-x-5' : ''}`}></div>
                </label>
            </div>
        </div>

        <div className="space-y-6 relative z-10">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-bold tracking-tight transition-colors ${active ? 'text-primary-900 dark:text-white' : 'text-slate-700 dark:text-gray-300'}`}>{name}</h3>
                    <span className="text-[9px] font-black text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-full border border-slate-200 dark:border-white/10 uppercase tracking-widest">{version || 'v2.2'}</span>
                </div>
                <p className="text-slate-500 dark:text-gray-400 text-[11px] leading-relaxed h-12 overflow-hidden italic transition-colors">"{desc}"</p>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-white/5 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-500 dark:text-gray-600 uppercase tracking-widest">Efficiency</p>
                    <p className={`text-lg font-mono font-bold ${active ? 'text-primary-700 dark:text-white' : 'text-slate-400 dark:text-gray-500'}`}>{active ? stats.success : '0.0%'}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-500 dark:text-gray-600 uppercase tracking-widest">Heuristic Δ</p>
                    <p className={`text-lg font-mono ${active ? 'text-slate-800 dark:text-gray-300' : 'text-slate-400 dark:text-gray-500'}`}>{active ? stats.latency : '0ms'}</p>
                </div>
            </div>

            {active && (
                <div className="pt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500/50 animate-pulse w-full"></div>
                    </div>
                    <span className="text-[8px] font-black text-green-600 dark:text-green-500 uppercase tracking-[0.2em]">Live_Sync</span>
                </div>
            )}
        </div>
    </div>
);

const Plugins: React.FC<PluginsProps> = ({ settings, setSettings, theme }) => {
    const isDark = theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const labelColor = isDark ? '#475569' : '#94a3b8';
    const tooltipBg = isDark ? '#020617' : '#ffffff';
    const tooltipBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
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
        <div className="space-y-10 reveal-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase">Intelligence Modules</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Deploy specialized telemetry units for deep infrastructure fingerprinting.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4">
                        <Fingerprint size={20} className="text-primary-500" />
                        <div>
                            <p className="text-[9px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.2em]">Active Matrix</p>
                            <p className="text-xl font-mono text-gray-900 dark:text-white font-bold">{Object.values(settings.enabledPlugins).filter(Boolean).length} / 4 UNITS</p>
                        </div>
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
                    colorClass="text-blue-400"
                    stats={{ success: '94.2%', latency: '112ms' }}
                />
                <PluginCard
                    name="NoSQLi Hunt"
                    desc="BSON operator fuzzing and session logic bypass for document stores."
                    active={settings.enabledPlugins.nosql}
                    onToggle={() => handleTogglePlugin('nosql')}
                    icon={Database}
                    colorClass="text-purple-400"
                    stats={{ success: '88.7%', latency: '145ms' }}
                />
                <PluginCard
                    name="WAF Stealth"
                    desc="Polymorphic encoding and fragmentation for IDS/WAF bypass."
                    active={settings.enabledPlugins.waf}
                    onToggle={() => handleTogglePlugin('waf')}
                    icon={Shield}
                    colorClass="text-green-400"
                    stats={{ success: '91.0%', latency: '24ms' }}
                />
                <PluginCard
                    name="LDAP Forge"
                    desc="Experimental directory filter forge for enterprise infrastructure."
                    version="v0.9A-EXP"
                    active={settings.enabledPlugins.ldap}
                    onToggle={() => handleTogglePlugin('ldap')}
                    icon={Server}
                    colorClass="text-amber-400"
                    stats={{ success: '65.4%', latency: '310ms' }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[40px] p-10 shadow-xl dark:shadow-2xl relative overflow-hidden group transition-colors">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><BarChart3 size={200} /></div>
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Activity size={20} className="text-primary-500" />
                                Extraction Precision Matrix
                            </h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Heuristic Baseline vs Active Deployment</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                <span className="text-[9px] font-mono text-primary-400 font-bold">LEGACY</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                <span className="text-[9px] font-mono text-purple-400 font-bold">V2.2_AI</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-80 relative z-10 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke={gridColor} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: labelColor, fontSize: 10, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Legacy" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                                <Radar name="V2.2" dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '1rem' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[40px] p-10 shadow-xl dark:shadow-2xl flex flex-col justify-between group transition-colors">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-red-600/10 rounded-3xl border border-red-500/20">
                                <Zap size={24} className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Signature DB</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Encrypted Payload Cache</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="relative group/val">
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Unit Integrity</p>
                                <div className="flex items-end justify-between mb-2">
                                    <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter font-mono">{totalPayloads.toLocaleString()}</p>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Secured</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/[0.02]">
                                    <div className="h-full bg-primary-500 rounded-full w-[98.4%] shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-gray-700 uppercase tracking-tighter">Zero-Day Count</p>
                                    <p className="text-lg font-mono text-white">412</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-bold text-gray-700 uppercase tracking-tighter">Last Update</p>
                                    <p className="text-lg font-mono text-gray-400">2M AGO</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-10 py-5 bg-primary-600 hover:bg-primary-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-3xl transition-all shadow-2xl shadow-primary-600/30 active:scale-95 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <Activity size={16} />
                            Synchronize Signatures
                        </span>
                    </button>
                </div>
            </div>

            <div className="hf-glass hf-glass-hover rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform"><Terminal size={180} /></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-10 relative z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                            <Database size={24} className="text-primary-600 dark:text-primary-500" />
                            Elite Extraction Matrix
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-500 mt-3 max-w-2xl leading-relaxed italic transition-colors">The v2.2 extraction core employs multi-threaded asynchronous tunneling. Upon validation of an injection vector, the engine fingerprints the target environment and establishes a persistent intelligence feed.</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-500 opacity-50">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="OPERATIONAL VECTOR SEARCH..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-gray-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-gray-200 text-xs font-mono font-bold rounded-2xl pl-14 pr-6 py-4 focus:border-primary-500/50 outline-none transition-all tracking-widest placeholder:text-slate-400 dark:placeholder:text-gray-800 shadow-inner"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {Object.keys(PAYLOADS).filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 12).map((cat) => (
                        <div key={cat} className="group/item p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] hover:border-primary-500/20 transition-all cursor-default relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black text-gray-400 group-hover/item:text-primary-400 transition-colors uppercase tracking-tight">{cat}</span>
                                <div className="text-[10px] font-mono text-gray-700 bg-black/40 px-2 py-0.5 rounded border border-white/5">{PAYLOADS[cat].length}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden p-[0.5px]">
                                    <div className="h-full bg-primary-600/30 group-hover/item:bg-primary-500 transition-all shadow-[0_0_8px_rgba(59,130,246,0.2)]" style={{ width: `${Math.min(100, (PAYLOADS[cat].length / 50) * 100)}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-800 group-hover/item:text-gray-400 transition-colors uppercase">{(Math.min(100, (PAYLOADS[cat].length / 50) * 100)).toFixed(0)}%</span>
                            </div>
                        </div>
                    ))}
                    {Object.keys(PAYLOADS).filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <div className="col-span-full py-12 flex flex-col items-center gap-4 opacity-40">
                            <Info size={32} className="text-gray-500" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em]">No specialized vectors identified for this query.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Plugins;