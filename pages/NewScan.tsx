import React, { useState } from 'react';
import { ScanConfig, Page } from '../types';
import { Play, Sliders, Zap, Info, HelpCircle, Gauge, Globe, Terminal, Shield, Network } from 'lucide-react';

interface NewScanProps {
  onStartScan: (config: ScanConfig) => void;
  setPage: (page: Page) => void;
}

const HelpTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex ml-2 align-middle">
    <HelpCircle size={14} className="text-gray-500 hover:text-primary-400 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
      <p className="text-[11px] text-gray-300 leading-relaxed font-normal normal-case text-left">{text}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[6px] border-transparent border-t-white/10"></div>
    </div>
  </div>
);

const ConfigCard = ({ title, icon: Icon, children, colorClass }: any) => (
  <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/10 group">
    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-6">
      <h3 className="font-bold text-white flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gray-900 border border-white/5 group-hover:scale-110 transition-transform ${colorClass}`}>
          <Icon size={18} />
        </div>
        {title}
      </h3>
      <div className="flex gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="w-1 h-1 rounded-full bg-white"></div>
        <div className="w-1 h-1 rounded-full bg-white"></div>
      </div>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const NewScan: React.FC<NewScanProps> = ({ onStartScan, setPage }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.targetUrls) return;
    onStartScan(config);
    setPage(Page.DASHBOARD);
  };

  const getThreadDescription = (threads: number) => {
    if (threads <= 3) return { text: "Tactical Stealth", color: "text-green-400" };
    if (threads <= 10) return { text: "Balanced Precision", color: "text-primary-400" };
    return { text: "Aggressive Saturation", color: "text-amber-400" };
  };

  const threadDesc = getThreadDescription(config.threads);

  return (
    <div className="max-w-5xl mx-auto space-y-8 reveal-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter">Infiltrate New Targets</h2>
          <p className="text-gray-300 text-sm">Deploy the SQLiHunter engine against target infrastructure.</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex flex-wrap gap-2 max-w-lg">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block w-full mb-2 ml-1">Mission Presets</span>
          {[
            { name: 'POST API', url: 'https://api.vulnerable.com/v1/auth', method: 'POST', body: '{"username": "admin", "password": "password"}' },
            { name: 'Standard SQLi', url: 'https://vulnerable-sqli.com/api.php?id=1', method: 'GET', body: '' },
            { name: 'Deep Discovery', url: 'https://pentest-target.io/search?q=test&sort=id&page=1\nhttps://internal-api.secure/v2/users/auth', method: 'GET', body: '' },
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
              className="px-3 py-1.5 bg-gray-900 hover:bg-primary-600/20 border border-white/5 hover:border-primary-500/50 rounded-xl text-[10px] font-bold text-gray-400 hover:text-primary-400 transition-all uppercase tracking-tight"
            >
              + {preset.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setConfig({ ...config, targetUrls: '', method: 'GET', requestBody: '' })}
            className="px-3 py-1.5 bg-red-600/5 hover:bg-red-600/20 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-400 transition-all uppercase tracking-tight"
          >
            Clear Hub
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ConfigCard title="Target Intelligence Hub" icon={Globe} colorClass="text-primary-400">
              <div className="relative group/field h-full">
                <div className="absolute top-4 left-4 pointer-events-none opacity-20 group-focus-within/field:opacity-40 transition-opacity">
                  <Terminal size={18} className="text-primary-500" />
                </div>
                <textarea
                  className="w-full h-48 bg-gray-950/50 border border-white/5 rounded-3xl p-6 pl-14 text-gray-200 focus:border-primary-500/30 focus:ring-4 focus:ring-primary-500/5 outline-none font-mono text-xs leading-relaxed transition-all resize-none shadow-inner"
                  placeholder="Enter target vectors (One per line)...&#10;example: https://target.io/v1/users?id=100"
                  value={config.targetUrls}
                  onChange={(e) => setConfig({ ...config, targetUrls: e.target.value })}
                  required
                />
                <div className="absolute bottom-4 right-6 flex items-center gap-2 text-[10px] font-mono text-gray-400">
                  <Info size={12} />
                  <span>Auto-Spidery Active</span>
                </div>
              </div>
            </ConfigCard>
          </div>

          <div className="lg:col-span-2">
            <ConfigCard title="REST Intelligence" icon={Network} colorClass="text-purple-400">
              <div className="space-y-6">
                <div className="group/field">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">HTTP Verbs</label>
                  <div className="flex gap-2">
                    {['GET', 'POST', 'PUT'].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setConfig({ ...config, method: m as any })}
                        className={`flex-1 py-2 rounded-xl border font-mono text-[10px] font-bold transition-all ${config.method === m ? 'bg-primary-600/10 border-primary-500 text-primary-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-gray-950/50 border-white/5 text-gray-600 hover:border-white/10'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {config.method !== 'GET' && (
                  <div className="group/field reveal-up">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">JSON Request Skeleton</label>
                    <textarea
                      className="w-full h-24 bg-gray-950 border border-white/5 rounded-2xl p-4 text-gray-200 focus:border-purple-500/50 outline-none font-mono text-[10px] transition-all"
                      placeholder='{ "username": "admin" }'
                      value={config.requestBody}
                      onChange={(e) => setConfig({ ...config, requestBody: e.target.value })}
                    />
                    <p className="text-[8px] text-gray-600 mt-2 font-mono uppercase tracking-tighter">Enter JSON body structure for parameter fuzzing.</p>
                  </div>
                )}
              </div>
            </ConfigCard>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ConfigCard title="Mission Profile" icon={Sliders} colorClass="text-primary-400">
            <div className="space-y-4">
              {[
                { id: 'stealth', label: 'Stealth Recon', desc: 'Minimal footprint, WAF evasion active', color: 'hover:border-green-500/30' },
                { id: 'balanced', label: 'Balanced Pulse', desc: 'Standard frequency and depth', color: 'hover:border-primary-500/30' },
                { id: 'aggressive', label: 'Full Saturation', desc: 'Fast, comprehensive fuzzing matrix', color: 'hover:border-amber-500/30' }
              ].map((p) => (
                <label key={p.id} className={`flex items-start gap-4 p-5 rounded-3xl border cursor-pointer transition-all duration-300 relative overflow-hidden group/item ${config.profile === p.id ? 'bg-primary-600/10 border-primary-500/50 shadow-lg shadow-primary-500/5' : `bg-gray-950/40 border-white/5 ${p.color}`}`}>
                  <div className="pt-0.5">
                    <input
                      type="radio"
                      name="profile"
                      value={p.id}
                      checked={config.profile === p.id}
                      onChange={(e) => setConfig({ ...config, profile: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${config.profile === p.id ? 'border-primary-500 bg-primary-500' : 'border-gray-700'}`}>
                      {config.profile === p.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <span className="block font-bold text-sm text-white tracking-tight">{p.label}</span>
                    <span className="block text-[10px] text-gray-500 mt-1 uppercase tracking-tighter font-medium">{p.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </ConfigCard>

          <ConfigCard title="Engine Tuning" icon={Zap} colorClass="text-amber-400">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-gray-950/40 rounded-3xl border border-white/5 hover:border-purple-500/20 transition-all group/opt">
                <div className="space-y-1">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    ML-Heuristics
                    <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black bg-purple-600 text-white tracking-tighter">AI_V2</span>
                  </span>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Bypasses character-based filters</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config.useML}
                    onChange={(e) => setConfig({ ...config, useML: e.target.checked })}
                  />
                  <div className="w-8 h-4.5 bg-gray-800 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:shadow-sm after:transition-all peer-checked:after:translate-x-3.5"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-5 bg-gray-950/40 rounded-3xl border border-white/5 hover:border-primary-500/20 transition-all group/opt">
                <div className="space-y-1">
                  <span className="font-bold text-sm text-white">Advanced Plugins</span>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Activates GQL, NoSQL modules</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config.usePlugins}
                    onChange={(e) => setConfig({ ...config, usePlugins: e.target.checked })}
                  />
                  <div className="w-8 h-4.5 bg-gray-900 rounded-full peer peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:shadow-sm after:transition-all peer-checked:after:translate-x-3.5"></div>
                </label>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-end mb-5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} className="text-primary-500" />
                    Concurrency Matrix
                  </label>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white font-mono leading-none tracking-tighter">{config.threads}</span>
                    <span className={`block text-[8px] font-black uppercase tracking-widest ${threadDesc.color} mt-1`}>{threadDesc.text}</span>
                  </div>
                </div>
                <div className="relative group/slider">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={config.threads}
                    onChange={(e) => setConfig({ ...config, threads: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-gray-950 rounded-full appearance-none cursor-pointer accent-primary-600 group-hover/slider:bg-gray-900 transition-all"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-gray-700 mt-3 uppercase font-bold">
                    <span>1_THREAD</span>
                    <span>20_THREADS</span>
                  </div>
                </div>
              </div>
            </div>
          </ConfigCard>

          {/* Fuzzing Configuration */}
          <ConfigCard title="Parameter Fuzzing" icon={Shield} colorClass="text-green-400">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-gray-950/40 rounded-3xl border border-white/5 hover:border-green-500/20 transition-all group/opt">
                <div className="space-y-1">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    Fuzzing Mode
                    <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black bg-green-600 text-white tracking-tighter">BETA</span>
                  </span>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Auto-discover injection points</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config.useFuzzing}
                    onChange={(e) => setConfig({
                      ...config,
                      useFuzzing: e.target.checked,
                      fuzzConfig: { ...config.fuzzConfig!, enabled: e.target.checked }
                    })}
                  />
                  <div className="w-8 h-4.5 bg-gray-800 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:shadow-sm after:transition-all peer-checked:after:translate-x-3.5"></div>
                </label>
              </div>

              {config.useFuzzing && (
                <div className="space-y-4 reveal-up">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Injection Vectors</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['GET', 'POST', 'HEADERS', 'COOKIES', 'PATH'].map(vector => (
                        <label key={vector} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${config.fuzzConfig?.vectors.includes(vector as any) ? 'bg-green-600/10 border-green-500/50' : 'bg-gray-950/40 border-white/5 hover:border-white/10'}`}>
                          <input
                            type="checkbox"
                            checked={config.fuzzConfig?.vectors.includes(vector as any)}
                            onChange={(e) => {
                              const vectors = e.target.checked
                                ? [...(config.fuzzConfig?.vectors || []), vector]
                                : (config.fuzzConfig?.vectors || []).filter(v => v !== vector);
                              setConfig({ ...config, fuzzConfig: { ...config.fuzzConfig!, vectors: vectors as any } });
                            }}
                            className="sr-only"
                          />
                          <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all ${config.fuzzConfig?.vectors.includes(vector as any) ? 'border-green-500 bg-green-500' : 'border-gray-700'}`}>
                            {config.fuzzConfig?.vectors.includes(vector as any) && <div className="w-1.5 h-1.5 rounded-sm bg-white"></div>}
                          </div>
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">{vector}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Fuzzing Strategy</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'smart', label: 'Smart', desc: 'High-risk first' },
                        { id: 'sequential', label: 'Sequential', desc: 'One-by-one' },
                        { id: 'parallel', label: 'Parallel', desc: 'Simultaneous' },
                        { id: 'recursive', label: 'Recursive', desc: 'Nested params' }
                      ].map(strategy => (
                        <label key={strategy.id} className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${config.fuzzConfig?.strategy === strategy.id ? 'bg-green-600/10 border-green-500/50' : 'bg-gray-950/40 border-white/5 hover:border-white/10'}`}>
                          <div className="pt-0.5">
                            <input
                              type="radio"
                              name="fuzzStrategy"
                              value={strategy.id}
                              checked={config.fuzzConfig?.strategy === strategy.id}
                              onChange={(e) => setConfig({ ...config, fuzzConfig: { ...config.fuzzConfig!, strategy: e.target.value as any } })}
                              className="sr-only"
                            />
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${config.fuzzConfig?.strategy === strategy.id ? 'border-green-500 bg-green-500' : 'border-gray-700'}`}>
                              {config.fuzzConfig?.strategy === strategy.id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                            </div>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-300 uppercase tracking-tight">{strategy.label}</span>
                            <span className="block text-[8px] text-gray-600 uppercase tracking-tighter">{strategy.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-950/40 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Payload Mutations</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={config.fuzzConfig?.payloadMutation}
                        onChange={(e) => setConfig({ ...config, fuzzConfig: { ...config.fuzzConfig!, payloadMutation: e.target.checked } })}
                      />
                      <div className="w-7 h-4 bg-gray-800 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:shadow-sm after:transition-all peer-checked:after:translate-x-3"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-950/40 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Encoding Variants</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={config.fuzzConfig?.encodingVariants}
                        onChange={(e) => setConfig({ ...config, fuzzConfig: { ...config.fuzzConfig!, encodingVariants: e.target.checked } })}
                      />
                      <div className="w-7 h-4 bg-gray-800 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:shadow-sm after:transition-all peer-checked:after:translate-x-3"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </ConfigCard>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="group relative flex items-center gap-4 px-12 py-5 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-primary-600/20 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Play size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
            <span className="text-sm uppercase tracking-[0.2em] italic">Deploy Engine</span>
          </button>
        </div>
      </form >
    </div >
  );
};

export default NewScan;