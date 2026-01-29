import { useState, useEffect, useMemo } from 'react';
import { calculateWeatherValue, EORZEA_RATIO, ET_HOUR_IN_LT, ET_MINUTE_IN_LT } from '../utils/weatherUtils';

export const useEorzeaTime = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const eorzeaData = useMemo(() => {
    const totalETSeconds = (currentTime * EORZEA_RATIO) / 1000;
    const etHours = Math.floor(totalETSeconds / 3600) % 24;
    const etDay = (Math.floor(totalETSeconds / 86400) % 32) + 1;
    
    let moonLabel = "殘月"; 
    if (etDay <= 4) moonLabel = "新月"; 
    else if (etDay <= 8) moonLabel = "眉月"; 
    else if (etDay <= 20 && etDay >= 16) moonLabel = "滿月";

    const earthSeconds = currentTime / 1000;
    const curVal = calculateWeatherValue(earthSeconds);
    const nxtVal = calculateWeatherValue(earthSeconds + 1400);
    const nWinStart = (Math.floor(etHours / 8) + 1) * 8;
    const ltToNext = (nWinStart - etHours) * ET_HOUR_IN_LT - ((Math.floor(totalETSeconds / 60) % 60) * ET_MINUTE_IN_LT);

    const displayTime = `${etHours.toString().padStart(2, '0')}:${(Math.floor(totalETSeconds / 60) % 60).toString().padStart(2, '0')}`;
    const nextIn = `${Math.floor(ltToNext / 60000)}m ${Math.floor((ltToNext % 60000) / 1000)}s`;

    return { currentTime, hours: etHours, day: etDay, moonLabel, curVal, nxtVal, displayTime, nextIn };
  }, [currentTime]);

  return eorzeaData;
};