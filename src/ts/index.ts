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
    throw new Error('Function not implemented.');
}
