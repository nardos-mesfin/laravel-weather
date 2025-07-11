// resources/js/Components/Weather/WeatherDetailsGrid.jsx

import React from 'react';
import dayjs from 'dayjs';
import { WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';

const WeatherDetailsGrid = ({ current, unit }) => {
    if (!current) return null;
    
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4">
                <h4 className="flex items-center gap-2 text-sm opacity-80"><WiSunrise /> Sunrise</h4>
                <p className="text-2xl font-semibold">{dayjs.unix(current.sys.sunrise).format('h:mm A')}</p>
            </div>
            <div className="glass-card p-4">
                <h4 className="flex items-center gap-2 text-sm opacity-80"><WiSunset /> Sunset</h4>
                <p className="text-2xl font-semibold">{dayjs.unix(current.sys.sunset).format('h:mm A')}</p>
            </div>
            <div className="glass-card p-4">
                <h4 className="flex items-center gap-2 text-sm opacity-80"><WiHumidity /> Humidity</h4>
                <p className="text-2xl font-semibold">{current.main.humidity}<span className="text-lg">%</span></p>
            </div>
            <div className="glass-card p-4">
                <h4 className="flex items-center gap-2 text-sm opacity-80"><WiStrongWind /> Wind</h4>
                <p className="text-2xl font-semibold">
                    {current.wind.speed.toFixed(1)}
                    <span className="text-lg"> {unit === 'metric' ? 'm/s' : 'mph'}</span>
                </p>
            </div>
        </div>
    );
};

export default WeatherDetailsGrid;