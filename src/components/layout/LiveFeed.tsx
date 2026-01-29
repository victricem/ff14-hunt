import React, { useRef } from 'react';
import { Megaphone, Loader2 } from 'lucide-react';

// 1. 在介面中補上 selectedServer
interface LiveFeedProps {
  alerts: any[];
  currentTime: number;
  onTabChange: (tab: string) => void;
  isMidnight: boolean;
  timers: Record<string, any>;
  selectedServer: string;
}

// 2. 在元件參數中加入 selectedServer
export const LiveFeed: React.FC<LiveFeedProps> = ({ 
  alerts,  
  onTabChange, 
  isMidnight, 
  selectedServer
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const getStyles = (rank: string, statusColor: string) => {
     let base = { bg: 'from-slate-500/5', border: 'border-slate-300', dot: 'bg-slate-400' };
     if (rank === 's') {
        base = { bg: 'from-emerald-500/20', border: 'border-emerald-500', dot: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' };
     } else if (statusColor.includes('red')) {
        base = { bg: 'from-red-500/15', border: 'border-red-500', dot: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-bounce' };
     }
     return base;
  };

  return (
    <div className={`mb-6 md:mb-10 flex flex-col md:flex-row items-stretch border rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md ${isMidnight ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'} font-black`}>
      <div className="w-full md:w-auto h-12 md:h-auto px-6 md:px-8 py-2 md:py-4 bg-gradient-to-r md:bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex md:flex-col flex-row items-center justify-between md:justify-center gap-3 font-black">
          <div className="flex items-center gap-2 md:gap-0 md:flex-col">
              <Megaphone className="w-5 h-5 md:w-6 md:h-6 animate-bounce" />
              <span className="text-[10px] md:text-[10px] uppercase font-black tracking-widest mt-0 md:mt-1">Live Feed</span>
          </div>
          <span className="md:hidden text-[10px] opacity-60 font-normal tracking-wider">左右滑動 ↔</span>
      </div>

      <div ref={scrollRef} className="flex-1 flex gap-4 overflow-x-auto custom-scrollbar-horizontal py-4 px-4 md:py-6 md:px-6 items-center cursor-grab active:cursor-grabbing select-none font-black">
          {alerts.length > 0 ? alerts.map(m => {
            const statusColor = m.status?.color || 'text-slate-500';
            const style = getStyles(m.rank, statusColor);
            
            return (
              <div key={m.id} onClick={() => onTabChange(m.expKey)} className={`relative flex-shrink-0 flex flex-col justify-center px-5 py-3 md:px-6 md:py-3 rounded-r-2xl border-l-[6px] cursor-pointer transition-all duration-300 hover:-translate-y-1 min-w-[160px] md:min-w-[180px] ${style.border} bg-gradient-to-r ${style.bg} to-transparent`}>
                <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-80 ${isMidnight ? 'text-slate-300' : 'text-slate-600'}`}>
                  [{selectedServer}] {m.rank.toUpperCase()}
                </div>
                <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${style.dot}`}></div>
                    <div className={`text-base md:text-lg font-black tracking-tight leading-none ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>{m.cn}</div>
                </div>
              </div>
            );
          }) : (
             <div className="flex items-center gap-3 px-4 py-2 opacity-40 select-none font-black">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400"/>
                <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">Scanning...</span>
             </div>
          )}
      </div>
    </div>
  );
};