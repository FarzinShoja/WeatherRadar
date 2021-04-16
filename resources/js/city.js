/**
 * City Request
 * Retrieve requested information by user then display the result
 */

// Get weather information by the user input (city)
let weather = {
  apiKey: "cf002751564a4c78f5f7ed479f1b9ba3",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data))
      .catch((_err) => alert("Wrong City!"));
  },

    /**
   * Retrieve the right data by the user input & display the result using innerText
   * access the json file provided by the api
   * [0] is to retrieve the right information from the array list provided by jason(api) */
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log(name, icon, description, temp, humidity, speed);
    document.querySelector(".city").innerText = "Weather in " + name;

    // this allows the weather icon to be changed base on the icon details we get from api
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
    // Change the background based on user input
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
    console.log(data);
  },

  // Retrives the user input from searchbar
  search: function () {
    this.fetchWeather(document.querySelector(".searchTerm").value);
  },
};

/**
 * This is addon that allows the default Weather to be set on user GPS Coordinate
 * Had to use this specific api to make this work
 */

let geoCode = {
  reverseGeocode: function (latitude, longitude) {
    var apikey = "2c6a706e575f4266a1429e5fa9e548d0";

    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      apikey +
      "&q=" +
      encodeURIComponent(latitude + "," + longitude) +
      "&pretty=1" +
      "&no_annotations=1";

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status === 200) {
        // Success!
        var data = JSON.parse(request.responseText);
        console.log(); // print the location
        weather.fetchWeather(data.results[0].components.city);
      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send(); // make the request
  },
  getLocation: function () {
    function success(data) {
      geoCode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    } else {
      var locationDefault = "Duluth";
      weather.fetchWeather(locationDefault);
    }
  },
};

// This function send the user input to the api
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

// this allows the user to use Enter key instead of search button 
document
  .querySelector(".searchTerm")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });
geoCode.getLocation();
