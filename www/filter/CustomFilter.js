'use strict';

/*

	dateToDayName
		--> Gelen string'ten date nesnesi olusturulur, tarihin haftadaki index'i
			alinir ve daysOfWeek'te karsilik gelen deger dondurulur.

	hourFormat
		--> Saatlik hava durumu gostermedeki api'dan donen saatleri uygun formata
			donusturmek icin kullaniliyor.

*/

WeatherApp.filter('dateToDayName', function() {
	return function(date) {
		var daysOfWeek = new Array('Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi');
		return daysOfWeek[new Date(date).getDay()];
	}
});

WeatherApp.filter('hourFormat', function() {
	return function(hour) {
		if (hour.length == 1) {
			return '00:00';
		} else if (hour.length == 3) {
			return '0' + hour.substring(0, 1) + ':00'
		} else {
			return hour.substring(0, 2) + ':00'
		}
	}
});