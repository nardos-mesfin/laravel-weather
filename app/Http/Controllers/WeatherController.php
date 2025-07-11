<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    public function get(Request $request)
    {
        $apiKey = env('VITE_WEATHER_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'Weather API key not configured.'], 500);
        }

        $unit = $request->query('unit', 'metric');
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $city = $request->query('city');

        // Geocode city to lat/lon if necessary
        if ($city && (!$lat || !$lon)) {
            try {
                $geoRes = Http::get('https://api.openweathermap.org/geo/1.0/direct', [
                    'q' => $city,
                    'limit' => 1,
                    'appid' => $apiKey,
                ]);
                $geoData = $geoRes->json();

                if (!$geoRes->ok() || empty($geoData)) {
                    return response()->json(['error' => 'City not found.'], 404);
                }
                $lat = $geoData[0]['lat'];
                $lon = $geoData[0]['lon'];
            } catch (\Exception $e) {
                Log::error('Geocoding API error: ' . $e->getMessage());
                return response()->json(['error' => 'Could not find location.'], 500);
            }
        } elseif (!$lat || !$lon) {
            return response()->json(['error' => 'Missing location parameters.'], 400);
        }

        // Now, make separate calls for the data using the standard free endpoints
        try {
            $commonParams = ['lat' => $lat, 'lon' => $lon, 'appid' => $apiKey, 'units' => $unit];
            
            // 1. Get Current Weather
            $currentWeatherRes = Http::get('https://api.openweathermap.org/data/2.5/weather', $commonParams);
            if (!$currentWeatherRes->ok()) throw new \Exception('Failed to get current weather.');
            $currentWeatherData = $currentWeatherRes->json();
            
            // 2. Get 5-Day / 3-Hour Forecast
            $forecastRes = Http::get('https://api.openweathermap.org/data/2.5/forecast', $commonParams);
            if (!$forecastRes->ok()) throw new \Exception('Failed to get forecast.');
            $forecastData = $forecastRes->json();
            
            // 3. Get Air Quality
            $aqiRes = Http::get('https://api.openweathermap.org/data/2.5/air_pollution', ['lat' => $lat, 'lon' => $lon, 'appid' => $apiKey]);
            $aqiData = $aqiRes->json();

            // The /weather endpoint conveniently includes the city name
            $currentWeatherData['name'] = $currentWeatherData['name'] ?? 'Current Location';

            return response()->json([
                'current' => $currentWeatherData,
                'forecast' => $forecastData, // This contains the 'list' of 3-hour forecasts
                'aqi' => $aqiData['list'][0] ?? null,
            ]);

        } catch (\Exception $e) {
            Log::error('Weather fetch exception: ' . $e->getMessage());
            return response()->json(['error' => 'Service unavailable. Could not fetch weather data.'], 500);
        }
    }

    // This autocomplete function is still correct and uses a free endpoint. NO CHANGE NEEDED.
    public function autocomplete(Request $request)
    {
        $query = $request->query('q');
        if (!$query) {
            return response()->json(['options' => []]);
        }
        
        $apiKey = env('VITE_WEATHER_API_KEY');

        try {
            $response = Http::get('https://api.openweathermap.org/geo/1.0/direct', [
                'q' => $query,
                'limit' => 5,
                'appid' => $apiKey,
            ]);

            $data = $response->json();
            $options = collect($data)->map(function ($city) {
                $label = $city['name'];
                if (isset($city['state'])) {
                    $label .= ", " . $city['state'];
                }
                $label .= ", " . $city['country'];

                return [
                    'value' => [
                        'lat' => $city['lat'],
                        'lon' => $city['lon'],
                        'name' => $city['name']
                    ],
                    'label' => $label,
                ];
            })->unique('label')->values();

            return response()->json(['options' => $options]);

        } catch (\Exception $e) {
            return response()->json(['options' => []]);
        }
    }
}