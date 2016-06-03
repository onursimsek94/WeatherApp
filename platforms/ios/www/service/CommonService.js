'use strict';

WeatherApp.service('CommonService', function() {

	var cityList = [];

	return {
		addCity: function(data) {
			cityList.push(data);
		},

		deleteCity: function(index) {
			cityList.splice(index, 1);
		},

		getCityList: function() {
			return cityList;
		},

		setCityTemperature: function(nowTemperature, weatherDescription, weather) {
			cityList[cityList.length - 1].nowTemperature = nowTemperature;
			cityList[cityList.length - 1].weatherDescription = weatherDescription;
			cityList[cityList.length - 1].weather = weather;
		}
	}

});