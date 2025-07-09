import React, { useState, useEffect } from 'react';

export default function Weather() {
    const [city, setCity] = useState('Addis Ababa');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState('metric');

    // 🌍 Get weather by geolocation
    const getWeatherByLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}&unit=${unit}`);
                const data = await res.json();

                if (data.cod && data.cod !== 200) {
                    setError(data.message || "Unknown error");
                } else {
                    setWeather(data);
                    setCity(data.name); // update input with auto city
                }
            } catch (err) {
                setError("Failed to get weather.");
            }
            setLoading(false);
        }, () => {
            setError("Permission denied or unavailable.");
            setLoading(false);
        });
    };

    // 🔁 Auto-run on page load
    useEffect(() => {
        getWeatherByLocation();
    }, [unit]);

    const getWeather = async () => {
        setLoading(true);
        setError(null);
        setWeather(null);

        try {
            const res = await fetch(`/api/weather?city=${city}&unit=${unit}`);
            const data = await res.json();

            if (data.cod && data.cod !== 200) {
                setError(data.message || "Unknown error");
            } else {
                setWeather(data);
            }
        } catch (err) {
            setError("Failed to fetch weather.");
        }

        setLoading(false);
    };

    const toggleUnit = () => {
        setUnit(prev => (prev === 'metric' ? 'imperial' : 'metric'));
    };

    return (
        <div className="p-6 max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">🌤️ Weather App</h1>

            <div className="mb-4 flex justify-center items-center gap-2">
                <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="border p-2 rounded w-2/3"
                />
                <button
                    onClick={getWeather}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Search
                </button>
            </div>

            <div className="mb-4 flex justify-center gap-2">
                <button
                    onClick={toggleUnit}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                    Switch to {unit === 'metric' ? '°F' : '°C'}
                </button>
                <button
                    onClick={getWeatherByLocation}
                    className="bg-green-200 px-3 py-1 rounded hover:bg-green-300"
                >
                    Use My Location
                </button>
            </div>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {weather && (
                <div className="mt-6 bg-white shadow p-4 rounded text-left">
                    <p><strong>City:</strong> {weather.name}</p>
                    <p><strong>Temperature:</strong> {weather.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
                    <p><strong>Condition:</strong> {weather.weather[0].description}</p>
                    <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                    <p><strong>Wind:</strong> {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                </div>
            )}
        </div>
    );
}
