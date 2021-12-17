function getDayOfTheWeek(object) {
	let weekDay = "";
	let date = new Date(object.dt_txt);
	let dayOfTheWeek = date.getDay();

	switch (dayOfTheWeek) {
		case 0:
			weekDay = "Sun";
			break;
		case 1:
			weekDay = "Mon";
			break;
		case 2:
			weekDay = "Tue";
			break;
		case 3:
			weekDay = "Wed";
			break;
		case 4:
			weekDay = "Thu";
			break;
		case 5:
			weekDay = "Fri";
			break;
		case 6:
			weekDay = "Sat";
			break;
		default:
			weekDay = "n/a";
			break;
	}

	return weekDay;
}

function outputForecastCard(object) {
	let weekDay = getDayOfTheWeek(object);

	let card = document.createElement("div");
	card.classList.add("card");

	let img = document.createElement("img");
	let baseImgUrl = "http://openweathermap.org/img/wn/";
	img.setAttribute("src", `${baseImgUrl}${object.weather[0].icon}.png`);
	img.setAttribute("alt", object.weather[0].description);

	let cardInfo = document.createElement("div");
	cardInfo.classList.add("card-info");

	let dayOfTheWeek = document.createElement("h4");
	dayOfTheWeek.classList.add("week-day");
	dayOfTheWeek.textContent = weekDay;

	let temperature = document.createElement("div");
	temperature.classList.add("card-temp");
	temperature.textContent = `${object.main.temp.toFixed()}°F`;

	cardInfo.appendChild(dayOfTheWeek);
	cardInfo.appendChild(temperature);
	card.appendChild(img);
	card.appendChild(cardInfo);

	document.querySelector(".w-cards").appendChild(card);
}

function outputSummary(data, currentDay) {
	let cityName = document.querySelector(".city-name");
	cityName.textContent = data.city.name;

	let img = document.createElement("img");
	let baseImgUrl = "http://openweathermap.org/img/wn/";
	img.setAttribute("src", `${baseImgUrl}${currentDay.weather[0].icon}.png`);
	img.setAttribute("alt", currentDay.weather[0].description);

	document.querySelector(".temperature-img").appendChild(img);

	let highTemperature = document.querySelector(".temperature");
	highTemperature.textContent = `${currentDay.main.temp_max.toFixed()}°F`;

	let description = document.querySelector(".description");
	description.textContent = currentDay.weather[0].description;

	let temperature = parseFloat(currentDay.main.temp_max);

	let windSpeed = document.querySelector(".wind");
	windSpeed.textContent = `Wind: ${currentDay.wind.speed.toFixed(1)} Km/h`;

	let humidity = document.querySelector(".humidity");
	humidity.textContent = `Humidity: ${currentDay.main.humidity}%`;

	const speed = parseFloat(currentDay.wind.speed);

	const windChill =
		35.74 +
		0.6215 * temperature -
		35.75 * speed ** 0.16 +
		0.4275 * (temperature * speed ** 0.16);

	if (temperature > 50 || speed < 3) {
		document.querySelector(".windchill").style.display = "none";
	} else {
		document.querySelector(".windchill").innerText = `Feels like ${
			windChill.toFixed(1) + "°F"
		}`;
	}
}

function fetchWeatherData(city) {
	const apiKey = "1414ba56a14dbf67746a1932cb8b6b41";
	const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			let currentDay = data["list"][0];
			let day2 = data["list"][8];
			let day3 = data["list"][16];
			let day4 = data["list"][24];
			let day5 = data["list"][32];
			let fiveDaysForecastList = [currentDay, day2, day3, day4, day5];

			for (let i = 1; i < fiveDaysForecastList.length; i++) {
				outputForecastCard(fiveDaysForecastList[i]);
			}

			outputSummary(data, currentDay);
		});

	let img = document.querySelector(".city-img");
	img.setAttribute("src", `https://source.unsplash.com/1600x900/?${city}`);
}

function handleSearch() {
	let value = document.querySelector(".search-bar").value;
	if (!value || /^\s*$/.test(value)) {
		window.alert("Type a valid City!");
		return;
	}

	document.querySelector(".w-cards").innerHTML = "";

	fetchWeatherData(document.querySelector(".search-bar").value);

	document.querySelector(".search-bar").value = "";
}

let button = document.querySelector("#submit-btn");
button.addEventListener("click", () => handleSearch());

document
	.querySelector(".search-bar")
	.addEventListener("keyup", function (event) {
		if (event.key == "Enter") {
			handleSearch();
		}
	});
