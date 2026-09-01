/**
 * VyomaCast — Core Application Controller (app.js)
 * Manages LocalStorage, Theme Switching, Search Autocomplete, GPS Location, and Mobile Menu.
 */

const AppState = {
  STORAGE_KEYS: {
    THEME: 'vyomacast_theme',
    LOCATION: 'vyomacast_active_loc',
    SAVED: 'vyomacast_saved_cities'
  },

  DEFAULT_LOC: {
    name: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    lat: 28.6139,
    lon: 77.2090,
    displayName: 'Delhi, India'
  },

  getActiveLocation() {
    const data = localStorage.getItem(this.STORAGE_KEYS.LOCATION);
    return data ? JSON.parse(data) : this.DEFAULT_LOC;
  },

  setActiveLocation(loc) {
    localStorage.setItem(this.STORAGE_KEYS.LOCATION, JSON.stringify(loc));
  },

  getSavedCities() {
    const data = localStorage.getItem(this.STORAGE_KEYS.SAVED);
    return data ? JSON.parse(data) : [
      { name: 'Delhi', country: 'India', countryCode: 'IN', lat: 28.6139, lon: 77.2090 },
      { name: 'Mumbai', country: 'India', countryCode: 'IN', lat: 19.0760, lon: 72.8777 },
      { name: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lon: -0.1278 }
    ];
  },

  saveCity(loc) {
    const list = this.getSavedCities();
    if (list.some(c => c.name.toLowerCase() === loc.name.toLowerCase())) {
      showToast('City already saved in My Cities', 'info');
      return;
    }
    list.push(loc);
    localStorage.setItem(this.STORAGE_KEYS.SAVED, JSON.stringify(list));
    showToast(`✓ Added ${loc.name} to My Cities`, 'success');
  },

  removeCity(name) {
    const list = this.getSavedCities().filter(c => c.name.toLowerCase() !== name.toLowerCase());
    localStorage.setItem(this.STORAGE_KEYS.SAVED, JSON.stringify(list));
    showToast(`Removed ${name} from My Cities`, 'info');
  }
};

// Global Theme Management
function initTheme() {
  const saved = localStorage.getItem(AppState.STORAGE_KEYS.THEME) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);

  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(AppState.STORAGE_KEYS.THEME, next);
      updateThemeIcon(next);
      showToast(`Switched to ${next === 'light' ? 'Light' : 'Dark'} Mode`, 'info');
    });
  }
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  btn.innerHTML = theme === 'dark'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}

// Global Autocomplete Search
function initSearch(onSelectCallback) {
  const searchWrappers = document.querySelectorAll('.search-wrapper');
  searchWrappers.forEach(wrapper => {
    const input = wrapper.querySelector('.search-input');
    const form = wrapper.querySelector('.search-form');
    const dropdown = wrapper.querySelector('.autocomplete-dropdown');
    if (!input || !dropdown) return;

    let timer = null;
    input.addEventListener('input', e => {
      clearTimeout(timer);
      const q = e.target.value.trim();
      if (q.length < 2) {
        dropdown.classList.remove('open');
        return;
      }

      dropdown.innerHTML = '<div class="autocomplete-status">Searching...</div>';
      dropdown.classList.add('open');

      timer = setTimeout(async () => {
        const results = await WeatherAPI.searchLocations(q);
        if (!results.length) {
          dropdown.innerHTML = '<div class="autocomplete-status">No locations found</div>';
          return;
        }

        dropdown.innerHTML = '';
        const list = document.createElement('ul');
        list.className = 'autocomplete-list';

        results.forEach(loc => {
          const li = document.createElement('li');
          li.className = 'autocomplete-item';
          li.innerHTML = `
            <div class="autocomplete-item-left">
              <span>📍</span>
              <div>
                <span class="item-name">${loc.name}</span>
                <div class="item-sub">${loc.displayName}</div>
              </div>
            </div>
            <button class="btn-inline-add-city">＋ Add</button>
          `;

          li.addEventListener('click', e => {
            if (e.target.closest('.btn-inline-add-city')) return;
            AppState.setActiveLocation(loc);
            dropdown.classList.remove('open');
            if (typeof onSelectCallback === 'function') onSelectCallback(loc);
          });

          li.querySelector('.btn-inline-add-city').addEventListener('click', e => {
            e.stopPropagation();
            AppState.saveCity(loc);
          });

          list.appendChild(li);
        });

        dropdown.appendChild(list);
      }, 250);
    });

    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        dropdown.classList.remove('open');
        const q = input.value.trim();
        if (!q) return;
        const res = await WeatherAPI.searchLocations(q);
        if (res.length) {
          AppState.setActiveLocation(res[0]);
          if (typeof onSelectCallback === 'function') onSelectCallback(res[0]);
        }
      });
    }

    document.addEventListener('click', e => {
      if (!wrapper.contains(e.target)) dropdown.classList.remove('open');
    });
  });
}

// Global GPS Location Detection
function initGPS(onSelectCallback) {
  const btn = document.getElementById('geolocation-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!navigator.geolocation) return showToast('Geolocation not supported.', 'error');
    showToast('Detecting location...', 'info');

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const loc = await WeatherAPI.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        AppState.setActiveLocation(loc);
        showToast(`📍 Detected: ${loc.displayName}`, 'success');
        if (typeof onSelectCallback === 'function') onSelectCallback(loc);
      },
      () => showToast('Location permission denied.', 'warning'),
      { timeout: 10000 }
    );
  });
}

// Mobile Menu Drawer Handler
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
  }
}

function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
});