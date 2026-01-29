import React, { useState } from 'react';
import { CheckCircle, RotateCcw, Crown, ListPlus, Check, Edit3, FileClock } from 'lucide-react';
import type { Mob } from '../data/huntData';
import { getWindowText } from '../utils/weatherUtils';
import clsx from 'clsx';

const MOB_IMAGES: Record<string, string> = {
  // 7.0
  '水晶化身之王': 'https://ff14hunt.blob.core.windows.net/image/arch_aethereater.webp',
  '厭忌之人 奇里格': 'https://ff14hunt.blob.core.windows.net/image/Kirlirger_the_Abhorren.webp',
  '伊努索奇': 'https://ff14hunt.blob.core.windows.net/image/Ihnuxokiy.webp',
  '內尤佐緹': 'https://ff14hunt.blob.core.windows.net/image/Neyoozoteel.webp',
  '山謝亞': 'https://ff14hunt.blob.core.windows.net/image/Sansheya.webp',
  '先驅勇士 阿提卡斯': 'https://ff14hunt.blob.core.windows.net/image/Atticus_the_Primogenitor.webp',
  '天氣預報機器人': 'https://ff14hunt.blob.core.windows.net/image/The_Forecaster.webp',
  // 6.0
  '克爾': 'https://ff14hunt.blob.core.windows.net/image/Ker.webp',
  '布弗魯': 'https://ff14hunt.blob.core.windows.net/image/Burfurlur_the_Canny.webp',
  '頗胝迦': 'https://ff14hunt.blob.core.windows.net/image/Sphatika.webp',
  '阿姆斯特朗': 'https://ff14hunt.blob.core.windows.net/image/Armstrong.webp',
  '沉思之物': 'https://ff14hunt.blob.core.windows.net/image/Ruminator.webp',
  '俄菲翁尼厄斯': 'https://ff14hunt.blob.core.windows.net/image/Ophioneus.webp',
  '狹縫': 'https://ff14hunt.blob.core.windows.net/image/Narrow-rift.webp',
  // 5.0
  '得到寬恕的叛亂': 'https://ff14hunt.blob.core.windows.net/image/The_Forgiven_Rebellion.webp',
  '戾蟲': 'https://ff14hunt.blob.core.windows.net/image/Tyger.webp',
  '得到寬恕的炫學': 'https://ff14hunt.blob.core.windows.net/image/Forgiven_Pedantry.webp',
  '多智獸': 'https://ff14hunt.blob.core.windows.net/image/Tarchia.webp',
  '阿格拉俄珀': 'https://ff14hunt.blob.core.windows.net/image/Aglaope.webp',
  '伊休妲': 'https://ff14hunt.blob.core.windows.net/image/Ixtab.webp',
  '顧尼圖': 'https://ff14hunt.blob.core.windows.net/image/Gunitt.webp',
  // 4.0
  '優曇婆羅花': 'https://ff14hunt.blob.core.windows.net/image/Udumbara.webp',
  '爬骨怪龍': 'https://ff14hunt.blob.core.windows.net/image/Bone_Crawler.webp',
  '鹽和光': 'https://ff14hunt.blob.core.windows.net/image/Salt_and_Light.webp',
  '巨大鰩': 'https://ff14hunt.blob.core.windows.net/image/Okina.webp',
  '兀魯忽乃朝魯': 'https://ff14hunt.blob.core.windows.net/image/Orghana.webp',
  '伽馬': 'https://ff14hunt.blob.core.windows.net/image/Gamma.webp',
  // 3.0
  '盧克洛塔': 'https://ff14hunt.blob.core.windows.net/image/Leucrotta.webp',
  '凱撒貝希摩斯': 'https://ff14hunt.blob.core.windows.net/image/Kaiser_Behemoth.webp',
  '神穆爾鳥': 'https://ff14hunt.blob.core.windows.net/image/Senmurv.webp',
  '蒼白騎士': 'https://ff14hunt.blob.core.windows.net/image/The_Pale_Rider.webp',
  '剛德瑞瓦': 'https://ff14hunt.blob.core.windows.net/image/Gandarewa.webp',
  '極樂鳥': 'https://ff14hunt.blob.core.windows.net/image/Bird_of_Paradise.webp',
  // 2.0
  '雷德羅巨蛇': 'https://ff14hunt.blob.core.windows.net/image/Laideronnette.webp',
  '烏爾伽魯': 'https://ff14hunt.blob.core.windows.net/image/Wulgaru.webp',
  '奪心魔': 'https://ff14hunt.blob.core.windows.net/image/Mindflayer.webp',
  '千竿口花希達': 'https://ff14hunt.blob.core.windows.net/image/Thousand-cast_Theda.webp',
  '虛無探索者': 'https://ff14hunt.blob.core.windows.net/image/Zona_Seeker.webp',
  '布隆特斯': 'https://ff14hunt.blob.core.windows.net/image/Brontes.webp',
  '巴拉烏爾': 'https://ff14hunt.blob.core.windows.net/image/Lampalagua.webp',
  '努紐努維': 'https://ff14hunt.blob.core.windows.net/image/Nunyunuwi.webp',
  '蚓螈巨蟲': 'https://ff14hunt.blob.core.windows.net/image/Minhocao.webp',
  '護土精靈': 'https://ff14hunt.blob.core.windows.net/image/Croque-Mitaine.webp',
  '咕爾呱洛斯': 'https://ff14hunt.blob.core.windows.net/image/Croakadile.webp',
  '伽洛克': 'https://ff14hunt.blob.core.windows.net/image/the_Garlok.webp',
  '火憤牛': 'https://ff14hunt.blob.core.windows.net/image/Bonnacon.webp',
  '南迪': 'https://ff14hunt.blob.core.windows.net/image/Nandi.webp',
  '牛頭黑神': 'https://ff14hunt.blob.core.windows.net/image/Chernobog.webp',
  '薩法特': 'https://ff14hunt.blob.core.windows.net/image/Safat.webp',
  '阿格里帕': 'https://ff14hunt.blob.core.windows.net/image/Agrippa_the_Mighty.webp',
};

const formatDateTime = (ts: number) => {
  if (!ts) return "無紀錄";
  const d = new Date(ts);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

interface HuntCardProps {
  mob: Mob;
  timer: any;
  currentTime: number;
  isMidnight: boolean;
  isAdmin: boolean;
  server: string;
  inTrain: boolean;
  viewMode: 'card' | 'list';
  onToggleKill: () => void;
  onToggleTrain: () => void;
  onOpenHistory: () => void;
  isEditing?: boolean;
  editTimeVal?: string;
  setEditTimeVal?: (val: string) => void;
  onToggleEdit?: () => void;
  onManualSubmit?: () => void;
}

export const HuntCard: React.FC<HuntCardProps> = ({ 
  mob, timer, currentTime, isMidnight, isAdmin, server, inTrain, viewMode,
  onToggleKill, onToggleTrain, onOpenHistory,
  isEditing, editTimeVal, setEditTimeVal, onToggleEdit, onManualSubmit
}) => {
  const [showTrigger, setShowTrigger] = useState(false); 

  const isKilled = timer?.endTime > currentTime;
  const isSpecial = mob.rank === 'ss' || mob.zone.includes('全境');
  const winText = getWindowText(mob, currentTime);
  const isWindowOpen = winText && winText.includes("開放");
  const bgImage = MOB_IMAGES[mob.cn];

  const styles = {
    card: isMidnight ? 'bg-[#1a1d27] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-sm',
    btn: isMidnight ? 'bg-[#252a3a] border-white/10 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100',
    specialKing: isMidnight ? 'bg-gradient-to-br from-amber-900/60 via-purple-900/40 to-slate-900/80 border-amber-500/40' : 'bg-gradient-to-br from-amber-50 to-purple-50 border-amber-300/60',
    readyGlowS: isMidnight ? 'border-yellow-500/40 shadow-[0_0_25px_rgba(234,179,8,0.25)] ring-2 ring-yellow-500/20' : 'border-yellow-500/50 bg-yellow-50/5',
    readyGlowA: isMidnight ? 'border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.25)] ring-2 ring-blue-500/20' : 'border-blue-500/50 bg-blue-50/5'
  };

  let statusLabel = '準備就緒';
  let statusColor = isMidnight ? 'text-slate-400 font-black' : 'text-slate-500 font-black';

  if (isKilled) {
      statusLabel = '冷卻中';
      statusColor = isMidnight ? 'text-blue-400 font-black' : 'text-blue-600 font-black';
  } else {
      if (mob.rank === 's') {
          statusLabel = '觸發開放';
          statusColor = isMidnight ? 'text-emerald-400 font-black' : 'text-emerald-600 font-black';
      } else {
          statusLabel = '重生開放';
          statusColor = isMidnight ? 'text-emerald-400 font-black' : 'text-emerald-600 font-black';
      }
  }

  if (isSpecial) {
      statusLabel = '特殊觸發';
      statusColor = 'text-purple-500 font-black animate-pulse';
  }

  const textColorPrimary = isMidnight ? 'text-white' : 'text-slate-900';
  const textColorSecondary = isMidnight ? 'text-slate-400' : 'text-slate-500';

  const calibrationUIContent = (
    <div className={clsx("mt-4 p-4 rounded-2xl border flex flex-col md:flex-row gap-3 animate-in slide-in-from-top-2", isMidnight ? "bg-black/40 border-white/10" : "bg-slate-50 border-slate-200")}>
        <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">指定擊殺時間</label>
            <input 
                type="datetime-local" 
                value={editTimeVal} 
                onChange={(e) => setEditTimeVal?.(e.target.value)}
                onClick={(e) => e.stopPropagation()} 
                className={clsx("w-full p-2 rounded-xl text-sm font-mono outline-none border transition-all", isMidnight ? "bg-black/20 border-white/10 focus:border-blue-500 text-white" : "bg-white border-slate-300 focus:border-blue-500")}
            />
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); onManualSubmit?.(); }}
            className="self-end px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg hover:bg-blue-500 transition-all active:scale-95"
        >
            確認更新
        </button>
    </div>
  );

  // --- LIST VIEW 模式 ---
  if (viewMode === 'list') {
      return (
        <div className={clsx("flex flex-col border-b last:border-0 font-black", isMidnight ? "border-white/5" : "border-slate-100")}>
            <div onClick={() => setShowTrigger(!showTrigger)} className={clsx("p-4 flex items-center justify-between cursor-pointer transition-all", !isKilled ? (isMidnight ? 'bg-emerald-500/10' : 'bg-emerald-50/5') : 'hover:bg-white/5')}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-[10px] text-blue-500 w-12 shrink-0 font-black">[{server.slice(0,2)}]</span>
                    <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                            <span className="text-[10px] text-slate-500 uppercase truncate font-black">{mob.zone}</span>
                            <span className={clsx("md:hidden text-[10px] font-bold", statusColor)}>{statusLabel}</span>
                        </div>
                        <div className={clsx("flex items-center gap-2 text-base font-black truncate", textColorPrimary)}>
                            {mob.cn} {isSpecial && <Crown className="w-3 h-3 text-amber-500 fill-current"/>}
                        </div>
                        
                        {!isKilled && winText && !winText.includes("一週內") && (
                            <div className="mt-1">
                                {isWindowOpen ? (
                                    <span className="text-[10px] text-emerald-500 font-mono font-bold flex items-center gap-1 animate-pulse">
                                        🔥 剩 {winText.replace('開放剩餘：', '')}
                                    </span>
                                ) : (
                                    <span className={clsx("text-[10px] font-mono font-bold flex items-center gap-1", isMidnight ? "text-purple-400" : "text-purple-600")}>
                                        🔮 {winText}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={clsx("hidden md:block text-sm font-black whitespace-nowrap min-w-[80px] text-right", statusColor)}>{statusLabel}</div>
                </div>

                {/* ⚠️ 修正：SS 怪隱藏所有操作按鈕，確保跟 Card View 一致 */}
                {!isSpecial && (
                    <div className="flex gap-2 shrink-0 ml-4">
                        {isAdmin && <button onClick={(e) => { e.stopPropagation(); onToggleEdit?.(); }} className={clsx("p-2 rounded-lg border transition-colors font-black", styles.btn)}><Edit3 className="w-4 h-4"/></button>}
                        <button onClick={(e)=>{e.stopPropagation(); onOpenHistory()}} className={clsx("p-2 rounded-lg border transition-colors font-black", styles.btn)}><FileClock className="w-4 h-4"/></button>
                        <button onClick={(e)=>{e.stopPropagation(); onToggleTrain()}} className={clsx("p-2 rounded-lg border transition-colors font-black", inTrain ? "bg-emerald-600 text-white border-emerald-500" : styles.btn)}>{inTrain?<Check className="w-4 h-4"/>:<ListPlus className="w-4 h-4"/>}</button>
                        <button onClick={(e)=>{e.stopPropagation(); onToggleKill()}} className={clsx("p-2 rounded-lg text-white shadow-lg active:scale-95 transition-transform font-black", isKilled ? "bg-red-600" : "bg-emerald-600")}>{isKilled?<RotateCcw className="w-4 h-4"/>:<CheckCircle className="w-4 h-4"/>}</button>
                    </div>
                )}
            </div>
            
            {(showTrigger || isEditing) && (
                <div className={clsx("px-4 pb-4 md:px-12 md:pb-6", isMidnight ? "bg-white/5" : "bg-slate-50")}>
                    {isEditing && calibrationUIContent}
                    {showTrigger && (
                        <div className={clsx("p-4 mt-2 text-xs font-mono border-l-4 border-blue-500 rounded-r-xl", isMidnight ? "bg-white/5 text-slate-400" : "bg-white text-slate-600 border")}>
                            {timer?.startTime && <div className="mb-2 opacity-70 font-bold">上次擊殺: {formatDateTime(timer.startTime)}</div>}
                            <div className="leading-relaxed">{mob.trigger || "無觸發條件資訊"}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
      );
  }

  // --- CARD VIEW 模式 ---
  return (
    <div className={clsx(
      styles.card,
      "relative overflow-hidden rounded-[2rem] md:rounded-[3.5rem] border-2 p-5 md:p-12 transition-all duration-300 font-black group",
      !isKilled && !isSpecial ? (mob.rank === 's' ? styles.readyGlowS : styles.readyGlowA) : '',
      isSpecial ? styles.specialKing : ''
    )}>
      
      {bgImage && (
          <div className={clsx("monster-bg-art", isMidnight ? "theme-midnight" : "theme-sunlight")}>
              <img src={bgImage} alt={mob.cn} />
          </div>
      )}

      <div className="relative z-10 flex flex-col font-black w-full text-left">
         <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div className="w-full md:pr-10">
               <div className="flex items-center flex-wrap gap-2 mb-4">
                  <span className={clsx("text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-wider", mob.expKey === 'arr' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white')}>
                    {mob.zone.split(' ')[0]}
                  </span>
                  {isSpecial && <span className="bg-purple-500 text-white text-[10px] px-3 py-1 rounded-lg flex items-center gap-1 shadow-md font-black uppercase"><Crown className="w-3 h-3 fill-current"/> SPECIAL</span>}
               </div>

               <h3 className={clsx("text-3xl md:text-5xl mb-2 font-black tracking-tight leading-tight drop-shadow-md", textColorPrimary)}>{mob.cn}</h3>
               <p className={clsx("text-sm md:text-base opacity-40 mb-2 italic font-black", textColorSecondary)}>{mob.jp}</p>
               <div className="text-xs md:text-sm text-slate-500 mb-4 uppercase tracking-widest font-black">{mob.zone}</div>

               <div className={clsx("text-base md:text-2xl font-black tracking-widest uppercase mb-2 flex items-center gap-3", statusColor)}>{statusLabel}</div>

               {!isKilled && winText && winText !== "一週內無符合條件" && !isSpecial && (
                  <div className="mb-6 flex flex-col gap-1">
                    <span className={clsx("text-[10px] font-bold", isWindowOpen ? "text-red-500 animate-pulse" : "opacity-60")}>
                      {isWindowOpen ? "🔥 窗口關閉倒數" : "🔮 預測觸發時間"}
                    </span>
                    <span className={clsx("text-sm md:text-lg font-mono font-black px-2 py-1 rounded-lg w-fit", 
                      isWindowOpen ? "bg-emerald-600 text-white shadow-lg animate-pulse" : "bg-slate-200 text-slate-600"
                    )}>
                      {winText.replace('開放剩餘：', '').replace('理論：', '')}
                    </span>
                  </div>
               )}

               {mob.trigger && (
                 <div className={clsx("mb-4 p-4 rounded-2xl text-xs md:text-sm leading-relaxed border-l-4 backdrop-blur-sm shadow-sm", isMidnight ? "bg-blue-900/30 border-blue-500 text-slate-200" : "bg-white/60 border-blue-400 text-slate-800")}>
                    <span className="block font-bold mb-1 opacity-80 text-blue-400 uppercase tracking-wider text-[10px]">Trigger Condition</span>
                    {mob.trigger}
                 </div>
               )}
               
               {isEditing && calibrationUIContent}
            </div>

            {!isSpecial && (
              <div className="flex flex-row md:flex-col items-center gap-2 md:gap-5 mt-6 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-dashed border-white/10 w-full md:w-auto shrink-0">
                 {isAdmin && <button onClick={(e) => { e.stopPropagation(); onToggleEdit?.(); }} className={clsx("flex-1 md:flex-none p-3.5 md:p-6 rounded-2xl border-2 justify-center flex items-center transition-all hover:scale-110 font-black", styles.btn)}><Edit3 className="w-6 h-6 md:w-8 md:h-8"/></button>}
                 <button onClick={(e)=>{e.stopPropagation(); onOpenHistory()}} className={clsx("flex-1 md:flex-none p-3.5 md:p-6 rounded-2xl border-2 justify-center flex items-center transition-all hover:scale-110 font-black", styles.btn)}><FileClock className="w-6 h-6 md:w-8 md:h-8" /></button>
                 <button onClick={(e)=>{e.stopPropagation(); onToggleTrain()}} className={clsx("flex-1 md:flex-none p-3.5 md:p-6 rounded-2xl border-2 justify-center flex items-center transition-all hover:scale-110 font-black", inTrain ? "bg-emerald-600 text-white border-emerald-500" : styles.btn)}>{inTrain ? <Check className="w-6 h-6 md:w-8 md:h-8" /> : <ListPlus className="w-6 h-6 md:w-8 md:h-8" />}</button>
                 <button onClick={(e)=>{e.stopPropagation(); onToggleKill()}} className={clsx("flex-[2] md:flex-none p-3.5 md:p-6 rounded-2xl border-2 shadow-lg justify-center flex items-center transition-all active:scale-95 hover:scale-110 font-black", isKilled ? (isMidnight ? "bg-red-950/40 border-red-500/50 text-red-500" : "bg-red-600 text-white") : (isMidnight ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-400" : "bg-emerald-600 text-white"))}>{isKilled ? <RotateCcw className="w-6 h-6 md:w-8 md:h-8"/> : <CheckCircle className="w-6 h-6 md:w-8 md:h-8"/>}</button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};