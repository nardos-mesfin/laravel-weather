// resources/js/Components/Weather/WeatherIcon.jsx

import React from 'react';
import {
    WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloud, WiCloudy,
    WiRain, WiShowers, WiThunderstorm, WiSnow, WiFog, WiNightAltRain, WiNightAltShowers,
    WiNightAltThunderstorm, WiNightAltSnow
} from 'react-icons/wi';

const WeatherIcon = ({ code, isDay, className }) => {
    const iconMap = {
        200: isDay ? WiThunderstorm : WiNightAltThunderstorm,
        201: isDay ? WiThunderstorm : WiNightAltThunderstorm,
        202: isDay ? WiThunderstorm : WiNightAltThunderstorm,
        210: isDay ? WiThunderstorm : WiNightAltThunderstorm,
        211: WiThunderstorm,
        212: WiThunderstorm,
        221: WiThunderstorm,
        230: isDay ? WiThunderstorm : WiNightAltThunderstorm,
        231: isDay ? WiThunderstorm : WiNightAltThunderstorm,
        232: isDay ? WiThunderstorm : WiNightAltThunderstorm,
        300: isDay ? WiShowers : WiNightAltShowers,
        301: isDay ? WiShowers : WiNightAltShowers,
        302: isDay ? WiShowers : WiNightAltShowers,
        500: isDay ? WiRain : WiNightAltRain,
        501: isDay ? WiRain : WiNightAltRain,
        502: WiRain,
        503: WiRain,
        504: WiRain,
        511: WiSnow,
        520: isDay ? WiShowers : WiNightAltShowers,
        521: isDay ? WiShowers : WiNightAltShowers,
        522: isDay ? WiShowers : WiNightAltShowers,
        600: WiSnow,
        601: WiSnow,
        602: WiSnow,
        701: WiFog,
        711: WiFog,
        721: WiFog,
        731: WiFog,
        741: WiFog,
        751: WiFog,
        761: WiFog,
        771: WiFog,
        781: WiFog,
        800: isDay ? WiDaySunny : WiNightClear,
        801: isDay ? WiDayCloudy : WiNightAltCloudy,
        802: WiCloud,
        803: WiCloudy,
        804: WiCloudy,
    };

    const IconComponent = iconMap[code] || (isDay ? WiDaySunny : WiNightClear);

    return <IconComponent className={className} />;
};

export default WeatherIcon;