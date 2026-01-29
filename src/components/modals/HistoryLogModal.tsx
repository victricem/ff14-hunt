import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { X, FileClock, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const APP_ID = 'ffxiv-hunt-stable-final-v24';

interface HistoryLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  server: string;
  mobId: string | null;
  mobName: string;
  isMidnight: boolean;
}

export const HistoryLogModal: React.FC<HistoryLogModalProps> = ({ 
  isOpen, onClose, server, mobId, mobName, isMidnight 
}) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !mobId) return;

    setLoading(true);
    const q = query(
      collection(db, 'artifacts', APP_ID, 'public', 'data', `timers-${server}`, mobId, 'history'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id }));
      setLogs(list);
      setLoading(false);
    }, (err) => {
        console.error("History fetch error:", err);
        setLoading(false);
    });

    return () => unsub();
  }, [isOpen, server, mobId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={clsx(
          "border-2 rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh] overflow-hidden transition-all",
          isMidnight ? "bg-[#12141e] border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-700"
      )}>
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center shrink-0">
          <h3 className="text-xl md:text-2xl font-black flex items-center gap-3">
            <span className="bg-blue-600 text-white p-2 md:p-2.5 rounded-xl"><FileClock className="w-5 h-5 md:w-6 md:h-6" /></span>
            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2">
                <span>{mobName}</span>
                <span className="text-xs md:text-sm opacity-50 font-normal">({server})</span>
            </div>
          </h3>
          <button 
            onClick={onClose} 
            className={clsx("p-3 rounded-xl transition-colors", isMidnight ? "bg-white/5 hover:bg-white/10" : "bg-slate-100 hover:bg-slate-200")}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-3">
          {loading ? (
              <div className="flex justify-center py-10 opacity-50"><Loader2 className="w-8 h-8 animate-spin"/></div>
          ) : logs.length === 0 ? (
              <div className="text-center opacity-40 py-10 font-black tracking-widest text-sm">尚無歷史紀錄</div>
          ) : (
              logs.map(log => (
                <div key={log.id} className={clsx(
                    "p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm transition-all hover:scale-[1.01]", 
                    isMidnight ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                )}>
                  <div className="flex items-start md:items-center gap-4">
                    <div className={clsx(
                        "text-[10px] font-mono px-2 py-1 rounded shrink-0 text-center",
                        isMidnight ? "bg-black/40 text-slate-400" : "bg-slate-200 text-slate-500"
                    )}>
                      <div className="font-bold">{new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                      <div className="opacity-60 text-[9px]">{new Date(log.timestamp).toLocaleDateString()}</div>
                    </div>
                    
                    <div>
                      <div className="font-bold text-base flex items-center gap-2">
                        <span className={clsx(
                            "text-[10px] px-2 py-0.5 rounded border font-black",
                            log.action === 'KILL' ? "border-red-500/50 text-red-500 bg-red-500/10" : 
                            log.action === 'RESET' ? "border-blue-500/50 text-blue-500 bg-blue-500/10" : 
                            "border-amber-500/50 text-amber-500 bg-amber-500/10"
                        )}>
                          {log.action === 'KILL' ? '擊殺' : log.action === 'RESET' ? '重置' : '手動'}
                        </span>
                      </div>
                      <div className="opacity-60 text-xs mt-1 font-medium">{log.details}</div>
                    </div>
                  </div>
                  
                  <div className="text-[10px] opacity-40 text-right font-mono flex items-center justify-end gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                      by {log.userLabel}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};