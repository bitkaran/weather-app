const toggle = document.querySelector(".theme-toggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
});

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  toggle.textContent = "☀️";
}

const apiKey = "092ae207c7e0ce836703f50719d6440a";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherBox = document.querySelector(".weather");
const errorBox = document.querySelector(".error");
const card = document.querySelector(".card");

function showLoader() {
  card.classList.add("loading");
  weatherBox.style.display = "none";
  errorBox.style.display = "none";
}

function hideLoader() {
  card.classList.remove("loading");
}

/* NUMBER ANIMATION */
function animateNumber(el, start, end, suffix = "") {
  let current = start;
  const step = end > start ? 1 : -1;

  const interval = setInterval(() => {
    current += step;
    el.innerHTML = current + suffix;
    if (current === end) clearInterval(interval);
  }, 15);
}

async function checkWeather(city) {
  city = city.trim();

  if (!city) return;

  showLoader();

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (!response.ok) {
      handleError(response.status);
      hideLoader();
      return;
    }

    const data = await response.json();
    updateUI(data);
  } catch {
    showError("Network error 🌐");
  }

  hideLoader();
}

function updateUI(data) {
  document.querySelector(
    ".city"
  ).innerHTML = `${data.name}, ${data.sys.country}`;

  animateNumber(
    document.querySelector(".temp"),
    0,
    Math.round(data.main.temp),
    "°C"
  );

  animateNumber(
    document.querySelector(".feels"),
    0,
    Math.round(data.main.feels_like),
    "°C"
  );

  document.querySelector(".description").innerHTML =
    data.weather[0].description;

  animateNumber(
    document.querySelector(".humidity"),
    0,
    data.main.humidity,
    "%"
  );

  animateNumber(
    document.querySelector(".wind"),
    0,
    Math.round(data.wind.speed),
    " km/h"
  );

  document.querySelector(".minmax").innerHTML =
    Math.round(data.main.temp_min) +
    "°C / " +
    Math.round(data.main.temp_max) +
    "°C";

  document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";

  document.querySelector(".visibility").innerHTML =
    (data.visibility / 1000).toFixed(1) + " km";

  document.querySelector(".sunrise").innerHTML = new Date(
    data.sys.sunrise * 1000
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.querySelector(".sunset").innerHTML = new Date(
    data.sys.sunset * 1000
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  setWeatherIcon(data.weather[0].main);

  weatherBox.style.display = "block";
  errorBox.style.display = "none";
}

function setWeatherIcon(condition) {
  const icons = {
    Clouds: "clouds.png",
    Clear: "clear.png",
    Rain: "rain.png",
    Drizzle: "drizzle.png",
    Mist: "mist.png",
    Snow: "snow.png",
  };

  weatherIcon.src = `images/${icons[condition] || "clear.png"}`;
}

function handleError(code) {
  let msg = "Something went wrong 😕";

  if (code === 404) msg = "City not found 🏙️";
  if (code === 401) msg = "Invalid API key 🔑";
  if (code === 429) msg = "Too many requests 🚦";

  showError(msg);
}

function showError(message) {
  errorBox.style.display = "block";
  errorBox.innerText = message;
  weatherBox.style.display = "none";
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchBox.value);
  }
});

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;

    showLoader();

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => updateUI(data))
      .finally(hideLoader);
  },
  () => {
    console.log("Location permission denied");
  }
);

window.addEventListener("offline", () => {
  showError("You are offline ⚠️");
});
