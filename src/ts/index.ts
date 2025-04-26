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
        const cityValue = input.value == '' ? 'New York' : input.value;
        render('us', cityValue);
    }
}

window.onload = () => {
    render('us', 'New York');
};
