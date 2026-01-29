import React from 'react';
import { LogIn, LogOut, Moon, Sun, Clock, User } from 'lucide-react';
import clsx from 'clsx';


interface HeaderProps {
  user: any;
  hunterName: string;
  setHunterName: (name: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  selectedServer: string;
  setSelectedServer: (server: string) => void;
  eorzeaData: any;
  theme: string;
  setTheme: (theme: string) => void;
  onShowWeather: () => void;
  currentTime: number;
  isMidnight: boolean;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user, hunterName, setHunterName, onLogin, onLogout,
   eorzeaData, isMidnight,
  onShowWeather, currentTime, isAdmin, onToggleAdmin, setTheme
}) => {
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState(hunterName);

  // 樣式變數
  const styles = {
    headerBg: isMidnight ? 'bg-[#12141e]/90 border-white/5 backdrop-blur-xl' : 'bg-white/80 border-slate-200 shadow-sm',
    btn: isMidnight ? 'bg-[#252a3a] border-white/10 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100',
  };

  const handleSaveName = () => {
    setHunterName(tempName);
    setIsEditing(false);
  };

  return (
    <header className={`mb-4 md:mb-8 border-b ${styles.headerBg} p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative z-20 font-black`}>
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-6 font-black">
        
        {/* Logo 區塊 */}
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
          <img 
            src="https://ff14hunt.blob.core.windows.net/image/icon.webp" 
            alt="Hunt Logo" 
            className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border-2 border-yellow-500/30 shrink-0 shadow-lg"
          />
          <div className="text-left font-black">
             <h1 className="text-2xl md:text-4xl font-black tracking-tighter leading-none">FFXIV 繁中狩獵助手</h1>
             <p className="text-slate-500 text-[10px] md:text-xs uppercase tracking-widest font-black opacity-80">FFXIV Hunt Tracker v3.5</p>
          </div>
        </div>

        {/* 使用者登入區塊 */}
        <div className={`w-full md:w-auto px-4 py-2.5 rounded-2xl border-2 flex items-center justify-between md:justify-start gap-3 transition-all ${isMidnight ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'}`}>
           {user && !user.isAnonymous ? (
              <>
                <div className="flex items-center gap-3 overflow-hidden">
                   <img src={user.photoURL} alt="Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/20 shrink-0" />
                   <div className="flex flex-col items-start md:items-end min-w-0">
                      <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                         <User className="w-3 h-3" /> <span>獵人稱號</span>
                      </div>
                      {isEditing ? (
                          <input 
                            autoFocus
                            type="text" 
                            value={tempName} 
                            onChange={(e) => setTempName(e.target.value)} 
                            onBlur={handleSaveName}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                            className={`text-sm md:text-xs font-bold bg-transparent border-b-2 ${isMidnight?'border-blue-500 text-white':'border-blue-500 text-black'} w-24 focus:outline-none`}
                          />
                      ) : (
                          <div onClick={() => { setTempName(hunterName); setIsEditing(true); }} className={`text-sm md:text-xs font-bold cursor-pointer truncate max-w-[100px] ${!hunterName ? 'text-blue-500 animate-pulse' : (isMidnight ? 'text-slate-200' : 'text-slate-800')}`}>
                             {hunterName || '點擊設定...'}
                          </div>
                      )}
                   </div>
                </div>
                <button onClick={onLogout} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0">
                    <LogOut className="w-4 h-4"/>
                </button>
              </>
           ) : (
              <button onClick={onLogin} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400 transition-all py-1">
                 <div className="p-1.5 bg-blue-500 text-white rounded-lg"><LogIn className="w-4 h-4" /></div>
                 <span>Google 登入 (啟用回報)</span>
              </button>
           )}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-end gap-4 font-black">
        <div className="grid grid-cols-3 gap-2 w-full xl:w-auto">
           <button onClick={onToggleAdmin} className={clsx("py-3 rounded-xl border-2 text-[10px] uppercase transition-all font-black flex items-center justify-center gap-1", isAdmin ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : styles.btn)}>
             {isAdmin ? '領隊 ON' : '領隊授權'}
           </button>
           <button onClick={onShowWeather} className={`py-3 rounded-xl border-2 text-[10px] uppercase font-black ${styles.btn}`}>天氣預報</button>
           <button onClick={() => setTheme(isMidnight ? 'sunlight' : 'midnight')} className={`py-3 rounded-xl border-2 text-[10px] uppercase font-black ${styles.btn}`}>{isMidnight ? '切換日光' : '切換深夜'}</button>
        </div>

        <div className="grid grid-cols-3 md:flex md:flex-row gap-2 w-full xl:w-auto">
           <div className={`p-2 md:px-4 md:py-3 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 ${isMidnight ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'}`}>
              <Moon className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
              <div className="text-center md:text-left">
                  <div className="text-[9px] text-slate-500 uppercase font-black leading-none mb-0.5">Moon</div>
                  <div className="text-xs md:text-lg font-black leading-none">{eorzeaData.moonLabel}</div>
              </div>
           </div>
           <div className={`p-2 md:px-4 md:py-3 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 ${isMidnight ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'}`}>
              <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
              <div className="text-center md:text-left">
                  <div className="text-[9px] text-slate-500 uppercase font-black leading-none mb-0.5">ET</div>
                  <div className="text-sm md:text-2xl font-mono font-black leading-none">{eorzeaData.displayTime}</div>
              </div>
           </div>
           <div className={`p-2 md:px-4 md:py-3 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 ${isMidnight ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white border-blue-500/20'}`}>
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              <div className="text-center md:text-left">
                  <div className="text-[9px] text-slate-500 uppercase font-black leading-none mb-0.5">LT</div>
                  <div className="text-sm md:text-xl font-mono font-black leading-none">{new Date(currentTime).toLocaleTimeString([], {hour12:false})}</div>
              </div>
           </div>
        </div>
      </div>
    </header>
  );
};