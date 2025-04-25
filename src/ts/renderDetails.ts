import {
    getWeatherGivenCity,
    getWeatherGivenLocation,
    WeatherReport,
} from './weatherApi';

/**
 * @param unit: passing metric/US unit
 * @param city: optional parameter for city
 * @param geolocation: optional parameter for providing current location
 * @throws when the weather/geocoding API fails, or when neither city or location is shared
 */
export async function render(
    unit: string = 'metric',
    city?: string,
    geolocation?: GeolocationPosition,
) {
    let weatherDetails: WeatherReport | undefined;
    try {
        if (geolocation)
            weatherDetails = await getWeatherGivenLocation(geolocation, unit);
        else if (city) weatherDetails = await getWeatherGivenCity(city, unit);
        else throw new Error('Must provide city or provide location');

        if (weatherDetails) {
            renderCurrentContidions(weatherDetails);
            renderFeelsLike(weatherDetails);
            renderHumidity(weatherDetails);
            renderDescription(weatherDetails);
            renderFutureForecast(weatherDetails);
        } else {
            console.log(
                'Weather report result is undefined, rendering skipped',
            );
            throw new Error(
                'Weather report result is undefined, rendering skipped',
            );
        }
    } catch (error) {
        console.log('Error fetching weather', error);
        throw error;
    }
}
function renderCurrentContidions(weatherDetails: {}) {
    throw new Error('Function not implemented.');
}

function renderFeelsLike(weatherDetails: {}) {
    throw new Error('Function not implemented.');
}

function renderHumidity(weatherDetails: {}) {
    throw new Error('Function not implemented.');
}

function renderDescription(weatherDetails: {}) {
    throw new Error('Function not implemented.');
}

function renderFutureForecast(weatherDetails: {}) {
    throw new Error('Function not implemented.');
}
