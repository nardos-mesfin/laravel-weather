import React, { useState, useEffect } from 'react';

export default function Weather() {
    const [city, setCity] = useState('Addis Ababa');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState('metric');

    // Dark mode state from localStorage
    const [dark, setDark] = useState(() => {
        return localStorage.getItem('dark') === 'true';
    });

    // Recent searches from localStorage
    const [recent, setRecent] = useState(() => {
        const saved = localStorage.getItem('recentCities');
        return saved ? JSON.parse(saved) : [];
    });

    // Sync dark mode class & localStorage
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('dark', dark);
    }, [dark]);

    // Fetch weather by city
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

                // Save recent search if not exists
                if (!recent.includes(city)) {
                    const updated = [city, ...recent].slice(0, 5);
                    setRecent(updated);
                    localStorage.setItem('recentCities', JSON.stringify(updated));
                }
            }
        } catch {
            setError("Failed to fetch weather.");
        }
        setLoading(false);
    };

    // Fetch weather by geolocation
    const getWeatherByLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported.");
            return;
        }
        setError(null);
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

                    if (data.cod && data.cod !== 200) {
                        setError(data.message || "Unknown error");
                    } else {
                        setWeather(data);
                        setCity(data.name);

                        // Save recent city from geolocation if not exists
                        if (!recent.includes(data.name)) {
                            const updated = [data.name, ...recent].slice(0, 5);
                            setRecent(updated);
                            localStorage.setItem('recentCities', JSON.stringify(updated));
                        }
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

    // Auto-run on unit change
    useEffect(() => {
        getWeatherByLocation();

        const fallback = setTimeout(() => {
            if (!weather && !error) {
                setCity("Addis Ababa");
                getWeather();
            }
        }, 10000);

        return () => clearTimeout(fallback);
    }, [unit]);

    const toggleUnit = () => {
        setUnit(prev => (prev === 'metric' ? 'imperial' : 'metric'));
    };

    return (
        <div className="p-6 max-w-xl mx-auto text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors">
            <h1 className="text-2xl font-bold mb-4">🌤️ Weather App</h1>

            <div className="mb-4 flex justify-center items-center gap-2">
                <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="border p-2 rounded w-2/3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                    onClick={getWeather}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Search
                </button>
                <button
                    onClick={() => setDark(!dark)}
                    className="ml-2 bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                >
                    {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>

            <div className="mb-4 flex justify-center gap-2">
                <button
                    onClick={toggleUnit}
                    className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    Switch to {unit === 'metric' ? '°F' : '°C'}
                </button>
                <button
                    onClick={getWeatherByLocation}
                    className="bg-green-200 dark:bg-green-700 px-3 py-1 rounded hover:bg-green-300 dark:hover:bg-green-600"
                >
                    Use My Location
                </button>
            </div>

            {recent.length > 0 && (
                <div className="mb-4">
                    <p className="mb-2 font-semibold">Recent Searches:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {recent.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setCity(c);
                                    getWeather();
                                }}
                                className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {weather && (
                <div className="mt-6 bg-white dark:bg-gray-800 shadow p-4 rounded text-left transition-colors">
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
