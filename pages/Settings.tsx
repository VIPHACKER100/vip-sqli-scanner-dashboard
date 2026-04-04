import React, { useState, useRef } from 'react';
import { 
  Save, Bell, Cloud, Database, Cpu, Globe, Shield, Terminal, Zap, Fingerprint, Lock, 
  ShieldAlert, Sliders, RefreshCw, CheckCircle, XCircle, Upload, Download,
  ArrowRight, Key, Gauge, Activity, Radio, Layers, Eye, Trash2, Hexagon
} from 'lucide-react';
import { ScannerSettings } from '../types';

interface SettingsProps {
  settings: ScannerSettings;
  setSettings: (settings: ScannerSettings) => void;
}

// ─── Settings Card Wrapper ───────────────────────────────────────────────────
const SettingsCard = ({ title, icon: Icon, children, colorClass, subtitle }: any) => (
  <div className="modern-card group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
    <div className="p-8 border-b border-border bg-muted/20 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className={`p-3.5 rounded-2xl bg-background border border-border group-hover:scale-110 transition-transform shadow-sm group-hover:border-accent/30 ${colorClass}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-display text-xl text-foreground italic">{title}</h3>
          {subtitle && (
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-60">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-1.5 opacity-10">
        {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-foreground" />)}
      </div>
    </div>
    <div className="p-10 relative z-10">
      {children}
    </div>
  </div>
);

// ─── Component Start ────────────────────────────────────────────────────────
const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const [newPayloadCat, setNewPayloadCat] = useState('');
  const [newPayloadVal, setNewPayloadVal] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleToggleSurface = (key: keyof ScannerSettings['surfaceCoverage']) => {
    setSettings({
      ...settings,
      surfaceCoverage: {
        ...settings.surfaceCoverage,
        [key]: !settings.surfaceCoverage[key]
      }
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPayload = () => {
    if (newPayloadCat && newPayloadVal) {
      setSettings({
        ...settings,
        customPayloads: [
          ...settings.customPayloads,
          { id: Date.now().toString(), category: newPayloadCat, payload: newPayloadVal, description: 'User added vector' }
        ]
      });
      setNewPayloadCat('');
      setNewPayloadVal('');
    }
  };

  const handleExportPayloads = () => {
    const data = JSON.stringify(settings.customPayloads, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VIP_Payloads_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPayloads = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        let imported: { id: string; category: string; payload: string; description: string }[] = [];
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            imported = parsed.map((p: any, i: number) => ({
              id: Date.now().toString() + i,
              category: p.category || 'Imported',
              payload: p.payload || String(p),
              description: p.description || 'Imported vector'
            }));
          }
        } else {
          imported = text.split('\n').filter(l => l.trim()).map((line, i) => ({
            id: Date.now().toString() + i,
            category: 'Imported',
            payload: line.trim(),
            description: 'Imported from .txt'
          }));
        }
        const existing = new Set(settings.customPayloads.map(p => p.payload));
        const newOnes = imported.filter(p => !existing.has(p.payload));
        setSettings({ ...settings, customPayloads: [...settings.customPayloads, ...newOnes] });
      } catch {
        alert('Failed to parse import file. Ensure it is valid JSON or TXT format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleFinalize = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-border relative">
        <div className="space-y-4">
          <div className="section-label">System Control</div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground italic">
            Engine <span className="text-electric-gradient">Calibration</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Configure the VIP-XNode core parameters, infiltration telemetry, and mission-critical exfiltration protocols.
          </p>
        </div>
        
        <div className="flex items-center gap-5 bg-background-alt px-8 py-5 rounded-3xl border border-border shadow-sm group">
          <Fingerprint size={24} className="text-accent group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Instance_Identity</span>
            <span className="text-sm font-mono text-foreground font-black tracking-tighter">0x3F_D4_A2_9B</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        <div className="space-y-10">
          {/* Scanner Tuning */}
          <SettingsCard title="Scanner Core" subtitle="Advanced Engine Tuning" icon={Cpu} colorClass="text-accent">
            <div className="space-y-10">
              
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Engine Execution Mode</label>
                <div className="flex bg-background-alt p-1.5 rounded-2xl border border-border shadow-inner">
                  <button 
                    onClick={() => setSettings({ ...settings, scannerMode: 'mock' })}
                    className={`flex-1 py-3.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      settings.scannerMode === 'mock' 
                        ? 'bg-accent text-white shadow-accent-sm' 
                        : 'text-muted-foreground hover:text-accent'
                    }`}
                  >
                    Simulated Intel
                  </button>
                  <button 
                    onClick={() => setSettings({ ...settings, scannerMode: 'real' })}
                    className={`flex-1 py-3.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      settings.scannerMode === 'real' 
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                        : 'text-muted-foreground hover:text-rose-600'
                    }`}
                  >
                    Forensic Live
                  </button>
                </div>
                {settings.scannerMode === 'real' && (
                  <div className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                    <ShieldAlert size={18} className="text-rose-500 shrink-0" />
                    <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wide leading-relaxed">
                      [BRIDGE_SYNC_REQUIRED] Live mode requires the XNode proxy bridge active at http://localhost:3001. Ensure internal telemetry is running.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Mission Persona (User-Agent)</label>
                <div className="relative group/input">
                  <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-accent transition-colors" size={16} />
                  <input
                    type="text"
                    aria-label="Mission Persona User Agent"
                    placeholder="User-Agent String"
                    className="w-full bg-background border border-border rounded-2xl pl-14 pr-6 py-4 text-foreground focus:border-accent/40 outline-none text-xs font-mono transition-all shadow-sm group-hover/input:border-accent/20"
                    value={settings.userAgent}
                    onChange={(e) => setSettings({ ...settings, userAgent: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Pulse Rate Limit</label>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-accent font-mono tracking-tighter">{(settings.rateLimit / 1000).toFixed(1)}</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase ml-2 tracking-widest">S/REQ</span>
                  </div>
                </div>
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    className="w-full h-1.5 bg-background border border-border rounded-full appearance-none cursor-pointer accent-accent shadow-inner"
                    value={settings.rateLimit}
                    onChange={(e) => setSettings({ ...settings, rateLimit: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between text-[9px] font-black text-muted-foreground mt-4 uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-1.5"><Zap size={10} className="text-accent" /> High_Velocity</span>
                    <span className="flex items-center gap-1.5">Sector_Stealth <Lock size={10} /></span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-10 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Surface Coverage Matrix</p>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent/40" />)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(settings.surfaceCoverage) as Array<keyof ScannerSettings['surfaceCoverage']>).map(key => (
                    <label key={key} className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 group ${settings.surfaceCoverage[key] ? 'bg-accent/5 border-accent/30 shadow-sm' : 'bg-background border-border hover:border-accent/20'}`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${settings.surfaceCoverage[key] ? 'text-accent' : 'text-muted-foreground'}`}>
                        {key.replace(/([A-Z])/g, '_$1').toUpperCase()}
                      </span>
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.surfaceCoverage[key]}
                          onChange={() => handleToggleSurface(key)}
                        />
                        <div className="w-10 h-5.5 bg-muted rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:after:translate-x-4.5 transition-colors"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* Maintenance Section (Standalone styled) */}
          <div className="modern-card p-10 bg-background-alt border-rose-500/10 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none">
              <RefreshCw size={180} />
            </div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20">
                <Trash2 size={24} strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl text-foreground italic uppercase">Mission Purge</h3>
            </div>
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest relative z-10 leading-relaxed italic max-w-md">
              Synchronize full system wipe of intelligence cache, session metadata, and instance identity. This protocol is terminal and irreversible.
            </p>
            <button
              onClick={() => (window as any).factoryReset && (window as any).factoryReset()}
              className="w-full py-5 bg-white border-2 border-rose-500/30 hover:border-rose-500 text-rose-600 font-black rounded-3xl text-[11px] uppercase tracking-[0.3em] transition-all hover:bg-rose-600 hover:text-white shadow-lg active:scale-95 relative z-10"
            >
              Exterminate All System Intelligence
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {/* Notifications */}
          <SettingsCard title="Alert Telemetry" subtitle="Mission Notification Protocol" icon={Bell} colorClass="text-amber-500">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Secured Webhook Integration</label>
                <div className="flex gap-3">
                  <div className="relative flex-1 group/input">
                    <Radio className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-accent" size={16} />
                    <input
                      type="text"
                      placeholder="https://hooks.sync.internal/v1/..."
                      value={settings.webhookUrl || ''}
                      onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                      className="w-full bg-background border border-border rounded-2xl pl-14 pr-6 py-4 text-foreground focus:border-accent/30 outline-none text-[10px] font-mono shadow-sm transition-all"
                    />
                  </div>
                  <button className="px-8 py-4 bg-background border border-border hover:border-accent/40 text-accent rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-sm">
                    Test_Link
                  </button>
                </div>
              </div>
              <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/20 flex gap-5">
                <div className="p-3 bg-amber-500/10 rounded-2xl h-fit border border-amber-500/20">
                  <ShieldAlert size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2 italic">Stealth Protocol :: Warning</p>
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">
                    External telemetry streams may leave traces in high-frequency traffic logs. Secure VPN tunnels are required for Sector 0x9 infiltration.
                  </p>
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* Cloud & Identity */}
          <SettingsCard title="Cloud Vault" subtitle="Encrypted Intelligence Sync" icon={Globe} colorClass="text-emerald-500">
            <div className="space-y-8">
               <div className="space-y-4">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Sync Node Endpoint</label>
                  <div className="relative group/input">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-accent" size={16} />
                    <input
                      type="text"
                      className="w-full bg-background border border-border rounded-2xl px-14 py-4 text-foreground text-xs font-mono outline-none focus:border-accent/30 transition-all font-bold tracking-tight shadow-sm"
                      placeholder="https://vault.viphacker.internal/api/v2"
                      value={settings.syncEndpointNode || ''}
                      onChange={(e) => setSettings({ ...settings, syncEndpointNode: e.target.value })}
                    />
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Master Vault Access Token</label>
                  <div className="relative group/input">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-accent" size={16} />
                    <input
                      type="password"
                      placeholder="SQ-HUNTER-XNODE-PRIVATE-KEY"
                      className="w-full bg-background border border-border rounded-2xl pl-14 pr-6 py-4 text-foreground text-xs font-mono outline-none shadow-sm focus:border-accent/30 transition-all"
                      value={settings.vaultToken || ''}
                      onChange={(e) => setSettings({ ...settings, vaultToken: e.target.value })}
                    />
                  </div>
               </div>
            </div>
          </SettingsCard>

          {/* Custom Payloads */}
          <SettingsCard title="Vector Lab" subtitle="User-Defined Payloads" icon={Layers} colorClass="text-accent">
            <div className="space-y-8">
              <div className="flex flex-col gap-5 p-6 bg-background-alt border border-border rounded-3xl group/lab">
                <input 
                  placeholder="Vector Category (e.g. UNION_EXCLUSIVE)" 
                  value={newPayloadCat}
                  onChange={(e) => setNewPayloadCat(e.target.value)}
                  className="bg-transparent border-b border-border/60 p-2.5 text-[11px] font-black uppercase tracking-widest outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/30"
                />
                <input 
                  placeholder="Payload String (SQL Mutation)" 
                  value={newPayloadVal}
                  onChange={(e) => setNewPayloadVal(e.target.value)}
                  className="bg-transparent border-b border-border/60 p-2.5 text-[12px] font-mono outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/30 font-bold text-foreground"
                />
                <div className="flex flex-wrap gap-3 mt-4">
                  <button 
                    onClick={handleAddPayload}
                    className="flex-1 min-w-[140px] py-4 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-accent-sm transition-all active:scale-95 hover:brightness-110"
                  >
                    Register Vector
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-4 bg-background border border-border hover:border-accent/30 text-muted-foreground hover:text-accent text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Upload size={14} /> Import
                  </button>
                  <button
                    onClick={handleExportPayloads}
                    disabled={settings.customPayloads.length === 0}
                    className="px-6 py-4 bg-background border border-border hover:border-emerald-500/30 text-muted-foreground hover:text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 shadow-sm disabled:opacity-20"
                  >
                    <Download size={14} /> Export
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.txt"
                  className="hidden"
                  onChange={handleImportPayloads}
                />
              </div>

              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-3 custom-scrollbar">
                {settings.customPayloads.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-10 opacity-20">
                    <Hexagon size={32} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No custom vectors</p>
                  </div>
                ) : (
                  settings.customPayloads.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl group/item hover:border-accent/40 shadow-sm transition-all">
                      <div className="flex flex-col overflow-hidden gap-1">
                        <span className="text-[9px] font-black text-accent uppercase tracking-widest flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-accent/40" /> {p.category}
                        </span>
                        <span className="text-[11px] font-mono text-foreground font-bold truncate max-w-[240px]">{p.payload}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSettings({
                            ...settings,
                            customPayloads: settings.customPayloads.filter(cp => cp.id !== p.id)
                          });
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl opacity-0 group-hover/item:opacity-100 transition-all border border-rose-500/10 shadow-sm"
                        title="Purge Vector"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-12 flex flex-col lg:flex-row items-center justify-between gap-12 border-t border-border bg-background relative z-20">
        <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1 leading-none">Intelligence Architecture</span>
            <span className="text-sm font-mono text-foreground font-black tracking-tighter uppercase italic">V2.2.4-STABLE::XNODE_PRIME</span>
          </div>
          <div className="hidden sm:block w-px h-10 bg-border" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1 leading-none">Synchronization Pulse</span>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <span className="text-sm font-mono text-muted-foreground font-bold tracking-tighter uppercase italic">
                Live_Sync // {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')} LOCAL
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 lg:flex-none px-8 py-4 text-muted-foreground hover:text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
          >
            Purge_Changes
          </button>
          <button 
            disabled={saveStatus !== 'idle'}
            onClick={handleFinalize}
            className={`flex-1 lg:flex-none min-w-[280px] h-18 flex items-center justify-center gap-4 px-12 font-black rounded-3xl transition-all shadow-xl active:scale-95 group relative overflow-hidden ${
              saveStatus === 'saved' ? 'bg-emerald-600 shadow-emerald-500/20 text-white' : 
              saveStatus === 'saving' ? 'bg-accent/80 text-white' : 'bg-accent hover:brightness-110 shadow-accent-sm text-white'
            }`}
          >
            {saveStatus === 'saved' ? <CheckCircle size={20} strokeWidth={3} /> : 
             saveStatus === 'saving' ? <RefreshCw size={20} strokeWidth={3} className="animate-spin" /> : 
             <Shield size={20} strokeWidth={3} />}
            <span className="text-xs uppercase tracking-[0.3em] font-black italic">
              {saveStatus === 'saved' ? 'Mission Synchronized' : 
               saveStatus === 'saving' ? 'Establishing Sync...' : 'Finalize Mission Plan'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;