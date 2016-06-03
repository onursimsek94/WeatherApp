'use strict';

WeatherApp.service('WeatherService', function($http) {

	return {
		SearchCity: function(searchValue, elementId, callBackMethodName) {
			$http({
					method: "GET",
					url: GLOBALS.worldWeatherOnlineProperties.cityUrl,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					params: {
						query: searchValue,
						key: GLOBALS.worldWeatherOnlineProperties.apiKey,
						format: GLOBALS.worldWeatherOnlineProperties.format
					}
				})
				.success(function(result, status) {
					console.log(result);

					var data = [];
					if (result.search_api != undefined) {
						for (var i = 0; i < result.search_api.result.length; i++) {
							data.push({
								areaName: result.search_api.result[i].areaName[0].value,
								region: result.search_api.result[i].region[0].value,
								country: result.search_api.result[i].country[0].value,
								latitude: result.search_api.result[i].latitude,
								longitude: result.search_api.result[i].longitude,
								nowTemperature: '',
								weatherDescription: '',
								weather: []
							});
						}
					} else{
						data = "-1";
					}

					angular.element(document.getElementById(elementId)).scope()[callBackMethodName](data);
				})
				.error(function(result, status) {
					console.log(result);
					angular.element(document.getElementById(elementId)).scope()[callBackMethodName]("-1");
				});
		},

		GetCityWeather: function(city, days, times, elementId, callBackMethodName) {
			$http({
					method: "GET",
					url: GLOBALS.worldWeatherOnlineProperties.weatherUrl,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					params: {
						q: city,
						key: GLOBALS.worldWeatherOnlineProperties.apiKey,
						lang: GLOBALS.worldWeatherOnlineProperties.language,
						num_of_days: days == '' ? GLOBALS.worldWeatherOnlineProperties.num_of_days : days,
						tp: times == '' ? GLOBALS.worldWeatherOnlineProperties.tp : times,
						format: GLOBALS.worldWeatherOnlineProperties.format
					}
				})
				.success(function(result, status) {
					console.log(result);
					
					var data = {
						nowTemperature: result.data.current_condition[0].temp_C,
						weatherDescription: result.data.current_condition[0].lang_tr[0].value,
						weather: result.data.weather
					};

					angular.element(document.getElementById(elementId)).scope()[callBackMethodName](data);
				})
				.error(function(result, status) {
					console.log(result);
				});
		}

	}

})