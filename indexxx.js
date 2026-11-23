import { getCoordinatesByCity, getWeatherByCoords } from "./index.js";
import { setStatus, renderWeather, renderRecentSearches } from "./indexx.js";

const STORAGE_KEY = "weather_recent_cities";

const state = {
  unit: "C",
  lastLocationName: null,
  lastWeatherData: null,
  recentCities: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
};

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const unitToggleBtn = document.getElementById("unit-toggle");
const geoBtn = document.getElementById("geo-btn");

function saveRecentCity(cityName) {
  const filtered = state.recentCities.filter(
    (item) => item.toLowerCase() !== cityName.toLowerCase()
  );
  state.recentCities = [cityName, ...filtered].slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.recentCities));
  renderRecentSearches(state.recentCities, handleCitySearch);
}

async function handleCitySearch(city) {
  const trimmed = city.trim();
  if (!trimmed) return;

  setStatus("Hava durumu yükleniyor...");

  try {
    const location = await getCoordinatesByCity(trimmed);
    const weather = await getWeatherByCoords(location.latitude, location.longitude);

    state.lastLocationName = location.displayName;
    state.lastWeatherData = weather;

    renderWeather(state.lastLocationName, state.lastWeatherData, state.unit);
    saveRecentCity(location.cityName);
    setStatus("");
  } catch (error) {
    setStatus(error.message || "Bir hata oluştu.", true);
  }
}

function handleGeoLocation() {
  if (!navigator.geolocation) {
    setStatus("Tarayıcınız konum özelliğini desteklemiyor.", true);
    return;
  }

  setStatus("Konum alınıyor...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const weather = await getWeatherByCoords(latitude, longitude);

        state.lastLocationName = "Mevcut Konumunuz";
        state.lastWeatherData = weather;

        renderWeather(state.lastLocationName, state.lastWeatherData, state.unit);
        setStatus("");
      } catch (error) {
        setStatus(error.message || "Konum hava durumu alınamadı.", true);
      }
    },
    () => {
      setStatus("Konum izni reddedildi veya alınamadı.", true);
    }
  );
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleCitySearch(cityInput.value);
  cityInput.value = "";
});

unitToggleBtn.addEventListener("click", () => {
  state.unit = state.unit === "C" ? "F" : "C";
  if (state.lastWeatherData && state.lastLocationName) {
    renderWeather(state.lastLocationName, state.lastWeatherData, state.unit);
  }
});

geoBtn.addEventListener("click", handleGeoLocation);

renderRecentSearches(state.recentCities, handleCitySearch);
handleCitySearch(state.recentCities[0] || "İstanbul");