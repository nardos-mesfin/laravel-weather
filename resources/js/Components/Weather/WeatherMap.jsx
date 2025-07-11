// resources/js/Components/Weather/WeatherMap.jsx

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const WeatherMap = ({ location, dark }) => {
    if (!location) return null;

    const position = [location.lat, location.lon];
    const apiKey = import.meta.env.VITE_VITE_WEATHER_API_KEY;

    // This 'key' is crucial. It forces React to re-create the map
    // when the location or theme changes, avoiding complex state management.
    const mapId = useMemo(() => `${location.lat}-${location.lon}-${dark}`, [location, dark]);

    // Choose different map styles for light and dark mode
    const lightMapUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    const darkMapUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";
    const mapUrl = dark ? darkMapUrl : lightMapUrl;

    const weatherLayerUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`;
    
    return (
        <div className="glass-card p-2 rounded-2xl overflow-hidden">
            <MapContainer 
                key={mapId} // This forces a re-render
                center={position} 
                zoom={9} 
                style={{ height: '300px', width: '100%' }}
                className="rounded-xl"
            >
                {/* Base Map Layer */}
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    url={mapUrl}
                />

                {/* Weather Overlay Layer */}
                <TileLayer
                    url={weatherLayerUrl}
                    opacity={0.7}
                />

                {/* Location Marker */}
                <Marker position={position}>
                    <Popup>
                        Current weather location.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default WeatherMap;