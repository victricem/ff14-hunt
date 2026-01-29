import React from 'react';
import { X, CloudSun } from 'lucide-react';
import { getWeather } from '../../utils/weatherUtils';

// 定義要顯示的地圖
const MAPS = ['奧闊帕恰山', '迷津', '黑衣森林中央林區', '東拉諾西亞', '西薩納蘭'];

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  eorzeaData: any;
  isMidnight: boolean;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose, eorzeaData, isMidnight }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
        <div className={`border-2 p-8 rounded-[3rem] max-w-4xl w-full shadow-2xl ${isMidnight ? 'bg-[#12141e] border-white/5 text-white' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black flex items-center gap-3">
                    <CloudSun className="text-blue-400"/> 天氣預報
                </h2>
                <button onClick={onClose} className="p-3 rounded-full border-2 hover:bg-white/10"><X/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 左側資訊 */}
                <div className={`p-8 rounded-[2.5rem] border flex flex-col justify-center ${isMidnight ? 'bg-white/5 border-white/5' : 'bg-slate-50'}`}>
                    <div className="text-xs uppercase tracking-widest opacity-50 mb-2">Current Eorzea Day</div>
                    <div className="text-6xl font-mono font-black mb-4">Day {eorzeaData.day}</div>
                    <div className="text-2xl text-yellow-500 font-black">Next: {eorzeaData.nextIn}</div>
                </div>

                {/* 右側列表 */}
                <div className="space-y-3">
                    {MAPS.map(mapName => (
                        <div key={mapName} className={`p-4 rounded-2xl border flex justify-between items-center ${isMidnight ? 'border-white/10 hover:bg-white/5' : 'border-slate-200'}`}>
                            <span className="font-bold">{mapName}</span>
                            <div className="text-right">
                                <div className="text-blue-400 font-black">{getWeather(mapName, eorzeaData.curVal)}</div>
                                <div className="text-xs opacity-50">Next: {getWeather(mapName, eorzeaData.nxtVal)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};