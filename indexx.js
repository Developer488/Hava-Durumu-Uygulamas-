const WEATHER_CODES = {
  0: { desc: "Açık", icon: "☀️" },
  1: { desc: "Çoğunlukla Açık", icon: "🌤️" },
  2: { desc: "Parçalı Bulutlu", icon: "⛅" },
  3: { desc: "Kapalı", icon: "☁️" },
  45: { desc: "Sisli", icon: "🌫️" },
  48: { desc: "Kırağılı Sis", icon: "🌫️" },
  51: { desc: "Hafif Çiseleme", icon: "🌦️" },
  53: { desc: "Orta Çiseleme", icon: "🌦️" },
  55: { desc: "Yoğun Çiseleme", icon: "🌧️" },
  61: { desc: "Hafif Yağmurlu", icon: "🌦️" },
  63: { desc: "Yağmurlu", icon: "🌧️" },
  65: { desc: "Şiddetli Yağmur", icon: "🌧️" },
  71: { desc: "Hafif Kar Yağışlı", icon: "🌨️" },
  73: { desc: "Kar Yağışlı", icon: "❄️" },
  75: { desc: "Yoğun Kar Yağışlı", icon: "❄️" },
  80: { desc: "Hafif Sağanak", icon: "🌦️" },
  81: { desc: "Sağanak Yağışlı", icon: "🌧️" },
  82: { desc: "Şiddetli Sağanak", icon: "⛈️" },
  95: { desc: "Gök Gürültülü Fırtına", icon: "⛈️" },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { desc: "Bilinmiyor", icon: "🌡️" };
}

function formatTemp(celsius, unit) {
  const value = unit === "F" ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°${unit}`;
}

function formatDayName(dateStr) {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("tr-TR", { weekday: "short" });
}

export function setStatus(message, isError = false) {
  const statusEl = document.getElementById("status-message");
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

export function renderWeather(locationName, weatherData, unit = "C") {
  const contentEl = document.getElementById("weather-content");
  const { current, daily } = weatherData;
  const info = getWeatherInfo(current.weather_code);

  document.getElementById("location-name").textContent = locationName;
  document.getElementById("weather-desc").textContent = info.desc;
  document.getElementById("weather-icon").textContent = info.icon;
  document.getElementById("current-temp").textContent = formatTemp(current.temperature_2m, unit);
  document.getElementById("apparent-temp").textContent = formatTemp(current.apparent_temperature, unit);
  document.getElementById("humidity").textContent = `%${current.relative_humidity_2m}`;
  document.getElementById("wind-speed").textContent = `${Math.round(current.wind_speed_10m)} km/s`;

  const forecastList = document.getElementById("forecast-list");
  forecastList.innerHTML = "";

  daily.time.forEach((day, index) => {
    const dayInfo = getWeatherInfo(daily.weather_code[index]);
    const maxTemp = formatTemp(daily.temperature_2m_max[index], unit);
    const minTemp = formatTemp(daily.temperature_2m_min[index], unit);

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <span class="forecast-day">${index === 0 ? "Bugün" : formatDayName(day)}</span>
      <span class="forecast-icon">${dayInfo.icon}</span>
      <div class="forecast-temps">
        <strong>${maxTemp}</strong>
        <span class="min">${minTemp}</span>
      </div>
    `;
    forecastList.appendChild(card);
  });

  contentEl.classList.remove("hidden");
}

export function renderRecentSearches(cities, onSelect) {
  const container = document.getElementById("recent-searches");
  container.innerHTML = "";

  cities.forEach((city) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "recent-chip";
    btn.textContent = city;
    btn.addEventListener("click", () => onSelect(city));
    container.appendChild(btn);
  });
}