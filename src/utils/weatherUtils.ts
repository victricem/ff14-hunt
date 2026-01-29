// src/utils/weatherUtils.ts

import type { Mob } from '../data/huntData';

// 常數定義
export const EORZEA_RATIO = 1440 / 70; // 艾歐澤亞時間倍率
export const ET_HOUR_IN_LT = 175 * 1000; // 1 ET 小時 = 175 秒
export const ET_MINUTE_IN_LT = ET_HOUR_IN_LT / 60;
export const WEATHER_PERIOD = 1400; // 天氣每 23分20秒 (1400秒) 變換一次

// ------------------------------------------------------------------
// 核心算法：計算天氣雜湊值 (0-99)
// ------------------------------------------------------------------
export const calculateWeatherValue = (unixSeconds: number) => {
  const timeBlock = Math.floor(unixSeconds / WEATHER_PERIOD);
  // 8小時一個循環 (00:00, 08:00, 16:00)
  const startHour = ((timeBlock + 1) % 3) * 8;
  const totalDays = Math.floor(timeBlock / 3);
  
  const calcBase = totalDays * 100 + startHour;
  // 模擬 32-bit 整數溢位運算 (JavaScript 預設為 double)
  const step1 = ((calcBase << 11) ^ calcBase) >>> 0;
  const step2 = ((step1 >>> 8) ^ step1) >>> 0;
  
  return step2 % 100;
};

// ------------------------------------------------------------------
// 地圖天氣對照表
// ------------------------------------------------------------------
export const getWeather = (zoneName: string, value: number): string => {
  switch (zoneName) {
    case '奧闊帕恰山': 
      if (value < 20) return '碧空'; 
      if (value < 40) return '晴朗'; 
      if (value < 55) return '風'; 
      if (value < 70) return '霧'; 
      if (value < 85) return '雨'; 
      return '雪';

    case '迷津': 
      if (value < 15) return '碧空'; 
      if (value < 60) return '晴朗'; 
      if (value < 75) return '陰雲'; 
      if (value < 85) return '小雨'; 
      if (value < 95) return '雨'; 
      return '靈烈';

    case '黑衣森林中央林區': 
    case '中森': 
      if (value < 5) return '雷'; 
      if (value < 20) return '雨'; 
      if (value < 30) return '霧'; 
      if (value < 40) return '陰雲'; 
      if (value < 70) return '晴朗'; 
      return '碧空'; 

    case '東拉諾西亞': 
    case '東拉': 
      if (value < 5) return '霧'; 
      if (value < 50) return '碧空'; 
      if (value < 80) return '晴朗'; 
      if (value < 90) return '陰雲'; 
      if (value < 95) return '雨'; 
      return '暴雨';

    case '西薩納蘭': 
      if (value < 40) return '碧空'; 
      if (value < 60) return '晴朗'; 
      if (value < 80) return '陰雲'; 
      if (value < 90) return '霧'; 
      return '雨';

    // 預設
    default: return '未知';
  }
};

