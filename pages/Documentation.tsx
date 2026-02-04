import React from 'react';
import { BookOpen, Shield, Code, Zap, Hash, Terminal, Database, Check } from 'lucide-react';

const DocSection = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white dark:bg-gray-900/40 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden group hover:border-primary-500/30 transition-all transition-colors">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Icon size={160} />
        </div>
        <div className="relative z-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-4 italic tracking-tight">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <Icon size={20} className="text-primary-500" />
                </div>
                {title}
            </h3>
            <div className="space-y-4 text-sm text-gray-400 leading-relaxed font-medium">
                {children}
            </div>
        </div>
    </div>
);

const Documentation: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-12 reveal-up pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter uppercase italic">Mission Protocols</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Technical documentation for the SQLiHunter Intelligence Suite v2.2</p>
                </div>
                <div className="px-6 py-2 bg-primary-600/10 border border-primary-500/30 rounded-2xl flex items-center gap-3">
                    <Shield size={16} className="text-primary-400" />
                    <span className="text-[10px] font-mono text-primary-400 font-bold tracking-widest uppercase">Clearance::LEVEL_7</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DocSection title="Boolean-Blind Heuristics" icon={Hash}>
                    <p>The core detection method utilizes high-frequency boolean differential analysis. By injecting conditional vectors (e.g., <code className="text-primary-400 font-mono">AND 1=1</code> / <code className="text-primary-400 font-mono">AND 1=0</code>), the engine monitors server response deltas (size, timing, and DOM structure).</p>
                    <p>When a delta is identified, the engine initiates a <b>Binary Search Bit-Extraction</b> routine to exfiltrate data character-by-character from the database backend without triggering traditional WAF patterns.</p>
                </DocSection>

                <DocSection title="UNION-Based Exfiltration" icon={Database}>
                    <p>For high-throughput missions, the UNION technique provides the fastest data dump potential. The scanner automatically enumerates columns via <code className="text-primary-400 font-mono">ORDER BY</code> binary searches.</p>
                    <p>Once the column structure is mapped, a specialized multi-row payload is deployed to synchronize targeted database tables directly into the dashboard's local intelligence hub.</p>
                </DocSection>

                <DocSection title="ML Pattern Recognition" icon={Zap}>
                    <p>The SQLiHunter v2.2 engine utilizes a <b>Bi-LSTM Neural Network</b> trained on over 200,000 positive and negative injection signatures. This layer identifies subtle "soft" error patterns that traditional regex engines miss.</p>
                    <p>The ML engine provides a confidence score (0.0 - 1.0) for every anomalous response, significantly reducing false-positives in high-noise enterprise environments.</p>
                </DocSection>

                <DocSection title="Stealth & Evasion" icon={Shield}>
                    <p>To maintain mission integrity, the <b>WAF Stealth</b> module applies multiple encoding layers including Hex, Base64, and Double-URL encoding. Payload fragmentation ensures that signatures do not exceed common packet-inspection buffers.</p>
                    <p>Mission profiles control the "Pulse Velocity"—Stealth missions use jittered intervals to mimic human-like browsing patterns, bypassing behavioral AI defenses.</p>
                </DocSection>

                <DocSection title="Core Detection Matrix" icon={Terminal}>
                    <p>The v2.2 engine identifies vulnerabilities via three specialized technical triggers:</p>
                    <ul className="list-disc ml-5 space-y-2">
                        <li><b>Error Signatures</b>: Scans response content for specific database failure strings (e.g., <code className="text-red-400">mysql_fetch</code>, <code className="text-red-400">PostgreSQL query failed</code>, <code className="text-red-400">ORA-</code>).</li>
                        <li><b>Latency Thresholds</b>: Identifies time-based vectors by monitoring for response delays exceeding a 4.0s baseline.</li>
                        <li><b>Length Differentials</b>: Analyzes byte-count variances between positive (<code className="text-primary-400">1=1</code>) and negative (<code className="text-primary-400">1=2</code>) boolean conditions.</li>
                    </ul>
                </DocSection>
            </div>

            <div className="bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[40px] p-12 relative overflow-hidden group shadow-xl dark:shadow-2xl transition-colors">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Check size={160} /></div>
                <div className="relative z-10 space-y-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-4 italic tracking-tighter">
                        <Zap size={24} className="text-amber-500" />
                        Mission Mitigation Protocol
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Primary Remediation</h4>
                            <div className="space-y-4">
                                {[
                                    { t: "Prepared Statements", d: "Enforce parameterized queries to decouple code from data vectors." },
                                    { t: "Input Sanitization", d: "Implement strict allow-list validation on all entry points." }
                                ].map(item => (
                                    <div key={item.t} className="p-5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{item.t}</p>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Atmospheric Defense</h4>
                            <div className="space-y-4">
                                {[
                                    { t: "WAF Integration", d: "Deploy Cloud-native firewalls with updated SQLi signature sets." },
                                    { t: "Least Privilege", d: "Restrict database service accounts to absolute minimum permissions." }
                                ].map(item => (
                                    <div key={item.t} className="p-5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{item.t}</p>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-950/40 border border-gray-200 dark:border-white/5 rounded-[40px] p-12 relative overflow-hidden group shadow-inner transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3 italic tracking-tighter">
                            <Terminal size={24} className="text-primary-500" />
                            Mission Authorization & Ethics
                        </h3>
                        <div className="h-px w-24 bg-primary-500/30 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] font-mono text-gray-500 uppercase tracking-widest leading-loose">
                        <div className="space-y-4">
                            <p><span className="text-gray-300 font-bold mr-2">[01]</span> Use of this suite is strictly authorized for internal infrastructure testing and authorized offensive security missions.</p>
                            <p><span className="text-gray-300 font-bold mr-2">[02]</span> All exfiltrated data is cached locally and should be purged via the Mission Maintenance protocol after use.</p>
                        </div>
                        <div className="space-y-4">
                            <p><span className="text-gray-300 font-bold mr-2">[03]</span> The v2.2 engine signature is designed for maximum stealth; do not utilize aggressive profiles on live infrastructure without proxies.</p>
                            <p><span className="text-gray-300 font-bold mr-2">[04]</span> Developers (VIPHACKER.100) assume no liability for unauthorized deployment or data breaches.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documentation;
