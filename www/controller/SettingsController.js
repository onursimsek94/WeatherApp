'use strict';

/*

	$scope.city
		--> Aranilan sehri, daha onceden eklenmis olan sehirleri ve 
			arama sonucunda donen sehirleri tutar.

	$scope.effaceable
		--> Sehir silme ikonunu ve butonunu gosterip gizlemek icin kullaniliyor.
			Butonun gozukmesi icin listede en az 2 sehir olmali

	$scope.notFound
		--> Kullanici bilgilendirmesi icin kullaniliyor. Arama sonucunda sehir
			donmezse view'da Sonuc Bulunamadi yazisini gosteriyor.

	$scope.changeEffaceable
		--> $scope.effaceable degerini degistirir.

	$scope.deleteCity
		--> Sehir silmek icin kullaniliyor. CommonService.deleteCity'ye secilen
			sehrin indexi gonderiliyor. Silme isleminin gerceklesebilmesi icin
			$scope.effaceable true olmali ve index 0 olmamalidir. Bulunulan 
			konum silinemez.

	$scope.$watch('city.name'
		--> Sehir arama yapmak icin kullanilir. Arama icin en az 3 karakter olmalidir.
			WeatherService.SearchCity'ye yazilan deger gonderilir. Sonuc
			$scope.handlerCitiesData'ya duser.

	$scope.handlerCitiesData
		--> Sonuc -1 donmemisse sehir bulunmus demektir ve sonuclar listelenir.
			Sonuc -1 donmusse sehir bulunamamis demektir ve kullanici bilgilendirilir.

	$scope.clearSearchDatas
		--> Sehir arama field'inin ve bulunan sehirlerin temizlenmesi icin kullanilir.

	$scope.addCity
		--> Sehir eklemek icin kullanilir. Listelenen sehirlerden biri secildiginde
			tetiklenir. Secilen sehir CommonService.addCity'ye gonderilir. Sehrin
			hava durumunu almak icin enlem ve boylami WeatherService.GetCityWeather'a
			gonderir, sonucu $scope.handlerTemperatureData'ya duser.

	$scope.handlerTemperatureData
		--> CommonService.setCityTemperature'a donen hava durumu bilgilerini gonderir
			ve modal'i kapatir.			

*/

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