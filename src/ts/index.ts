import '../css/styles.css';
import '../css/reset.css';
import { getWeatherGivenCity, getWeatherGivenLocation } from './weatherApi';

console.log('hello world');

// getWeatherGivenCity('chennai')
//     .then((weather) => console.log(weather))
//     .catch((err) => console.log(err));

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                getWeatherGivenLocation(pos)
                    .then((weather) => console.log(weather))
                    .catch((err) => console.log(err)),
            (err) => console.log(err),
        );
    } else {
        console.log('Geolocation not supported in your browser');
    }
}

// getLocation();