// ------------------------------------------------------------------
// 複雜邏輯：計算視窗狀態文字
// ------------------------------------------------------------------
export const getWindowText = (mob: Mob, currentTimeMs: number): string | null => {
  if (!mob.windowType) return null;

  // ⚠️ 修正重點：強制將傳入的毫秒轉為整數秒，避免小數點誤差導致亂跳
  const currentUnix = Math.floor(currentTimeMs / 1000);

  // 取得基礎時間 (對齊到最近的一次天氣變換點)
  const weatherBaseTime = Math.floor(currentUnix / WEATHER_PERIOD) * WEATHER_PERIOD;

  // 往未來預測 450 個天氣時段 (約 1 週)
  for (let i = 0; i < 450; i++) {
    const checkTime = weatherBaseTime + (i * WEATHER_PERIOD);
    
    // 計算該時間點的 ET 總秒數
    const checkETTotal = checkTime * EORZEA_RATIO;
    const checkETHours = (checkETTotal / 3600) % 24;

    // 1. 計算天氣條件
    const weatherVal = calculateWeatherValue(Math.floor(checkTime));
    const weatherName = getWeather(mob.zone, weatherVal);
    
    let isWeatherMatch = true;

    // 特殊邏輯：雷德羅巨蛇 (需要連續兩次雨)
    if (mob.windowType === 'continuous-rain') {
      const prevWeatherVal = calculateWeatherValue(Math.floor(checkTime - WEATHER_PERIOD));
      const prevWeatherName = getWeather(mob.zone, prevWeatherVal);
      
      if (weatherName === '雨' && prevWeatherName === '雨') {
        isWeatherMatch = true;
      } else {
        isWeatherMatch = false;
      }
    } else {
      isWeatherMatch = mob.weather ? (mob.weather.includes(weatherName)) : true;
    }

    // 2. 計算月相條件 (1-32)
    // 0 = 新月前夕, 1-4 = 新月範圍
    const moonPhase = (Math.floor(checkETTotal / 86400) + 1) % 32;
    const moonDay = moonPhase === 0 ? 32 : moonPhase; 
    
    const isMoonMatch = mob.moon ? (moonDay >= mob.moon[0] && moonDay <= mob.moon[1]) : true;

    // 如果天氣和月相都符合，再檢查具體 ET 時間段
    if (isWeatherMatch && isMoonMatch) {
      // 檢查該天氣時段內的 8 個 ET 小時 (天氣每8個ET小時換一次)
      for (let h = 0; h < 8; h++) {
        // 真實世界該 ET 小時開始的時間
        // ⚠️ 這裡用 Math.floor 確保整數秒
        const exactSpawnTime = Math.floor(checkTime + (h * 175)); 
        const exactSpawnEndTime = exactSpawnTime + 175;

        // 計算當下的 ET 小時 (0-23)
        const currentETHour = (Math.floor(checkETHours) + h) % 24;

        // 特殊例外：巨大鰩在第 16 天中午前不出
        if (mob.cn === '巨大鰩' && moonDay === 16 && currentETHour < 12) continue;

        let isTimeMatch = true;
        if (mob.time) {
          const [start, end] = mob.time;
          // 處理跨日邏輯 (例如 17:00 到 03:00)
          isTimeMatch = (start < end) 
            ? (currentETHour >= start && currentETHour < end) 
            : (currentETHour >= start || currentETHour < end);
        }

        if (isTimeMatch) {
          // 情況 A：窗口正在開放中
          if (currentUnix >= exactSpawnTime && currentUnix < exactSpawnEndTime) {
            // 計算剩餘秒數 (比較 天氣結束時間 和 ET小時結束時間，取較早者)
            const windowEnd = Math.min(checkTime + WEATHER_PERIOD, exactSpawnEndTime);
            const secondsLeft = windowEnd - currentUnix;
            
            if (secondsLeft <= 0) return "窗口即將結束";
            
            if (mob.windowType === 'continuous-rain') return `觸發開放：連續降雨中`;
            
            const mLeft = Math.floor(secondsLeft / 60);
            const sLeft = Math.floor(secondsLeft % 60);
            return `開放剩餘：${mLeft}m ${String(sLeft).padStart(2, '0')}s`;
          }

          // 情況 B：窗口在未來 (預測)
          if (exactSpawnTime > currentUnix) {
            const waitSeconds = exactSpawnTime - currentUnix;
            const days = Math.floor(waitSeconds / 86400);
            const hours = Math.floor((waitSeconds % 86400) / 3600);
            const mins = Math.floor((waitSeconds % 3600) / 60);
            
            const timeStr = `${hours}h ${String(mins).padStart(2, '0')}m`;
            return days > 0 ? `理論：約 ${days}天 ${timeStr}` : `理論：約 ${timeStr}`;
          }
        }
      }
    }
  }

  return "一週內無符合條件";
};