import React, { useState, useEffect } from 'react';
import { Shield, Terminal, Cpu, Database, Activity, Lock, Fingerprint, Zap } from 'lucide-react';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('0x00: INITIALIZING BOOT_SEQUENCE');
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const messages = [
            '0x01: LOAD_KERNEL::SQLi_HUNTER_V2.2',
            '0x02: DECRYPT_SIGNATURE_CACHE::7542_KEYS',
            '0x03: BOOT_NEURAL_LSTM_ENGINE...',
            '0x04: SYNC_WAF_BYPASS_PROTOCOLS...',
            '0x05: ESTABLISH_REST_FUZZING_MATRIX...',
            '0x10: PHASE_II_READY_FOR_ENGAGEMENT'
        ];

        let currentMsg = 0;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 1200);
                    return 100;
                }

                const nextProgress = prev + (Math.random() * 12);
                const msgIdx = Math.floor((nextProgress / 100) * messages.length);
                if (msgIdx !== currentMsg && msgIdx < messages.length) {
                    currentMsg = msgIdx;
                    setStatus(messages[msgIdx]);
                }
                return Math.min(nextProgress, 100);
            });

            if (Math.random() > 0.85) {
                setGlitch(true);
                setTimeout(() => setGlitch(false), 80);
            }
        }, 350);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center p-8 overflow-hidden font-technical">
            {/* Background Cyber-Grid */}
            <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-primary-950/20 pointer-events-none"></div>
            <div className="absolute inset-0 scan-line-overlay opacity-10"></div>

            {/* Animated Background Orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

            <div className={`relative transition-all duration-100 flex flex-col items-center ${glitch ? 'translate-x-1.5 -translate-y-1 scale-105 skew-x-3 opacity-60 grayscale' : ''}`}>
                <div className="relative mb-16 group">
                    <div className="absolute inset-0 bg-primary-500 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative flex items-center justify-center w-40 h-40 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(59,130,246,0.2)] rotate-45 transform hover:rotate-0 transition-all duration-1000">
                        <Shield size={80} className="text-primary-500 -rotate-45 group-hover:rotate-0 transition-all duration-1000" strokeWidth={1} />
                        <div className="absolute inset-2 border border-primary-500/20 rounded-[32px] pointer-events-none"></div>
                    </div>
                    {/* Pulsing Alert Rings */}
                    <div className="absolute inset-0 border-2 border-primary-500/10 rounded-[40px] animate-ping opacity-20"></div>
                </div>

                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <Zap className="text-amber-500 animate-pulse" size={24} />
                        <h1 className="text-7xl font-black text-white tracking-[0.3em] uppercase italic select-none">
                            SQLI<span className="text-primary-500 text-neon-primary">HUNTER</span>
                        </h1>
                        <Zap className="text-amber-500 animate-pulse" size={24} />
                    </div>
                    <div className="flex items-center justify-center gap-3 opacity-60">
                        <div className="h-px w-8 bg-gray-700"></div>
                        <p className="text-primary-400 text-[10px] font-black tracking-[0.6em] uppercase">
                            Advanced Intelligence Dashboard v2.2
                        </p>
                        <div className="h-px w-8 bg-gray-700"></div>
                    </div>
                </div>
            </div>

            <div className="mt-32 w-full max-w-md space-y-6">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-mono text-primary-400 font-black animate-pulse uppercase tracking-[0.2em]">{status}</span>
                    <span className="text-xs font-mono text-gray-400 font-bold bg-white/5 px-3 py-1 rounded-full border border-white/5">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5 shadow-inner">
                    <div
                        className="h-full bg-primary-600 shadow-[0_0_20px_rgba(37,99,235,0.8)] transition-all duration-700 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between items-center opacity-40 px-2 pt-2">
                    <div className="flex gap-8">
                        <Cpu size={16} className={progress > 20 ? 'text-primary-500' : 'text-gray-700'} />
                        <Database size={16} className={progress > 40 ? 'text-primary-500' : 'text-gray-700'} />
                        <Terminal size={16} className={progress > 60 ? 'text-primary-500' : 'text-gray-700'} />
                        <Activity size={16} className={progress > 80 ? 'text-primary-500' : 'text-gray-700'} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Lock size={12} className="text-gray-600" />
                        <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">TLS_SECURED</span>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i <= 3 ? 'bg-primary-500' : 'bg-gray-800'}`}></div>)}
                </div>
                <div className="flex items-center gap-3">
                    <Fingerprint size={14} className="text-gray-700" />
                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] font-mono flex items-center gap-2">
                        Authorized Pentest Mission // Instance 0x3F_8A9B
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
