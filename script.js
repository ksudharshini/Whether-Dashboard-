const API_URL = "https://api.open-meteo.com/v1/forecast";
let tempUnit = "C";
let forecastDays = 15;
let currentCoords = null;
let theme = localStorage.getItem("theme") || "light";
if (theme === "dark") document.body.classList.add("dark");

// 🔐 Auth
function showRegister() {
  loginPage.classList.add("hidden");
  registerPage.classList.remove("hidden");
}
function showLogin() {
  registerPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
}
function login() {
  const email = loginEmail.value.trim(), pass = loginPassword.value.trim();
  if (email && pass) {
    localStorage.setItem("user", email);
    loginPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
  }
  else alert("Enter all fields!");
}
function register() {
  const email = regEmail.value.trim(), pass = regPassword.value.trim();
  if (email && pass) {
    alert("Registered successfully! Please login.");
    showLogin();
  }
  else alert("Fill all fields!");
}
function logout() {
  localStorage.removeItem("user");
  dashboard.classList.add("hidden");
  loginPage.classList.remove("hidden");
}

// ⚙️ Settings
function showSettings() {
  dashboard.classList.add("hidden");
  settingsPage.classList.remove("hidden");
}
function goBack() {
  settingsPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
}
function toggleTheme() {
  document.body.classList.toggle("dark");
  theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
}

// 🕒 Time
function updateDateTime() {
  const now = new Date();
  dateTime.innerHTML = `<b>${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</b><br><b>${now.toLocaleTimeString()}</b>`;
}
setInterval(updateDateTime, 1000); updateDateTime();

// 🌦️ Fetch Weather
async function fetchWeather(lat, lon, name) {
  currentCoords = { latitude: lat, longitude: lon };
  try {
    const url = `${API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature,pressure_msl&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weathercode&forecast_days=${forecastDays}&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.current_weather) return alert("Weather unavailable for this area.");
    const c = data.current_weather;
    cityName.innerText = name;
    let temp = c.temperature;
    if (tempUnit === "F") temp = (temp * 9 / 5) + 32;
    temperature.innerText = `${temp.toFixed(1)} °${tempUnit}`;
    description.innerText = `Condition: ${getWeatherIcon(c.weathercode)}`;
    windSpeed.innerText = c.windspeed;
    humidity.innerText = `${data.hourly.relative_humidity_2m[0]}%`;
    feelsLike.innerText = `${data.hourly.apparent_temperature[0].toFixed(1)} °${tempUnit}`;
    sunrise.innerText = data.daily.sunrise[0].split("T")[1];
    sunset.innerText = data.daily.sunset[0].split("T")[1];
    renderForecast(data.daily);
  } catch (err) {
    alert("Weather fetch failed.");
    console.error(err);
  }
}

// 🔁 Auto Temp Refresh
async function autoRefreshTemperature() {
  if (!currentCoords) return;
  const { latitude, longitude } = currentCoords;
  try {
    const res = await fetch(`${API_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
    const data = await res.json();
    const c = data.current_weather;
    let temp = c.temperature;
    if (tempUnit === "F") temp = (temp * 9 / 5) + 32;
    temperature.innerText = `${temp.toFixed(1)} °${tempUnit}`;
    description.innerText = `Condition: ${getWeatherIcon(c.weathercode)}`;
  } catch (err) {
    console.error("Auto update failed:", err);
  }
}
setInterval(autoRefreshTemperature, 10000);

// 📍 My Location
function getMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(latitude, longitude, "My Location");
    }, () => alert("Location access denied!"));
  } else alert("Geolocation not supported!");
}

// 🌤 Forecast Renderer
function renderForecast(daily) {
  forecastContainer.innerHTML = "";
  for (let i = 0; i < daily.time.length; i++) {
    const div = document.createElement("div");
    div.classList.add("day");
    div.innerHTML = `
      <b>${daily.time[i]}</b><br>
      🌡 Max: ${daily.temperature_2m_max[i]}°C<br>
      ❄ Min: ${daily.temperature_2m_min[i]}°C<br>
      ☁ ${getWeatherIcon(daily.weathercode[i])}
    `;
    forecastContainer.appendChild(div);
  }
}

// ☁️ Icons
function getWeatherIcon(code) {
  const icons = {
    0: "☀ Clear",
    1: "🌤 Partly Cloudy",
    2: "⛅ Cloudy",
    3: "☁ Overcast",
    45: "🌫 Fog",
    48: "🌫 Fog",
    51: "🌦 Drizzle",
    61: "🌧 Rain",
    71: "❄ Snow",
    95: "⛈ Thunderstorm"
  };
  return icons[code] || "🌈 Normal";
}

// 🔍 Search Suggestions
async function showSuggestions() {
  const query = cityInput.value.trim();
  const suggestionsDiv = document.getElementById("suggestions");
  suggestionsDiv.innerHTML = "";
  if (query.length < 2) return;
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await res.json();
    if (data.results) {
      data.results.forEach(loc => {
        const item = document.createElement("div");
        item.classList.add("suggestion-item");
        item.innerText = `${loc.name}, ${loc.country}`;
        item.onclick = () => {
          cityInput.value = loc.name;
          suggestionsDiv.innerHTML = "";
          fetchWeather(loc.latitude, loc.longitude, loc.name + ", " + loc.country);
        };
        suggestionsDiv.appendChild(item);
      });
    }
  } catch (err) {
    console.error("Suggestion fetch failed:", err);
  }
}

// Auto-login if already logged in (optional)
window.onload = function() {
  if(localStorage.getItem("user")) {
    loginPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
  }
}
