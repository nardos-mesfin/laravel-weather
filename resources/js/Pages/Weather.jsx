// resources/js/Pages/Weather.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { Head } from '@inertiajs/react'; // <-- 1. IMPORT THE HEAD COMPONENT

// Import our components
import SearchBar from '../Components/Weather/SearchBar';
import LoadingSkeleton from '../Components/Weather/LoadingSkeleton';
import CurrentWeatherCard from '../Components/Weather/CurrentWeatherCard';
import AirQualityCard from '../Components/Weather/AirQualityCard';
import HourlyForecast from '../Components/Weather/HourlyForecast';
import DailyForecast from '../Components/Weather/DailyForecast';
import WeatherDetailsGrid from '../Components/Weather/WeatherDetailsGrid';
import WeatherMap from '../Components/Weather/WeatherMap';
import RecentSearches from '../Components/Weather/RecentSearches';
import ForecastChart from '../Components/Weather/ForecastChart';
import Intro from '../Components/Intro';

const getAqiText = (aqi) => {
    switch (aqi) {
        case 1: return { text: 'Good', color: 'text-green-400' };
        case 2: return { text: 'Fair', color: 'text-yellow-400' };
        case 3: return { text: 'Moderate', color: 'text-orange-400' };
        case 4: return { text: 'Poor', color: 'text-red-500' };
        case 5: return { text: 'Very Poor', color: 'text-purple-500' };
        default: return { text: 'Unknown', color: 'text-gray-400' };
    }
};

