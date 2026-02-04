import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 italic">
            <div
                className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />
            <div className="relative w-full max-w-5xl bg-gray-900/40 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-500 overflow-hidden group">
                {/* Glow Border Effect */}
                <div className="absolute inset-0 border-[0.5px] border-primary-500/20 rounded-[40px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5 relative z-10 bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        <h3 className="text-xl font-bold text-white tracking-tighter uppercase">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all border border-white/5"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 relative z-10 scrollbar-hide scan-line-overlay">
                    {children}
                </div>

                {/* Footer Decor */}
                <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-center relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-gray-800"></div>)}
                        </div>
                        <span className="text-[8px] font-mono text-gray-700 uppercase tracking-[0.4em] font-bold">SQLiHunter System Intelligence Modal</span>
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map(j => <div key={j} className="w-1 h-1 rounded-full bg-gray-800"></div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
