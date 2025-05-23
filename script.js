const weatherApiKey = '568ab9708a2b6ca13762a2b0f93642cb'; // OpenWeather API key
const unsplashAccessKey = 'FGv19lZO9KvqATY8Vh5bhyjhq-7XII-oUEBspwh6xqM'; // Unsplash Access Key

async function setBackground(city) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&orientation=landscape&per_page=1&client_id=${unsplashAccessKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Unsplash image");

        const data = await response.json();
        const imageUrl = data.results[0]?.urls?.regular;

        if (imageUrl) {
            document.body.style.backgroundImage = `url('${imageUrl}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        } else {
            console.warn("No image found, falling back to source.unsplash.com");
            document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${encodeURIComponent(city)},city')`;
        }
    } catch (error) {
        console.error("Background image error:", error.message);
    }
}

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        document.getElementById('cityName').textContent = `City: ${data.name}`;
        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
        document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;

        const rainVolume = data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0;
        document.getElementById('rain').textContent = `Rain: ${rainVolume} mm`;

        const iconCode = data.weather[0].icon;
        const iconEl = document.getElementById('weatherIcon');
        iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        iconEl.style.display = 'block';

        // Change background image based on city
        setBackground(city);

    } catch (error) {
        alert("Error: " + error.message);
    }
}
