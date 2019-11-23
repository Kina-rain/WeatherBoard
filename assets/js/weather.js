
$(document).ready(function () {

    // tutorialzine.com for geolocation and calling load function for Search History
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    
    //load any saved locations from local storage
    loadLocations();

    //conver temp to C
    $("#convertToCelsius").click(function () {
        let temp = parseFloat($("#temperature").text());

        temp = ((temp - 32) * (5 / 9));

        $("#temperature").text(temp.toFixed(2));
    });

    //convert the temp to F
    $("#convertToFahrenheit").click(function () {
        let temp = parseFloat($("#temperature").text());

        temp = (temp * (9/5)) + 32; 

        $("#temperature").text(temp.toFixed(2));
    });

    // city and zip function button
    $("#citybtn").click(function() {
        getWeather($("#citySearch").val(), "", "");
    });

    $("#zipbtn").click(function() {
        getWeather("", $("#zipSearch").val(), "");
    });
});

// saves browsing History from weather search stackoverflow.com for add table/ row
function searchHistoryAdd(searchLocation, storeData) {
    var aTag = `<a href="#" onclick="getWeather('${searchLocation}', '', '')">${searchLocation}</a>`;

    $("#tabHistory > tbody:first-child").prepend("<tr><td>" + aTag + "</td></tr>");
    
    if (storeData) {storeLocations(searchLocation);}
}

// stores weather searches in local storage and pulls them back out
function storeLocations(searchLocation) {

    if (localStorage.getItem("locationData") === null) {
        var weatherData = {
            "location": [searchLocation]
        };
        localStorage.setItem("locationData", JSON.stringify(weatherData));
    } else {
        var weatherData = JSON.parse(localStorage.getItem("locationData"));
        weatherData.location.push(searchLocation);

        localStorage.setItem("locationData", JSON.stringify(weatherData));
    }
}

//  Pulls data out of storage 
function loadLocations() {
    if (localStorage.getItem("locationData") != null) {
        var weatherData = JSON.parse(localStorage.getItem("locationData"));

        weatherData.location.forEach(weatherLocation => {
        searchHistoryAdd(weatherLocation, false)        
    });
    }
}

// tutorialzine.com for weather forecast, works with geolocation call
function locationSuccess(position) {

    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var latLong = [lat, long];

    getWeather("", "", latLong);
}

function locationError(error) {
    console.log(error);
}


//  search engine for city, zip and latitude & longitude
function getWeather(city, zip, latLong) {
    var long, lat;
    var appID = "572971abd208ea8591c8c5db68a237cd";
    var weatherURL;

    if (city != "") {
        // Performing GET requests to the openweather API 
        weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + appID
    } else if (zip != "") {
       weatherURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&units=imperial&APPID=" + appID
    } else {
        lat = latLong[0];
        long = latLong[1];
        weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&APPID=" + appID
    }

    console.log(weatherURL);

    //  Pulling information from ajax call to set into Main Weather Area
    $.getJSON(weatherURL, function (json) {
        $("#city").html(json.name);
        $("#main_weather").html(json.weather[0].main);
        $("#description_weather").html(json.weather[0].description);
        $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
        $("#temperature").html(json.main.temp);
        $("#pressure").html(json.main.pressure);
        $("#humidity").html(json.main.humidity);
        $("#windspd").html(json.wind.speed);
                
        /* This was to get the UV Index but was unable to keep API key working */
        long = json.coord.lon;
        lat = json.coord.lat;
        getUVindex(long, lat, appID);

        //add our city to the search history list
        searchHistoryAdd(json.name, true);
    });
}

// UV index from openUV.io
function getUVindex(long, lat) {
    var appID = "d0002c08f39abfdc3b22ec60f51c0b4e";
    // add ajax query for UV index from api.openuv.io code found on OpenUV API key auth.
    var UVindexURl = "https://api.openuv.io/api/v1/uv?lat=" + lat + "&lng=" + long;

    $.ajax({
        type: "GET",
        dataType: "json",
        beforeSend: function(request) {
            request.setRequestHeader("x-access-token", appID);
            
        },
        url: UVindexURl, 
        success: function(response) {
            $("#UVindex").html(response.result.uv);
        },
        failure: function(response) {
            console.log(response);
            $("#UVindex").html("error");
        }
    });
}
