<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function get(Request $request)
    {
        $apiKey = config('services.weather.key');
        $unit = $request->query('unit', 'metric');

        // If lat/lon is present, use coordinates
        if ($request->has(['lat', 'lon'])) {
            $lat = $request->query('lat');
            $lon = $request->query('lon');

            $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
                'lat' => $lat,
                'lon' => $lon,
                'appid' => $apiKey,
                'units' => $unit,
            ]);
        } else {
            $city = $request->query('city', 'Addis Ababa');

            $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
                'q' => $city,
                'appid' => $apiKey,
                'units' => $unit,
            ]);
        }

        return $response->json();
    }

}

