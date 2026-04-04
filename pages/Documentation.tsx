import React from 'react';
import { 
  BookOpen, Shield, Code, Zap, Hash, Terminal, Database, Check, 
  ShieldCheck, ArrowRight, Target, Activity, Cpu, Hexagon, Globe, 
  Lock, Beaker, Radio
} from 'lucide-react';

const DocSection = ({ title, icon: Icon, children, accentClass = 'text-accent' }: any) => (
    <div className="modern-card group p-10 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
            <Icon size={160} />
        </div>
        <div className="relative z-10">
            <h3 className="font-display text-xl text-foreground italic mb-6 flex items-center gap-4">
                <div className={`p-3 bg-background border border-border rounded-2xl shadow-sm transition-all group-hover:border-accent/30 ${accentClass}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                {title}
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-medium">
                {children}
            </div>
        </div>
    </div>
);

const Documentation: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-border relative">
              <div className="space-y-4">
                <div className="section-label">Technical Intelligence</div>
                <h2 className="font-display text-5xl md:text-6xl text-foreground italic">
                  Mission <span className="text-electric-gradient">Protocols</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                    Technical documentation for the VIP-XNode Intelligence Suite v2.2. Standard Operating Procedures for deep-sector infiltration.
                </p>
              </div>
              
              <div className="px-8 py-4 bg-background-alt border border-accent/20 rounded-3xl flex items-center gap-4 shadow-sm group">
                <ShieldCheck size={20} className="text-accent group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-1">Clearance_Level</span>
                  <span className="text-sm font-mono text-foreground font-black tracking-tighter uppercase italic">LEVEL_7::AUTHORIZED</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <DocSection title="Boolean-Blind Heuristics" icon={Hash}>
                    <p>The core detection method utilizes high-frequency boolean differential analysis. By injecting conditional vectors (e.g., <code className="text-accent font-bold px-1.5 py-0.5 bg-accent/5 rounded">AND 1=1</code> / <code className="text-accent font-bold px-1.5 py-0.5 bg-accent/5 rounded">AND 1=0</code>), the engine monitors server response deltas.</p>
                    <p>When a delta is identified, the engine initiates a <span className="text-foreground font-bold italic">Binary Search Bit-Extraction</span> routine to exfiltrate data character-by-character from the database backend without triggering traditional WAF patterns.</p>
                </DocSection>

                <DocSection title="UNION-Based Exfiltration" icon={Database} accentClass="text-emerald-500">
                    <p>For high-throughput missions, the UNION technique provides the fastest data dump potential. The scanner automatically enumerates columns via <code className="text-emerald-600 font-bold px-1.5 py-0.5 bg-emerald-500/5 rounded">ORDER BY</code> binary searches.</p>
                    <p>Once the column structure is mapped, a specialized multi-row payload is deployed to synchronize targeted database tables directly into the dashboard's local intelligence hub.</p>
                </DocSection>

                <DocSection title="ML Pattern Recognition" icon={Zap} accentClass="text-amber-500">
                    <p>The SQLiHunter v2.2 engine utilizes a <span className="text-foreground font-bold">Bi-LSTM Neural Network</span> trained on over 200,000 positive and negative injection signatures. This layer identifies subtle "soft" error patterns that traditional regex engines miss.</p>
                    <p>The ML engine provides a confidence score (0.0 - 1.0) for every anomalous response, significantly reducing false-positives in high-noise enterprise environments.</p>
                </DocSection>

                <DocSection title="Stealth & Evasion" icon={Shield} accentClass="text-rose-500">
                    <p>To maintain mission integrity, the <span className="text-foreground font-bold">WAF Stealth</span> module applies multiple encoding layers including Hex, Base64, and Double-URL encoding. Payload fragmentation ensures that signatures do not exceed common packet-inspection buffers.</p>
                    <p>Mission protocols utilize the <span className="text-foreground font-bold italic">Adaptive UI Layer</span> to maintain visual stealth and clarity across high-contrast combat zones (Light) and low-light infiltration sectors (Dark).</p>
                </DocSection>

                <DocSection title="XNODE Interface Architecture" icon={Hexagon} accentClass="text-indigo-500">
                    <p>The v2.2.4 update introduces the <span className="text-indigo-600 font-bold uppercase tracking-tighter">Semantic Design System</span>. This architecture decouples hardcoded aesthetics from the functional UI, routing all visual states through a centralized mission-control variable layer.</p>
                    <p>By mapping core colors to technical intent (e.g., <code className="text-indigo-600 font-bold px-1.5 py-0.5 bg-indigo-500/5 rounded">--accent</code> for action vectors, <code className="text-indigo-600 font-bold px-1.5 py-0.5 bg-indigo-500/5 rounded">--background</code> for tactical space), the scanner ensures absolute clarity during high-velocity data sweeps.</p>
                </DocSection>

                <DocSection title="Core Detection Matrix" icon={Terminal}>
                    <p>The v2.2 engine identifies vulnerabilities via three specialized technical triggers:</p>
                    <ul className="space-y-4 pt-2">
                        <li className="flex gap-4 items-start group">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-pulse" />
                          <p className="text-[13px] leading-relaxed">
                            <span className="text-foreground font-bold uppercase tracking-tight">Error Signatures</span>: Scans response content for specific database failure strings.
                          </p>
                        </li>
                        <li className="flex gap-4 items-start group">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <p className="text-[13px] leading-relaxed">
                            <span className="text-foreground font-bold uppercase tracking-tight">Latency Thresholds</span>: Identifies time-based vectors via delays exceeding a 4.0s baseline.
                          </p>
                        </li>
                        <li className="flex gap-4 items-start group">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                          <p className="text-[13px] leading-relaxed">
                            <span className="text-foreground font-bold uppercase tracking-tight">Length Differentials</span>: Analyzes byte-count variances between boolean states.
                          </p>
                        </li>
                    </ul>
                </DocSection>
                
                <div className="modern-card p-10 bg-accent text-white shadow-accent-sm relative overflow-hidden group flex flex-col justify-between">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                      <Beaker size={240} />
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                            <Radio className="text-white" size={24} strokeWidth={3} />
                          </div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Lab</h4>
                        </div>
                        <p className="text-[15px] leading-relaxed font-bold uppercase tracking-widest opacity-90 italic">
                            Experimental payload mutations and zero-day signature sync protocols are available in the Vector Lab.
                        </p>
                    </div>
                    
                    <button className="w-full py-5 bg-white text-accent rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.03] active:scale-95 shadow-xl relative z-10 mt-10">
                        ACCESS_RESEARCH_PORTAL
                    </button>
                </div>
            </div>

            {/* Mitigation Protocol Section */}
            <div className="modern-card p-12 relative overflow-hidden group shadow-2xl border-t-4 border-t-emerald-500">
                <div className="absolute inset-0 dot-pattern opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
                  <ShieldCheck size={200} />
                </div>
                
                <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-background-alt text-emerald-600 rounded-2xl border border-emerald-500/20 shadow-sm transition-all group-hover:scale-110">
                        <ShieldCheck size={28} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-display text-3xl text-foreground italic flex items-center gap-4 uppercase tracking-tight">
                            Mission Mitigation Protocol
                        </h3>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-60">Strategic Countermeasures & Defense</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] border-l-2 border-emerald-500 pl-4 py-1">Primary Remediation</h4>
                            <div className="space-y-6">
                                {[
                                    { t: "Prepared Statements", d: "Enforce parameterized queries to decouple code from data vectors.", icon: Code },
                                    { t: "Input Sanitization", d: "Implement strict allow-list validation on all entry points.", icon: Lock }
                                ].map(item => (
                                    <div key={item.t} className="flex gap-5 group/item">
                                        <div className="p-3 bg-background border border-border group-hover/item:border-emerald-500/30 transition-all shadow-sm">
                                          <item.icon size={16} className="text-muted-foreground group-hover/item:text-emerald-600 transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground mb-1">{item.t}</p>
                                            <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] border-l-2 border-emerald-500 pl-4 py-1">Atmospheric Defense</h4>
                            <div className="space-y-6">
                                {[
                                    { t: "WAF Integration", d: "Deploy Cloud-native firewalls with updated SQLi signature sets.", icon: Globe },
                                    { t: "Least Privilege", d: "Restrict database service accounts to absolute minimum permissions.", icon: Shield }
                                ].map(item => (
                                    <div key={item.t} className="flex gap-5 group/item">
                                        <div className="p-3 bg-muted/50 rounded-xl border border-border group-hover/item:border-emerald-500/30 transition-all">
                                          <item.icon size={16} className="text-muted-foreground group-hover/item:text-emerald-600 transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground mb-1">{item.t}</p>
                                            <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ethics & Logic Matrix */}
            <div className="modern-card p-16 relative overflow-hidden group shadow-inner bg-background-alt border-b-4 border-b-accent">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="max-w-4xl mx-auto space-y-12 relative z-10 text-center">
                    <div className="space-y-4">
                        <div className="p-4 bg-background border border-border rounded-full w-fit mx-auto shadow-sm group-hover:scale-110 transition-transform duration-700">
                          <Terminal size={32} className="text-accent" strokeWidth={2.5} />
                        </div>
                        <h3 className="font-display text-4xl text-foreground italic uppercase tracking-tight">
                            Mission Authorization & Ethics
                        </h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] font-mono">
                          Standardized Engagement protocols // 2.2.4-STABLE
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] leading-loose text-left">
                        <div className="space-y-6">
                            <div className="flex gap-6 items-start group/li">
                              <span className="text-accent font-black text-xs group-hover/li:translate-x-1 transition-transform">[01]</span>
                              <p className="italic">Use of this suite is strictly authorized for internal infrastructure testing and authorized offensive security missions.</p>
                            </div>
                            <div className="flex gap-6 items-start group/li">
                              <span className="text-accent font-black text-xs group-hover/li:translate-x-1 transition-transform">[02]</span>
                              <p className="italic">All exfiltrated data is cached locally and should be purged via the Mission Maintenance protocol after use.</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-6 items-start group/li">
                              <span className="text-accent font-black text-xs group-hover/li:translate-x-1 transition-transform">[03]</span>
                              <p className="italic">The v2.2 engine signature is designed for maximum stealth; prioritize secured proxy tunnels for high-noise sectors.</p>
                            </div>
                            <div className="flex gap-6 items-start group/li">
                              <span className="text-accent font-black text-xs group-hover/li:translate-x-1 transition-transform">[04]</span>
                              <p className="italic">Developers (VIPHACKER.100) assume no liability for unauthorized deployment or mission-critical data breaches.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documentation;
