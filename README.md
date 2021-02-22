# MMM-OpenWeatherForecast

This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

![Screenshot](/../screenshots/MMM-OpenWeatherForecast.png?raw=true "Screenshot")

A weather module that displays current, hourly and daily forecast information
using data from the OpenWeather One Call API. This is a replacement module for MMM-DarkSkyForecast, now that Dark Sky no longer allows free API access.  This maintains much of the same functionality and adds a few new features.

**NOTE** This module uses the Nunjucks templating system introduced in version 2.2.0 of MagicMirror.  If you're seeing nothing on your display where you expect this module to appear, make sure your MagicMirror version is at least 2.2.0.


## Installation

1. Navigate into your MagicMirror `modules` folder and execute<br>
`git clone https://github.com/jclarke0000/MMM-OpenWeatherForecast.git`.
2. Enter the new `MMM-OpenWeatherForecast` directory and execute `npm install`.



## Configuration

At a minimum you need to supply the following required configuration parameters:

* `apikey` 
* `latitude`
* `longitude`

`apikey` needs to be secified as a String, while `latitude` and `longitude` can be specified as either a String or a Number.  Both work fine.

e.g.,
```
  {
    module: "MMM-OpenWeatherForecast",
    position: "top_right",
    header: "Forecast",
    config: {
      apikey: "a1b2c3d4e5f6g7h8j9k0", //only string here
      latitude: 51.490230,            //number works here
      longitude: "-0.258810"          //so does a string
    }
  },
```

You need to create a free account with OpenWeather in order to get an API key:
https://home.openweathermap.org/users/sign_up.

Free tier is fine -- this module will not make anywhere near 60 calls per minute / 1,000,000 requests per month.

Find out your latitude and longitude here:
https://www.latlong.net/.

