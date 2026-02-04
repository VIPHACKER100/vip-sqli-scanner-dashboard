import React from 'react';
import { Save, Bell, Cloud, Database, Cpu, Globe, Shield, Terminal, Zap, Fingerprint, Lock, ShieldAlert, Sliders, RefreshCw } from 'lucide-react';
import { ScannerSettings } from '../types';

interface SettingsProps {
  settings: ScannerSettings;
  setSettings: (settings: ScannerSettings) => void;
}

const SettingsCard = ({ title, icon: Icon, children, colorClass, subtitle }: any) => (
  <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/10 group relative">
    <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className={`p-3.5 rounded-2xl bg-gray-900 border border-white/10 group-hover:scale-110 transition-transform ${colorClass} shadow-xl`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg tracking-tight uppercase italic">{title}</h3>
          {subtitle && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-60">{subtitle}</p>}
        </div>
      </div>
      <div className="flex gap-1.5 opacity-20">
        {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>)}
      </div>
    </div>
    <div className="p-10 relative z-10">
      {children}
    </div>
  </div>
);

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const handleToggleSurface = (key: keyof ScannerSettings['surfaceCoverage']) => {
    setSettings({
      ...settings,
      surfaceCoverage: {
        ...settings.surfaceCoverage,
        [key]: !settings.surfaceCoverage[key]
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 reveal-up pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Engine Calibration</h2>
          <p className="text-gray-400 text-sm mt-2">Fine-tune the SQLiHunter core parameters and exfiltration telemetry units.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/[0.02] px-6 py-3 rounded-3xl border border-white/5 shadow-inner">
          <Fingerprint size={18} className="text-primary-500" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Instance_Identity</span>
            <span className="text-xs font-mono text-gray-400 font-bold">0x3F_D4_A2_9B</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          {/* Scanner Tuning */}
          <SettingsCard title="Scanner Core" subtitle="Advanced Engine Tuning" icon={Cpu} colorClass="text-primary-400">
            <div className="space-y-10">
              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 group-hover/field:text-primary-400 transition-colors">Mission Persona (User-Agent)</label>
                <div className="relative">
                  <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500/40" size={16} />
                  <input
                    type="text"
                    className="w-full bg-gray-950 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-gray-200 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none text-xs font-mono transition-all shadow-inner"
                    value={settings.userAgent}
                    onChange={(e) => setSettings({ ...settings, userAgent: e.target.value })}
                  />
                </div>
              </div>

              <div className="group/field">
                <div className="flex justify-between items-end mb-5">
                  <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] group-hover/field:text-primary-400 transition-colors">Pulse Rate Limit</label>
                  <div className="text-right">
                    <span className="text-xl font-bold text-white font-mono tracking-tighter">{(settings.rateLimit / 1000).toFixed(1)}</span>
                    <span className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">s/REQ</span>
                  </div>
                </div>
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    className="w-full h-1.5 bg-gray-950 rounded-full appearance-none cursor-pointer accent-primary-600 shadow-inner"
                    value={settings.rateLimit}
                    onChange={(e) => setSettings({ ...settings, rateLimit: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between text-[8px] font-black text-gray-700 mt-4 uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-1.5"><Zap size={10} /> Fast_Saturation</span>
                    <span className="flex items-center gap-1.5">Elite_Stealth <Lock size={10} /></span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Matrix Coverage Layer</p>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-primary-500/40"></div>)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(settings.surfaceCoverage) as Array<keyof ScannerSettings['surfaceCoverage']>).map(key => (
                    <label key={key} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 group/toggle ${settings.surfaceCoverage[key] ? 'bg-primary-500/5 border-primary-500/30' : 'bg-gray-950/40 border-white/5 hover:border-white/10'}`}>
                      <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${settings.surfaceCoverage[key] ? 'text-primary-400' : 'text-gray-500'}`}>{key.replace(/([A-Z])/g, '-$1')}</span>
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.surfaceCoverage[key]}
                          onChange={() => handleToggleSurface(key)}
                        />
                        <div className="w-8 h-4.5 bg-gray-900 rounded-full peer peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:shadow-md after:transition-all peer-checked:after:translate-x-3.5"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>

        <div className="space-y-10">
          {/* Notifications */}
          <SettingsCard title="Alert Telemetry" subtitle="Mission Notification Protocol" icon={Bell} colorClass="text-amber-400">
            <div className="space-y-8">
              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Secured Webhook Hook</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={14} />
                    <input
                      type="password"
                      value="https://hooks.slack.com/services/SQLI/HUNTER/ALERTS"
                      className="w-full bg-gray-950 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-gray-600 text-[10px] font-mono outline-none shadow-inner"
                      readOnly
                    />
                  </div>
                  <button className="px-8 py-2 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all active:scale-95 shadow-xl">Test_Line</button>
                </div>
              </div>
              <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/20 flex gap-5">
                <div className="p-3 bg-amber-500/10 rounded-2xl h-fit">
                  <ShieldAlert size={20} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 italic">Stealth Warning :: 0x8A</p>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">External exfiltration alerts may leave high-velocity breadcrumbs in ISP/DNS logs. Use of a secured proxy bridge is mandatory for production sectors.</p>
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* Cloud & Identity */}
          <SettingsCard title="Cloud Vault" subtitle="Encrypted Intelligence Sync" icon={Globe} colorClass="text-green-400">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="group/field">
                  <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Sync Endpoint Node</label>
                  <input
                    type="text"
                    className="w-full bg-gray-950 border border-white/5 rounded-2xl px-6 py-4 text-gray-200 text-xs font-mono outline-none focus:border-green-500/40 transition-all font-bold tracking-tight shadow-inner"
                    placeholder="https://vault.viphacker.internal/api/v2"
                  />
                </div>
                <div className="group/field">
                  <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Master Vault Token</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700" size={14} />
                    <input
                      type="password"
                      value="••••••••••••••••••••••••"
                      className="w-full bg-gray-950 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-gray-400 text-xs font-mono outline-none"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* Maintenance */}
          <div className="p-8 bg-red-600/5 border border-red-500/10 rounded-[40px] space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform">
              <RefreshCw size={120} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-red-600/10 rounded-2xl border border-red-500/20">
                <Shield size={20} className="text-red-500" />
              </div>
              <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">Extreme De-Sanitization</h3>
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest relative z-10 leading-loose">
              This protocol initiates a full localized wipe of the intelligence cache, session metadata, and instance identity. This mission reset is irreversible.
            </p>
            <button
              onClick={() => (window as any).factoryReset()}
              className="w-full py-5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl hover:shadow-red-600/30 active:scale-95 relative z-10"
            >
              Purge All System Intelligence
            </button>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-10 flex flex-col lg:flex-row items-center justify-between gap-10 border-t border-white/5">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Architecture</span>
            <span className="text-sm font-mono text-gray-400 font-bold tracking-tighter uppercase">V2.2.4-STABLE::XNODE</span>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Sync Status</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-sm font-mono text-gray-500 font-bold tracking-tighter uppercase italic">Live // 14:02 UTC</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none px-8 py-3 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Discard_Mission_Plan</button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-4 px-12 py-5 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-primary-600/30 active:scale-95 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Sliders size={18} className="relative z-10" />
            <span className="text-xs uppercase tracking-[0.2em] relative z-10 italic">Finalize Calibration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;