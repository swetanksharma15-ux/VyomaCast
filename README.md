# 🌦️ VyomaCast — Real-Time Weather, Simplified

> A modern, responsive multi-page weather dashboard built with **Pure Semantic HTML5, CSS3, and Vanilla JavaScript (ES6+)**. 
> Fully connected to live meteorological and air quality satellite data with zero external framework dependencies.

---

## 🌐 Live Demo

Experience the live application here: **[vyomacast.com](https://swetanksharma15-ux.github.io/VyomaCast/)**

---

## ✨ Features

- 🌤️ **Live Meteorological Telemetry**: Real-time temperature, "feels like", humidity, wind speed & direction, pressure, UV index, cloud cover, and sunrise/sunset times.
- 🌫️ **Exact Live Air Quality (AQI)**: Direct integration with official Open-Meteo Air Quality API providing real-time US AQI, PM2.5, PM10, Carbon Monoxide (CO), and Nitrogen Dioxide (NO2).
- 📍 **Global Geocoding & GPS Search**: Instant autocomplete search for any city, town, or district worldwide + one-click browser GPS reverse geocoding.
- 📈 **Native Canvas 2D Graphs**: Lightweight custom HTML5 Canvas curves for 24h temperature sparklines, 7-day high/low trend curves, and hourly timeline splines (no heavy chart libraries).
- 🧭 **Dynamic Visual Widgets**: Interactive SVG wind compass with rotating needle and solar daylight arc trajectory.
- 🎨 **Dual Theme Engine**:
  - **Sky Blue Mode (Default)**: Clean atmospheric sky blue gradient background.
  - **Dark Mode**: 100% deep navy blue, midnight cyan, and sky blue UI (zero plain white background).
- 📱 **Fully Responsive Layout**: Optimized for desktop, tablet, and mobile screens.

---

## 📁 Systematic Project Architecture

```text
VyomaCast/
├── index.html                  (Main Home Dashboard at root)
│
├── html/                       (Secondary HTML Pages)
│   ├── forecast.html           (7-Day Forecast & High/Low Trend Curve)
│   ├── hourly.html             (24-Hour Timeline & Metric Spline Chart)
│   ├── cities.html             (My Saved Cities & Featured Global Hubs)
│   └── details.html            (Dynamic Wind Compass, Solar Arc & Exact Live AQI)
│
├── css/
│   └── style.css               (Clean, concise stylesheet for Sky Blue & Dark themes)
│
├── js/
│   ├── api.js                  (Weather API, Live AQI API, and Geocoding service)
│   ├── app.js                  (Theme Controller, Autocomplete Search, GPS, Mobile Menu)
│   ├── charts.js               (Canvas 2D Graphs: Sparkline, Trend, Hourly Spline)
│   ├── home.js                 (Home Dashboard data binding)
│   └── pages.js                (Multi-page controller for secondary views)
│
├── assets/                     (Direct SVG Asset Files)
│   ├── favicon.svg             (Brand Weather Tab Icon)
│   ├── sunny.svg
│   ├── partly-cloudy.svg
│   ├── cloudy.svg
│   ├── rain.svg
│   ├── heavy-rain.svg
│   ├── thunderstorm.svg
│   ├── snow.svg
│   ├── mist.svg
│   ├── clear-night.svg
│   ├── thermometer.svg
│   ├── humidity.svg
│   ├── wind.svg
│   ├── pressure.svg
│   ├── visibility.svg
│   ├── uv.svg
│   ├── air-quality.svg
│   ├── compass.svg
│   ├── sunrise.svg
│   └── sunset.svg
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

No build tools, npm install, or compilation required!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/swetanksharma15-ux/VyomaCast.git
   ```
2. **Open the project:**
   Simply double-click `index.html` or open it in any modern web browser.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic tags, accessible structure.
- **CSS3**: Custom Properties (CSS variables), Grid & Flexbox layouts, Keyframe animations.
- **Vanilla JavaScript (ES6+)**: Modular architecture, `async/await`, Fetch API, HTML5 Canvas 2D Context, Web Storage API (`localStorage`).
- **APIs**: Open-Meteo Weather Forecast API, Open-Meteo Air Quality API, BigDataCloud Reverse Geocoding.

---

## 👨‍💻 Author

**Developed by Swetank**
