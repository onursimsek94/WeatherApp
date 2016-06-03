'use strict';

/*

	$scope.cityWeatherList
		--> Eklenen sehirlerin listesini tutar

	$scope.hourlyWeatherData
		--> Ana ekranda secilen sehrin bilgisini tutar

	$cordovaGeolocation.getCurrentPosition
		--> Uygulama ilk calistiginda bulunan konumun enlem ve boylamini alir.
		-->	WeatherService.SearchCity'ye alinan enlem boylami gonderir,
			sonuc $scope.handlerCityData'ya duser.

	$scope.handlerCityData
		--> Donen sonucun ilk verisi CommonService.addCity'ye gonderilerek
			listeye ekleniyor.
	
	$scope.getHourlyWeather
		--> Ana ekranda secilen sehrin enlem ve boylam degerlerini 
			WeatherService.GetCityWeather'a gonderir,
			sonuc $scope.handlerHourlyWeatherData'ya duser.

	$scope.handlerHourlyWeatherData
		--> hourlyWeatherModal'i acar ve saatlik hava durumu bilgisini 
			$scope.hourlyWeatherData'ya atar.

*/

WeatherApp.controller('MainController', function(WeatherService, CommonService, $scope, $cordovaGeolocation, $ionicLoading, $ionicModal, $ionicScrollDelegate) {

	$scope.cityWeatherList = CommonService.getCityList();

	$cordovaGeolocation.getCurrentPosition({
			enableHighAccuracy: false
		})
		.then(function(position) {
			$ionicLoading.show();
			WeatherService.SearchCity(position.coords.latitude + ',' + position.coords.longitude, 'mainView', 'handlerCityData');

		}, function(err) {
			$ionicLoading.hide();
			console.log(err);
		});

	$scope.handlerCityData = function(data) {
		data = data[0];
		CommonService.addCity(data);
		WeatherService.GetCityWeather(data.latitude + ',' + data.longitude, '', '', 'mainView', 'handlerTemperatureData');
	};

	$scope.handlerTemperatureData = function(data) {
		CommonService.setCityTemperature(data.nowTemperature, data.weatherDescription, data.weather);
		$ionicLoading.hide();
	};

	$ionicModal.fromTemplateUrl('view/hourlyWeatherModal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.hourlyWeatherModal = modal;
	});

	$scope.hourlyWeatherData = {
		areaName: '',
		weather: []
	};

	$scope.openHourlyWeatherModal = function() {
		$scope.hourlyWeatherModal.show();
	};

	$scope.closeHourlyWeatherModal = function() {
		$scope.hourlyWeatherModal.hide();
	};

	$scope.getHourlyWeather = function(areaName, latitude, longitude) {
		$ionicLoading.show();
		$scope.hourlyWeatherData.areaName = areaName;
		WeatherService.GetCityWeather(latitude + ',' + longitude, '1', '1', 'mainView', 'handlerHourlyWeatherData');
	};

	$scope.handlerHourlyWeatherData = function(data) {
		$scope.openHourlyWeatherModal();
		$ionicScrollDelegate.scrollTop();
		$scope.hourlyWeatherData.weather = data.weather;
		$ionicLoading.hide();
	};

});