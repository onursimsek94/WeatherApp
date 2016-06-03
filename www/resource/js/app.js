'use strict';

/*

    GLOBALS
        --> API icin gerekli bilgiler tutuluyor.

    document.addEventListener("offline"
        --> Uygulama ilk acildiginda internet kontrolu yapar. Internet yoksa
            kullaniciya uyari vererek programi kapatir. (Android)

*/

var GLOBALS = {
    worldWeatherOnlineProperties: {
        apiKey: 'a214d05a5c804f258f5185835163105',
        cityUrl: 'http://api.worldweatheronline.com/premium/v1/search.ashx',
        weatherUrl: 'http://api.worldweatheronline.com/premium/v1/weather.ashx',
        format: "json",
        num_of_days: 3,
        tp: 24,
        language: 'tr'
    }
};

var WeatherApp = angular.module('WeatherApp', ['ionic', 'ngCordova', 'ui.router'])

.run(function($ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        document.addEventListener("offline", function() {
            $ionicPopup.alert({
                title: 'Uyarı',
                template: "İnternet Bağlantınızı Açıp Tekrar Deneyin.",
                buttons: [{
                    text: 'Tamam',
                    type: 'button-positive',
                    onTap: function(e) {
                        navigator.app.exitApp();
                    }
                }]
            });
        }, false);
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.views.transition('none');

    $stateProvider

    .state('main', {
        url: '/main',
        templateUrl: 'view/main.html',
        controller: 'MainController'
    })

    .state('settings', {
        url: '/settings',
        templateUrl: 'view/settings.html',
        controller: 'SettingsController'
    })

    $urlRouterProvider.otherwise("/main");

})