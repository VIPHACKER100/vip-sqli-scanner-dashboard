import React from 'react';
import { 
  Terminal, Copy, Check, GitBranch, Play, Shield, Globe, 
  ArrowRight, Cpu, Layers, Box, Terminal as TerminalIcon,
  ShieldAlert, Info, Info as InfoIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const CloneGuide: React.FC = () => {
  const [copiedStep, setCopiedStep] = React.useState<number | null>(null);

  const handleCopy = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      title: 'Clone Repository',
      description: 'Clone the VIP SQLi Scanner Dashboard repository to your local machine using Git.',
      command: 'git clone https://github.com/VIPHACKER100/vip-sqli-scanner-dashboard',
      icon: <GitBranch className="w-5 h-5" />
    },
    {
      title: 'Navigate to Directory',
      description: 'Go into the cloned project directory to access the full module suite.',
      command: 'cd vip-sqli-scanner-dashboard',
      icon: <Terminal className="w-5 h-5" />
    },
    {
      title: 'Install Dependencies',
      description: 'Install all required NPM packages and intelligence dependencies.',
      command: 'npm install',
      icon: <Layers className="w-5 h-5" />
    },
    {
      title: 'Start Proxy Bridge (MANDATORY)',
      description: 'Initialize the Node.js Proxy Bridge to bypass CORS and SOP security restrictions for Real-World Forensic scans.',
      command: 'cd proxy && npm install && node server.js',
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: 'Run Development Server',
      description: 'Launch the Vite development server to experience the VIP SQLi Intelligence Dashboard.',
      command: 'npm run dev',
      icon: <Play className="w-5 h-5" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* ── Header ── */}
      <div className="space-y-4 text-center">
        <div className="section-label mx-auto w-fit">Deployment Protocol</div>
        <h1 className="font-display text-5xl text-foreground italic flex items-center justify-center gap-4">
          <TerminalIcon className="w-10 h-10 text-accent" strokeWidth={2.5} />
          Terminal <span className="text-electric-gradient">Guide</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
          Step-by-step instructions on how to deploy the VIP-XNode Intelligence Dashboard in your local tactical environment.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="modern-card group p-8 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 hover:translate-x-2"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform pointer-events-none">
              <span className="text-9xl font-black font-mono leading-none">0{index + 1}</span>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 border border-border flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-500 shadow-sm">
                  {React.cloneElement(step.icon as React.ReactElement, { strokeWidth: 2.5 })}
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                     <span className="text-[10px] font-mono font-black text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/20">STEP_0{index + 1}</span>
                     <h3 className="font-display text-2xl text-foreground italic">
                        {step.title}
                     </h3>
                   </div>
                  
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>

                <div className="relative group/cmd mt-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent rounded-2xl opacity-0 group-hover/cmd:opacity-100 transition-opacity blur-sm" />
                  <div className="relative bg-foreground border border-border/10 rounded-2xl p-6 shadow-2xl transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <code className="text-white font-mono text-[13px] tracking-tight selection:bg-accent selection:text-white break-all">
                        <span className="text-emerald-400 mr-2">$</span>
                        {step.command}
                      </code>
                      <button
                        onClick={() => handleCopy(step.command, index)}
                        className="flex-shrink-0 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-90"
                        title="Copy command"
                      >
                        {copiedStep === index ? (
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">COPIED</span>
                          </div>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="modern-card p-10 bg-accent text-white shadow-accent-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-all duration-1000 rotate-12">
          <ShieldAlert size={180} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
            <InfoIcon size={28} strokeWidth={3} />
          </div>
          <div className="space-y-3">
            <h4 className="font-display text-2xl italic uppercase tracking-tighter">Mission Pre-Flight Requirements</h4>
            <p className="text-sm font-bold leading-relaxed uppercase tracking-widest opacity-80 max-w-3xl">
              Ensure <span className="bg-white/20 px-1.5 py-0.5 rounded italic">Node.js (v18+)</span> and <span className="bg-white/20 px-1.5 py-0.5 rounded italic">Git</span> are present in your OS environment. The dashboard initializes on <span className="underline decoration-white/20 underline-offset-4">http://localhost:5173</span> across all standard telemetry ports.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CloneGuide;
