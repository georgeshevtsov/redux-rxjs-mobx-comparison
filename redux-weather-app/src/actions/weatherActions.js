import axios from 'axios';
export const FETCH_WEATHER = 'FETCH_WEATHER';

const APPID = '3c4703f7900ceea32c41dc6652ee61e9';
const getWeatherUrl = location => `https://api.openweathermap.org/data/2.5/weather?appid=${APPID}&q=${location}&units=metric`;

export function fetchWeather(location) {
    return {
        type: FETCH_WEATHER,
        payload: axios(getWeatherUrl(location))
    }
}