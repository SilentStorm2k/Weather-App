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
import { getDay, isToday, isTomorrow } from 'date-fns';

const weatherContainer = document.querySelector('.weatherReport');

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
) {
    let weatherDetails: WeatherReport | undefined;
    try {
        // if (geolocation)
        //     weatherDetails = await getWeatherGivenLocation(geolocation, unit);
        // else if (city) weatherDetails = await getWeatherGivenCity(city, unit);
        // else throw new Error('Must provide city or provide location');
        weatherDetails = tempWeatherReport();
        console.log('WORksS', weatherDetails);

        if (weatherDetails) {
            const unitString = unit == 'us' ? '°F' : '°C';
            renderCurrentConditions(weatherDetails, unitString);
            renderFeelsLike(weatherDetails, unitString);
            renderHumidity(weatherDetails);
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
function renderCurrentConditions(weatherDetails: WeatherReport, unit: string) {
    const currentConditionDiv =
        weatherContainer?.querySelector('.currentConditions');
    const locationDiv = currentConditionDiv?.children[0] as HTMLDivElement;
    const tempContainerDiv = currentConditionDiv?.children[1] as HTMLDivElement;
    const shortDescriptionDiv = currentConditionDiv
        ?.children[2] as HTMLDivElement;

    locationDiv.innerText = weatherDetails.location;
    shortDescriptionDiv.innerText = weatherDetails.conditions;

    const icon = tempContainerDiv.children[0] as HTMLImageElement;
    const currentTempDiv = tempContainerDiv.children[1] as HTMLDivElement;
    const minMaxTempDiv = tempContainerDiv.children[2] as HTMLDivElement;

    const iconKey = weatherDetails.weatherIcon;
    icon.src =
        weatherIcons[iconKey as keyof typeof weatherIcons] ||
        weatherIcons['clear-day'];
    currentTempDiv.innerText = weatherDetails.temperature.toString() + unit;

    const maxTempDiv = minMaxTempDiv.children[0] as HTMLDivElement;
    const minTempDiv = minMaxTempDiv.children[1] as HTMLDivElement;

    maxTempDiv.innerText = weatherDetails.tempMax.toString() + unit;
    minTempDiv.innerText = weatherDetails.tempMin.toString() + unit;
}

function renderFeelsLike(weatherDetails: WeatherReport, unit: string) {
    const feelsLikeDiv = weatherContainer?.querySelector('.feelsLike');
    const mainText = feelsLikeDiv?.children[0] as HTMLDivElement;
    const temp = feelsLikeDiv?.children[1] as HTMLDivElement;

    mainText.innerText = 'Feels like';
    temp.innerText = weatherDetails.feelsLike + unit;
}

function renderHumidity(weatherDetails: WeatherReport) {
    const humidityDiv = weatherContainer?.querySelector('.humidity');
    const mainText = humidityDiv?.children[0] as HTMLDivElement;
    const humidityContainer = humidityDiv?.children[1] as HTMLDivElement;

    mainText.innerText = 'Humidity';

    const humidityIcon = humidityContainer.children[0] as HTMLImageElement;
    const humidityValue = humidityContainer.children[1] as HTMLDivElement;

    humidityIcon.src = humidity;
    humidityValue.innerText = weatherDetails.humidity + '%';
}

function renderDescription(weatherDetails: WeatherReport) {
    const descriptionDiv = weatherContainer?.querySelector('.description');
    const descriptionIcon = descriptionDiv?.children[0] as HTMLImageElement;
    const mainText = descriptionDiv?.children[1] as HTMLDivElement;

    descriptionIcon.src = info;
    mainText.innerText = weatherDetails.description;
}

function renderFutureForecast(weatherDetails: WeatherReport, unit: string) {
    const futureForecastDiv = weatherContainer?.querySelector(
        '.futureForecast',
    ) as HTMLDivElement;
    cleanDiv(futureForecastDiv);
    for (const dayData of weatherDetails.days) {
        const curDate = new Date(dayData.date);
        if (isToday(curDate)) continue;

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
    throw new Error('Function not implemented.');
}

function cleanDiv(element: HTMLElement) {
    while (element.firstChild) element.removeChild(element.firstChild);
}
