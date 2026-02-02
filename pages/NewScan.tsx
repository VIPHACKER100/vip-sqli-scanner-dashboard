import React, { useState } from 'react';
import { ScanConfig, Page } from '../types';
import { Play, Sliders, Zap, Info, HelpCircle, Gauge } from 'lucide-react';

interface NewScanProps {
  onStartScan: (config: ScanConfig) => void;
  setPage: (page: Page) => void;
}

const HelpTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex ml-2 align-middle">
    <HelpCircle size={15} className="text-gray-500 hover:text-primary-400 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
      <p className="text-xs text-gray-300 leading-relaxed font-normal normal-case text-left">{text}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-700"></div>
    </div>
  </div>
);

const NewScan: React.FC<NewScanProps> = ({ onStartScan, setPage }) => {
  const [config, setConfig] = useState<ScanConfig>({
    targetUrls: '',
    profile: 'balanced',
    useML: true,
    usePlugins: true,
    threads: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.targetUrls) return;
    onStartScan(config);
    setPage(Page.DASHBOARD);
  };

  const getThreadDescription = (threads: number) => {
    if (threads <= 3) return { text: "Safe & Stealthy", color: "text-green-400" };
    if (threads <= 10) return { text: "Balanced Performance", color: "text-primary-400" };
    return { text: "High Noise / Fast", color: "text-amber-400" };
  };

  const threadDesc = getThreadDescription(config.threads);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">New Scan Configuration</h2>
        <p className="text-gray-400">Configure parameters for the next SQLi detection run.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Input */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            Target URLs (One per line)
            <HelpTooltip text="Enter full URLs. The scanner supports multiple targets and will automatically spider and extract parameters (e.g., ?id=1) for injection testing." />
          </label>
          <textarea
            className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            placeholder="http://example.com/product.php?id=1&#10;http://test.site/login"
            value={config.targetUrls}
            onChange={(e) => setConfig({ ...config, targetUrls: e.target.value })}
            required
          />
          <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
             <Info size={14} className="mt-0.5 flex-shrink-0" />
             <p>Supports HTTP/HTTPS. The scanner will automatically extract parameters.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Selection */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Sliders size={20} className="text-primary-400" />
              Scan Profile
              <HelpTooltip text="Profiles control the scan velocity and payload complexity. 'Stealth' minimizes logs, while 'Aggressive' performs comprehensive fuzzing." />
            </h3>
            <div className="space-y-3">
              {[
                { id: 'stealth', label: 'Stealth', desc: 'Slow, low noise, tries to evade WAF' },
                { id: 'balanced', label: 'Balanced', desc: 'Standard speed and detection depth' },
                { id: 'aggressive', label: 'Aggressive', desc: 'Fast, heavy payload usage, high noise' }
              ].map((p) => (
                <label key={p.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${config.profile === p.id ? 'bg-primary-900/20 border-primary-500/50' : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'}`}>
                  <input
                    type="radio"
                    name="profile"
                    value={p.id}
                    checked={config.profile === p.id}
                    onChange={(e) => setConfig({ ...config, profile: e.target.value as any })}
                    className="mt-1 text-primary-500 focus:ring-primary-500 bg-gray-900 border-gray-600"
                  />
                  <div>
                    <span className="block font-medium text-gray-200">{p.label}</span>
                    <span className="block text-xs text-gray-500">{p.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Zap size={20} className="text-amber-400" />
              Detection Engine
              <HelpTooltip text="Configure the underlying analysis engines used to identify vulnerabilities." />
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                 <div>
                   <span className="block font-medium text-gray-200 flex items-center gap-2">
                     ML Enhanced Detection
                     <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">v2.2</span>
                     <HelpTooltip text="Uses a Bi-LSTM neural network to analyze HTTP responses for subtle error patterns, reducing false positives by 40%." />
                   </span>
                   <span className="text-xs text-gray-500">Use machine learning to reduce false positives</span>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={config.useML}
                    onChange={(e) => setConfig({...config, useML: e.target.checked})}
                   />
                   <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                 </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                 <div>
                   <span className="block font-medium text-gray-200 flex items-center">
                    Plugin System
                    <HelpTooltip text="Activates technology-specific modules (GraphQL, NoSQL, LDAP) to broaden the attack surface coverage." />
                   </span>
                   <span className="text-xs text-gray-500">Enable GraphQL, NoSQL, and other plugins</span>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={config.usePlugins}
                    onChange={(e) => setConfig({...config, usePlugins: e.target.checked})}
                   />
                   <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                 </label>
              </div>

              <div className="pt-4 border-t border-gray-700/50">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Gauge size={16} className="text-gray-400" />
                      Concurrency
                      <HelpTooltip text="Defines the number of simultaneous HTTP requests. Higher values speed up the scan but increase the risk of being blocked by WAFs." />
                  </label>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-white leading-none">{config.threads}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${threadDesc.color} mt-1`}>{threadDesc.text}</span>
                  </div>
                </div>
                
                <div className="relative h-6 flex items-center">
                   <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    step="1"
                    value={config.threads} 
                    onChange={(e) => setConfig({...config, threads: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
                    style={{ accentColor: '#2563eb' }}
                  />
                </div>
                
                <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1 uppercase">
                  <span>1 Thread</span>
                  <span>20 Threads</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-600/30"
          >
            <Play size={20} fill="currentColor" />
            Start Scan
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewScan;