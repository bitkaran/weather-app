const toggle = document.querySelector(".theme-toggle");

        toggle.addEventListener("click", () => {
            document.body.classList.toggle("light");

            toggle.textContent =
                document.body.classList.contains("light") ? "☀️" : "🌙";

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
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

        const searchBox = document.querySelector(".search input");
        const searchBtn = document.querySelector(".search button");
        const weatherIcon = document.querySelector(".weather-icon");

        async function checkWeather(city) {
            const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

            if (response.status === 404) {
                document.querySelector(".error").style.display = "block";
                document.querySelector(".weather").style.display = "none";
                return;
            }

            const data = await response.json();
            updateUI(data);
        }

        function updateUI(data) {
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML =
                Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML =
                data.main.humidity + "%";
            document.querySelector(".wind").innerHTML =
                data.wind.speed + " km/h";

            setWeatherAnimation(data.weather[0].main);

            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display = "none";
        }

        function setWeatherAnimation(condition) {
            if (condition === "Clouds") {
                weatherIcon.src = "images/clouds.png";
            } else if (condition === "Clear") {
                weatherIcon.src = "images/clear.png";
            } else if (condition === "Rain") {
                weatherIcon.src = "images/rain.png";
            } else if (condition === "Drizzle") {
                weatherIcon.src = "images/drizzle.png";
            } else if (condition === "Mist") {
                weatherIcon.src = "images/mist.png";
            }
        }

        async function getCurrentLocationWeather() {
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
                );

                const data = await response.json();
                updateUI(data);
            });
        }

        searchBtn.addEventListener("click", () => {
            checkWeather(searchBox.value);
        });

        searchBox.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                checkWeather(searchBox.value);
            }
        });

        getCurrentLocationWeather();
