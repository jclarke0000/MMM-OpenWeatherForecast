/*********************************

  Magic Mirror Module:
  MMM-OpenWeatherForecast
  https://github.com/jclarke0000/MMM-OpenWeatherForecast

  Icons in use by this module:
  
  Skycons - Animated icon set by Dark Sky
  http://darkskyapp.github.io/skycons/
  (using the fork created by Maxime Warner
  that allows individual details of the icons
  to be coloured
  https://github.com/maxdow/skycons)

  Climacons by Adam Whitcroft
  http://adamwhitcroft.com/climacons/

  Free Weather Icons by Svilen Petrov
  https://www.behance.net/gallery/12410195/Free-Weather-Icons

  Weather Icons by Thom
  (Designed for DuckDuckGo)
  https://dribbble.com/shots/1832162-Weather-Icons

  Sets 4 and 5 were found on Graphberry, but I couldn't find
  the original artists.
  https://www.graphberry.com/item/weather-icons
  https://www.graphberry.com/item/weathera-weather-forecast-icons

  Some of the icons were modified to better work with the module's
  structure and aesthetic.

  Weather data provided by Dark Sky

  By Jeff Clarke
  MIT Licensed

*********************************/

Module.register("MMM-OpenWeatherForecast", {

  /*
    This module uses the Nunjucks templating system introduced in
    version 2.2.0 of MagicMirror.  If you're seeing nothing on your
    display where you expect this module to appear, make sure your
    MagicMirror version is at least 2.2.0.
  */
  requiresVersion: "2.2.0",

  defaults: {
    apikey: "",
    latitude: "",
    longitude: "",
    updateInterval: 10, // minutes
    requestDelay: 0,
    language: config.language,
    units: "metric",
    displayKmhForWind: false,
    concise: true,
    iconset: "1c",
    colored: true,
    useAnimatedIcons: true,
    animateMainIconOnly: true,
    animatedIconStartDelay: 1000,
    mainIconSize: 100,
    forecastIconSize: 70,
    updateFadeSpeed: 500,
    showFeelsLikeTemp: false,
    showSummary: true,

    showCurrentConditions: true,
    showExtraCurrentConditions: true,
    extraCurrentConditions: {
      highLowTemp: true,
      precipitation: true,
      sunrise: true,
      sunset: true,
      wind: true,
      barometricPressure: false,
      humidity: true,
      dewPoint: false,
      uvIndex: true,
      visibility: false
    },

    forecastHeaderText: "Forecast",
    forecastLayout: "tiled",

    showHourlyForecast: true,
    showHourlyTableHeaderRow: true,
    hourlyForecastTableHeaderText: "Hourly",
    hourlyForecastInterval: 3,
    maxHourliesToShow: 3,
    hourlyExtras: {
      precipitation: true,
      wind: true,
      barometricPressure: false,
      humidity: false,
      dewPoint: false,
      uvIndex: false,
      visibility: false
    },

    showDailyForecast: true,
    showDailyTableHeaderRow: true,
    dailyForecastTableHeaderText: "Daily",
    maxDailiesToShow: 3,
    dailyExtras: {
      precipitation: true,
      sunrise: false,
      sunset: false,
      wind: true,
      barometricPressure: false,
      humidity: false,
      dewPoint: false,
      uvIndex: false
    },

    label_maximum: "max",
    label_high: "H",
    label_low: "L",
    label_hourlyTimeFormat: "h a",
    label_sunriseTimeFormat: "h:mm a",
    label_days: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
    label_ordinals: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
  },


  

  validUnits: ["standard","metric","imperial"],
  validLayouts: ["tiled", "table"],

  getScripts: function() {
    return ["moment.js", this.file("skycons.js")];
  },

  getStyles: function () {
    return ["MMM-OpenWeatherForecast.css"];
  },

  getTemplate: function () {
    return "mmm-openweather-forecast.njk";
  },

  /*
    Data object provided to the Nunjucks template. The template does not
    do any data minipulation; the strings provided here are displayed as-is.
    The only logic in the template are conditional blocks that determine if
    a certain section should be displayed, and simple loops for the hourly
    and daily forecast.
   */
  getTemplateData: function () {
    return {
      phrases: {
        loading: this.translate("LOADING")
      },
      loading: this.formattedWeatherData == null ? true : false,
      config: this.config,
      forecast: this.formattedWeatherData,
      inlineIcons : {
        rain: this.generateIconSrc("i-rain"),
        wind: this.generateIconSrc("i-wind"),
        sunrise: this.generateIconSrc("i-sunrise"),
        sunset: this.generateIconSrc("i-sunset"),
        pressure: this.generateIconSrc("i-pressure"),
        humidity: this.generateIconSrc("i-humidity"),
        dewPoint: this.generateIconSrc("i-dewpoint"),
        uvIndex: this.generateIconSrc("i-uvindex"),
        visibility: this.generateIconSrc("i-visibility")
      },
      animatedIconSizes : {
        main: this.config.mainIconSize,
        forecast: this.config.forecastIconSize
      }

    };
  },

  start: function() {

    Log.info("Starting module: " + this.name);

    this.weatherData = null;
    this.iconCache = [];
    this.iconIdCounter = 0;
    this.formattedWeatherData = null;

    /*
      Optionally, Dark Sky's Skycons animated icon
      set can be used.  If so, it is drawn to the DOM
      and animated on demand as opposed to being 
      contained in animated images such as GIFs or SVGs.
      This initializes the colours for the icons to use.
     */
    if (this.config.useAnimatedIcons) {
      this.skycons = new Skycons({
        "monochrome": false,
        "colors" : {
          "main" : "#FFFFFF",
          "moon" : this.config.colored ? "#FFFDC2" : "#FFFFFF", 
          "fog" : "#FFFFFF",
          "fogbank" : "#FFFFFF",
          "cloud" : this.config.colored ? "#BEBEBE" : "#999999",
          "snow" : "#FFFFFF",
          "leaf" : this.config.colored ? "#98D24D" : "#FFFFFF",
          "rain" : this.config.colored ? "#7CD5FF" : "#FFFFFF",
          "sun" : this.config.colored ? "#FFD550" : "#FFFFFF"
        }
      });
    }

    //sanitize optional parameters
    if (this.validUnits.indexOf(this.config.units) == -1) {
      this.config.units = "standard";
    } 
    if (this.validLayouts.indexOf(this.config.forecastLayout) == -1) {
      this.config.forecastLayout = "tiled";
    } 
    if (this.iconsets[this.config.iconset] == null) {
      this.config.iconset = "1c";
    }
    this.sanitizeNumbers([
      "updateInterval",
      "requestDelay",
      "hourlyForecastInterval",
      "maxHourliesToShow",
      "maxDailiesToShow",
      "mainIconSize",
      "forecastIconSize",
      "updateFadeSpeed"
    ]);



    //force icon set to mono version whern config.coloured = false
    if (this.config.colored == false) {
      this.config.iconset = this.config.iconset.replace("c","m");      
    }

    //start data poll
    var self = this;
    setTimeout(function() {

      //first data pull is delayed by config
      self.getData();

      setInterval(function() {
        self.getData();
      }, self.config.updateInterval * 60 * 1000); //convert to milliseconds

    }, this.config.requestDelay);
    

  },

  getData: function() {
    this.sendSocketNotification("OPENWEATHER_FORECAST_GET", {
      apikey: this.config.apikey,
      latitude: this.config.latitude,
      longitude: this.config.longitude,
      units: this.config.units,
      language: this.config.language,
      instanceId: this.identifier,
      requestDelay: this.config.requestDelay
    });

  },

  socketNotificationReceived: function(notification, payload) {

    if (notification == "OPENWEATHER_FORECAST_DATA" && payload.instanceId == this.identifier) {

      //clear animated icon cache
      if (this.config.useAnimatedIcons) {
        this.clearIcons();
      }

      //process weather data
      this.weatherData = payload;
      this.formattedWeatherData = this.processWeatherData();

      this.updateDom(this.config.updateFadeSpeed);

      //broadcast weather update
      this.sendNotification("OPENWEATHER_FORECAST_WEATHER_UPDATE", payload);

      //start icon playback
      if (this.config.useAnimatedIcons) {
        var self = this;
        setTimeout(function() {
          self.playIcons(self);
        }, this.config.updateFadeSpeed + this.config.animatedIconStartDelay);
      } 

    }


  },

  /*
    This prepares the data to be used by the Nunjucks template.  The template does not do any logic other
    if statements to determine if a certain section should be displayed, and a simple loop to go through
    the houly / daily forecast items.
  */
  processWeatherData: function() {

    var timeZoneOffset = this.weatherData.timezone_offset;
    var summary = this.weatherData.current.weather[0].description.substring(0,1).toUpperCase() + this.weatherData.current.weather[0].description.substring(1) + ".";

    var hourlies = [];
    if (this.config.showHourlyForecast) {

      var displayCounter = 0;
      var currentIndex = this.config.hourlyForecastInterval;
      while (displayCounter < this.config.maxHourliesToShow) {
        if (this.weatherData.hourly[currentIndex] == null) {
          break;
        }

        var thisHour = this.weatherData.hourly[currentIndex];
        // thisHour.dt = thisHour.dt + timeZoneOffset;

        hourlies.push(this.forecastItemFactory(thisHour, "hourly"));

        currentIndex += this.config.hourlyForecastInterval;
        displayCounter++;

      }

    }

    var dailies = [];
    if (this.config.showDailyForecast) {

      for (var i = 1; i <= this.config.maxDailiesToShow; i++) {
        if (this.weatherData.daily[i] == null) {
          break;
        }

        var thisDay = this.weatherData.daily[i];
        // thisDay.dt = thisDay.dt + timeZoneOffset; 

        dailies.push(this.forecastItemFactory(thisDay, "daily"));
      }

    }

    var alerts = [];
    if (this.weatherData.alerts) {
      // for (alert in this.weatherData.alerts) {
      //   alert.description.replace("\n", "<br />");
      // }

      alerts = this.weatherData.alerts;
    }

    //current accumulation of precipitation
    var accumulation = 0 + " " + this.getUnit("accumulationRain");
    if (this.weatherData.current.rain) {
      accumulation = (Math.round(this.weatherData.current.rain["1h"] * 10) / 10) + " " + this.getUnit("accumulationRain");
    } else if (this.weatherData.current.snow) {
      accumulation = (Math.round(this.weatherData.current.snow["1h"] * 10) / 10) + " " + this.getUnit("accumulationSnow");
    }

    return {
      "currently" : {
        temperature: this.config.showFeelsLikeTemp ? Math.round(this.weatherData.current.feels_like) + "°" : Math.round(this.weatherData.current.temp) + "°",
        animatedIconId: this.config.useAnimatedIcons ? this.addIcon(this.iconMap[this.weatherData.current.weather[0].icon], true) : null,
        iconPath: this.generateIconSrc(this.iconMap[this.weatherData.current.weather[0].icon]),
        tempRange: this.formatHiLowTemperature(this.weatherData.daily[0].temp.max,this.weatherData.daily[0].temp.min),
        precipitation: accumulation,
        wind: this.formatWind(this.weatherData.current.wind_speed, this.weatherData.current.wind_deg, this.weatherData.current.wind_gust),
        sunrise: moment(this.weatherData.current.sunrise * 1000).format(this.config.label_sunriseTimeFormat),
        sunset: moment(this.weatherData.current.sunset * 1000).format(this.config.label_sunriseTimeFormat),
        pressure: Math.round(this.weatherData.current.pressure / 10) + " kPa",
        humidity: Math.round(this.weatherData.current.humidity) + "%",
        dewPoint: Math.round(this.weatherData.current.dew_point) + "°",
        uvIndex: Math.round(this.weatherData.current.uvi),
        visibility: Math.round(this.weatherData.current.visibility / 1000) + " km"
      },
      "summary" : summary,
      "hourly" : hourlies,
      "daily" : dailies,
      "alerts" : alerts
    };
  },  


  /*
    Hourly and Daily forecast items are very similar.  So one routine builds the data
    objects for both.
   */
  forecastItemFactory: function(fData, type) {

    var fItem = new Object();

    // --------- Date / Time Display ---------
    if (type == "daily") {

      //day name (e.g.: "MON")
      fItem.day = this.config.label_days[moment(fData.dt * 1000).format("d")];

    } else { //hourly

      //time (e.g.: "5 PM")
      fItem.time = moment(fData.dt * 1000).format(this.config.label_hourlyTimeFormat);
    }

    // --------- Icon ---------
    if (this.config.useAnimatedIcons && !this.config.animateMainIconOnly) {
      fItem.animatedIconId = this.addIcon(this.iconMap[fData.weather[0].icon], false);
    }
    fItem.iconPath = this.generateIconSrc(this.iconMap[fData.weather[0].icon]);

    // --------- Temperature ---------

    if (type == "hourly" && this.config.showFeelsLikeTemp) { //just display projected temperature for that hour
      fItem.temperature = Math.round(fData.feels_like) + "°";

    } else if(type == "hourly" && !this.config.showFeelsLikeTemp) {
      fItem.temperature = Math.round(fData.temp) + "°";

    } else { //display High / Low temperatures
      fItem.tempRange = this.formatHiLowTemperature(fData.temp.max,fData.temp.min);
    }

    // --------- Precipitation ---------
    fItem.precipitation = this.formatPrecipitation(fData.pop, fData.rain ? fData.rain["1h"] : null, fData.snow ? fData.snow["1h"] : null);

    // --------- Wind ---------
    fItem.wind = (this.formatWind(fData.wind_speed, fData.wind_deg, fData.wind_gust));

    // --------- Sunrise / Sunset -----------
    if (fData.sunrise) {
      fItem.sunrise = moment(fData.sunrise * 1000).format(this.config.label_sunriseTimeFormat);
    } 
    if (fData.sunset) {
      fItem.sunset = moment(fData.sunset * 1000).format(this.config.label_sunriseTimeFormat);
    } 

    // --------- Barometric Pressure -------------
    fItem.pressure = Math.round(fData.pressure / 10) + " kPa";

    // --------- Humididty -------------
    fItem.humidity = Math.round(fData.humidity) + "%";

    // --------- Dew Point -------------
    fItem.dewPoint = Math.round(fData.dew_point) + "°";

    // --------- UV Index -------------
    fItem.uvIndex = Math.round(fData.uvi);

    // --------- Visibility -------------
    if (fData.visibility) {
      fItem.visibility = Math.round(fData.visibility / 1000) + " km"
    }

    return fItem;
  },

  /*
    Returns a formatted data object for High / Low temperature range
   */
  formatHiLowTemperature: function(h,l) {
    return {
      high: (!this.config.concise ? this.config.label_high + " " : "") + Math.round(h) + "°",
      low: (!this.config.concise ? this.config.label_low + " " : "") + Math.round(l) + "°"
    };
  },

  /*
    Returns a formatted data object for precipitation
   */
  formatPrecipitation: function(percentChance, rainAccumulation, snowAccumulation) {

    var accumulation = null;

    //accumulation
    if (!this.config.concise && (rainAccumulation || snowAccumulation) ) {
      if (rainAccumulation){ //rain
        accumulation = (Math.round(rainAccumulation * 10) / 10) + " " + this.getUnit("accumulationRain");
      } else if (snowAccumulation) { //snow
        accumulation = Math.round(snowAccumulation) + " " + this.getUnit("accumulationSnow");
      } 
    }

    return {
      pop: percentChance ? Math.round(percentChance * 100) + "%" : "0%",
      accumulation: accumulation
    };

  },

  /*
    Returns a formatted data object for wind conditions
   */
  formatWind: function(speed, bearing, gust) {

    var conversionFactor = 1;
    if (this.config.units != "imperial" && this.config.displayKmhForWind) {
      conversionFactor = 3.6;
    }

    console.log("=========== units: " + this.config.units);
    console.log("=========== use km/h: " + this.config.displayKmhForWind);
    console.log("=========== conv factor: " + conversionFactor);

    //wind gust
    var windGust = null;
    if (!this.config.concise && gust) {
      windGust = " (" + this.config.label_maximum + " " + Math.round(gust * conversionFactor) + " " + this.getUnit("windSpeed") + ")";
    }    

    return {
      windSpeed: Math.round(speed * conversionFactor) + " " + this.getUnit("windSpeed") + (!this.config.concise ? " " + this.getOrdinal(bearing) : ""),
      windGust: windGust
    };
  },

  /*
    Returns the units in use for the data pull from Dark Sky
   */
  getUnit: function(metric) {

    if (metric == "windSpeed" && this.config.units != "imperial" && this.config.displayKmhForWind) {
      return "km/h"
    } else {
      return this.units[metric][this.config.units];
    }

  },

  /*
    Formats the wind direction into common ordinals (e.g.: NE, WSW, etc.)
    Wind direction is provided in degress from North in the data feed.
   */
  getOrdinal: function(bearing) {
    return this.config.label_ordinals[Math.round(bearing * 16 / 360) % 16];
  },

  /*
    Some display items need the unit beside them.  This returns the correct
    unit for the given metric based on the unit set in use.
   */
  units: {
    accumulationRain: {
      standard: "mm",
      metric: "mm",
      imperial: "in"
    },
    accumulationSnow: {
      standard: "cm",
      metric: "cm",
      imperial: "in"
    },
    windSpeed: {
      standard: "m/s",
      metric: "m/s",
      imperial: "mph"
    }
  },

  /*
    Icon sets can be added here.  The path is relative to
    MagicMirror/modules/MMM-DarkSky/icons, and the format
    is specified here so that you can use icons in any format
    that works for you.

    Dark Sky currently specifies one of ten icons for weather
    conditions:

      clear-day
      clear-night
      cloudy
      fog
      partly-cloudy-day
      partly-cloudy-night
      rain
      sleet
      snow
      wind

    All of the icon sets below support these ten plus an 
    additional three in anticipation of Dark Sky enabling
    a few more:

      hail,
      thunderstorm,
      tornado

    Lastly, the icons also contain two icons for use as inline
    indicators beside precipitation and wind conditions. These
    ones look best if designed to a 24px X 24px artboard.

      i-rain
      i-wind

   */
  iconsets: {
    "1m": {path:"1m", format:"svg"},
    "1c": {path:"1c", format:"svg"},
    "2m": {path:"2m", format:"svg"},
    "2c": {path:"2c", format:"svg"},
    "3m": {path:"3m", format:"svg"},
    "3c": {path:"3c", format:"svg"},
    "4m": {path:"4m", format:"svg"},
    "4c": {path:"4c", format:"svg"},
    "5m": {path:"5m", format:"svg"},
    "5c": {path:"5c", format:"svg"},
  },


/*
    Previous version of this module was built for Dark Sky which had it's own icon set.
    In order to reuse those icon, I need to map the standard icon IDs to the Dark Sky
    icon file names.  Possible icons are:

      * clear-day
      * clear-night
      * cloudy
      * fog
      * hail
      * partly-cloudy-day
      * partly-cloudy-night
      * rain
      * sleet
      * snow
      * thunderstorm
      * tornado
      * wind

   */
  iconMap: {
    "01d" : "clear-day",
    "01n" : "clear-night",
    "02d" : "partly-cloudy-day",
    "02n" : "partly-cloudy-night",
    "03d" : "cloudy",
    "03n" : "cloudy",
    "04d" : "cloudy",
    "04n" : "cloudy",
    "09d" : "rain",
    "09n" : "rain",
    "10d" : "rain",
    "10n" : "rain",
    "11d" : "thunderstorm",
    "11n" : "thunderstorm",
    "13d" : "snow",
    "13n" : "snow",
    "50d" : "fog",
    "50n" : "fog"
  },

  /*
    This generates a URL to the icon file
   */
  generateIconSrc: function(icon) {
    return this.file("icons/" + this.iconsets[this.config.iconset].path + "/" +
        icon + "." + this.iconsets[this.config.iconset].format);

  },



  /*
    When the Skycons animated set is in use, the icons need
    to be rebuilt with each data refresh.  This routine clears
    the icon cache before the data refresh is processed.
   */
  clearIcons: function() {
    this.skycons.pause();
    var self = this;
    this.iconCache.forEach(function(icon) {
      self.skycons.remove(icon.id);
    });
    this.iconCache = [];
    this.iconIdCounter = 0;
  },

  /*
    When the Skycons animated set is in use, the icons need
    to be rebuilt with each data refresh.  This routine adds
    an icon record to the cache.
   */
  addIcon: function(icon, isMainIcon) {

    console.log(" ================== Adding icon: " + icon + ", " + isMainIcon);

    //id to use for the canvas element
    var iconId;
    if (isMainIcon) {
      iconId = "skycon_main";
    } else {
      iconId = "skycon_" + this.iconCache.length;
    }


    //add id and icon name to cache
    this.iconCache.push({
      "id" : iconId,
      "icon" : icon
    });

    return iconId;
  },

  /*
    For use with the Skycons animated icon set. Once the
    DOM is updated, the icons are built and set to animate.
    Name is a bit misleading. We needed to wait until
    the canvas elements got added to the Dom, which doesn't
    happen until after updateDom() finishes executing
    before actually drawing the icons.
  */
  playIcons: function(inst) {
    inst.iconCache.forEach(function(icon) {
      console.log("=============== Adding animated icon " +icon.id + ": '" + icon.icon +"'");
      inst.skycons.add(icon.id, icon.icon);
    });
    inst.skycons.play();

  },

  /*
    For any config parameters that are expected as integers, this
    routine ensures they are numbers, and if they cannot be
    converted to integers, then the module defaults are used.
   */
  sanitizeNumbers: function(keys) {

    var self = this;
    keys.forEach(function(key) {
      if (isNaN(parseInt(self.config[key]))) {
        self.config[key] = self.defaults[key];
      } else {
        self.config[key] = parseInt(self.config[key]);
      }
    });
  }




});
