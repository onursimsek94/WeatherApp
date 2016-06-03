'use strict';

WeatherApp.controller('SettingsController', function(WeatherService, CommonService, $scope, $state, $ionicModal, $ionicLoading) {

	$scope.city = {
		name: '',
		addedCities: CommonService.getCityList(),
		matchedCities: []
	};
	$scope.effaceable = false;
	$scope.notFound = false;

	$scope.changeEffaceable = function() {
		$scope.effaceable = !$scope.effaceable;
	};

	$scope.deleteCity = function(index) {
		if($scope.effaceable && index != 0)
			CommonService.deleteCity(index);
	};

	$ionicModal.fromTemplateUrl('view/addCityModal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.addCityModal = modal;
	});

	$scope.openAddCityModal = function() {
		$scope.effaceable = false;
		$scope.addCityModal.show();
	};

	$scope.closeAddCityModal = function() {
		$scope.clearSearchDatas();
		$scope.addCityModal.hide();
	};

	$scope.$watch('city.name', function(newValue, oldValue, scope) {

		if (newValue.length >= 3) {
			$ionicLoading.show();
			WeatherService.SearchCity(newValue, 'settingsView', 'handlerCitiesData');
		}

	});

	$scope.handlerCitiesData = function(data) {
		$scope.city.matchedCities = [];

		if (data != "-1") {
			$scope.notFound = false;
			$scope.city.matchedCities = data;
		} else {
			$scope.notFound = true;
			$scope.city.matchedCities = [];
		}
		$ionicLoading.hide();
	};

	$scope.clearSearchDatas = function() {
		$scope.city.name = '';
		$scope.city.matchedCities = [];
	};

	$scope.addCity = function(item) {
		$ionicLoading.show();
		CommonService.addCity(item);
		WeatherService.GetCityWeather(item.latitude + ',' + item.longitude, '', '', 'settingsView', 'handlerTemperatureData');
	};

	$scope.handlerTemperatureData = function(data) {
		CommonService.setCityTemperature(data.nowTemperature, data.weatherDescription, data.weather);
		$ionicLoading.hide();
		$scope.closeAddCityModal();
	};

	$scope.goBack = function() {
		$scope.effaceable = false;
		$state.go('main');
	};

});