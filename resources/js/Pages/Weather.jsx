import React, { useState } from 'react';

export default function Weather() {
    const [city, setCity] = useState('Addis Ababa');
    const [weather, setWeather] = useState(null);

    const getWeather = async () => {
        const res = await fetch(`/api/weather?city=${city}`);
        const data = await res.json();
        setWeather(data);
    };

    return (
        <div className="p-6 max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">🌤️ Weather App</h1>
            <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="border p-2 rounded mr-2"
            />
            <button
                onClick={getWeather}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Get Weather
            </button>

            {weather && (
                <div className="mt-6 text-left">
                    <p><strong>City:</strong> {weather.name}</p>
                    <p><strong>Temperature:</strong> {weather.main.temp} °C</p>
                    <p><strong>Weather:</strong> {weather.weather[0].description}</p>
                </div>
            )}
        </div>
    );
}
