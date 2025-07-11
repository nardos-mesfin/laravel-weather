<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;

Route::get('/', [WeatherController::class, 'get']);
Route::get('/autocomplete', [WeatherController::class, 'autocomplete']);