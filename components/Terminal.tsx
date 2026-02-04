import React, { useEffect, useRef } from 'react';
import { LogEntry, LogLevel } from '../types';
import { Terminal as TerminalIcon, ChevronDown, ChevronUp, Trash2, ShieldAlert, Cpu, Search, AlertCircle } from 'lucide-react';

interface TerminalProps {
    logs: LogEntry[];
    onClear: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ logs, onClear }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const getLevelStyles = (level: LogLevel) => {
        switch (level) {
            case 'VULN': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'EXEC': return 'text-primary-400 bg-primary-400/10 border-primary-400/20';
            case 'WARN': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'ERROR': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const getIcon = (level: LogLevel) => {
        switch (level) {
            case 'VULN': return <ShieldAlert size={12} />;
            case 'EXEC': return <Cpu size={12} />;
            case 'WARN': return <AlertCircle size={12} />;
            case 'ERROR': return <Trash2 size={12} />;
            default: return <Search size={12} />;
        }
    };

    return (
        <div className={`fixed bottom-0 right-0 left-64 transition-all duration-300 z-50 ${isExpanded ? 'h-80' : 'h-10'} bg-gray-950/95 backdrop-blur-md border-t border-white/10 shadow-2xl`}>
            {/* Header */}
            <div className="h-10 flex items-center justify-between px-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-2">
                    <TerminalIcon size={14} className="text-primary-400" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Technical Mission Control</span>
                    <span className="text-[10px] bg-primary-600/20 text-primary-400 px-1.5 py-0.5 rounded border border-primary-600/30 ml-2 font-mono">
                        {logs.length} events
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); onClear(); }}
                        className="p-1 hover:bg-red-600/20 text-gray-500 hover:text-red-400 rounded transition-colors"
                        title="Clear Logs"
                    >
                        <Trash2 size={14} />
                    </button>
                    {isExpanded ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronUp size={14} className="text-gray-500" />}
                </div>
            </div>

            {/* Log Container */}
            {isExpanded && (
                <div className="h-72 overflow-y-auto p-4 font-mono space-y-2 selection:bg-primary-600/30">
                    {logs.map((log) => (
                        <div key={log.id} className="reveal-up group">
                            <div className="flex items-start gap-3">
                                <span className="text-gray-600 text-[10px] mt-0.5 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 mt-0.5 ${getLevelStyles(log.level)}`}>
                                    {getIcon(log.level)}
                                    {log.level}
                                </span>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-300 leading-relaxed">{log.message}</p>
                                    {log.url && <p className="text-[10px] text-primary-500/70 mt-0.5 truncate max-w-full">TARGET :: {log.url}</p>}
                                    {log.payload && (
                                        <div className="mt-2 p-2 bg-gray-900 border border-white/5 rounded text-[11px] text-gray-400 overflow-x-auto">
                                            <span className="text-primary-400 mr-2">$</span>{log.payload}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                            <TerminalIcon size={48} className="text-gray-600 mb-2" />
                            <p className="text-xs uppercase tracking-widest font-bold">Console Waiting for Input...</p>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
};

export default Terminal;
