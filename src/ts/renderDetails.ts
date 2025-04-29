import {
    getWeatherGivenCity,
    getWeatherGivenLocation,
    tempWeatherReport,
    WeatherReport,
} from './weatherApi';
import '../css/weather.styles.css';
import clearday from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/clear-day.png';
import clearnight from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/clear-night.png';
import cloudy from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/cloudy.png';
import fog from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/fog.png';
import hail from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/hail.png';
import partlycloudyday from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/partly-cloudy-day.png';
import partlycloudynight from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/partly-cloudy-night.png';
import rainsnowshowersday from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/rain-snow-showers-day.png';
import rainsnowshowersnight from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/rain-snow-showers-night.png';
import rainsnow from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/rain-snow.png';
import rain from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/rain.png';
import showersday from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/showers-day.png';
import showersnight from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/showers-night.png';
import sleet from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/sleet.png';
import snowshowersday from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/snow-showers-day.png';
import snowshowersnight from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/snow-showers-night.png';
import snow from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/snow.png';
import thunerrain from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/thunder-rain.png';
import thundershowersday from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/thunder-showers-day.png';
import thundershowersnight from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/thunder-showers-night.png';
import thunder from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/thunder.png';
import wind from '../assets/visualcrossing WeatherIcons main PNG-3rd Set - Color/wind.png';
import humidity from '../assets/humidity.png';
import info from '../assets/information.png';
import low from '../assets/low.png';
import high from '../assets/high.png';
import { getDay, isToday, isTomorrow } from 'date-fns';

const dayMap = {
    0: 'SUN',
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
    5: 'FRI',
    6: 'SAT',
};

