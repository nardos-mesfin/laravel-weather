// resources/js/Components/Weather/LiveClock.jsx

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Import the UTC plugin

// Extend dayjs with the UTC plugin
dayjs.extend(utc);

const LiveClock = ({ timezoneOffset }) => {
    // State to hold the formatted time string
    const [time, setTime] = useState('');

    useEffect(() => {
        // This function calculates the city's current time
        const calculateCityTime = () => {
            // 1. Get the current time in UTC
            // 2. Add the city's timezone offset (in seconds)
            // 3. Format it into a readable string
            const cityTime = dayjs().utc().add(timezoneOffset, 'second').format('h:mm:ss A');
            setTime(cityTime);
        };
        
        // Run the function once immediately to set the initial time
        calculateCityTime();

        // Set up an interval to run the function every second (1000ms)
        const intervalId = setInterval(calculateCityTime, 1000);

        // This is the cleanup function. It runs when the component is
        // removed, preventing memory leaks by clearing the interval.
        return () => clearInterval(intervalId);

    }, [timezoneOffset]); // The effect re-runs if the timezoneOffset changes (i.e., new city)

    if (!time) {
        return null; // Don't render anything until the first time is calculated
    }
    
    return (
        <div className="mt-4 mb-2">
            <p className="text-4xl font-light tracking-wider text-white/90">{time}</p>
        </div>
    );
};

export default LiveClock;