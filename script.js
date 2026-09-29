let d = new Date();
let day = d.toLocaleString('en-IN', { weekday: 'long' });
let date = d.getDate();
let month = d.toLocaleString('en-IN', { month: 'long' });
let year = d.getFullYear();
let hours = d.getHours();
let minutes = d.getMinutes();
hours = hours < 10 ? "0" + hours : hours;
minutes = minutes < 10 ? "0" + minutes : minutes;
document.getElementById("date-time").innerText =
day + ", " + date + " " + month + " " + year + " | " +
hours + ":" + minutes;



const city = document.getElementById("city");
const submit = document.getElementById("submit");
const cityName = document.getElementById("city-name");
const country = document.getElementById("country");
const temperature = document.getElementById("temperature");
const weatherType = document.getElementById("weather-type");
const image = document.getElementById("image");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const rain = document.getElementById("chance-of-rain");
const optionCities = document.querySelectorAll(".optioncity");
const optionWeathers = document.querySelectorAll(".optionweather");
const optionTemperatures = document.querySelectorAll(".optiontemperature");
const optionCards = document.querySelectorAll(".optioncard");


optionCards.forEach((card) => {
            const apiKey = 'f423002432946d1683c93e6b1e160dc5'
            const optioncity = card.querySelector(".optioncity").innerText;
            let optioncloud = 0;
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${optioncity}&appid=${apiKey}`).then((response) =>
            response.json()).then((data) => {
                if(data.cod === 200){
                    card.querySelector(".optiontemperature").innerText = (data.main.temp - 273.15).toFixed(0) + "°c";
                    optioncloud = data.clouds.all;
                    if(optioncloud>=0 && optioncloud<=10){
                        card.querySelector(".optionweather").innerText = "☀️";
                    }
                    else if(optioncloud>10 && optioncloud<=30){
                        card.querySelector(".optionweather").innerText = "🌤️";
                    }
                    else if(optioncloud>30 && optioncloud<=50){
                        card.querySelector(".optionweather").innerText = "⛅";
                    }
                    else if(optioncloud>50 && optioncloud<=70){
                        card.querySelector(".optionweather").innerText = "☁️";
                    }
                    else if(optioncloud>70 && optioncloud<=90){
                        card.querySelector(".optionweather").innerText = "☁️";
                    }
                    else if(optioncloud>90 && optioncloud<=100){
                        card.querySelector(".optionweather").innerText = "🌧️";
                    }
                }
            });
        });
        
function weathertype(x){
    if(x>=0 && x<=10){
        weatherType.innerText = "CLEAR SKY";
        image.innerText = "☀️";
    }
    else if(x>10 && x<=30){
        weatherType.innerText = "MOSTLY CLEAR";
        image.innerText = "🌤️";
    }
    else if(x>30 && x<=50){
        weatherType.innerText = "PARTLY CLOUDY";
        image.innerText = "⛅";
    }
    else if(x>50 && x<=70){
        weatherType.innerText = "MOSTLY CLOUDY";
        image.innerText = "☁️";
    }
    else if(x>70 && x<=90){
        weatherType.innerText = "CLOUDY";
        image.innerText = "☁️";
    }
    else if(x>90 && x<=100){
        weatherType.innerText = "OVERCAST";
        image.innerText = "🌧️";
    }

}

function defaultweather(e, cityname){
    e.preventDefault();
    let cloud = 0;
    const API_KEY = 'f423002432946d1683c93e6b1e160dc5';
    if(cityname.trim()){
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname.trim()}&appid=${API_KEY}`).then((response) =>
            response.json()).then((data) => {
                if(data.cod === 200){
                    cityName.innerText = cityname.toUpperCase();
                    country.innerText = data.sys.country;
                    temperature.innerText = (data.main.temp - 273.15).toFixed(0) + "°C";
                    feelsLike.innerText = (data.main.feels_like - 273.15).toFixed(0) + "°C";
                    humidity.innerText = data.main.humidity + "%";
                    windSpeed.innerText = (data.wind.speed * 3.6).toFixed(0) + " KM/H";
                    rain.innerText = (data.clouds.all) + "%";
                    cloud = data.clouds.all;
                    weathertype(cloud);
                }
                else{
                    alert("City not found. Please enter a valid city name.");
                    cityName.innerText = "ROURKELA";
                    city.value = "";
                }
            }).catch((error) => {
                console.error("Error fetching weather data:", error);
                alert("An error occurred while fetching weather data. Please try again later.");
                cityName.innerText = "ROURKELA";
            }   
        );
    }
    else{
        alert("Please enter a city name");
        cityName.innerText = "ROURKELA";
    }
}

submit.addEventListener("click", (e) => defaultweather(e, city.value));

optionCards.forEach((card) => {
    card.addEventListener("click", (e) => defaultweather(e, card.querySelector(".optioncity").innerText));
});

defaultweather(new Event("submit"), "Rourkela");

