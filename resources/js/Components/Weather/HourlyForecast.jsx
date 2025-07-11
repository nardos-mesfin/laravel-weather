// resources/js/Components/Weather/HourlyForecast.jsx

import React from 'react';
import dayjs from 'dayjs';
import WeatherIcon from './WeatherIcon';

const HourlyForecast = ({ forecastList, sunrise, sunset }) => {
    if (!forecastList || !forecastList.length) return null;
    
    return (
        <div className="glass-card p-4">
            <h3 className="font-bold mb-4">Next 24 Hours</h3>
            <div className="flex overflow-x-auto space-x-6 pb-2">
                {forecastList.slice(0, 8).map((item, i) => {
                    const isDay = item.dt > sunrise && item.dt < sunset;
                    return (
                        <div key={i} className="flex flex-col items-center flex-shrink-0 text-center">
                            <p className="text-sm opacity-80">{dayjs.unix(item.dt).format('h A')}</p>
                            <WeatherIcon 
                                code={item.weather[0].id} 
                                isDay={isDay} 
                                className="text-3xl my-1" 
                            />
                            <p className="font-semibold">{Math.round(item.main.temp)}°</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HourlyForecast;