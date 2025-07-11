// resources/js/Components/Weather/WeatherDetailsGrid.jsx

import React from 'react';
import { WiHumidity, WiStrongWind, WiBarometer, WiDaySunny } from 'react-icons/wi';
import { FaEye } from 'react-icons/fa'; // A better icon for visibility
import SunPath from './SunPath';
import DetailCard from './DetailCard'; // Import our new reusable component

// Helper function to interpret UV Index
const getUvIndexInfo = (uvIndex) => {
    const uvi = Math.round(uvIndex);
    if (uvi <= 2) return { text: 'Low', color: 'bg-green-500' };
    if (uvi <= 5) return { text: 'Moderate', color: 'bg-yellow-500' };
    if (uvi <= 7) return { text: 'High', color: 'bg-orange-500' };
    if (uvi <= 10) return { text: 'Very High', color: 'bg-red-500' };
    return { text: 'Extreme', color: 'bg-purple-500' };
};

const WeatherDetailsGrid = ({ current, uvData, unit }) => {
    if (!current) return null;

    const uvInfo = uvData ? getUvIndexInfo(uvData.value) : null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* SunPath remains our hero element */}
            <div className="md:col-span-2">
                <SunPath sunrise={current.sys.sunrise} sunset={current.sys.sunset} />
            </div>

            {/* Reusable DetailCards for our new metrics */}
            <DetailCard
                icon={<WiHumidity />}
                title="Humidity"
                value={current.main.humidity}
                unit="%"
            />
            <DetailCard
                icon={<WiStrongWind />}
                title="Wind"
                value={current.wind.speed.toFixed(1)}
                unit={unit === 'metric' ? 'm/s' : 'mph'}
            />
            <DetailCard
                icon={<FaEye />}
                title="Visibility"
                value={(current.visibility / 1000).toFixed(1)} // Convert meters to km
                unit="km"
            />
            <DetailCard
                icon={<WiBarometer />}
                title="Pressure"
                value={current.main.pressure}
                unit="hPa"
            />
            {uvInfo && (
                <div className="glass-card p-4 flex flex-col justify-center md:col-span-2">
                    <h4 className="flex items-center gap-2 text-sm opacity-80"><WiDaySunny /> UV Index</h4>
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-2xl font-semibold">{uvData.value.toFixed(1)}</p>
                        <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${uvInfo.color}`}>
                            {uvInfo.text}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherDetailsGrid;