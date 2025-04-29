import '../css/styles.css';
import '../css/reset.css';
import { render } from './renderDetails';
import { tempWeatherReport } from './weatherApi';

let cityValue = 'New York';
let unit = 'us';
let geoLocation: GeolocationPosition | undefined = undefined;
const loadingIcon = document.querySelector('.loading');
const searchIcon = document.querySelector('.search');
const input = document.querySelector('input');
const unitToggle = document.getElementById('unitToggle') as HTMLInputElement;
const useLocation = document.getElementById('location') as HTMLButtonElement;
const toggleNavButton = document.getElementById(
    'nav-toggle',
) as HTMLButtonElement;
const futureForecast = document.querySelector('.futureForecast') as HTMLElement;
let scrollerId = startScroll();
stopScroll();

futureForecast.addEventListener('mouseenter', () => {
    stopScroll();
});

futureForecast.addEventListener('mouseleave', () => {
    scrollerId = startScroll();
});

futureForecast.addEventListener('wheel', (event) => {
    event.preventDefault();
    futureForecast.scrollLeft += event.deltaY;
});

toggleNavButton.addEventListener('click', toggleNav);

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

function toggleNav(e: MouseEvent) {
    const state = document.body.dataset.nav;
    const text = toggleNavButton.querySelector('span') as HTMLSpanElement;
    if (state === 'false') {
        document.body.dataset.nav = 'true';
        text.innerText = 'Close';

        scrollerId = startScroll();
    } else {
        document.body.dataset.nav = 'false';
        text.innerText = 'Forecast';
        stopScroll();
        futureForecast.scrollTo({ left: 0, behavior: 'smooth' });
    }
}

function startScroll() {
    let id = setInterval(function () {
        futureForecast.scrollBy(3, 0);
        if (
            futureForecast.scrollLeft + futureForecast.offsetWidth >=
            futureForecast.scrollWidth
        ) {
            stopScroll();
            futureForecast.scrollTo({ left: 0, behavior: 'smooth' });
            setTimeout(() => {
                scrollerId = startScroll();
            }, 1000);
        }
    }, 30);
    return id;
}

function stopScroll() {
    clearInterval(scrollerId);
}

window.onload = () => {
    handleDefaultRender(unit, cityValue);
};
