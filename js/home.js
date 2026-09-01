/**
 * VyomaCast — Home Page Controller (home.js)
 */

async function initHomePage(loc) {
  try {
    const data = await WeatherAPI.fetchWeatherData(loc.lat, loc.lon, loc.name, loc.countryCode);

    // Hero Bindings
    setText('hero-city', data.city);
    setText('hero-country', data.country);
    setText('hero-temp', `${data.temp}°C`);
    setText('hero-feels-like', `Feels like ${data.feelsLike}°C`);
    setText('hero-condition', data.condition);
    setText('hero-desc', data.description);
    setText('hero-temp-high', `H: ${data.tempMax}°C`);
    setText('hero-temp-low', `L: ${data.tempMin}°C`);
    setSrc('hero-icon', data.icon);
    setText('hero-datetime', new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));

    // 8 Metric Cards Bindings
    setText('metric-wind-val', data.windSpeed);
    setText('metric-humidity-val', `${data.humidity}%`);
    setStyle('humidity-progress-bar', 'width', `${data.humidity}%`);
    setText('metric-uv-val', data.uvIndex);
    setText('metric-pressure-val', data.pressure);
    setText('metric-visibility-val', data.visibility);
    setText('metric-dew-val', `${data.dewPoint}°C`);
    setText('metric-clouds-val', `${data.clouds}%`);
    setText('metric-sunrise-time', data.sunrise);
    setText('metric-sunset-time', data.sunset);

    // Sparkline Canvas
    Charts.drawSparkline('sparkline-canvas', data.hourly.slice(0, 10).map(h => h.temp));
  } catch (err) {
    console.error('Home page render error:', err);
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setSrc(id, val) {
  const el = document.getElementById(id);
  if (el) el.src = val;
}

function setStyle(id, prop, val) {
  const el = document.getElementById(id);
  if (el) el.style[prop] = val;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('home-content-container')) {
    const loc = AppState.getActiveLocation();
    initHomePage(loc);
    initSearch(initHomePage);
    initGPS(initHomePage);
  }
});