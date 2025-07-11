// resources/js/Components/Weather/CurrentWeatherCard.jsx

import React from 'react';
import dayjs from 'dayjs';
import WeatherIcon from './WeatherIcon';
import LiveClock from './LiveClock'; 

const CurrentWeatherCard = ({ location, current, isDay }) => {
    if (!current || !location) return null;

    return (
        <div className="glass-card p-6 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold">{current.name}</h2>
            <p className="text-sm opacity-80">{dayjs.unix(current.dt).format('dddd, MMMM D')}</p>
            
            <WeatherIcon code={current.weather[0].id} isDay={isDay} className="text-8xl my-4" />
            
            <p className="text-6xl font-thin">{Math.round(current.main.temp)}°</p>

            {/* ADD THE LIVE CLOCK COMPONENT RIGHT HERE */}
            <LiveClock timezoneOffset={current.timezone} />

            <p className="text-xl font-semibold capitalize mt-2">{current.weather[0].description}</p>
            <p className="text-sm opacity-80">
                Feels like {Math.round(current.main.feels_like)}°
            </p>
        </div>
    );
};

export default CurrentWeatherCard;