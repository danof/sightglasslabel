'use strict';

/**
 * @ngdoc overview
 * @name sightglasslabelApp
 * @description
 * # sightglasslabelApp
 *
 * Main module of the application.
 */
angular
  .module('sightglasslabelApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'	
  ])
  .constant('FIREBASE_URL', 'https://siteglasslabel.firebaseio.com/')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/label', {
        templateUrl: 'views/label.html',
        controller: 'LabelCtrl'
      })
	  .when('/label/:labelId', {
        templateUrl: 'views/label.html',
        controller: 'LabelCtrl'
      })
	  .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthCtrl'
      })
	  .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl'
      })
	  .when('/forgot-password', {
        templateUrl: 'views/forgot-password.html',
        controller: 'AuthCtrl'
      })
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
