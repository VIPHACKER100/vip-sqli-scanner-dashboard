import React, { useState, useRef } from 'react';
import { ScanConfig, Page } from '../types';
import { Play, Sliders, Zap, Info, HelpCircle, Gauge, Globe, Terminal, Shield, Network, FileUp, Target, Command, Cpu } from 'lucide-react';

interface NewScanProps {
  onStartScan: (config: ScanConfig) => void;
  setPage: (page: Page) => void;
}

const HelpTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex ml-2 align-middle">
    <HelpCircle size={14} className="text-muted-foreground hover:text-accent cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-foreground text-background border border-border rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
      <p className="text-[11px] leading-relaxed font-bold uppercase tracking-tight">{text}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[6px] border-transparent border-t-foreground"></div>
    </div>
  </div>
);

const ConfigCard = ({ title, icon: Icon, children, colorClass }: any) => (
  <div className="modern-card group flex flex-col h-full">
    <div className="p-5 border-b border-border/50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-accent/10 transition-transform group-hover:scale-110 ${colorClass || 'text-accent'}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <h3 className="font-bold text-foreground text-sm uppercase tracking-tight">{title}</h3>
      </div>
      <div className="flex gap-1.5 opacity-20">
        <div className="w-1 h-1 rounded-full bg-foreground"></div>
        <div className="w-1 h-1 rounded-full bg-foreground"></div>
      </div>
    </div>
    <div className="p-6 flex-1">
      {children}
    </div>
  </div>
);

