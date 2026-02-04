import React from 'react';
import { User, Shield, Code, Globe, Terminal, Fingerprint, Award, Rocket, Quote, Github, Linkedin, ExternalLink } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-12 reveal-up pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter uppercase italic">Operative Profile</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-2">Verified credentials and professional intelligence baseline.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/[0.02] px-6 py-3 rounded-3xl border border-slate-200 dark:border-white/5 transition-colors shadow-inner">
                    <Fingerprint size={18} className="text-primary-600 dark:text-primary-500" />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">Digital_ID</span>
                        <span className="text-xs font-mono text-slate-600 dark:text-gray-400 font-bold uppercase tracking-tighter transition-colors">VIPHACKER.100</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="hf-glass hf-glass-hover p-10 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <User size={200} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-primary-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-primary-600/30">
                                    <Shield size={40} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Aryan Ahirwar</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className="text-primary-600 dark:text-primary-400 font-mono text-sm font-bold uppercase tracking-widest">Cybersecurity Specialist</p>
                                        <div className="h-4 w-px bg-slate-200 dark:bg-white/10"></div>
                                        <div className="flex items-center gap-3">
                                            <a href="https://github.com/VIPHACKER100/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                <Github size={16} />
                                            </a>
                                            <a href="https://www.linkedin.com/in/viphacker100/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0077b5] transition-colors">
                                                <Linkedin size={16} />
                                            </a>
                                            <a href="https://viphacker100.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-500 transition-colors">
                                                <Globe size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 text-slate-600 dark:text-gray-300 leading-relaxed text-sm font-medium transition-colors">
                                <p>
                                    <span className="text-slate-900 dark:text-white font-bold">Aryan Ahirwar</span>, professionally known as <span className="text-primary-600 dark:text-primary-400 font-bold uppercase tracking-tighter">viphacker.100</span>, is an emerging cybersecurity enthusiast, ethical hacking learner, and technology-focused individual with a strong interest in offensive and defensive security.
                                </p>
                                <p>
                                    He is actively building skills in <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md border border-slate-200 dark:border-white/10 italic text-slate-900 dark:text-white">penetration testing</span>, <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md border border-slate-200 dark:border-white/10 italic text-slate-900 dark:text-white">web application security</span>, and <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md border border-slate-200 dark:border-white/10 italic text-slate-900 dark:text-white">system-level analysis</span>, with a focus on understanding real-world vulnerabilities and secure system design.
                                </p>
                                <p>
                                    Aryan is known for working with <span className="text-slate-900 dark:text-white font-bold">security tools, reconnaissance techniques, SQL injection testing, and vulnerability analysis</span>, while maintaining an ethical and responsible approach to cybersecurity.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 hf-glass hf-glass-hover rounded-[32px] space-y-4">
                            <div className="flex items-center gap-3">
                                <Award className="text-amber-500" size={18} />
                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Philosophy</h4>
                            </div>
                            <div className="relative pt-6">
                                <Quote className="absolute top-0 left-0 text-primary-500/20" size={32} />
                                <p className="text-sm italic font-bold text-slate-600 dark:text-gray-400 pl-4 leading-relaxed transition-colors">
                                    “Hacking is not about breaking systems — it’s about understanding them deeply enough to make them stronger.”
                                </p>
                            </div>
                        </div>

                        <div className="p-8 hf-glass hf-glass-hover rounded-[32px] space-y-4">
                            <div className="flex items-center gap-3">
                                <Rocket className="text-primary-500" size={18} />
                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Mission Focus</h4>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium leading-relaxed transition-colors uppercase tracking-tight">
                                Aryan aims to grow into a skilled cybersecurity professional who contributes positively to the security community, believing that true hacking is about knowledge, discipline, and legality.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="hf-glass hf-glass-hover p-8 rounded-[40px] space-y-8">
                        <div className="flex items-center gap-3">
                            <Code className="text-primary-500" size={20} />
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Core Interests</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { l: "Ethical Hacking", v: "Fundamentals & Theory" },
                                { l: "Web Security", v: "SQLi, Auth, Logic Fuzzing" },
                                { l: "Reconnaissance", v: "OSINT & Info Gathering" },
                                { l: "Infrastructure", v: "OS Customization (Win/Linux)" },
                                { l: "Automation", v: "Security Tool Integration" },
                                { l: "Lower Level", v: "Networking & System Internals" }
                            ].map((item, i) => (
                                <li key={i} className="flex flex-col gap-1 group/item">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                        <span className="text-slate-400 dark:text-gray-500 group-hover/item:text-primary-500 transition-colors">{item.l}</span>
                                        <span className="text-slate-800 dark:text-white group-hover/item:text-primary-400 transition-colors">DEPLOYED</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-600/30 group-hover/item:bg-primary-600 transition-all duration-700" style={{ width: `${90 - (i * 8)}%` }}></div>
                                    </div>
                                    <p className="text-[9px] font-mono text-slate-400 dark:text-gray-600 uppercase mt-1 tracking-widest">{item.v}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-primary-600 rounded-[40px] p-8 shadow-2xl shadow-primary-600/40 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <Terminal className="text-white" size={20} />
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Xnode Research</h4>
                            </div>
                            <p className="text-[11px] text-white/80 leading-relaxed font-bold uppercase tracking-tight">
                                Aryan is involved in custom operating system modifications and tool integration, experimenting with Windows and Linux to optimize security workflows.
                            </p>
                            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.3em] transition-all active:scale-95">
                                View Xnode Repository
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 dark:bg-black p-12 rounded-[40px] border border-white/5 text-center space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity cyber-grid"></div>
                <Globe size={48} className="mx-auto text-primary-500 animate-pulse" />
                <h3 className="text-3xl font-black text-white tracking-widest uppercase italic">Authorized Mission Capability</h3>
                <p className="max-w-2xl mx-auto text-gray-400 text-xs font-bold leading-relaxed uppercase tracking-widest">
                    viphacker.100 continues to study modern attack vectors and security best practices to contribute positively to the global security community.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-primary-500 animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>

                <div className="absolute bottom-8 right-8">
                    <a
                        href="https://viphacker100.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group/link text-[9px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        Secure_Portal :: viphacker100.com
                        <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