### Other optional parameters

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>updateInterval</code></td>
      <td>How frequently, in minutes, to poll for data.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>10</code></td>
    </tr>
    <tr>
      <td><code>requestDelay</code></td>
      <td>In milliseconds, how long to delay the request.  If you have multiple instances of the module running, set one of them to a delay of a second or two to keep the API calls from being too close together.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>250</code></td>
    </tr>
    <tr>
      <td><code>updateFadeSpeed</code></td>
      <td>How quickly in milliseconds to fade the module out and in upon data refresh.  Set this to <code>0</code> for no fade.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>500</code> (i.e., 1/2 second).</td>
    </tr>
    <tr>
      <td><code>language</code></td>
      <td>The language to be used for display.<br><br><strong>Type</strong> <code>String</code><br>Defaults to the language set for Magic Mirror, but can be overridden with any of the language codes listed here: <a href="https://openweathermap.org/api/one-call-api#multi">https://openweathermap.org/api/one-call-api#multi</a></td>
    </tr>
    <tr>
      <td><code>units</code></td>
      <td>One of the following: <code>standard</code> (e.g., degrees Kelvin), <code>metric</code> (e.g., degress Celcius), or <code>imperial</code> (e.g., degrees Fahrenheit).<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"metric"</code><br /></td>
    </tr>
    <tr>
      <td><code>concise</code></td>
      <td>When set to <code>true</code>, this presents less information.  (e.g., no precipitation accumulation, no wind gusts, etc.)<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>iconset</code></td>
      <td>Which icon set to use.  See below for previews of the icon sets.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"1c"</code></td>
    </tr>
    <tr>
      <td><code>colored</code></td>
      <td>Whether to present module in colour or black-and-white.  Note, if set to <code>false</code>, the monochramtic version of your chosen icon set will be forced.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>useAnimatedIcons</code></td>
      <td>Whether to use the animated icon set.  When set to true, this will override your choice for <code>iconset</code>. However, flat icons will still be used in some instances.  For example if you set the <code>animateMainIconOnly</code> parameter to <code>true</code>, daily and hourly forecasts will not be animated and instead will use your choice for <code>iconset</code>.  Inline icons (i.e. used to prefix weather extras) will always be flat.  A good <code>iconset</code> match for the animated set is <code>1c</code>.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>animateMainIconOnly</code></td>
      <td>When set to <code>true</code>, only the main current conditions icon is animated. The rest use your choice for <code>iconset</code> (<code>1c</code> is a good match for the animated icon).  If you are running on a low-powered device like a Raspberry Pi, performance may suffer if you set this to <code>false</code>.  In my testing on a Pi 3b, enabling this ramped up CPU temperature by 15° - 20°, and fade transitions were not smooth.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showFeelsLikeTemp</code></td>
      <td>Makes the temprature display for current conditions and hourly forecast show the "feels like" temperature instead of the actual temperature.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>showCurrentConditions</code></td>
      <td>Whether to show current temperaure and current conditions icon.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showSummary</code></td>
      <td>Whether to show the forecast summary. Weather alerts will also appear here.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showExtraCurrentConditions</code></td>
      <td>Whether to show additional current conditions such as high/low temperatures, precipitation and wind speed.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>extraCurrentConditions</code></td>
      <td>What items to show when <code>showExtraCurrentConditions</code> is set to <code>true</code>.  See the Extras section below for details on how to specify this.<br><br><strong>Type</strong> <code>Object</code><br>Defaults to Hi/Lo Temp, Sunrise/Sunset, Precipitation, Wind and UV Index</td>
    </tr>
    <tr>
      <td><code>forecastHeaderText</code></td>
      <td>Text for the header above the forecast display.  Set to <code>""</code> to hide this header altogether.  Also doesn't appear if <code>showHourlyForecast</code> and <code>showDailylyForecast</code> are both set to <code>false</code>.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"Forecast"</code></td>
    </tr>
    <tr>
      <td><code>forecastLayout</code></td>
      <td>Can be set to <code>tiled</code> or <code>table</code>. How to display hourly and forecast information.  See below for screenshot examples of each.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>tiled</code></td>
    </tr>
    <tr>
      <td><code>showHourlyForecast</code></td>
      <td>Whether to show hourly forecast information. when set to <code>true</code> it works with the <code>hourlyForecastInterval</code> and <code>maxHourliesToShow</code> parameters.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showHourlyTableHeaderRow</code></td>
      <td>Whether to show the table header text and icon column headers on the hourly forecast table.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>hourlyForecastTableHeaderText</code></td>
      <td>The title text to be used for the hourly forecast table.  Set to <code>""</code> if you do not want a title.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"Hourly"</code></td>
    </tr>
    <tr>
      <td><code>hourlyForecastInterval</code></td>
      <td>How many hours apart each listed hourly forecast is.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>3</code></td>
    </tr>
    <tr>
      <td><code>maxHourliesToShow</code></td>
      <td>How many hourly forecasts to list.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>3</code></td>
    </tr>
    <tr>
      <td><code>hourlyExtras</code></td>
      <td>Hourly forecast items will always show the temperature (either actual or "feels like" depending on your setting for <code>showFeelsLikeTemp</code>).  You can configure additional items to be shown. See the "Extras" section below for details on how to specify this.<br><br><strong>Type</strong> <code>Object</code><br>Defaults to Precipitation and Wind.</td>
    </tr>
    <tr>
      <td><code>showDailyForecast</code></td>
      <td>Whether to show daily forecast information. when set to <code>true</code> it works with the <code>maxDailiesToShow</code> parameter.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showDailyTableHeaderRow</code></td>
      <td>Whether to show the table header text and icon column headers on the daily forecast table.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>dailyForecastTableHeaderText</code></td>
      <td>The title text to be used for the daily forecast table.  Set to <code>""</code> if you do not want a title.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"Daily"</code></td>
    </tr>
    <tr>
      <td><code>maxDailiesToShow</code></td>
      <td>How many daily forecasts to list.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>3</code></td>
    </tr>
    <tr>
      <td><code>dailyExtras</code></td>
      <td>Daily forecast items will always show the high/low temperature predictions.  You can configure additional items to be shown. See the "Extras" section below for details on how to specify this.<br><br><strong>Type</strong> <code>Object</code><br>Defaults to Precipitation and Wind.</td>
    </tr>
    <tr>
      <td><code>label_maximum</code></td>
      <td>The label you wish to display for prefixing wind gusts.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"max"</code>.</td>
    </tr>
    <tr>
      <td><code>label_high</code></td>
      <td>The label you wish to display for prefixing high temperature.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"H"</code>.</td>
    </tr>
    <tr>
      <td><code>label_low</code></td>
      <td>The label you wish to display for prefixing low temperature.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"L"</code>.</td>
    </tr>
    <tr>
      <td><code>label_timeFormat</code></td>
      <td>How you want the time formatted for hourly forecast display.  Accepts any valid moment.js format (<a href="https://momentjs.com/docs/#/displaying/format/">https://momentjs.com/docs/#/displaying/format/</a>). For example, specify short 24h format with <code>"k[h]"</code> (e.g.: <code>14h</code>)<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"h a"</code> (e.g.: <code>9 am</code>)</td>
    </tr>
    <tr>
      <td><code>label_sunriseTimeFormat</code></td>
      <td>How you want the time formatted for sunrise/sunset display.  Accepts any valid moment.js format (https://momentjs.com/docs/#/displaying/format/). For example, specify short 24h format with <code>"k[h]"</code> (e.g.: <code>14h</code>)<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"h:mm a"</code> (e.g.: <code>6:45 am</code>)</td>
    </tr>
    <tr>
      <td><code>label_days</code></td>
      <td>How you would like the days of the week displayed for daily forecasts.  Assumes index <code>0</code> is Sunday.<br><br><strong>Type</strong> <code>Array of Strings</code><br>Defaults to <code>["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]</code></td>
    </tr>
    <tr>
      <td><code>label_ordinals</code></td>
      <td>How you would like wind direction to be displayed.  Assumes index <code>0</code> is North and proceeds clockwise.<br><br><strong>Type</strong> <code>Array of Strings</code><br>Defaults to <code>["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]</code></td>
    </tr>
  </tbody>
</table>

## Extras

For each of current conditions, hourly forecast and daily forecast, there are additional data that can be optionally displayed.  Set the corresponding value for each key to either <code>true</code> or <code>false</code> to show or hide the item respectively.

### Valid options for <code>extraCurrentConditions</code>

This shows all available options:
```
  extraCurrentConditions: {
    highLowTemp: true,
    precipitation: true,
    sunrise: true,
    sunset: true,
    wind: true,
    barometricPressure: true,
    humidity: true,
    dewPoint: true,
    uvIndex: true,
    visibility: true
  },
```

This shows just Hi/Low temp display an precipitation:
```
  extraCurrentConditions: {
    highLowTemp: true,
    precipitation: true,
    sunrise: false,
    sunset: false,
    wind: false,
    barometricPressure: false,
    humidity: false,
    dewPoint: false,
    uvIndex: false,
    visibility: false
  },
```

### Valid options for <code>hourlyExtras</code>

```
  hourlyExtras: {
    precipitation: true,
    wind: true,
    barometricPressure: true,
    humidity: true,
    dewPoint: true,
    uvIndex: true,
    visibility: true
  },
```

### Valid options for <code>dailyExtras</code>

```
  dailyExtras: {
    precipitation: true,
    sunrise: true,
    sunset: true,
    wind: true,
    barometricPressure: true,
    humidity: true,
    dewPoint: true,
    uvIndex: true
  },
```

## Sample Configuration

```
  {
    module: "MMM-OpenWeatherForecast",
    position: "top_right",
    header: "Forecast",
    config: {
      apikey: "********************", //SUPER SECRET
      latitude: 43.653225,
      longitude: -79.383186,
      units: "metric",
      iconset: "3c",
      colored: true,
      concise: true,
      requestDelay: "2000",
      showFeelsLikeTemp: true,

      showCurrentConditions: true,
      showSummary: true,
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

      forecastLayout: "table",
      forecastHeaderText: "",

      hourlyForecastTableHeaderText: "By the hour",
      showHourlyForecast: true,
      showHourlyTableHeaderRow: true,
      hourlyForecastInterval: 1,
      maxHourliesToShow: 10,
      hourlyExtras: {
        precipitation: true,
        wind: true,
        barometricPressure: false,
        humidity: false,
        dewPoint: false,
        uvIndex: false,
        visibility: false
      },

      dailyForecastTableHeaderText: "Throughout the week",
      showDailyForecast: true,
      showDailyTableHeaderRow: true,
      maxDailiesToShow: 5,
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

    }
  },

```

## Icon Sets

![Icon Sets](icons/iconsets.png?raw=true "Icon Sets")


## Layouts

![Layouts](/../screenshots/forecast-layouts.jpg?raw=true "Layouts")


## Styling

This module is set to be 320px wide by default.  If you wish to override it, you can add the following to your `custom.css` file:

```
.MMM-OpenWeatherForecast .module-content {
  width: 500px; /* adjust this as desired */
}
```

Most important elements of this module have one or more class names applied. Examine the `MMM-OpenWeatherForecast.css` or inspect elements directly with your browser of choice to determine what class you would like to override.


## For Module Developers

This module broadcasts a notification when it recieves a weather update.  The notification is `OPENWEATHER_FORECAST_WEATHER_UPDATE` and the payload contains OpenWeather's JSON weather forecast object for the One Call API.  For details on the weather object, see https://openweathermap.org/api/one-call-api.
