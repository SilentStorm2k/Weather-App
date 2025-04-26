import { getAddressFromLocation } from './geoLocationApi';

// --- Type Definitions ---
interface VisualCrossingCurrentConditions {
    datetime: string;
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    humidity: number;
    dew: number;
    precip: number | null;
    precipprob: number | null;
    precipcover?: number | null;
    preciptype: string | null;
    snow: number;
    snowdepth: number | null;
    windgust: number | null;
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    visibility: number;
    solarradiation: number;
    solarenergy: number;
    uvindex: number;
    severerisk?: number | null;
    conditions: string;
    icon: string;
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    moonphase: number;
}

interface VisualCrossingDay {
    datetime: string;
    datetimeEpoch: number;
    tempmax: number;
    tempmin: number;
    temp: number;
    feelslikemax: number;
    feelslikemin: number;
    feelslike: number;
    dew: number;
    humidity: number;
    precip: number;
    precipprob: number;
    precipcover: number;
    preciptype: string | string[] | null;
    snow: number;
    snowdepth: number | null;
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    visibility: number;
    solarradiation: number;
    solarenergy: number;
    uvindex: number;
    severerisk: number;
    conditions: string;
    icon: string;
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    moonphase: number;
    hours?: unknown[];
    source: unknown;
    stations: unknown;
}

interface VisualCrossingResponse {
    queryCost: number;
    latitude: number;
    longitude: number;
    resolvedAddress: string;
    address: string;
    timezone: string;
    tzoffset: number;
    description: string;
    days: VisualCrossingDay[];
    alerts: any[];
    stations: Record<string, any>;
    currentConditions: VisualCrossingCurrentConditions;
}

export interface WeatherReportDay {
    date: string;
    temp: number;
    temperature: number;
    feelsLike: number;
    tempMax: number;
    tempMin: number;
    humidity: number;
    conditions: string;
    weatherIcon: string;
    sunrise: string;
    sunset: string;
}

export interface WeatherReport {
    location: string;
    description: string;
    days: WeatherReportDay[];
    temperature: number;
    feelsLike: number;
    tempMax: number;
    tempMin: number;
    humidity: number;
    conditions: string;
    weatherIcon: string;
    sunrise: string;
    sunset: string;
    isDay: boolean;
}

const acceptableUnits = new Set(['metric', 'us']);
const WEATHER_API_KEY =
    process.env.WEATHER_API_KEY ?? 'LUBKBGRTTVAZCP4DU8UHDT2NU';

// --- Helper Functions ---

/**
 * Parses a single day's weather data from the API response.
 * @param day - The raw weather data for a single day.
 * @returns - The parsed weather data for a single day.
 */
function parseDay(day: VisualCrossingDay): WeatherReportDay {
    return {
        date: day.datetime,
        temp: day.temp,
        temperature: day.temp,
        feelsLike: day.feelslike,
        tempMax: day.tempmax,
        tempMin: day.tempmin,
        humidity: day.humidity,
        conditions: day.conditions,
        weatherIcon: day.icon,
        sunrise: day.sunrise,
        sunset: day.sunset,
    };
}

/**
 * Parses the array of daily weather data from the API response.
 * @param days - The array of raw daily weather data.
 * @returns - The parsed array of daily weather reports.
 */
function parseDays(days: VisualCrossingDay[]): WeatherReportDay[] {
    return days.map(parseDay);
}

/**
 * Parses the overall weather data from the API response.
 * @param data - The raw API response data.
 * @returns - The parsed weather report.
 */
function parseWeatherData(data: VisualCrossingResponse): WeatherReport {
    const currentConditions = data.currentConditions;

    const isDay =
        currentConditions.sunriseEpoch < currentConditions.datetimeEpoch &&
        currentConditions.datetimeEpoch < currentConditions.sunsetEpoch;

    return {
        location: data.resolvedAddress ?? 'Unknown Location',
        description: data.description ?? 'No Description',
        days: parseDays(data.days),
        temperature: currentConditions.temp,
        feelsLike: currentConditions.feelslike,
        tempMax: data.days[0].tempmax,
        tempMin: data.days[0].tempmin,
        humidity: currentConditions.humidity,
        conditions: currentConditions.conditions,
        weatherIcon: currentConditions.icon,
        sunrise: currentConditions.sunrise,
        sunset: currentConditions.sunset,
        isDay: isDay,
    };
}

/**
 * Fetches weather data for a given location.
 * @param geolocation - The GeolocationPosition object.
 * @param unit - The unit of measurement ('metric', 'us').
 * @returns - A promise that resolves to a WeatherReport object.
 * @throws - An error if the API request fails.
 */
export async function getWeatherGivenLocation(
    geolocation: GeolocationPosition,
    unit: string = 'metric',
): Promise<WeatherReport> {
    if (!acceptableUnits.has(unit)) unit = 'metric';

    const { latitude, longitude } = geolocation.coords;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=${unit}&key=${WEATHER_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        });

        if (!response.ok) {
            console.error(
                'Visual Crossing API error: ',
                response.status,
                response.statusText,
            );
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseJSON: VisualCrossingResponse = await response.json(); // Explicit type
        const parsedWeatherReport = parseWeatherData(responseJSON);
        parsedWeatherReport.description =
            await getAddressFromLocation(geolocation);

        return parsedWeatherReport;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

/**
 * Fetches weather data for a given location.
 * @param city - The city whose weather you want.
 * @param unit - The unit of measurement ('metric', 'us').
 * @returns - A promise that resolves to a WeatherReport object.
 * @throws - An error if the API request fails.
 */
export async function getWeatherGivenCity(
    city: string = 'chennai',
    unit: string = 'metric',
): Promise<WeatherReport> {
    if (!acceptableUnits.has(unit)) unit = 'metric';
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=${WEATHER_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        });
        if (!response.ok) {
            console.error(
                'Visual Crossing API error: ',
                response.status,
                response.statusText,
            );
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseJSON: VisualCrossingResponse = await response.json(); // Explicit type
        const parsedWeatherReport = parseWeatherData(responseJSON);
        return parsedWeatherReport;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

import weatherData from './tempResponse.json';

export function tempWeatherReport() {
    const response: VisualCrossingResponse = weatherData;
    return parseWeatherData(response);
}