const weatherIcons = {
    'clear-day': clearday,
    'clear-night': clearnight,
    cloudy: cloudy,
    fog: fog,
    hail: hail,
    'partly-cloudy-day': partlycloudyday,
    'partly-cloudy-night': partlycloudynight,
    'rain-snow-showers-day': rainsnowshowersday,
    'rain-snow-showers-night': rainsnowshowersnight,
    'rain-snow': rainsnow,
    rain: rain,
    'showers-day': showersday,
    'showers-night': showersnight,
    sleet: sleet,
    'snow-showers-day': snowshowersday,
    'snow-showers-night': snowshowersnight,
    snow: snow,
    'thunder-rain': thunerrain,
    'thunder-showers-day': thundershowersday,
    'thunder-showers-night': thundershowersnight,
    thunder: thunder,
    wind: wind,
};

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
    userGivenWeatherDetails?: WeatherReport,
) {
    let weatherDetails: WeatherReport | undefined;
    try {
        if (userGivenWeatherDetails) weatherDetails = userGivenWeatherDetails;
        else if (geolocation)
            weatherDetails = await getWeatherGivenLocation(geolocation, unit);
        else if (city) weatherDetails = await getWeatherGivenCity(city, unit);
        else throw new Error('Must provide city or provide location');

        if (weatherDetails) {
            const unitString = unit == 'us' ? '°F' : '°C';
            renderCurrentLocation(weatherDetails);
            renderCurrentConditions(weatherDetails, unitString);
            // renderFeelsLike(weatherDetails, unitString);
            renderHumidity(weatherDetails);
            renderMinMaxTemp(weatherDetails, unitString);
            renderDescription(weatherDetails);
            renderFutureForecast(weatherDetails, unitString);
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

/**
 * Renders the current weather conditions to the UI.
 *
 * @param weatherDetails: The weather data object.
 * @param unit:         The unit of temperature ('°F' or '°C').
 * @throws Error if the weatherContainer or its children are not found.
 */
// function renderCurrentConditions(weatherDetails: WeatherReport, unit: string) {
//     const currentConditionDiv = document?.querySelector('.currentConditions');
//     const locationDiv = currentConditionDiv?.children[0] as HTMLDivElement;
//     const tempContainerDiv = currentConditionDiv?.children[1] as HTMLDivElement;
//     const shortDescriptionDiv = currentConditionDiv
//         ?.children[2] as HTMLDivElement;

//     locationDiv.innerText = weatherDetails.location;
//     shortDescriptionDiv.innerText = weatherDetails.conditions;

//     const icon = tempContainerDiv.children[0] as HTMLImageElement;
//     const currentTempDiv = tempContainerDiv.children[1] as HTMLDivElement;
//     const minMaxTempDiv = tempContainerDiv.children[2] as HTMLDivElement;

//     const iconKey = weatherDetails.weatherIcon;
//     icon.src =
//         weatherIcons[iconKey as keyof typeof weatherIcons] ||
//         weatherIcons['clear-day'];
//     icon.alt = iconKey.split('-').join(' ');
//     currentTempDiv.innerText = weatherDetails.temperature.toString() + unit;

//     const maxTempDiv = minMaxTempDiv.children[0] as HTMLDivElement;
//     const minTempDiv = minMaxTempDiv.children[1] as HTMLDivElement;

//     maxTempDiv.innerText = weatherDetails.tempMax.toString() + unit;
//     minTempDiv.innerText = weatherDetails.tempMin.toString() + unit;
// }

function renderCurrentConditions(weatherDetails: WeatherReport, unit: string) {
    const currentConditionDiv = document?.querySelector(
        '.currentConditions',
    ) as HTMLDivElement;
    cleanDiv(currentConditionDiv);

    // const tempContainerDiv = document.createElement('div');
    const icon = document.createElement('img');
    const currentTemp = document.createElement('div');
    const iconKey = weatherDetails.weatherIcon;
    icon.src =
        weatherIcons[iconKey as keyof typeof weatherIcons] ||
        weatherIcons['clear-day'];
    icon.alt = iconKey.split('-').join(' ');
    currentTemp.innerText = weatherDetails.temperature.toString() + unit;
    currentConditionDiv?.appendChild(icon);
    currentConditionDiv?.appendChild(currentTemp);
    // currentConditionDiv?.appendChild(tempContainerDiv);
}

function renderMinMaxTemp(weatherDetails: WeatherReport, unit: string) {
    const max = document.querySelector('.maxTemp') as HTMLDivElement;
    const min = document.querySelector('.minTemp') as HTMLDivElement;
    cleanDiv(max);
    cleanDiv(min);

    const maxIcon = document.createElement('img');
    const maxTempDiv = document.createElement('div');
    const minIcon = document.createElement('img');
    const minTempDiv = document.createElement('div');

    maxTempDiv.innerText = weatherDetails.tempMax.toString() + unit;
    minTempDiv.innerText = weatherDetails.tempMin.toString() + unit;
    maxIcon.src = high;
    minIcon.src = low;

    max.appendChild(maxIcon);
    max.appendChild(maxTempDiv);
    min.appendChild(minIcon);
    min.appendChild(minTempDiv);
}

function renderCurrentLocation(weatherDetails: WeatherReport) {
    const locationDiv = document.querySelector(
        '.currentLocation',
    ) as HTMLDivElement;
    locationDiv.innerText = weatherDetails.location;
}

/**
 * Renders the "feels like" temperature to the UI.
 *
 * @param weatherDetails: The weather data object.
 * @param unit:         The unit of temperature ('°F' or '°C').
 * @throws Error if the weatherContainer or feelsLike children are not found.
 */
function renderFeelsLike(weatherDetails: WeatherReport, unit: string) {
    const feelsLikeDiv = document?.querySelector('.feelsLike');
    const mainText = feelsLikeDiv?.children[0] as HTMLDivElement;
    const temp = feelsLikeDiv?.children[1] as HTMLDivElement;

    mainText.innerText = 'Feels like';
    temp.innerText = weatherDetails.feelsLike + unit;
}

/**
 * Renders the humidity information to the UI.
 *
 * @param weatherDetails: The weather data object.
 * @throws Error if the weatherContainer or humidity children are not found.
 */
function renderHumidity(weatherDetails: WeatherReport) {
    const humidityDiv = document?.querySelector('.humidity') as HTMLDivElement;
    cleanDiv(humidityDiv);

    const humidityIcon = document.createElement('img');
    const humidityValue = document.createElement('div');
    humidityIcon.src = humidity;
    humidityValue.innerText = weatherDetails.humidity + '%';

    humidityDiv?.appendChild(humidityIcon);
    humidityDiv?.appendChild(humidityValue);
}

/**
 * Renders the weather description to the UI.
 *
 * @param weatherDetails: The weather data object.
 * @throws Error if the weatherContainer or description children are not found.
 */
function renderDescription(weatherDetails: WeatherReport) {
    const descriptionDiv = document.querySelector(
        '.description',
    ) as HTMLDivElement;
    cleanDiv(descriptionDiv);
    const descriptionIcon = document.createElement('img');
    const mainText = document.createElement('div');

    descriptionIcon.src = info;
    mainText.innerText = weatherDetails.description;
    descriptionDiv?.appendChild(descriptionIcon);
    descriptionDiv?.appendChild(mainText);
}

/**
 * Renders the future forecast to the UI.
 *
 * @param weatherDetails: The weather data object.
 * @param unit:         The unit of temperature ('°F' or '°C').
 * @throws Error if the weatherContainer or futureForecast container is not found.
 */
function renderFutureForecast(weatherDetails: WeatherReport, unit: string) {
    const futureForecastDiv = document?.querySelector(
        '.futureForecast',
    ) as HTMLDivElement;
    cleanDiv(futureForecastDiv);
    for (const dayData of weatherDetails.days) {
        const curDate = new Date(dayData.date);
        if (isToday(curDate) || dayData == weatherDetails.days[0]) continue;

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('card');

        const day = document.createElement('div');
        const tempContainer = document.createElement('div');

        day.innerText = dayMap[getDay(curDate) as keyof typeof dayMap];
        if (isTomorrow(curDate)) day.innerText = 'TOM';

        const weatherIcon = document.createElement('img');
        const temp = document.createElement('div');
        const iconKey = dayData.weatherIcon;
        weatherIcon.src =
            weatherIcons[iconKey as keyof typeof weatherIcons] ||
            weatherIcons['clear-day'];

        temp.innerText = dayData.temp + unit;

        tempContainer.appendChild(weatherIcon);
        tempContainer.appendChild(temp);
        dayDiv.appendChild(day);
        dayDiv.appendChild(tempContainer);
        futureForecastDiv.appendChild(dayDiv);
    }
}

/**
 * Cleans all the children of a given HTML element.
 *
 * @param element: The HTML element to clean.
 */
function cleanDiv(element: HTMLElement) {
    while (element.firstChild) element.removeChild(element.firstChild);
}
