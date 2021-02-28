/*********************************

  Node Helper for MMM-OpenWeatherForecast.

  This helper is responsible for the data pull from OpenWeather's
  One Call API. At a minimum the API key, Latitude and Longitude
  parameters must be provided.  If any of these are missing, the
  request to OpenWeather will not be executed, and instead an error
  will be output the the MagicMirror log.

  Additional, this module supplies two optional parameters:

    units - one of "standard", "metric" or "imperial"
    lang - Any of the languages OpenWeather supports, as listed here: https://openweathermap.org/api/one-call-api#multi

  The OpenWeather OneCall API request looks like this:

    http://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&lang={lang}&exclude=minutely&units={units}&lang={lang}

*********************************/

var NodeHelper = require("node_helper");
var axios = require('axios').default; //replaces the deprecated Request library
var moment = require("moment");

module.exports = NodeHelper.create({

  start: function() {
    console.log("====================== Starting node_helper for module [" + this.name + "]");
  },

  socketNotificationReceived: function(notification, payload){
    if (notification === "OPENWEATHER_FORECAST_GET") {

      var self = this;

      if (payload.apikey == null || payload.apikey == "") {
        console.log( "[MMM-OpenWeatherForecast] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** No API key configured. Get an API key at https://darksky.net" );
      } else if (payload.latitude == null || payload.latitude == "" || payload.longitude == null || payload.longitude == "") {
        console.log( "[MMM-OpenWeatherForecast] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** Latitude and/or longitude not provided." );
      } else {

        //make request to OpenWeather One Call API
        var url = "https://api.openweathermap.org/data/2.5/onecall?" +
          "lat=" + payload.latitude +
          "&lon=" + payload.longitude +
          "&exclude=" + "minutely" +
          "&appid=" + payload.apikey +
          "&units=" + payload.units +
          "&lang=" + payload.language;

        /* 
          Update 28-Feb-2021: 
          The old standby Request library has been deprecated.
          So data fetch is now done with Axios.
         */
        axios.get(url)
          .then(function (response) {
            // handle success
            response.data.instanceId = payload.instanceId;
            self.sendSocketNotification("OPENWEATHER_FORECAST_DATA", response.data);
          })
          .catch(function (error) {
            // handle error
            console.log( "[MMM-OpenWeatherForecast] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** " + error );
          });


      }
    }
  },


});