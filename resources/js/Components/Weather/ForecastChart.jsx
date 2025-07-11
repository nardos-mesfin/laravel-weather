// resources/js/Components/Weather/ForecastChart.jsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, // Import BarElement for bar charts
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import dayjs from 'dayjs';

// Register all the necessary components for Chart.js
ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler
);

const ForecastChart = ({ forecastList, unit, dark }) => {
    // 1. STATE: Keep track of which tab is active. 'temp' is the default.
    const [activeTab, setActiveTab] = useState('temp');

    const next24Hours = forecastList.slice(0, 9);
    const textColor = dark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

    // 2. DYNAMIC CONFIG: Generate chart data and options based on the active tab.
    // We use useMemo for performance, so the chart config is only recalculated when needed.
    const { chartData, chartOptions } = useMemo(() => {
        let labels = next24Hours.map(item => dayjs.unix(item.dt).format('h A'));
        let datasets = [];
        let options = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {}, // We'll customize this per tab
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: textColor, callback: (value) => value }, // Customize per tab
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor },
                },
            },
        };

        switch (activeTab) {
            case 'precip':
                datasets = [{
                    label: 'Precipitation Chance',
                    data: next24Hours.map(item => (item.pop * 100).toFixed(0)),
                    backgroundColor: dark ? 'rgba(56, 189, 248, 0.6)' : 'rgba(59, 130, 246, 0.6)',
                    borderColor: dark ? 'rgba(56, 189, 248, 1)' : 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                }];
                options.scales.y.max = 100; // Y-axis goes from 0 to 100%
                options.scales.y.min = 0;
                options.scales.y.ticks.callback = (value) => value + '%';
                options.plugins.tooltip.callbacks.label = (ctx) => `${ctx.parsed.y}% chance`;
                break;
            
            case 'wind':
                datasets = [{
                    label: `Wind Speed (${unit === 'metric' ? 'm/s' : 'mph'})`,
                    data: next24Hours.map(item => item.wind.speed.toFixed(1)),
                    fill: false,
                    borderColor: dark ? '#fde047' : '#f59e0b', // Yellow/Amber
                    pointBackgroundColor: dark ? '#fff' : '#000',
                    tension: 0.4,
                }];
                options.scales.y.ticks.callback = (value) => value + ` ${unit === 'metric' ? 'm/s' : 'mph'}`;
                options.plugins.tooltip.callbacks.label = (ctx) => `Wind: ${ctx.parsed.y} ${unit === 'metric' ? 'm/s' : 'mph'}`;
                break;

            case 'temp':
            default:
                datasets = [{
                    label: 'Temperature (°)',
                    data: next24Hours.map(item => Math.round(item.main.temp)),
                    fill: true,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                        gradient.addColorStop(0, dark ? 'rgba(56, 189, 248, 0.5)' : 'rgba(59, 130, 246, 0.5)');
                        gradient.addColorStop(1, dark ? 'rgba(56, 189, 248, 0)' : 'rgba(59, 130, 246, 0)');
                        return gradient;
                    },
                    borderColor: dark ? 'rgba(56, 189, 248, 1)' : 'rgba(59, 130, 246, 1)',
                    pointBackgroundColor: dark ? '#fff' : '#000',
                    pointBorderColor: dark ? 'rgba(56, 189, 248, 1)' : 'rgba(59, 130, 246, 1)',
                    tension: 0.4,
                }];
                options.scales.y.ticks.callback = (value) => value + '°';
                options.plugins.tooltip.callbacks.label = (ctx) => `Temp: ${ctx.parsed.y}°`;
                break;
        }

        return { chartData: { labels, datasets }, chartOptions: options };

    }, [activeTab, forecastList, unit, dark]); // The dependencies for our memo

    const ChartComponent = activeTab === 'precip' ? Bar : Line;
    const tabStyle = "px-3 py-1 text-sm rounded-lg transition-colors duration-200";
    const activeTabStyle = "bg-white/20 text-white font-semibold";
    const inactiveTabStyle = "text-white/70 hover:bg-white/10";
    
    return (
        <div className="glass-card p-4 h-[22rem] flex flex-col">
            {/* 3. TABS UI: The buttons to switch between chart types */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white/90 dark:text-white">Forecast Details</h3>
                <div className="flex gap-2 p-1 bg-black/10 rounded-lg">
                    <button onClick={() => setActiveTab('temp')} className={`${tabStyle} ${activeTab === 'temp' ? activeTabStyle : inactiveTabStyle}`}>Temp</button>
                    <button onClick={() => setActiveTab('precip')} className={`${tabStyle} ${activeTab === 'precip' ? activeTabStyle : inactiveTabStyle}`}>Precip.</button>
                    <button onClick={() => setActiveTab('wind')} className={`${tabStyle} ${activeTab === 'wind' ? activeTabStyle : inactiveTabStyle}`}>Wind</button>
                </div>
            </div>
            
            <div className="flex-grow">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab} // The key is crucial for AnimatePresence to detect changes
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full w-full"
                    >
                        {/* 4. RENDER THE CHART: Conditionally render Bar or Line chart */}
                        <ChartComponent options={chartOptions} data={chartData} />
                    </motion.div>
                 </AnimatePresence>
            </div>
        </div>
    );
};

export default ForecastChart;