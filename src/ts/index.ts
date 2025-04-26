import '../css/styles.css';
import '../css/reset.css';
import { render } from './renderDetails';

let cityValue = 'New York';
let unit = 'metric';
let geoLocation: GeolocationPosition | undefined = undefined;
const loadingIcon = document.querySelector('.loading');
const searchIcon = document.querySelector('.search');
const input = document.querySelector('input');
const unitToggle = document.getElementById('unitToggle') as HTMLInputElement;
const useLocation = document.getElementById('location') as HTMLButtonElement;

input?.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        handleSubmit(e as Event);
    }
});

searchIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    handleSubmit(e);
});

unitToggle.addEventListener('change', () => {
    if (unitToggle.checked) unit = 'metric';
    else unit = 'us';
    handleDefaultRender(unit, cityValue);
});

useLocation.addEventListener('click', (e) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            geoLocation = position;
            handleDefaultRender(unit, undefined, geoLocation);
        });
    } else {
        console.error('Location permission not available');
    }
});

function handleSubmit(ev: Event) {
    if (input) {
        cityValue = input.value == '' ? cityValue : input.value;
        handleDefaultRender(unit, cityValue);
    }
}

async function handleDefaultRender(
    unit: string,
    cityValue?: string,
    geoLocation?: GeolocationPosition,
) {
    loadingIcon?.classList.remove('hidden');
    searchIcon?.classList.add('hidden');
    try {
        await render(unit, cityValue, geoLocation);
    } catch (error) {
        console.log(error);
    } finally {
        loadingIcon?.classList.add('hidden');
        searchIcon?.classList.remove('hidden');
    }
}

window.onload = () => {
    // render('metric', undefined, undefined, tempWeatherReport());
    handleDefaultRender(unit, cityValue);
};
