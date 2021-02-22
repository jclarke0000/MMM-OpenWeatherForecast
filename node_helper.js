/*********************************

  Node Helper for MMM-DarkSkyForecast.

  This helper is responsible for the data pull from Dark Sky.
  At a minimum the API key, Latitude and Longitude parameters
  must be provided.  If any of these are missing, the request
  to Dark Sky will not be executed, and instead an error
  will be output the the MagicMirror log.

  Additional, this module supplies two optional parameters:

    units - one of "ca", "uk2", "us", or "si"
    lang - Any of the languages Dark Sky supports, as listed here: https://darksky.net/dev/docs#response-format

  The Dark Sky API request looks like this:

    https://api.darksky.net/forecast/API_KEY/LATITUDE,LONGITUDE?units=XXX&lang=YY

*********************************/

const NodeHelper = require("node_helper");
const fetch = require("node-fetch");
const moment = require("../../node_modules/moment/moment.js");


module.exports = NodeHelper.create({

  start: function() {
    console.log("====================== Starting node_helper for module [" + this.name + "]");
  },

  async socketNotificationReceived(notification, payload) {
    if (notification === "OPENWEATHER_FORECAST_GET") {

      if (payload.apikey == null || payload.apikey == "") {
        console.log( "[MMM-OpenWeatherForecast] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** No API key configured. Get an API key at https://darksky.net" );
      } else if (payload.latitude == null || payload.latitude == "" || payload.longitude == null || payload.longitude == "") {
        console.log( "[MMM-OpenWeatherForecast] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** Latitude and/or longitude not provided." );
      } else {

        //make request to OpenWeather One Call API
        const url = "https://api.openweathermap.org/data/2.5/onecall?" +
          "lat=" + payload.latitude +
          "&lon=" + payload.longitude +
          "&exclude=" + "minutely" +
          "&appid=" + payload.apikey +
          "&units=" + payload.units +
          "&lang=" + payload.language;


        try {
          response = await fetch(url);

          if (response.statusText !== "OK") {
            console.log( "[MMM-DarkSkyForecast] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** " + response.statusText );
            return;
          }
          resp = await response.json();
          resp.instanceId = payload.instanceId;
          this.sendSocketNotification("OPENWEATHER_FORECAST_DATA", resp);

        } catch (error) {
          console.log( "[MMM-DarkSkyForecast] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** " + error );
	}

      }
    }
  },


});
