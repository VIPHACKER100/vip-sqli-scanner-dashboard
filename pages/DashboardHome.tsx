import React from 'react';
import { ScanStats, ScanResult } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Activity, CheckCircle, AlertTriangle, ShieldCheck, Cpu, Target, Network, FileSearch, Terminal, Database, Globe } from 'lucide-react';

interface DashboardHomeProps {
  stats: ScanStats;
  scanHistory: any[];
  results: ScanResult[];
}

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, bgClass }: any) => (
  <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl transition-all hover:border-white/10 group relative overflow-hidden">
    <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform ${colorClass}`}>
      <Icon size={100} />
    </div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-gray-400 transition-colors font-mono">{title}</p>
        <h3 className="text-4xl font-bold text-white mb-1 tracking-tighter">{value}</h3>
        {subtext && <p className="text-[10px] text-gray-500 font-mono group-hover:text-gray-400 transition-colors uppercase tracking-widest">{subtext}</p>}
      </div>
      <div className={`p-4 rounded-2xl ${bgClass} shadow-xl transform transition-all duration-500 group-hover:rotate-6`}>
        <Icon className={`w-6 h-6 ${colorClass}`} strokeWidth={1.5} />
      </div>
    </div>
  </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ stats, scanHistory, results }) => {
  const progress = stats.total > 0 ? (stats.processed / stats.total) * 100 : 0;
  const isScanning = stats.total > 0 && stats.processed < stats.total;
  const vulnerableResults = results.filter(r => r.verdict === 'VULNERABLE').slice(0, 3);

  return (
    <div className="space-y-8 reveal-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter italic">Mission Intelligence Hub</h2>
          <p className="text-gray-400 text-sm">Real-time tactical metrics and high-value exfiltration telemetry.</p>
        </div>
        {isScanning && (
          <div className="flex items-center gap-4 bg-primary-600/10 border border-primary-500/30 px-6 py-3 rounded-2xl shadow-2xl shadow-primary-600/10 backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
            </span>
            <span className="text-[11px] font-bold text-primary-200 tracking-widest uppercase font-mono">MISSION_PHASE::ACTIVE {Math.round(progress)}%</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Target Workload" value={stats.total} subtext={`Processed: ${stats.processed}`} icon={Activity} colorClass="text-blue-400" bgClass="bg-blue-400/10" />
        <StatCard title="Defenses Solid" value={stats.safe} subtext="Negative Findings" icon={ShieldCheck} colorClass="text-green-400" bgClass="bg-green-400/10" />
        <StatCard title="Breaches Confirmed" value={stats.vulnerable} subtext="Exfiltration Active" icon={AlertTriangle} colorClass="text-red-400" bgClass="bg-red-400/10" />
        <StatCard title="Anomalous Hits" value={stats.suspicious} subtext="ML Signal Hits" icon={CheckCircle} colorClass="text-purple-400" bgClass="bg-purple-400/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Section */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={120} />
            </div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <Activity size={18} className="text-primary-500" />
                  Operations Timeline
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time detection velocity baseline</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[9px] font-mono border border-green-500/20 rounded">SAFE</span>
                <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[9px] font-mono border border-red-500/20 rounded">VULN</span>
              </div>
            </div>
            <div className="h-64 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scanHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVulnDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSafeDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#ffffff10', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} />
                  <Area type="monotone" dataKey="vulnerable" stroke="#ef4444" strokeWidth={3} fill="url(#colorVulnDash)" />
                  <Area type="monotone" dataKey="safe" stroke="#22c55e" strokeWidth={3} fill="url(#colorSafeDash)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* High-Value Intelligence Feed */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-3">
                <Terminal size={18} className="text-red-500" />
                Critical Intelligence Matrix
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[7px] font-bold text-gray-500">{i}</div>)}
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Live Exfiltration</span>
              </div>
            </div>
            <div className="p-4">
              {vulnerableResults.length > 0 ? (
                <div className="space-y-3">
                  {vulnerableResults.map((vuln) => (
                    <div key={vuln.id} className="group p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-red-500/20 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2.5 bg-red-600/10 rounded-xl border border-red-500/20 text-red-500 group-hover:scale-110 transition-transform shrink-0">
                          <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono text-primary-400 truncate mb-1">{vuln.url}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">MySQL v8.0</span>
                            <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                            <span className="text-[9px] font-mono text-green-500 uppercase">Authenticated</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-gray-600 uppercase mb-0.5 tracking-tighter">Confidence</p>
                          <p className="text-xs font-mono text-purple-400 font-bold">{(vuln.mlConfidence! * 100).toFixed(1)}%</p>
                        </div>
                        <button
                          onClick={() => (window as any).setPage('results')}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                        >
                          <FileSearch size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center opacity-40">
                  <AlertTriangle size={32} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Passive Monitoring Active :: No Critical Hits</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Tactical Statistics */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
              <Database size={120} />
            </div>
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <Cpu size={18} className="text-primary-500" />
              Telemetric Precision
            </h3>
            <div className="space-y-6 flex-1 flex flex-col justify-center relative z-10">
              {[
                { label: "Engine Throughput", value: isScanning ? 88 : 0, color: "bg-blue-500", icon: Activity },
                { label: "WAF Evasion Mean", value: isScanning ? 94 : 100, color: "bg-green-500", icon: Globe },
                { label: "ML Diff Accuracy", value: isScanning ? 91 : 0, color: "bg-purple-500", icon: Cpu },
                { label: "Extraction Load", value: isScanning ? 42 : 5, color: "bg-amber-500", icon: Database }
              ].map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.1em] text-gray-500 group-hover:text-gray-400 transition-colors">
                    <span className="flex items-center gap-2">
                      <item.icon size={12} className="text-gray-700" />
                      {item.label}
                    </span>
                    <span className="text-gray-300 font-mono tracking-tighter">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/[0.02]">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)]`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 relative z-10">
              <div>
                <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">State</p>
                <span className={`text-xs font-bold ${isScanning ? 'text-primary-400' : 'text-gray-500'} font-mono`}>{isScanning ? 'MISSION_ACTIVE' : 'READY_STANDBY'}</span>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">Uptime</p>
                <span className="text-xs text-gray-400 font-mono tracking-tighter italic">07:24:12</span>
              </div>
            </div>
          </div>

          {/* Tactical Node Explorer */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
              <Network size={120} />
            </div>
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <Target size={18} className="text-red-500" />
              Target Vector Map
            </h3>
            <div className="grid grid-cols-4 gap-3 relative z-10 h-32">
              {Array.from({ length: 12 }).map((_, i) => {
                const isNodeVuln = results[i]?.verdict === 'VULNERABLE';
                const isNodeSafe = results[i]?.verdict === 'SAFE';
                const isNodeLoading = !results[i] && isScanning && i < stats.processed + 2;

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl border transition-all duration-500 ${isNodeVuln ? 'bg-red-500/20 border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
                      isNodeSafe ? 'bg-green-500/10 border-green-500/30' :
                        isNodeLoading ? 'bg-primary-500/10 border-primary-500/30 animate-pulse' :
                          'bg-white/5 border-white/5'
                      }`}
                  ></div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-white/5 pt-8 relative z-10">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Extraction Heuristics</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: 'Stealth', A: 120, fullMark: 150 },
                    { subject: 'Precision', A: 130, fullMark: 150 },
                    { subject: 'Bypass', A: 140, fullMark: 150 },
                    { subject: 'Velocity', A: 90, fullMark: 150 },
                    { subject: 'Extraction', A: 110, fullMark: 150 },
                  ]}>
                    <PolarGrid stroke="#ffffff05" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 8, fontWeight: 'bold' }} />
                    <Radar name="Engine" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Mission Critical Call to Action */}
          <button
            onClick={() => (window as any).setPage('new_scan')}
            className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary-600/30 active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Target size={18} fill="currentColor" />
              Infiltrate New Vector
            </span>
          </button>

          {/* Live Mission Logs */}
          <div className="bg-gray-950/40 border border-white/5 rounded-[32px] p-6 shadow-inner group">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                <Terminal size={12} className="text-primary-500" />
                Mission_Log::Live
              </span>
              <div className="h-px flex-1 mx-4 bg-white/[0.03]"></div>
              <span className="text-[8px] font-mono text-gray-700 uppercase">FEED_0x3A</span>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
              {results.slice(0, 5).map((log, i) => (
                <div key={log.id} className="flex items-center justify-between text-[9px] font-mono border-b border-white/[0.02] pb-2 last:border-0 hover:bg-white/[0.02] transition-colors px-2">
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-gray-700">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={`font-bold ${log.verdict === 'VULNERABLE' ? 'text-red-500' : 'text-gray-500'}`}>
                      {log.verdict === 'VULNERABLE' ? 'CRIT::BREACH' : 'INFO::CLEARED'}
                    </span>
                    <span className="text-gray-600 truncate opacity-60">» {log.url}</span>
                  </div>
                  <span className="text-primary-500/40 font-black shrink-0">0x{log.id.slice(0, 4)}</span>
                </div>
              ))}
              {results.length === 0 && (
                <div className="py-4 text-center text-[9px] font-black text-gray-800 uppercase tracking-widest italic">
                  Waiting for Mission Deployment...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;