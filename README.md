# Weather Dashboard

## Overview
This Weather Dashboard is a user-friendly web application that provides current weather conditions and forecasts based on user input or device location. It is built using HTML, CSS, and JavaScript, making it lightweight and easy to customize. The app fetches live weather data from a public API and displays temperature, humidity, wind speed, and weather descriptions.

## Features
- Search weather by city name
- Displays current temperature, humidity, wind speed, and weather condition icons
- Responsive design for desktop and mobile devices
- Clean and intuitive interface built with HTML and CSS
- JavaScript handles fetching data from the weather API and dynamically updating the UI

## Technologies Used
- HTML5 for structure
- CSS3 for styling and layout
- JavaScript (ES6) for API calls and dynamic UI update
- OpenWeatherMap API (or any other weather API you used) for weather data

## Installation and Usage
1. Clone the repository or download the source files.
2. Open `index.html` in any modern web browser.
3. Enter a city name in the search box and press Enter or click the search button.
4. View the current weather data displayed on the dashboard.

## API Setup
- You need an API key from OpenWeatherMap (or your chosen provider).
- Replace the placeholder API key in the JavaScript file with your own key.

```javascript
const apiKey = "YOUR_API_KEY_HERE";
```

## Project Structure
```
/weather-dashboard
│
├── index.html           # Main HTML file
├── styles.css           # CSS styles file
├── script.js            # JavaScript logic file
└── README.md            # This file
```

## Contribution
Feel free to fork the project, improve the UI, add features like 5-day forecasts, or include location-based weather detection using the browser's geolocation API.

## License
This project is open source and available under the MIT License.
