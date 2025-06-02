// 请替换为您自己的和风天气 API 密钥
const apiKey = 'YOUR_HEFENG_WEATHER_API_KEY';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityNameDisplay = document.getElementById('cityName');
const temperatureDisplay = document.getElementById('temperature');
const humidityDisplay = document.getElementById('humidity');
const windSpeedDisplay = document.getElementById('windSpeed');
const weatherDescriptionDisplay = document.getElementById('weatherDescription');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('请输入城市名称！'); // Please enter a city name!
    }
});

async function fetchWeatherData(city) {
    // 和风天气 API 需要城市的 locationID，而不是城市名称。
    // 第一步：通过城市名称获取 locationID
    const geoApiUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${apiKey}`;

    try {
        const geoResponse = await fetch(geoApiUrl);
        const geoData = await geoResponse.json();

        if (geoData.code === '200' && geoData.location && geoData.location.length > 0) {
            const locationID = geoData.location[0].id;
            // 第二步：通过 locationID 获取天气信息
            const weatherApiUrl = `https://devapi.qweather.com/v7/weather/now?location=${locationID}&key=${apiKey}`;
            const weatherResponse = await fetch(weatherApiUrl);
            const weatherData = await weatherResponse.json();

            if (weatherData.code === '200') {
                displayWeatherData(weatherData.now, geoData.location[0].name);
            } else {
                alert(`获取天气数据失败：${weatherData.code} - ${weatherData.message || ''}`); // Failed to get weather data
            }
        } else if (geoData.code === '404' || (geoData.location && geoData.location.length === 0)) {
             alert('找不到指定的城市，请检查输入是否正确。'); // City not found, please check input.
        }
        else {
            alert(`获取城市ID失败：${geoData.code} - ${geoData.message || ''}`); // Failed to get city ID
        }
    } catch (error) {
        console.error('获取天气数据时出错:', error); // Error fetching weather data
        alert('获取天气数据时出错，请检查网络连接或稍后再试。'); // Error fetching weather data, please check network or try again later.
    }
}

function displayWeatherData(weather, cityDisplayName) {
    cityNameDisplay.textContent = cityDisplayName; // 使用地理API返回的官方城市名称
    temperatureDisplay.textContent = `温度：${weather.temp}°C`; // Temperature
    humidityDisplay.textContent = `湿度：${weather.humidity}%`; // Humidity
    windSpeedDisplay.textContent = `风速：${weather.windSpeed} km/h`; // Wind Speed
    weatherDescriptionDisplay.textContent = `天气：${weather.text}`; // Weather
}