export default function Weather() {
    // --- STATE MANAGEMENT ---
    const [location, setLocation] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [dailyForecast, setDailyForecast] = useState([]);
    const [aqiData, setAqiData] = useState(null);
    const [uvData, setUvData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unit, setUnit] = useState('metric');
    const [dark, setDark] = useState(() => localStorage.getItem('dark') === 'true');
    const [recentSearches, setRecentSearches] = useState(() => {
        try {
            const stored = localStorage.getItem('recentSearches');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isIntroVisible, setIsIntroVisible] = useState(true); 

    // --- ANIMATION VARIANTS ---
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

    // --- DATA FETCHING & HELPERS ---
    const updateRecentSearches = useCallback((newSearch) => {
        if (!newSearch || !newSearch.name) return;
        setRecentSearches(prevSearches => {
            const filtered = prevSearches.filter(s => {
                if (!s || !s.name) return false;
                return s.name.toLowerCase() !== newSearch.name.toLowerCase();
            });
            const updated = [newSearch, ...filtered].slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const handleDeleteSearch = (searchToDelete) => {
        setRecentSearches(prevSearches => {
            const updated = prevSearches.filter(s => s.lat !== searchToDelete.lat || s.lon !== searchToDelete.lon);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
        });
    };

    const fetchWeather = useCallback(async (loc) => {
        if (!loc || typeof loc.lat === 'undefined' || typeof loc.lon === 'undefined') return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/?lat=${loc.lat}&lon=${loc.lon}&unit=${unit}`);
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `Error: ${res.status}`);
            }
            const data = await res.json();
            setCurrentWeather(data.current);
            setForecast(data.forecast);
            setAqiData(data.aqi);
            setUvData(data.uv);
            updateRecentSearches({ name: data.current.name, lat: loc.lat, lon: loc.lon });
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [unit, updateRecentSearches]); 
    
    // --- USE EFFECT HOOKS ---
    useEffect(() => {
        const getInitialLocation = new Promise((resolve) => {
             navigator.geolocation.getCurrentPosition(
                ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
                () => {
                    const storedSearches = localStorage.getItem('recentSearches');
                    const recent = storedSearches ? JSON.parse(storedSearches) : [];
                    if (recent.length > 0 && recent[0].lat && recent[0].lon) {
                        resolve(recent[0]);
                    } else {
                        resolve({ lat: 9.005401, lon: 38.763611 });
                    }
                }
            );
        });
        
        const timer = setTimeout(async () => {
            const initialLocation = await getInitialLocation;
            setLocation(initialLocation);
            setIsIntroVisible(false);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    // Effect to handle the intro screen
    useEffect(() => {
        // Let the "Weather Weaver" animation play for 6 seconds
        const timer = setTimeout(() => {
            setIsIntroVisible(false);
        }, 6000); // 6000 milliseconds = 6 seconds
    
        return () => clearTimeout(timer);
    }, []); // Empty dependency array ensures this runs only once


    useEffect(() => {
        if (location && !isIntroVisible) {
            fetchWeather(location);
        }
    }, [location, unit, fetchWeather, isIntroVisible]);

    useEffect(() => {
        if (forecast && forecast.list) {
            const dailyData = forecast.list.reduce((acc, reading) => {
                const date = reading.dt_txt.split(' ')[0];
                if (!acc[date]) { acc[date] = { date: date, minTemp: reading.main.temp, maxTemp: reading.main.temp, icons: {} }; }
                acc[date].minTemp = Math.min(acc[date].minTemp, reading.main.temp);
                acc[date].maxTemp = Math.max(acc[date].maxTemp, reading.main.temp);
                const icon = reading.weather[0].id;
                acc[date].icons[icon] = (acc[date].icons[icon] || 0) + 1;
                return acc;
            }, {});
            const processedDaily = Object.values(dailyData).map(day => {
                const mostFrequentIcon = Object.keys(day.icons).reduce((a, b) => day.icons[a] > day.icons[b] ? a : b);
                return {...day, icon: mostFrequentIcon };
            }).slice(0, 5);
            setDailyForecast(processedDaily);
        }
    }, [forecast]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    const handleSearchChange = (searchData) => {
        if (searchData) {
            setLocation({ ...searchData.value });
            setIsSearchFocused(false);
        }
    };

    const getBackgroundClass = () => {
        if (!currentWeather) return 'bg-gray-400';
        const code = currentWeather.weather[0].id;
        const isDay = currentWeather.dt > currentWeather.sys.sunrise && currentWeather.dt < currentWeather.sys.sunset;
        if (code < 300) return 'bg-storm-day'; if (code < 600) return 'bg-rainy-day'; if (code < 700) return 'bg-snowy-day';
        if (code < 800) return 'bg-atmosphere'; if (code === 800) return isDay ? 'bg-clear-day' : 'bg-clear-night';
        if (code > 800) return isDay ? 'bg-cloudy-day' : 'bg-cloudy-night'; return 'bg-clear-day';
    };

    const isDay = currentWeather ? currentWeather.dt > currentWeather.sys.sunrise && currentWeather.dt < currentWeather.sys.sunset : true;

    // --- RENDER ---
    return (
        <>
            {/* 2. USE THE HEAD COMPONENT WITH A DYNAMIC TITLE */}
            <Head title={currentWeather ? currentWeather.name : 'Loading...'} />

            <AnimatePresence>
                {isIntroVisible ? (
                    <Intro key="intro" />
                ) : (
                    <motion.div key="main-app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <div className={`main-bg ${getBackgroundClass()}`} />
                        <main className="p-4 sm:p-6 lg:p-8 text-white font-sans min-h-screen flex flex-col items-center relative">
                            <header className="w-full max-w-6xl flex justify-between items-center mb-4 z-10">
                                <h1 className="text-xl font-bold text-shadow">Weatherly</h1>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setUnit(u => u === 'metric' ? 'imperial' : 'metric')} className="text-lg font-semibold hover:scale-110 transition-transform">
                                        °{unit === 'metric' ? 'C' : 'F'}
                                    </button>
                                    <button onClick={() => setDark(d => !d)} className="text-2xl hover:scale-110 transition-transform">
                                        {dark ? <FiSun /> : <FiMoon />}
                                    </button>
                                </div>
                            </header>

                            <div className="w-full max-w-md z-20 mb-4">
                               <SearchBar 
                                    onSearchChange={handleSearchChange}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                               />
                            </div>
                            
                            <div className="w-full max-w-md z-10 mb-8">
                                <AnimatePresence>
                                    {!isSearchFocused && (
                                         <RecentSearches 
                                            searches={recentSearches} 
                                            onSearch={setLocation} 
                                            onDelete={handleDeleteSearch} 
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div key="loader" exit={{ opacity: 0 }}><LoadingSkeleton /></motion.div>
                                ) : error ? (
                                    <motion.div key="error" className="glass-card p-4 text-red-300">Error: {error}</motion.div>
                                ) : currentWeather && forecast && uvData && (
                                    <motion.div
                                        key="content"
                                        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0 }}
                                    >
                                        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                                            <CurrentWeatherCard location={location} current={currentWeather} isDay={isDay} />
                                            <AirQualityCard aqiData={aqiData} getAqiText={getAqiText} />
                                            <WeatherMap location={currentWeather.coord} dark={dark} />
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                                            <HourlyForecast forecastList={forecast.list} sunrise={currentWeather.sys.sunrise} sunset={currentWeather.sys.sunset} />
                                            <ForecastChart forecastList={forecast.list} unit={unit} dark={dark} />
                                            <DailyForecast dailyData={dailyForecast} />
                                            <WeatherDetailsGrid current={currentWeather} uvData={uvData} unit={unit} />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </main>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}