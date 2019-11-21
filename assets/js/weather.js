$(document).ready(function () {

   // Optional Code for temperature conversion
    var fahrenheit = true;

    $("#convertToCelsius").click(function () {
        if (fahrenheit) {
            $("#temperature").text(((($("#temperature").text() - 32) * (5 / 9))));
        }
        fahrenheit = false;
    });

    $("#convertToFahrenheit").click(function () {
        if (fahrenheit == false) {
            $("#temperature").text((($("#temperature").text() * (9 / 5)) + 32));
        }
        fahrenheit = true;
    });

    $("#citybtn").click(function() {
        getWeather($("#citySearch").val(), false);
    });

    $("#zipbtn").click(function() {
        getWeather($("#zipSearch").val(), true);
    });
});


//  search engine for city or zip
function getWeather(location, zipSearch) {
    var long, lat;
    var appID = "";
    var weatherURL;

    if (!zipSearch) {
        // add ajax query for city search and set lat and long var from ajax response
        // Performing GET requests to the openweather API and logging the responses to the console
        weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + ",us&units=imperial&APPID=" + appID
    } else {
        // add ajax query for zip search and set lat and long var from ajax response
       weatherURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + location + ",us&units=imperial&APPID=" + appID
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
    });
}

function getUVindex(long, lat) {
    var appID = "";
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
