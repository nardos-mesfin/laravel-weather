import React, { useState, useEffect } from 'react';

export default function Weather() {
    const [city, setCity] = useState('Addis Ababa');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState('metric');
    const [dark, setDark] = useState(() => localStorage.getItem('dark') === 'true');
    const [recent, setRecent] = useState([]);

    // 🌍 Get weather by geolocation
    const getWeatherByLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported.");
            return;
        }

        setLoading(true);
        let didRespond = false;

        const geoTimeout = setTimeout(() => {
            if (!didRespond) {
                setError("Geolocation took too long. Try entering your city manually.");
                setLoading(false);
            }
        }, 8000);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                didRespond = true;
                clearTimeout(geoTimeout);
                const { latitude, longitude } = position.coords;

                try {
                    const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}&unit=${unit}`);
                    const data = await res.json();

                    if (data.error) {
                        setError(data.error);
                    } else {
                        setWeather(data.weather);
                        setForecast(data.forecast || []);
                        setCity(data.weather.name);
                        updateRecent(data.weather.name);
                    }
                } catch {
                    setError("Failed to get weather.");
                }
                setLoading(false);
            },
            (error) => {
                didRespond = true;
                clearTimeout(geoTimeout);
                console.error("Geolocation error:", error);
                setError("Location access denied. Please check browser/OS settings.");
                setLoading(false);
            }
        );
    };

    // 🔍 Get weather by city name
    const getWeather = async () => {
        setLoading(true);
        setError(null);
        setWeather(null);
        setForecast([]);

        try {
            const res = await fetch(`/api/weather?city=${city}&unit=${unit}`);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                setWeather(data.weather);
                setForecast(data.forecast || []);
                updateRecent(data.weather.name);
            }
        } catch {
            setError("Failed to fetch weather.");
        }

        setLoading(false);
    };

    // 💾 Save recent searches
    const updateRecent = (newCity) => {
        const updated = [newCity, ...recent.filter(c => c !== newCity)].slice(0, 5);
        setRecent(updated);
        localStorage.setItem("recent", JSON.stringify(updated));
    };

    // 🌓 Dark mode toggle
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("dark", dark);
    }, [dark]);

    // 🔁 Load recent & auto-fetch
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("recent")) || [];
        setRecent(saved);
        getWeatherByLocation();

        const fallback = setTimeout(() => {
            if (!weather && !error) {
                getWeather();
            }
        }, 10000);

        return () => clearTimeout(fallback);
    }, [unit]);

    const toggleUnit = () => setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
    const toggleDark = () => setDark(prev => !prev);

    const iconUrl = weather?.weather?.[0]?.icon
        ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
        : null;

    return (
        <div className="p-6 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            <div className="flex justify-between items-center max-w-xl mx-auto mb-6">
                <h1 className="text-2xl font-bold">🌤️ Weather App</h1>
                <button onClick={toggleDark} className="bg-black text-white dark:bg-yellow-400 dark:text-black px-3 py-1 rounded">
                    {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4">
                <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="border p-2 rounded w-full sm:w-2/3 dark:bg-gray-800 dark:text-white"
                />
                <button
                    onClick={getWeather}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Search
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
                <button
                    onClick={toggleUnit}
                    className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                >
                    Switch to {unit === 'metric' ? '°F' : '°C'}
                </button>
                <button
                    onClick={getWeatherByLocation}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                    Use My Location
                </button>
            </div>

            {recent.length > 0 && (
                <>
                    <div className="text-sm font-medium mb-2">Recent Searches:</div>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {recent.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => { setCity(item); getWeather(); }}
                                className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {weather && (
                <div className="mt-6 bg-white dark:bg-gray-800 shadow p-4 rounded text-left max-w-full sm:max-w-md mx-auto">
                    <div className="text-center mb-4">
                        {iconUrl && <img src={iconUrl} alt="Icon" className="w-20 h-20 mx-auto" />}
                        <p className="text-lg font-bold">{weather.name}</p>
                    </div>
                    <p><strong>Temperature:</strong> {weather.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
                    <p><strong>Condition:</strong> {weather.weather[0].description}</p>
                    <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                    <p><strong>Wind:</strong> {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>

                    <iframe
                        className="w-full h-48 mt-4 rounded"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${weather.coord.lon - 0.02}%2C${weather.coord.lat - 0.02}%2C${weather.coord.lon + 0.02}%2C${weather.coord.lat + 0.02}&layer=mapnik&marker=${weather.coord.lat}%2C${weather.coord.lon}`}
                        title="Map"
                    ></iframe>
                </div>
            )}

            {forecast.length > 0 && (
                <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded max-w-full sm:max-w-xl mx-auto">
                    <h2 className="text-lg font-bold mb-2 text-center">📅 Forecast (Next 24h)</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {forecast.map((f, i) => (
                            <div key={i} className="p-2 bg-white dark:bg-gray-700 rounded shadow text-center">
                                <p className="text-sm">{f.dt_txt.slice(11, 16)}</p>
                                <img
                                    src={`https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`}
                                    alt="icon"
                                    className="w-12 h-12 mx-auto"
                                />
                                <p>{f.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