const NewScan: React.FC<NewScanProps> = ({ onStartScan, setPage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [config, setConfig] = useState<ScanConfig>({
    targetUrls: '',
    method: 'GET',
    requestBody: '',
    profile: 'balanced',
    useML: true,
    usePlugins: true,
    useFuzzing: false,
    fuzzConfig: {
      enabled: false,
      vectors: ['GET', 'POST'],
      strategy: 'smart',
      payloadMutation: true,
      encodingVariants: true,
      maxDepth: 3,
      maxPayloadsPerParam: 10
    },
    threads: 5
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const currentUrls = config.targetUrls.trim();
          setConfig(prev => ({
            ...prev,
            targetUrls: currentUrls ? `${currentUrls}\n${content.trim()}` : content.trim()
          }));
        }
      };
      reader.readAsText(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const currentUrls = config.targetUrls.trim();
          setConfig(prev => ({
            ...prev,
            targetUrls: currentUrls ? `${currentUrls}\n${content.trim()}` : content.trim()
          }));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.targetUrls) return;
    onStartScan(config);
    setPage(Page.DASHBOARD);
  };

  const getThreadDescription = (threads: number) => {
    if (threads <= 3) return { text: "Tactical Stealth", color: "text-emerald-500" };
    if (threads <= 10) return { text: "Balanced Precision", color: "text-accent" };
    return { text: "Aggressive Saturation", color: "text-rose-500" };
  };

  const threadDesc = getThreadDescription(config.threads);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
        <div className="space-y-4">
          <div className="section-label">Deployment Phase</div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground max-w-2xl leading-[1.1]">
            Infiltrate New <span className="text-electric-gradient italic">Vectors</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Configure the VIP-Engine for deep protocol analysis and vulnerability discovery across target domains.
          </p>
        </div>

        <div className="modern-card p-4 flex flex-wrap gap-2 max-w-lg bg-background-alt border-dashed">
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] block w-full mb-2 ml-1">Pre-Configured Operations</span>
          {[
            { name: 'POST API Sync', url: 'https://api.vulnerable.com/v1/auth', method: 'POST', body: '{"username": "admin", "password": "password"}' },
            { name: 'Standard SQLi', url: 'https://vulnerable-sqli.com/api.php?id=1', method: 'GET', body: '' },
            { name: 'Matrix Discovery', url: 'https://pentest-target.io/search?q=test&sort=id&page=1\nhttps://internal-api.secure/v2/users/auth', method: 'GET', body: '' },
          ].map(preset => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                const current = config.targetUrls.trim();
                setConfig({
                  ...config,
                  targetUrls: current ? `${current}\n${preset.url}` : preset.url,
                  method: preset.method as any,
                  requestBody: preset.body
                });
              }}
              className="px-3 py-1.5 bg-background hover:bg-accent/10 border border-border rounded-xl text-[10px] font-bold text-muted-foreground hover:text-accent transition-all uppercase tracking-tight"
            >
              + {preset.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-background hover:bg-accent/10 border border-border rounded-xl text-[10px] font-bold text-muted-foreground hover:text-accent transition-all uppercase tracking-tight flex items-center gap-1.5"
          >
            <FileUp size={12} />
            CSV/TXT Load
          </button>
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".txt"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ConfigCard title="Target Intelligence Hub" icon={Target} colorClass="text-accent">
              <div className="relative h-full">
                <div className="absolute top-5 left-5 pointer-events-none">
                  <Terminal size={20} className="text-accent opacity-30" />
                </div>
                <textarea
                  className={`w-full h-80 bg-background border-2 rounded-3xl p-8 pl-16 text-foreground focus:border-accent/40 focus:ring-8 focus:ring-accent/5 outline-none font-mono text-xs leading-relaxed transition-all resize-none shadow-inner ${isDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-border'}`}
                  placeholder="Enter target vectors (One per line)...&#10;example: https://target.io/v1/users?id=100"
                  value={config.targetUrls}
                  onChange={(e) => setConfig({ ...config, targetUrls: e.target.value })}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  required
                />
                <div className="absolute bottom-6 right-8 flex items-center gap-3 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                  <Cpu size={14} className="text-accent" />
                  <span>VIP-Engine Baseline Active</span>
                </div>
              </div>
            </ConfigCard>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ConfigCard title="Protocol Selection" icon={Network} colorClass="text-violet-500">
              <div className="space-y-8">
                <div>
                  <label className="label-mono mb-4">HTTP Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['GET', 'POST', 'PUT'].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setConfig({ ...config, method: m as any })}
                        className={`py-3 rounded-2xl border font-mono text-xs font-bold transition-all ${config.method === m ? 'bg-accent text-white border-accent shadow-accent-sm' : 'bg-background border-border text-muted-foreground hover:border-accent/30'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {config.method !== 'GET' && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="label-mono mb-4">JSON Matrix Template</label>
                    <textarea
                      className="w-full h-32 bg-background border border-border rounded-2xl p-5 text-foreground focus:border-accent/40 outline-none font-mono text-[11px] transition-all shadow-inner"
                      placeholder='{ "username": "admin" }'
                      value={config.requestBody}
                      onChange={(e) => setConfig({ ...config, requestBody: e.target.value })}
                    />
                    <p className="text-[9px] text-muted-foreground mt-3 font-mono font-bold uppercase tracking-tight italic">Define schema for automated parameter mutation.</p>
                  </div>
                )}
              </div>
            </ConfigCard>

            <div className="modern-card p-6 border-dashed border-accent/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Shield size={20} />
                </div>
                <div>
                  <span className="font-bold text-sm block">Proxy Bridge</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">Status: Isolated</span>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 pulsing-dot" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ConfigCard title="Mission Profile" icon={Sliders} colorClass="text-accent">
            <div className="space-y-4">
              {[
                { id: 'stealth', label: 'Tactical Stealth', desc: 'Minimal footprint, WAF evasion active', color: 'border-emerald-500/30' },
                { id: 'balanced', label: 'Balanced Pulse', desc: 'Standard frequency and depth', color: 'border-accent/30' },
                { id: 'aggressive', label: 'Full Saturation', desc: 'Fast, comprehensive saturation', color: 'border-rose-500/30' }
              ].map((p) => (
                <label key={p.id} className={`flex items-start gap-5 p-6 rounded-3xl border-2 cursor-pointer transition-all duration-500 relative group/item ${config.profile === p.id ? 'bg-accent/5 border-accent shadow-accent-sm' : `bg-card border-border hover:border-accent/30 hf-glass-hover`}`}>
                  <div className="pt-1">
                    <input
                      type="radio"
                      name="profile"
                      value={p.id}
                      checked={config.profile === p.id}
                      onChange={(e) => setConfig({ ...config, profile: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${config.profile === p.id ? 'border-accent bg-accent' : 'border-border'}`}>
                      {config.profile === p.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </div>
                  <div>
                    <span className={`block font-bold text-base tracking-tight ${config.profile === p.id ? 'text-foreground' : 'text-muted-foreground'}`}>{p.label}</span>
                    <span className="block text-[10px] text-muted-foreground mt-1.5 uppercase font-mono font-bold tracking-tight">{p.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </ConfigCard>

          <ConfigCard title="Engine Sync" icon={Zap} colorClass="text-amber-500">
            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-background-alt rounded-3xl border border-border group/opt transition-all hover:border-accent/30">
                <div className="space-y-1.5">
                  <span className="font-bold text-sm text-foreground flex items-center gap-3">
                    Neural Heuristics
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-accent text-white tracking-widest uppercase">ML_V4</span>
                  </span>
                  <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-tight">Adaptive filter bypass logic</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config.useML}
                    onChange={(e) => setConfig({ ...config, useML: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-6 bg-background-alt rounded-3xl border border-border group/opt transition-all hover:border-accent/30">
                <div className="space-y-1.5">
                  <span className="font-bold text-sm text-foreground">Advanced Plugin Matrix</span>
                  <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-tight">Activates GQL, NoSQL sub-routers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config.usePlugins}
                    onChange={(e) => setConfig({ ...config, usePlugins: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="flex justify-between items-end mb-6">
                  <label className="label-mono flex items-center gap-3">
                    <Gauge size={16} className="text-accent" />
                    Concurrency Velocity
                  </label>
                  <div className="text-right">
                    <span className="text-3xl font-display font-bold text-foreground leading-none">{config.threads}</span>
                    <span className={`block text-[9px] font-black uppercase tracking-[0.2em] ${threadDesc.color} mt-2`}>{threadDesc.text}</span>
                  </div>
                </div>
                <div className="relative group/slider px-2">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={config.threads}
                    onChange={(e) => setConfig({ ...config, threads: parseInt(e.target.value) })}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-4 uppercase font-bold tracking-widest">
                    <span>MIN_LIMIT</span>
                    <span>MAX_SATURATION</span>
                  </div>
                </div>
              </div>
            </div>
          </ConfigCard>
        </div>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            className="btn-primary px-16 h-20 shadow-accent-lg group"
          >
            <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" strokeWidth={2.5} />
            <span className="text-lg font-display italic">Deploy Protocol</span>
          </button>
        </div>
      </form >
    </div >
  );
};

export default NewScan;