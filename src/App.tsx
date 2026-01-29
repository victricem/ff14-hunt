import { useState, useEffect, useMemo, useRef } from 'react';
import { collection, onSnapshot, doc, setDoc, getDoc, addDoc, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { db, auth } from './config/firebase';
import { HUNT_DATA, EXPANSIONS, SERVERS } from './data/huntData'; 
import type { Mob } from './data/huntData';
import { useEorzeaTime } from './hooks/useEorzeaTime';
import clsx from 'clsx';
import { Loader2, LayoutGrid, List, Shield, Sword } from 'lucide-react';

import { Header } from './components/layout/Header';
import { LiveFeed } from './components/layout/LiveFeed';
import { HuntCard } from './components/HuntCard'; 
import { HuntTrainPanel } from './components/hunt/HuntTrainPanel';
import { WeatherModal } from './components/modals/WeatherModal';
import { AdminModal } from './components/modals/AdminModal';
import { HistoryLogModal } from './components/modals/HistoryLogModal'; 

const APP_ID = 'ffxiv-hunt-stable-final-v24';

// SHA256 Helper
async function sha256(message: string) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function App() {
  const eorzeaData = useEorzeaTime();
  const [theme, setTheme] = useState(() => localStorage.getItem('ff-theme') || 'sunlight');
  const [selectedServer, setSelectedServer] = useState(() => localStorage.getItem('ff-server') || '伊弗利特');
  const [activeTab, setActiveTab] = useState('all'); 
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card'); 
  const [sortByStatus, setSortByStatus] = useState(true); 

  const [user, setUser] = useState<any>(null);
  const [hunterName, setHunterName] = useState('');
  const [isAdmin, setIsAdmin] = useState(() => { try { return localStorage.getItem('ff-is-admin') === 'true'; } catch(e) { return false; } });
  
  const [timers, setTimers] = useState<Record<string, any>>({});
  const [trainList, setTrainList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for manual time editing
  const [editingTimeId, setEditingTimeId] = useState<string | null>(null);
  const [customTimeInput, setCustomTimeInput] = useState("");

  const [showWeather, setShowWeather] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [historyTarget, setHistoryTarget] = useState<{isOpen: boolean, mobId: string|null, mobName: string}>({ isOpen: false, mobId: null, mobName: '' });

  const isMidnight = theme === 'midnight';

  // Mouse Drag Logic
  const tabsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    if (tabsRef.current) {
        startX.current = e.pageX - tabsRef.current.offsetLeft;
        scrollLeftVal.current = tabsRef.current.scrollLeft;
    }
  };
  const onMouseLeave = () => { isDragging.current = false; };
  const onMouseUp = () => { isDragging.current = false; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; 
    tabsRef.current.scrollLeft = scrollLeftVal.current - walk;
  };

  const styles = {
    bg: isMidnight ? 'bg-[#0a0b10] text-slate-200' : 'bg-slate-50 text-slate-900',
    btn: isMidnight ? 'bg-[#252a3a] border-white/10 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100',
    container: isMidnight ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200',
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
        if (u) {
            setUser(u);
            if (!u.isAnonymous) {
                try {
                    const snap = await getDoc(doc(db, 'users', u.uid));
                    if (snap.exists()) setHunterName(snap.data().hunterName || '');
                } catch(e) { console.error(e); }
            }
        } else {
            signInAnonymously(auth).catch(console.error);
            setHunterName('');
        }
    });
    return () => unsub();
  }, []);

  const handleLogin = () => signInWithPopup(auth, new GoogleAuthProvider()).catch(console.error);
  const handleLogout = () => signOut(auth).catch(console.error);
  
  const handleUpdateName = async (name: string) => {
      if (!user || user.isAnonymous) return;
      try {
        await setDoc(doc(db, 'users', user.uid), { hunterName: name }, { merge: true });
        setHunterName(name);
      } catch(e) { alert("更新稱號失敗"); }
  };

  const handleVerifyAdmin = async (key: string) => {
      if (!user || user.isAnonymous) {
          alert("⛔ 權限驗證失敗\n\n請先點擊右上角登入 Google 帳號，才能進行領隊授權驗證。");
          return;
      }
      if (!key) return;

      try {
          const inputHash = await sha256(key);
          const docRef = doc(db, 'config', 'admin_settings');
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
              const dbHash = docSnap.data().password_hash;
              if (inputHash === dbHash) {
                  setIsAdmin(true);
                  localStorage.setItem('ff-is-admin', 'true');
                  setShowAdmin(false);
                  alert("🎉 領隊授權成功！");
              } else {
                  alert("⛔ 密碼錯誤");
              }
          } else {
              console.error("尚未在資料庫設定密碼 (config/admin_settings)");
              alert("系統錯誤：未設定管理員密碼庫");
          }
      } catch (e) {
          console.error("驗證失敗", e);
          alert("驗證過程發生錯誤");
      }
  };

  const handleToggleAdmin = () => {
      if (isAdmin) {
          setIsAdmin(false);
          localStorage.removeItem('ff-is-admin');
      } else {
          setShowAdmin(true);
      }
  };

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, 'artifacts', APP_ID, 'public', 'data', `timers-${selectedServer}`), (snap) => {
        const d: any = {};
        snap.forEach(doc => d[doc.id] = doc.data());
        setTimers(d);
        setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });
    return () => unsub();
  }, [selectedServer]);

  // Log Action Helper
  const logAction = async (mobId: string, mobName: string, actionType: string, details: string = "") => {
    try {
      const historyRef = collection(db, 'artifacts', APP_ID, 'public', 'data', `timers-${selectedServer}`, mobId, 'history');
      const displayName = isAdmin ? '領隊 (Admin)' : (hunterName || '匿名獵人');
      const recorderUid = user && !user.isAnonymous ? user.uid : (isAdmin ? 'ADMIN' : 'ANONYMOUS');

      await addDoc(historyRef, { 
          mobName, 
          action: actionType, 
          details, 
          timestamp: Date.now(), 
          userLabel: displayName,
          uid: recorderUid
      });

      const q = query(historyRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      if (snapshot.size > 50) {
        const toDelete = snapshot.docs.slice(50);
        toDelete.forEach(async (docSnapshot) => await deleteDoc(docSnapshot.ref));
      }
    } catch (e) { console.error("Log error:", e); }
  };

  const handleManualUpdate = async (mobId: string, mobName: string, windowHours: number) => {
      if (!isAdmin || !customTimeInput) return;
      try {
          const selectedTs = new Date(customTimeInput).getTime();
          if (isNaN(selectedTs)) {
              alert("時間格式錯誤");
              return;
          }
          const ref = doc(db, 'artifacts', APP_ID, 'public', 'data', `timers-${selectedServer}`, mobId);
          await setDoc(ref, {
              startTime: selectedTs,
              endTime: selectedTs + (windowHours * 3600000),
              updatedAt: Date.now(),
              isManual: true,
              windowHours: windowHours
          }, { merge: true });
          
          logAction(mobId, mobName, 'EDIT', `手動調整時間至 ${new Date(customTimeInput).toLocaleTimeString()}`);

          setEditingTimeId(null);
          setCustomTimeInput("");
          alert("✅ 時間已手動校正");
      } catch (e) {
          console.error(e);
          alert("❌ 更新失敗");
      }
  };

  const liveAlerts = useMemo(() => {
      const alerts: any[] = [];
      const targetKeys = activeTab === 'all' ? Object.keys(HUNT_DATA) : [activeTab];

      targetKeys.forEach(k => {
          if (!HUNT_DATA[k]) return;
          [...HUNT_DATA[k].s, ...HUNT_DATA[k].a].forEach((m, i) => {
              const rank = HUNT_DATA[k].s.includes(m) ? 's' : 'a';
              const id = `${k}-${rank}-${i}`;
              const timer = timers[id];
              if (!timer?.endTime || timer.endTime <= eorzeaData.currentTime) {
                  alerts.push({ ...m, id, expKey: k, rank, timer });
              }
          });
      });
      return alerts.sort((a) => (a.rank === 's' ? -1 : 1)).slice(0, 30);
  }, [timers, eorzeaData.currentTime, selectedServer, activeTab]);

  const currentViewData = useMemo(() => {
      const sList: Mob[] = [];
      const aList: Mob[] = [];
      const targetKeys = activeTab === 'all' ? Object.keys(HUNT_DATA) : [activeTab];

      targetKeys.forEach(k => {
          const exp = HUNT_DATA[k];
          if (exp) {
              exp.s.forEach((m, i) => sList.push({ ...m, id: `${k}-s-${i}`, rank: 's', expKey: k }));
              exp.a.forEach((m, i) => aList.push({ ...m, id: `${k}-a-${i}`, rank: 'a', expKey: k }));
          }
      });

      const sortFn = (a: Mob, b: Mob) => {
          if (sortByStatus) {
              const aT = timers[a.id!]?.endTime || 0;
              const bT = timers[b.id!]?.endTime || 0;
              const aReady = aT <= eorzeaData.currentTime;
              const bReady = bT <= eorzeaData.currentTime;
              if (aReady && !bReady) return -1;
              if (!aReady && bReady) return 1;
          }
           const aS = a.zone.includes('全境');
           const bS = b.zone.includes('全境');
           if (aS && !bS) return -1;
           if (!aS && bS) return 1;
          return 0; 
      };

      return { s: sList.sort(sortFn), a: aList.sort(sortFn) };
  }, [activeTab, timers, sortByStatus, eorzeaData.currentTime]);

  const handleToggleKill = async (mobId: string, mobName: string, windowHours: number) => {
      if (!mobId) return;
      const timer = timers[mobId];
      const isKilled = timer?.endTime > eorzeaData.currentTime;
      
      if (!isKilled && user && user.isAnonymous) {
         if(window.confirm("【防亂按機制】請先登入 Google 帳號才能回報時間。")) handleLogin();
         return;
      }
      if (isKilled && !isAdmin) {
         alert("權限不足：只有領隊可以重置時間。");
         return;
      }

      const ref = doc(db, 'artifacts', APP_ID, 'public', 'data', `timers-${selectedServer}`, mobId);
      try {
          if (isKilled) {
              await setDoc(ref, {});
              logAction(mobId, mobName, 'RESET', '重置了計時器');
          } else {
              const now = Date.now();
              await setDoc(ref, { startTime: now, endTime: now + windowHours * 3600000, updatedAt: now }, { merge: true });
              logAction(mobId, mobName, 'KILL', `標記擊殺，冷卻 ${windowHours} 小時`);
          }
      } catch (e) { alert("操作失敗"); }
  };

  const toggleTrain = (mobName: string, zone: string) => {
      const id = `${mobName}-${selectedServer}`;
      setTrainList(prev => prev.some(x => x.id === id) ? prev.filter(x => x.id !== id) : [...prev, { id, mobName, zone, server: selectedServer, uniqueId: Date.now().toString() }]);
  };

  return (
    <div className={clsx("min-h-screen p-4 pb-96 transition-all duration-500 font-black", styles.bg)}>
      <Header 
        user={user} hunterName={hunterName} setHunterName={handleUpdateName} onLogin={handleLogin} onLogout={handleLogout}
        selectedServer={selectedServer} setSelectedServer={setSelectedServer} eorzeaData={eorzeaData} theme={theme} setTheme={(t) => {setTheme(t); localStorage.setItem('ff-theme', t)}}
        onShowWeather={() => setShowWeather(true)} currentTime={eorzeaData.currentTime} isMidnight={isMidnight}
        isAdmin={isAdmin} onToggleAdmin={handleToggleAdmin}
      />

      <LiveFeed 
        alerts={liveAlerts} currentTime={eorzeaData.currentTime} onTabChange={setActiveTab} 
        isMidnight={isMidnight} timers={timers} selectedServer={selectedServer}
      />

      <div className="flex flex-wrap gap-2 mb-6 bg-black/10 p-2 rounded-2xl font-black">
        {SERVERS.map(s => (
            <button key={s} onClick={() => { setSelectedServer(s); localStorage.setItem('ff-server', s); }} className={clsx("flex-1 py-4 rounded-xl text-xs font-black transition-all", selectedServer === s ? "bg-blue-600 text-white shadow-xl shadow-blue-900/30" : "bg-transparent text-slate-500 hover:bg-white/5")}>{s}</button>
        ))}
      </div>

      <div className="flex flex-col gap-6 mb-12 font-black">
          <div className="relative scroll-gradient-mask">
            <div ref={tabsRef} onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove} className="flex flex-nowrap gap-3 overflow-x-auto pb-4 scrollbar-hide font-black px-1 cursor-grab active:cursor-grabbing select-none">
                {EXPANSIONS.map(e => (
                    <button key={e.id} onClick={() => setActiveTab(e.id)} className={clsx("flex-shrink-0 px-7 py-4 rounded-3xl text-xs font-black transition-all border-2 whitespace-nowrap", activeTab === e.id ? clsx(e.color || "bg-blue-600", "border-transparent text-white shadow-xl scale-105") : clsx(styles.btn))}>{e.name}</button>
                ))}
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-4">
             <div className={clsx("border-2 rounded-2xl p-1 flex gap-1 font-black", isMidnight ? "bg-black/40 border-white/5" : "bg-white border-slate-200")}>
                 <button onClick={() => setViewMode('card')} className={clsx("p-2.5 rounded-xl transition-all", viewMode==='card'?"bg-blue-600 text-white shadow-lg":"")}><LayoutGrid className="w-5 h-5"/></button>
                 <button onClick={() => setViewMode('list')} className={clsx("p-2.5 rounded-xl transition-all", viewMode==='list'?"bg-blue-600 text-white shadow-lg":"")}><List className="w-5 h-5"/></button>
             </div>
             <button onClick={() => setSortByStatus(!sortByStatus)} className={clsx("px-6 py-3 rounded-2xl border-2 text-[11px] uppercase transition-all font-black", styles.btn)}>排序：{sortByStatus ? '重生優先' : '預設排序'}</button>
          </div>
      </div>

      {loading ? <div className="flex flex-col items-center justify-center py-48 opacity-50"><Loader2 className="animate-spin w-12 h-12 mb-4 text-blue-500"/><span className="font-black tracking-widest animate-pulse">SYNCING DATA...</span></div> : (
          <div className={clsx(viewMode === 'card' ? "grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 font-black" : "flex flex-col gap-10 font-black")}>
              
              <section className={clsx(viewMode === 'list' ? "w-full" : "")}>
                  <h2 className={clsx("text-3xl md:text-4xl mb-6 md:mb-10 flex items-center gap-3 md:gap-5 px-6 font-black", isMidnight ? "text-white" : "text-slate-900")}>
                      <Shield className="w-8 h-8 md:w-12 md:h-12 text-yellow-500 font-black"/> S-Rank
                  </h2>
                  <div className={clsx(viewMode==='card' ? "flex flex-col gap-4 md:gap-10" : clsx("flex flex-col border-2 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden divide-y divide-white/5", styles.container))}>
                      {currentViewData.s.map(mob => (
                          <HuntCard 
                            key={mob.id} mob={mob} timer={timers[mob.id!]} currentTime={eorzeaData.currentTime} isMidnight={isMidnight} isAdmin={isAdmin} server={selectedServer} inTrain={trainList.some(x => x.mobName === mob.cn)} viewMode={viewMode}
                            onToggleKill={() => handleToggleKill(mob.id!, mob.cn, mob.window)} 
                            onToggleTrain={() => toggleTrain(mob.cn, mob.zone)} 
                            onOpenHistory={() => setHistoryTarget({isOpen: true, mobId: mob.id!, mobName: mob.cn})} 
                            isEditing={editingTimeId === mob.id}
                            editTimeVal={customTimeInput}
                            setEditTimeVal={setCustomTimeInput}
                            onToggleEdit={() => setEditingTimeId(editingTimeId === mob.id ? null : mob.id!)}
                            onManualSubmit={() => handleManualUpdate(mob.id!, mob.cn, mob.window)}
                          />
                      ))}
                  </div>
              </section>
              
              <section className={clsx(viewMode === 'list' ? "w-full" : "")}>
                  <h2 className={clsx("text-3xl md:text-4xl mb-6 md:mb-10 flex items-center gap-3 md:gap-5 px-6 font-black", isMidnight ? "text-white" : "text-slate-900")}>
                      <Sword className="w-8 h-8 md:w-12 md:h-12 text-blue-500 font-black"/> A-Rank
                  </h2>
                  <div className={clsx(viewMode==='card' ? "flex flex-col gap-4 md:gap-8" : clsx("flex flex-col border-2 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden divide-y divide-white/5", styles.container))}>
                      {currentViewData.a.map(mob => (
                          <HuntCard 
                            key={mob.id} mob={mob} timer={timers[mob.id!]} currentTime={eorzeaData.currentTime} isMidnight={isMidnight} isAdmin={isAdmin} server={selectedServer} inTrain={trainList.some(x => x.mobName === mob.cn)} viewMode={viewMode}
                            onToggleKill={() => handleToggleKill(mob.id!, mob.cn, mob.window)} 
                            onToggleTrain={() => toggleTrain(mob.cn, mob.zone)} 
                            onOpenHistory={() => setHistoryTarget({isOpen: true, mobId: mob.id!, mobName: mob.cn})} 
                            isEditing={editingTimeId === mob.id}
                            editTimeVal={customTimeInput}
                            setEditTimeVal={setCustomTimeInput}
                            onToggleEdit={() => setEditingTimeId(editingTimeId === mob.id ? null : mob.id!)}
                            onManualSubmit={() => handleManualUpdate(mob.id!, mob.cn, mob.window)}
                          />
                      ))}
                  </div>
              </section>
          </div>
      )}

      <HuntTrainPanel list={trainList} setList={setTrainList} isMidnight={isMidnight} />
      <WeatherModal isOpen={showWeather} onClose={() => setShowWeather(false)} eorzeaData={eorzeaData} isMidnight={isMidnight} />
      <AdminModal isOpen={showAdmin} onClose={() => setShowAdmin(false)} onVerify={handleVerifyAdmin} isMidnight={isMidnight} />
      <HistoryLogModal isOpen={historyTarget.isOpen} onClose={() => setHistoryTarget({...historyTarget, isOpen: false})} server={selectedServer} mobId={historyTarget.mobId} mobName={historyTarget.mobName} isMidnight={isMidnight} />
    </div>
  );
}

export default App;