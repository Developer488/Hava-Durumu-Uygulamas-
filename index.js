export async function getCoordinatesByCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=tr&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Konum servisine şu anda ulaşılamıyor.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`"${city}" için sonuç bulunamadı.`);
  }

  const { name, country, latitude, longitude } = data.results[0];
  return {
    displayName: country ? `${name}, ${country}` : name,
    cityName: name,
    latitude,
    longitude,
  };
}

export async function getWeatherByCoords(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    forecast_days: "5",
    timezone: "auto",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Hava durumu verileri alınamadı.");
  }

  return response.json();
}