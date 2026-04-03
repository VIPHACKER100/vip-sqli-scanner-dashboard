import React from 'react';
import { Terminal, Copy, Check, GitBranch, Play, Shield, Globe } from 'lucide-react';
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
      icon: <GitBranch className="w-5 h-5 text-primary-500" />
    },
    {
      title: 'Navigate to Directory',
      description: 'Go into the cloned project directory.',
      command: 'cd vip-sqli-scanner-dashboard',
      icon: <Terminal className="w-5 h-5 text-amber-500" />
    },
    {
      title: 'Install Dependencies',
      description: 'Install all the required NPM packages and dependencies.',
      command: 'npm install',
      icon: <Globe className="w-5 h-5 text-blue-500" />
    },
    {
      title: 'Start Proxy Bridge (Optional but Recommended)',
      description: 'Start the Node.js Proxy Bridge to bypass CORS restrictions for the Real Scanner.',
      command: 'cd proxy && npm install && node server.js',
      icon: <Shield className="w-5 h-5 text-red-500" />
    },
    {
      title: 'Run Development Server',
      description: 'Start the Vite development server to launch the dashboard interface.',
      command: 'npm run dev',
      icon: <Play className="w-5 h-5 text-green-500" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Terminal className="w-8 h-8 text-primary-600" />
          Installation & Usage Guide
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mt-2">
          Step-by-step instructions on how to get the VIP SQLi Scanner Dashboard up and running in your local environment.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 rounded-l-xl h-full bg-slate-200 dark:bg-white/5">
              <div className="w-full bg-primary-500 absolute top-0" style={{ height: '30%', top: '35%' }}></div>
            </div>
            
            <div className="pl-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 flex-shrink-0">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
                  {index + 1}. {step.title}
                </h3>
              </div>
              
              <p className="text-slate-500 dark:text-gray-400 text-sm mb-4">
                {step.description}
              </p>

              <div className="relative group">
                <pre className="bg-slate-900 dark:bg-[#0a0a0a] text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-slate-800 border-l-4 border-l-primary-500 shadow-inner">
                  <code>{step.command}</code>
                </pre>
                <button
                  onClick={() => handleCopy(step.command, index)}
                  className="absolute top-3 right-3 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-300 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
                  title="Copy command"
                >
                  {copiedStep === index ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-6">
        <h4 className="text-amber-800 dark:text-amber-500 font-semibold mb-2 flex items-center gap-2">
           <Shield className="w-5 h-5" /> Important Note
        </h4>
        <p className="text-sm text-amber-700 dark:text-amber-400/80">
          Make sure you have Node.js (v18+) and Git installed on your system before proceeding with these steps. The dashboard will typically run on <code className="bg-amber-100 dark:bg-amber-900/30 px-1 py-0.5 rounded">http://localhost:5173</code> by default.
        </p>
      </div>

    </div>
  );
};

export default CloneGuide;
