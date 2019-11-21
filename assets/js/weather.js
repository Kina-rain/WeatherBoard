
$(document).ready(function () {

    // tutorialzine.com for geolocation
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);

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

    $("#citybtn").click(function() {
        getWeather($("#citySearch").val(), "", "");
    });

    $("#zipbtn").click(function() {
        getWeather("", $("#zipSearch").val(), "");
    });
});

// save browsing History to weather search
// stackoverflow.com for add table/ row
function searchHistoryAdd(searchLocation) {
    var aTag = `<a href="#" onclick="getWeather('${searchLocation}', '', '')">${searchLocation}</a>`;

    $("#tabHistory > tbody:first-child").prepend("<tr><td>" + aTag + "</td></tr>");
}

// tutorialzine.com for weather forecast
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
        // add ajax query for city search and set lat and long var from ajax response
        // Performing GET requests to the openweather API and logging the responses to the console
        weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + appID
    } else if (zip != "") {
        // add ajax query for zip search and set lat and long var from ajax response
       weatherURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&units=imperial&APPID=" + appID
    } else {
        lat = latLong[0];
        long = latLong[1];
        weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&APPID=" + appID
    }

    console.log(weatherURL);

    $.getJSON(weatherURL, function (json) {
        $("#city").html(json.name);
        $("#main_weather").html(json.weather[0].main);
        $("#description_weather").html(json.weather[0].description);
        $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
        $("#temperature").html(json.main.temp);
        $("#pressure").html(json.main.pressure);
        $("#humidity").html(json.main.humidity);
        $("#windspd").html(json.wind.speed);
                
        long = json.coord.lon;
        lat = json.coord.lat;

        getUVindex(long, lat, appID);
        searchHistoryAdd(json.name);
    });
}

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
