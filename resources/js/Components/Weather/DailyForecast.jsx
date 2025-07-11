// resources/js/Components/Weather/DailyForecast.jsx

import React from 'react';
import dayjs from 'dayjs';
import WeatherIcon from './WeatherIcon';

const DailyForecast = ({ dailyData }) => {
    if (!dailyData || !dailyData.length) return null;

    return (
        <div className="glass-card p-4">
            <h3 className="font-bold mb-2">5-Day Forecast</h3>
            <div className="space-y-2">
                {dailyData.map((day, i) => (
                    <div key={i} className="flex items-center justify-between text-sm sm:text-base">
                        <p className="w-1/4 font-semibold">{dayjs(day.date).format('ddd')}</p>
                        <div className="w-1/4 flex justify-center">
                            <WeatherIcon code={day.icon} isDay={true} className="text-2xl" />
                        </div>
                        <p className="w-1/4 text-sm opacity-80">{Math.round(day.minTemp)}°</p>
                        <div className="w-full bg-gray-200/30 rounded-full h-1.5 dark:bg-gray-700/50 mx-2">
                            <div className="bg-gradient-to-r from-sky-400 to-orange-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, ((day.maxTemp - day.minTemp) / 20) * 100)}%` }}></div>
                        </div>
                        <p className="w-1/4 text-right font-semibold">{Math.round(day.maxTemp)}°</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyForecast;