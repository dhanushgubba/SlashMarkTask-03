document.getElementById('locationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city');
    }
});

document.getElementById('detectLocationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoordinates(latitude, longitude);
        }, () => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function getWeather(city) {
    const apiKey = '9802b4a9c74aa5530527c8d5758b7bac';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data))
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayFiveDayForecast(data.list))
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}

function getWeatherByCoordinates(latitude, longitude) {
    const apiKey = '9802b4a9c74aa5530527c8d5758b7bac';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data))
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayFiveDayForecast(data.list))
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}

function displayCurrentWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
    weatherIcon.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.innerHTML = `<img src="${iconUrl}" alt="${description}">`;
    }
}

function displayFiveDayForecast(forecastData) {
    const fiveDayForecastDiv = document.getElementById('five-day-forecast');
    fiveDayForecastDiv.innerHTML = '';

    // Group forecast data by day
    const dailyData = forecastData.reduce((acc, item) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
    }, {});

    Object.keys(dailyData).slice(0, 5).forEach(day => {
        const dayData = dailyData[day];
        const dayForecastHtml = dayData.map(item => {
            const dateTime = new Date(item.dt * 1000);
            const hour = dateTime.getHours();
            const temperature = Math.round(item.main.temp - 273.15);
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            return `
                <div class="forecast-item">
                    <span>${hour}:00</span>
                    <img src="${iconUrl}" alt="Weather icon">
                    <span>${temperature}°C</span>
                </div>
            `;
        }).join('');

        fiveDayForecastDiv.innerHTML += `
            <div class="forecast-day">
                <h3>${day}</h3>
                <div class="forecast-details">${dayForecastHtml}</div>
            </div>
        `;
    });
}
