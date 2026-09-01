/**
 * VyomaCast — Views & Multi-Page Controller (pages.js)
 * Controls 7-Day Forecast, 24h Hourly Timeline, Saved Cities, and Details (AQI + Compass).
 */

// ==========================================
// 1. FORECAST PAGE
// ==========================================
async function initForecastPage(loc) {
  const data = await WeatherAPI.fetchWeatherData(loc.lat, loc.lon, loc.name, loc.countryCode);

  document.getElementById('forecast-city-name').textContent = data.city;
  document.getElementById('forecast-city-country').textContent = `${data.city}, ${data.country}`;
  document.getElementById('forecast-temp-summary').textContent = `Range: ${data.tempMin}°C — ${data.tempMax}°C`;

  const grid = document.getElementById('forecast-grid');
  if (!grid) return;
  grid.innerHTML = '';

  data.daily.forEach((d, idx) => {
    const card = document.createElement('div');
    card.className = `forecast-day-card ${idx === 0 ? 'active' : ''}`;
    card.innerHTML = `
      <span class="day-badge">${d.day}</span>
      <span class="day-date">${d.date}</span>
      <img src="${d.icon}" alt="${d.condition}" class="day-icon" />
      <span class="day-condition">${d.condition}</span>
      <div class="day-temp-bar">
        <span style="color: #ef4444;">${d.tempMax}°</span>
        <span style="color: var(--text-muted);">/</span>
        <span style="color: #0284c7;">${d.tempMin}°</span>
      </div>
      <span class="day-rain-prob">💧 ${d.rainProb}%</span>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.forecast-day-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      renderDayDetails(d);
    });

    grid.appendChild(card);
  });

  renderDayDetails(data.daily[0]);
  Charts.drawForecastChart('forecast-chart-canvas', data.daily.map(d => d.tempMax), data.daily.map(d => d.tempMin), data.daily.map(d => d.day));
}

function renderDayDetails(d) {
  const panel = document.getElementById('day-details-panel');
  if (!panel) return;
  panel.innerHTML = `
    <div class="day-details-header">
      <div>
        <h3 style="font-size: 1.35rem; font-weight: 700;">${d.fullDay} Breakdown (${d.date})</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">${d.condition} • Rain chance: ${d.rainProb}% • UV Index: ${d.uvIndex}</p>
      </div>
      <span class="badge badge-primary">High: ${d.tempMax}°C / Low: ${d.tempMin}°C</span>
    </div>
    <div class="timeparts-grid">
      <div class="timepart-box">
        <span class="timepart-title">Morning</span>
        <span class="timepart-temp">${d.morningTemp}°C</span>
      </div>
      <div class="timepart-box">
        <span class="timepart-title">Afternoon</span>
        <span class="timepart-temp" style="color: #ef4444;">${d.afternoonTemp}°C</span>
      </div>
      <div class="timepart-box">
        <span class="timepart-title">Evening</span>
        <span class="timepart-temp">${d.eveningTemp}°C</span>
      </div>
      <div class="timepart-box">
        <span class="timepart-title">Night</span>
        <span class="timepart-temp" style="color: #0284c7;">${d.nightTemp}°C</span>
      </div>
    </div>
  `;
}

// ==========================================
// 2. HOURLY PAGE
// ==========================================
async function initHourlyPage(loc) {
  const data = await WeatherAPI.fetchWeatherData(loc.lat, loc.lon, loc.name, loc.countryCode);

  document.getElementById('hourly-city-name').textContent = data.city;
  document.getElementById('hourly-city-country').textContent = `${data.city}, ${data.country}`;
  document.getElementById('hourly-current-temp').textContent = `${data.temp}°C`;

  const track = document.getElementById('hourly-track');
  if (!track) return;
  track.innerHTML = '';

  data.hourly.forEach((h, idx) => {
    const card = document.createElement('div');
    card.className = `hourly-card ${idx === 0 ? 'now' : ''}`;
    card.innerHTML = `
      <span class="hourly-time">${h.time}</span>
      <img src="${h.icon}" alt="${h.condition}" class="hourly-icon" />
      <span class="hourly-temp">${h.temp}°</span>
      <span class="hourly-subval">💧 ${h.rainProb}%</span>
    `;
    track.appendChild(card);
  });

  const temps = data.hourly.map(h => h.temp);
  const rains = data.hourly.map(h => h.rainProb);
  const winds = data.hourly.map(h => h.windSpeed);
  const times = data.hourly.map(h => h.time);

  function updateMetricChart(metric) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-metric') === metric));
    if (metric === 'temp') {
      document.getElementById('chart-metric-badge').textContent = 'Temperature (°C)';
      Charts.drawHourlySpline('hourly-chart-canvas', temps, times, '#0284c7');
    } else if (metric === 'rain') {
      document.getElementById('chart-metric-badge').textContent = 'Precipitation (%)';
      Charts.drawHourlySpline('hourly-chart-canvas', rains, times, '#06b6d4');
    } else {
      document.getElementById('chart-metric-badge').textContent = 'Wind (km/h)';
      Charts.drawHourlySpline('hourly-chart-canvas', winds, times, '#0284c7');
    }
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => updateMetricChart(btn.getAttribute('data-metric'));
  });

  updateMetricChart('temp');

  document.getElementById('stat-peak-temp').textContent = `${Math.max(...temps)}°C`;
  document.getElementById('stat-peak-rain').textContent = `${Math.max(...rains)}% chance`;
  document.getElementById('stat-peak-wind').textContent = `${Math.max(...winds)} km/h`;
}

// ==========================================
// 3. CITIES PAGE
// ==========================================
function initCitiesPage(loc) {
  const saved = AppState.getSavedCities();
  document.getElementById('favorites-count').textContent = `${saved.length} saved`;

  const favGrid = document.getElementById('favorites-grid');
  if (favGrid) {
    favGrid.innerHTML = '';
    saved.forEach(c => {
      const card = document.createElement('div');
      card.className = 'city-card';
      card.innerHTML = `
        <div class="city-card-header">
          <div><h3 class="city-card-name">${c.name}</h3><span class="city-card-country">${c.country}</span></div>
          <div class="city-card-actions">
            <button class="btn-card-action btn-view">View</button>
            <button class="btn-card-action btn-remove">Remove</button>
          </div>
        </div>
        <div class="city-card-body"><span class="city-card-temp">--°</span></div>
      `;

      card.querySelector('.btn-view').addEventListener('click', () => {
        AppState.setActiveLocation(c);
        window.location.href = window.location.pathname.includes('/html/') ? '../index.html' : 'index.html';
      });

      card.querySelector('.btn-remove').addEventListener('click', e => {
        e.stopPropagation();
        AppState.removeCity(c.name);
        initCitiesPage(loc);
      });

      favGrid.appendChild(card);

      WeatherAPI.fetchWeatherData(c.lat, c.lon, c.name, c.countryCode).then(w => {
        const t = card.querySelector('.city-card-temp');
        if (t) t.textContent = `${w.temp}°`;
      }).catch(() => {});
    });
  }

  const addBtn = document.getElementById('add-current-fav-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      AppState.saveCity(loc);
      initCitiesPage(loc);
    };
  }

  const hubs = [
    { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
    { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
    { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
    { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 }
  ];

  const hubGrid = document.getElementById('popular-cities-grid');
  if (hubGrid && hubGrid.children.length === 0) {
    hubGrid.innerHTML = '';
    hubs.forEach(h => {
      const hCard = document.createElement('div');
      hCard.className = 'city-card';
      hCard.innerHTML = `
        <div class="city-card-header">
          <div><h3 class="city-card-name">${h.name}</h3><span class="city-card-country">${h.country}</span></div>
          <button class="btn-card-action btn-view">View</button>
        </div>
        <div class="city-card-body"><span class="city-card-temp">--°</span></div>
      `;
      hCard.querySelector('.btn-view').addEventListener('click', () => {
        AppState.setActiveLocation(h);
        window.location.href = window.location.pathname.includes('/html/') ? '../index.html' : 'index.html';
      });
      hubGrid.appendChild(hCard);

      WeatherAPI.fetchWeatherData(h.lat, h.lon, h.name).then(w => {
        const t = hCard.querySelector('.city-card-temp');
        if (t) t.textContent = `${w.temp}°`;
      }).catch(() => {});
    });
  }
}

// ==========================================
// 4. DETAILS PAGE (EXACT LIVE AQI + COMPASS)
// ==========================================
async function initDetailsPage(loc) {
  const data = await WeatherAPI.fetchWeatherData(loc.lat, loc.lon, loc.name, loc.countryCode);

  document.getElementById('details-city-name').textContent = data.city;
  document.getElementById('details-city-country').textContent = `${data.city}, ${data.country}`;
  document.getElementById('details-current-temp').textContent = `${data.temp}°C`;

  document.getElementById('atmospheric-summary-text').textContent = `${data.city} is experiencing ${data.condition.toLowerCase()} at ${data.temp}°C (feels like ${data.feelsLike}°C). Humidity is ${data.humidity}% with winds at ${data.windSpeed} km/h. Live Air Quality is ${data.airQuality.label} (AQI ${data.airQuality.aqi}).`;

  document.getElementById('wind-speed-badge').textContent = `${data.windSpeed} km/h`;
  document.getElementById('wind-speed-val').textContent = `${data.windSpeed} km/h`;
  document.getElementById('wind-gust-val').textContent = `${data.windGust} km/h`;
  document.getElementById('wind-dir-val').textContent = `${data.windDeg}°`;
  document.getElementById('wind-beaufort-val').textContent = data.windSpeed < 5 ? 'Calm' : data.windSpeed < 20 ? 'Light Breeze' : 'Moderate Gale';
  const needle = document.getElementById('compass-needle');
  if (needle) needle.style.transform = `rotate(${data.windDeg}deg)`;

  document.getElementById('sun-sunrise-time').textContent = data.sunrise;
  document.getElementById('sun-sunset-time').textContent = data.sunset;

  // EXACT LIVE AQI BINDINGS
  const pill = document.getElementById('aqi-pill');
  if (pill) {
    pill.className = `badge ${data.airQuality.badgeClass}`;
    pill.textContent = `AQI: ${data.airQuality.aqi} — ${data.airQuality.label}`;
  }
  const aqiVal = document.getElementById('aqi-value');
  if (aqiVal) {
    aqiVal.textContent = data.airQuality.aqi;
    aqiVal.style.color = data.airQuality.color;
  }
  document.getElementById('aqi-pm25').textContent = `${data.airQuality.pm25} µg/m³`;
  document.getElementById('aqi-pm10').textContent = `${data.airQuality.pm10} µg/m³`;
  document.getElementById('aqi-co').textContent = `${data.airQuality.co} mg/m³`;
  document.getElementById('aqi-no2').textContent = `${data.airQuality.no2} µg/m³`;

  document.getElementById('detail-pressure').textContent = data.pressure;
  document.getElementById('detail-humidity').textContent = data.humidity;
  document.getElementById('detail-dew').textContent = data.dewPoint;
  document.getElementById('detail-uv').textContent = data.uvIndex;
  document.getElementById('detail-visibility').textContent = data.visibility;
  document.getElementById('detail-clouds').textContent = data.clouds;
}

// Router for multi-pages
document.addEventListener('DOMContentLoaded', () => {
  const loc = AppState.getActiveLocation();
  if (document.getElementById('forecast-content-container')) {
    initForecastPage(loc);
    initSearch(initForecastPage);
    initGPS(initForecastPage);
  }
  if (document.getElementById('hourly-content-container')) {
    initHourlyPage(loc);
    initSearch(initHourlyPage);
    initGPS(initHourlyPage);
  }
  if (document.getElementById('cities-content-container')) {
    initCitiesPage(loc);
    initSearch(initCitiesPage);
    initGPS(initCitiesPage);
  }
  if (document.getElementById('details-content-container')) {
    initDetailsPage(loc);
    initSearch(initDetailsPage);
    initGPS(initDetailsPage);
  }
});