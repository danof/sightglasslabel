'use strict';

/**
 * @ngdoc function
 * @name sightglasslabelApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the sightglasslabelApp
 */
angular.module('sightglasslabelApp')
	.controller('NavCtrl', function ($scope, $rootScope, $location, Auth) {
		$scope.logout = function() {
			Auth.logout();
			$location.path('/');
		};
		
		$scope.login = function() {
			$rootScope.previousPage = $location.url();
			$location.path('/login');
		};
	});
