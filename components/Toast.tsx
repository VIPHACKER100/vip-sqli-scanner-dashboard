import React from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`pointer-events-auto w-96 bg-gray-900/95 backdrop-blur shadow-2xl rounded-lg border-l-4 transform transition-all duration-500 ease-in-out animate-pulse-fast flex items-start p-4 ${
            toast.type === 'error' ? 'border-red-500 shadow-red-900/20' : 'border-amber-500 shadow-amber-900/20'
          }`}
        >
          <div className="flex-shrink-0 pt-0.5">
             {toast.type === 'error' ? (
               <ShieldAlert className="w-5 h-5 text-red-500" />
             ) : (
               <AlertTriangle className="w-5 h-5 text-amber-500" />
             )}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-bold ${toast.type === 'error' ? 'text-red-400' : 'text-amber-400'}`}>
              {toast.title}
            </p>
            <p className="mt-1 text-xs text-gray-300 font-mono break-all line-clamp-2">
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onDismiss(toast.id)}
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-white focus:outline-none transition-colors"
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;