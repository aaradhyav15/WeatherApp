const apiKey = '4ae530c524e78da1478becc7671f7dc2'; // Replace 'YOUR_API_KEY' with your actual API key
const unsplashAccessKey = 'WgX7EF2-ntwtsueoKmBD6NFpSGBwEhqhSUIK5vs8dD4'; // Replace 'YOUR_UNSPLASH_ACCESS_KEY' with your Unsplash Access Key

function getWeather() {
  const city = document.getElementById('cityInput').value;
  const weatherInfo = document.getElementById('weatherInfo');
  const forecastSection = document.getElementById('forecast');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      const { name, main, weather } = data;
      const temperature = main.temp;
      const weatherDescription = weather[0].description;

      const weatherHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Weather: ${weatherDescription}</p>
      `;
      weatherInfo.innerHTML = weatherHTML;

      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(forecastData => {
          const forecastItems = forecastData.list.slice(0, 7); // Get next 7 days forecast
          let forecastHTML = '<h2>Weather Forecast (Next 7 Days)</h2><ul>';
          forecastItems.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('en', { weekday: 'long' });
            const temp = item.main.temp;
            const description = item.weather[0].description;
            forecastHTML += `<li>${day}: ${temp}°C, ${description}</li>`;
          });
          forecastHTML += '</ul>';
          forecastSection.innerHTML = forecastHTML;
        })
        .catch(error => {
          console.error('Failed to fetch forecast:', error);
        });

      fetch(`https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashAccessKey}`)
        .then(response => response.json())
        .then(imageData => {
          const imageUrl = imageData.urls.regular;
          document.body.style.backgroundImage = `url(${imageUrl})`;
        })
        .catch(error => {
          console.error('Failed to fetch image:', error);
        });
    })
    .catch(error => {
      weatherInfo.innerHTML = `<p>${error.message}</p>`;
    });
}
