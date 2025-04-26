import '../css/styles.css';
import '../css/reset.css';
import {
    getWeatherGivenCity,
    getWeatherGivenLocation,
    tempWeatherReport,
} from './weatherApi';
import { render } from './renderDetails';

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

let cityValue = 'New York';
let unit = 'metric';
let geoLocation: GeolocationPosition | undefined = undefined;

const input = document.querySelector('input');
input?.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        handleSubmit(e as Event);
    }
});

const search = document.querySelector('svg');
search?.addEventListener('click', (e) => {
    e.preventDefault();
    handleSubmit(e);
});

function handleSubmit(ev: Event) {
    if (input) {
        cityValue = input.value == '' ? cityValue : input.value;
        render(unit, cityValue);
    }
}

window.onload = () => {
    // render('metric', undefined, undefined, tempWeatherReport());
    render(unit, cityValue);
};

const unitToggle = document.getElementById('unitToggle') as HTMLInputElement;

unitToggle.addEventListener('change', () => {
    if (unitToggle.checked) unit = 'metric';
    else unit = 'us';
    render(unit, cityValue);
});

const useLocation = document.getElementById('location') as HTMLButtonElement;

useLocation.addEventListener('click', (e) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            geoLocation = position;
            render(unit, undefined, position);
        });
    } else {
        console.error('Location permission not available');
    }
});
