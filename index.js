// 🕵️‍♀️ This is the Day, Date and Time
let now = new Date();
console.log(now);

let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

function formatDayDateTime(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentDay = days[date.getDay()];
  let currentMonth = months[date.getMonth()];
  let currentDate = date.getDate();
  let currentHour = hours;
  let currentMinute = minutes;

  let formattedDayDateTime = `${currentDay} • ${currentMonth} ${currentDate} • ${currentHour}:${currentMinute}`;
  return formattedDayDateTime;
}

console.log(formatDayDateTime(now));

let dayDateTime = document.querySelector("#day-date-time");
dayDateTime.innerHTML = `${formatDayDateTime(now)}`;

// 🕵️‍♀️ These are functions for the forecast

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
      <div class="weather-forecast-day">${formatForecastDay(
        forecastDay.dt
      )}</div>
      <img
        src="https://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
        alt=""
        width="38"/>
      <div class="weather-forecast-temp">
        <span class="weather-forecast-temp-max">${Math.round(
          forecastDay.temp.max
        )}° </span>
        <span class="weather-forecast-temp-min">${Math.round(
          forecastDay.temp.min
        )}°</span>
      </div>
    </div>
`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c3333c25f62df25da6b4c9597ac6f645";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// 🕵️‍♀️ These are the functions for the main weather and the search engine

function displayWeatherCondition(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector(".current-temp").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#feels-like").innerHTML = `Feels like: ${Math.round(
    response.data.main.feels_like
  )}°`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#wind-speed").innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )}km/hr`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function changeBackgroundImage() {
  if (response.data.weather[0].id <= 299) {
    document.body.style.backgroundImage =
      "url('./images/thunderstorm-200.png')";
  } else if (response.data.weather[0].id <= 599) {
    document.body.style.backgroundImage = "url('./images/rainy-300-500.png')";
  } else if (response.data.weather[0].id <= 699) {
    document.body.style.backgroundImage = "url('./images/snow-600.png')";
  } else if (response.data.weather[0].id <= 799) {
    document.body.style.backgroundImage = "url('./images/dust-700.jpg')";
  } else {
    document.body.style.backgroundImage = "url('./images/clear-800.png')";
  }
}

function search(city) {
  let apiKey = "c3333c25f62df25da6b4c9597ac6f645";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-search").value;
  search(city);
}

let form = document.querySelector(".search-form");
form.addEventListener("submit", searchCity, changeBackgroundImage);

search("Singapore");

// 🕵️‍♀️ This is the Current Location search button

function showCurrentLocation(position) {
  let apiKey = "c3333c25f62df25da6b4c9597ac6f645";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getCurrentLocation);
