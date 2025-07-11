// resources/js/Components/Weather/SunPath.jsx

import React, { useState, useEffect } from 'react';
import { FiSun } from 'react-icons/fi';
import dayjs from 'dayjs';

const SunPath = ({ sunrise, sunset }) => {
    const [sunPosition, setSunPosition] = useState(0);

    useEffect(() => {
        const calculateSunPosition = () => {
            const now = dayjs();
            const sunriseTime = dayjs.unix(sunrise);
            const sunsetTime = dayjs.unix(sunset);

            // If it's before sunrise or after sunset, clamp the position
            if (now.isBefore(sunriseTime)) {
                setSunPosition(0);
                return;
            }
            if (now.isAfter(sunsetTime)) {
                setSunPosition(180);
                return;
            }

            // Calculate the percentage of daylight that has passed
            const totalDaylight = sunsetTime.diff(sunriseTime, 'second');
            const daylightPassed = now.diff(sunriseTime, 'second');
            const progress = (daylightPassed / totalDaylight);

            // Convert percentage to a degree from 0 to 180
            setSunPosition(progress * 180);
        };

        // Calculate position immediately on load
        calculateSunPosition();

        // Then update it every minute
        const intervalId = setInterval(calculateSunPosition, 60000);

        // Cleanup on component unmount
        return () => clearInterval(intervalId);

    }, [sunrise, sunset]);

    return (
        <div className="glass-card p-4 flex flex-col justify-between h-full">
            <h3 className="font-bold text-white/90 dark:text-white mb-2">Daylight</h3>
            <div className="relative w-full h-24 flex items-center justify-center">
                {/* The half-circle path */}
                <div className="absolute bottom-0 w-48 h-24 border-t-2 border-dashed border-white/30 rounded-t-full"></div>
                
                {/* Sun icon container - this is what we rotate */}
                <div 
                    className="absolute w-48 h-24"
                    style={{ transform: `rotate(${sunPosition}deg)` }}
                >
                    {/* The Sun Icon itself */}
                    <div className="absolute top-[-10px] left-1/2 -ml-[10px] text-yellow-300">
                        <FiSun size={20} />
                    </div>
                </div>
            </div>
            <div className="flex justify-between text-xs font-semibold text-white/80 mt-2">
                <span>{dayjs.unix(sunrise).format('h:mm A')}</span>
                <span>{dayjs.unix(sunset).format('h:mm A')}</span>
            </div>
        </div>
    );
};

export default SunPath;