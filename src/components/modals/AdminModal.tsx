import React, { useState } from 'react';
import clsx from 'clsx';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (key: string) => void;
  isMidnight: boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onVerify, isMidnight }) => {
  const [inputKey, setInputKey] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/98 backdrop-blur-2xl">
        <div className={clsx("border-2 p-12 rounded-[4rem] shadow-2xl max-w-sm w-full text-center font-black",
            isMidnight ? "bg-[#12141e] border-white/5 text-white" : "bg-white border-slate-200 text-slate-900"
        )}>
            <h2 className="text-3xl mb-12 italic uppercase font-black tracking-tight">領隊授權驗證</h2>
            <input 
                type="password" 
                value={inputKey} 
                onChange={(e) => setInputKey(e.target.value)} 
                placeholder="******" 
                className={clsx("w-full border-2 p-6 rounded-[2rem] mb-12 text-center text-4xl outline-none transition-all shadow-inner font-mono font-black",
                    isMidnight ? "bg-black/50 border-white/10 text-yellow-500 focus:border-yellow-500" : "bg-black/5 border-slate-200 focus:border-blue-500"
                )}
                onKeyDown={(e) => e.key === 'Enter' && onVerify(inputKey)}
                autoFocus
            />
            <div className="flex gap-4">
                <button onClick={onClose} className={clsx("flex-1 py-5 rounded-3xl border-2 uppercase text-xs font-black hover:opacity-70", isMidnight ? "border-white/10" : "border-slate-200")}>取消</button>
                <button onClick={() => onVerify(inputKey)} className="flex-1 py-5 bg-yellow-600 text-white rounded-3xl text-xs font-black uppercase hover:bg-yellow-500 shadow-xl active:scale-95 transition-all">驗證</button>
            </div>
        </div>
    </div>
  );
};