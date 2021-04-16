/**
 * GPS Coordinates Request
 * Retrieve requested information by user then display the result
 */
// Get weather information by the user input (GPS Coordinates)
let weather = {
    apiKey: "cf002751564a4c78f5f7ed479f1b9ba3",
    fetchWeather: function (latitude, longitude) {
      fetch(
        "https://api.openweathermap.org/data/2.5/find?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data))
        .catch((_err) => alert("Wrong GPS Coodr!"));
    },
  
    /**
     * Retrieve the right data by the user input & display the result using innerText
     * access the json file provided by the api
     * [0] is to retrieve the right information from the array list provided by jason(api) */
    displayWeather: function (data) {
      const { name } = data;
      console.log(data);
      const { icon, description } = data.list[0];
      const { temp, humidity } = data.list[0].main;
      const { speed } = data.list[0].wind;
      console.log(name, icon, description, temp, humidity, speed);
      document.querySelector(".city").innerText =
        "Weather in " + data.list[0].name;
  
      // this allows the weather icon to be changed base on the icon details we get from api
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" +
        data.list[0].weather[0].icon +
        ".png";
      document.querySelector(".description").innerText =
        data.list[0].weather[0].description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText =
        "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText =
        "Wind speed: " + data.list[0].wind.speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
      // Change the background based on user input
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
  
    // Retrieves the user input from searchbar
    // Since the gps coordination requires two input we can split them by ","
    search: function () {
      var userInput = document.querySelector(".searchTerm").value;
      var latLong = new Array();
      latLong = userInput.split(",");
      this.fetchWeather(latLong[0], latLong[1]);
    },
  };
  
  /**
   * This is addon that allows the defult Weather to be set on user GPS Coordinate
   * Had to use this spefic api to make this work
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
          console.log(data.results[0].geometry.lat, data.results[0].geometry.lng); // print the location
          weather.fetchWeather(
            data.results[0].geometry.lat,
            data.results[0].geometry.lng
          );
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
        weather.fetchWeather(51.5074, 0.1278);
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
  