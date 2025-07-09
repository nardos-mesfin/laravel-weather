<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    public function get(Request $request)
    {
        $apiKey = env('WEATHER_API_KEY');
        $unit = $request->query('unit', 'metric');
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $city = $request->query('city');

        $params = [
            'appid' => $apiKey,
            'units' => $unit,
        ];

        if ($lat && $lon) {
            $params['lat'] = $lat;
            $params['lon'] = $lon;
        } elseif ($city) {
            $params['q'] = $city;
        } else {
            return response()->json(['error' => 'Missing location parameters.'], 400);
        }

        try {
            // Current weather
            $weatherRes = Http::get('https://api.openweathermap.org/data/2.5/weather', $params);
            $weatherData = $weatherRes->json();

            if (!$weatherRes->ok()) {
                return response()->json(['error' => $weatherData['message'] ?? 'Failed to get weather.'], 500);
            }

            // Forecast (5-day / 3-hour intervals)
            $forecastParams = array_merge($params, [
                'cnt' => 8, // roughly 24h of forecast (8 x 3h)
            ]);

            $forecastRes = Http::get('https://api.openweathermap.org/data/2.5/forecast', $forecastParams);
            $forecastData = $forecastRes->json();

            return response()->json([
                'weather' => $weatherData,
                'forecast' => $forecastData['list'] ?? [],
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Exception: ' . $e->getMessage()], 500);
        }
    }
}
