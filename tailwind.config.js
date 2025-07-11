import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: 'class', // Keep this
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // Add this backgroundImage extension
            backgroundImage: {
                'clear-day': "url('/images/bg-clear-day.png')",
                'clear-night': "url('/images/bg-clear-night.png')",
                'cloudy-day': "url('/images/bg-cloudy-day.png')",
                'cloudy-night': "url('/images/bg-cloudy-night.png')",
                'rainy-day': "url('/images/bg-rain.png')",
                'rainy-night': "url('/images/bg-rain.png')", // Can use same for day/night
                'snowy-day': "url('/images/bg-snow.png')",
                'snowy-night': "url('/images/bg-snow.png')",
                'storm-day': "url('/images/bg-storm.png')",
                'storm-night': "url('/images/bg-storm.png')",
                'atmosphere': "url('/images/bg-cloudy-day.png')", // A fallback for fog/mist etc.
            },
        },
    },

    plugins: [forms],
};