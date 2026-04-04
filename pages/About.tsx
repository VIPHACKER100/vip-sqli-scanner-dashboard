import React from 'react';
import { 
  User, Shield, Code, Globe, Terminal, Fingerprint, Award, Rocket, Quote, 
  Github, Linkedin, ExternalLink, ArrowRight, Target, Activity, Cpu, 
  ShieldCheck, Star, Briefcase, Zap, Globe as GlobeIcon
} from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-border relative">
              <div className="space-y-4">
                <div className="section-label">Intelligence Profile</div>
                <h2 className="font-display text-5xl md:text-6xl text-foreground italic">
                  Operative <span className="text-electric-gradient">Profile</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                    Verified credentials, security philosophy, and professional intelligence baseline for XNode implementation.
                </p>
              </div>
              
              <div className="flex items-center gap-5 bg-muted/30 px-8 py-5 rounded-3xl border border-border shadow-sm group">
                <Fingerprint size={24} className="text-accent group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Digital_ID</span>
                  <span className="text-sm font-mono text-foreground font-black tracking-tighter uppercase">VIPHACKER.100</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Main Bio Card */}
                    <div className="modern-card p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
                            <User size={260} />
                        </div>
                        <div className="relative z-10 space-y-10">
                            <div className="flex flex-col md:flex-row md:items-center gap-8">
                                <div className="w-24 h-24 bg-accent text-white rounded-3xl flex items-center justify-center shadow-accent-sm group-hover:scale-105 transition-transform">
                                    <Shield size={44} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-display text-4xl text-foreground italic">Aryan Ahirwar</h3>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <p className="text-accent font-mono text-xs font-black uppercase tracking-[0.2em]">Cybersecurity Specialist</p>
                                        <div className="hidden sm:block h-4 w-px bg-border" />
                                        <div className="flex items-center gap-4">
                                            <a href="https://github.com/VIPHACKER100/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-all active:scale-95">
                                                <Github size={18} />
                                            </a>
                                            <a href="https://www.linkedin.com/in/viphacker100/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#0077b5] transition-all active:scale-95">
                                                <Linkedin size={18} />
                                            </a>
                                            <a href="https://viphacker100.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-all active:scale-95">
                                                <GlobeIcon size={18} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 text-muted-foreground leading-relaxed font-medium">
                                <p className="text-base sm:text-lg">
                                    <span className="text-foreground font-black">Aryan Ahirwar</span>, professionally recognized as <span className="text-accent font-black underline decoration-accent/20">viphacker.100</span>, is a high-caliber cybersecurity specialist focusing on offensive and defensive security architectures.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                  <div className="space-y-2">
                                     <div className="flex items-center gap-3 text-[10px] font-black text-foreground uppercase tracking-widest">
                                       <Target size={14} className="text-accent" /> Specialization
                                     </div>
                                     <p className="text-xs leading-loose">
                                        Penetration testing, web application security (SQLi/Auth/XSS), and system-level forensic analysis.
                                     </p>
                                  </div>
                                  <div className="space-y-2">
                                     <div className="flex items-center gap-3 text-[10px] font-black text-foreground uppercase tracking-widest">
                                       <Zap size={14} className="text-accent" /> Technical Focus
                                     </div>
                                     <p className="text-xs leading-loose">
                                        Security tool automation, reconnaissance techniques, and vulnerability intelligence at scale.
                                     </p>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="modern-card p-10 space-y-6 relative overflow-hidden group">
                           <div className="absolute inset-0 dot-pattern opacity-[0.02] pointer-events-none" />
                            <div className="flex items-center gap-3 relative z-10">
                                <Award className="text-amber-500" size={18} strokeWidth={2.5} />
                                <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Philosophy</h4>
                            </div>
                            <div className="relative pt-6 z-10">
                                <Quote className="absolute top-0 left-0 text-accent/10" size={40} />
                                <p className="text-[15px] italic font-bold text-foreground pl-6 leading-relaxed">
                                    “Hacking is not about breaking systems — it’s about understanding them deeply enough to make them stronger.”
                                </p>
                            </div>
                        </div>

                        <div className="modern-card p-10 space-y-6 relative overflow-hidden group">
                            <div className="flex items-center gap-3 relative z-10">
                                <Rocket className="text-accent" size={18} strokeWidth={2.5} />
                                <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Mission Focus</h4>
                            </div>
                            <p className="text-[12px] text-muted-foreground font-bold leading-relaxed uppercase tracking-widest relative z-10 italic">
                                Contributing elite-level research to the security community, driven by discipline, legality, and absolute technical excellence.
                            </p>
                            <div className="mt-4 pt-6 border-t border-border/50 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                              <span className="text-[9px] font-mono font-bold">SECTOR_STABILITY::99%</span>
                              <Activity size={14} className="text-accent" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="modern-card p-10 space-y-10 relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                            <Cpu className="text-accent" size={22} strokeWidth={2.5} />
                            <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Core Interests</h4>
                        </div>
                        <ul className="space-y-8">
                            {[
                                { l: "Ethical Hacking", v: "Fundamentals & Theory", p: 95 },
                                { l: "Web Security", v: "SQLi, Auth, Logic Fuzzing", p: 88 },
                                { l: "Reconnaissance", v: "OSINT & Info Gathering", p: 82 },
                                { l: "Infrastructure", v: "OS Customization", p: 75 },
                                { l: "Automation", v: "Security Tool Integration", p: 70 },
                                { l: "Internals", v: "Networking & System Kernels", p: 65 }
                            ].map((item, i) => (
                                <li key={i} className="flex flex-col gap-2 group/item">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-muted-foreground group-hover/item:text-accent transition-colors">{item.l}</span>
                                        <span className="text-foreground group-hover/item:text-accent transition-colors">ACTIVE</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-accent shadow-accent-sm transition-all duration-1500" style={{ width: `${item.p}%` }} />
                                    </div>
                                    <p className="text-[9px] font-mono text-muted-foreground uppercase mt-1 tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">
                                      {item.v}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="modern-card p-10 bg-accent text-white shadow-accent-sm relative overflow-hidden group transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                                  <Terminal className="text-white" size={24} strokeWidth={3} />
                                </div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">XNode Research</h4>
                            </div>
                            <p className="text-[13px] leading-relaxed font-bold uppercase tracking-widest opacity-90 italic">
                                Specialized in custom operating system modifications and mission-critical tool integration for Windows/Linux environments.
                            </p>
                            <button className="w-full py-5 bg-white text-accent rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.03] active:scale-95 shadow-xl">
                                INITIATE_REPOSITORY_SYNC
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modern-card p-16 text-center space-y-10 relative overflow-hidden group border-t-4 border-t-accent bg-muted/10">
                <div className="absolute inset-0 dot-pattern opacity-[0.03] pointer-events-none" />
                
                <div className="p-6 bg-accent/5 border border-accent/20 rounded-full w-fit mx-auto shadow-sm group-hover:scale-110 transition-transform duration-700">
                  <GlobeIcon size={48} className="text-accent animate-pulse" strokeWidth={1.5} />
                </div>
                
                <div className="space-y-6">
                  <h3 className="font-display text-4xl text-foreground italic uppercase tracking-tight">Authorized Mission Capability</h3>
                  <p className="max-w-3xl mx-auto text-muted-foreground text-sm font-bold leading-relaxed uppercase tracking-[0.1em] opacity-70">
                      viphacker.100 continues to study modern attack vectors and security best practices to contribute positively to the global security community.
                  </p>
                </div>
                
                <div className="flex justify-center gap-5">
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce shadow-accent-sm"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>

                <div className="pt-8">
                    <a
                        href="https://viphacker100.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 group/link px-8 py-4 bg-background border border-border rounded-3xl text-[10px] font-black text-muted-foreground hover:text-accent hover:border-accent/40 transition-all uppercase tracking-[0.3em] shadow-sm"
                    >
                        SECURE_PORTAL :: viphacker100.com
                        <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
