// resources/js/Components/Weather/AirQualityCard.jsx

import React from 'react';

const AirQualityCard = ({ aqiData, getAqiText }) => {
    if (!aqiData) return null;

    const { text, color } = getAqiText(aqiData.main.aqi);

    return (
        <div className="glass-card p-4">
            <h3 className="font-bold mb-2">Air Quality</h3>
            <div className="flex items-center justify-between">
                <p className={`text-2xl font-bold ${color}`}>{text}</p>
                <p className="text-4xl font-thin">{aqiData.components.pm2_5.toFixed(1)} <span className="text-sm">μg/m³</span></p>
            </div>
        </div>
    );
};

export default AirQualityCard;