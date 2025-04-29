var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import '../css/styles.css';
import '../css/reset.css';
import { render } from './renderDetails';
let cityValue = 'New York';
let unit = 'us';
let geoLocation = undefined;
const loadingIcon = document.querySelector('.loading');
const searchIcon = document.querySelector('.search');
const input = document.querySelector('input');
const unitToggle = document.getElementById('unitToggle');
const useLocation = document.getElementById('location');
const toggleNavButton = document.getElementById('nav-toggle');
const futureForecast = document.querySelector('.futureForecast');
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
input === null || input === void 0 ? void 0 : input.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        handleSubmit(e);
    }
});
searchIcon === null || searchIcon === void 0 ? void 0 : searchIcon.addEventListener('click', (e) => {
    e.preventDefault();
    handleSubmit(e);
});
unitToggle.addEventListener('change', () => {
    if (unitToggle.checked)
        unit = 'metric';
    else
        unit = 'us';
    handleDefaultRender(unit, cityValue);
});
useLocation.addEventListener('click', (e) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            geoLocation = position;
            handleDefaultRender(unit, undefined, geoLocation);
        });
    }
    else {
        console.error('Location permission not available');
    }
});
function handleSubmit(ev) {
    if (input) {
        cityValue = input.value == '' ? cityValue : input.value;
        handleDefaultRender(unit, cityValue);
    }
}
function handleDefaultRender(unit, cityValue, geoLocation) {
    return __awaiter(this, void 0, void 0, function* () {
        loadingIcon === null || loadingIcon === void 0 ? void 0 : loadingIcon.classList.remove('hidden');
        searchIcon === null || searchIcon === void 0 ? void 0 : searchIcon.classList.add('hidden');
        try {
            yield render(unit, cityValue, geoLocation);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            loadingIcon === null || loadingIcon === void 0 ? void 0 : loadingIcon.classList.add('hidden');
            searchIcon === null || searchIcon === void 0 ? void 0 : searchIcon.classList.remove('hidden');
        }
    });
}
function toggleNav(e) {
    const state = document.body.dataset.nav;
    const text = toggleNavButton.querySelector('span');
    if (state === 'false') {
        document.body.dataset.nav = 'true';
        text.innerText = 'Close';
        scrollerId = startScroll();
    }
    else {
        document.body.dataset.nav = 'false';
        text.innerText = 'Forecast';
        stopScroll();
        futureForecast.scrollTo({ left: 0, behavior: 'smooth' });
    }
}
function startScroll() {
    let id = setInterval(function () {
        futureForecast.scrollBy(3, 0);
        if (futureForecast.scrollLeft + futureForecast.offsetWidth >=
            futureForecast.scrollWidth) {
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
