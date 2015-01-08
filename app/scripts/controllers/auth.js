'use strict';

/**
 * @ngdoc function
 * @name sightglasslabelApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the sightglasslabelApp
 */
angular.module('sightglasslabelApp')
	.controller('AuthCtrl', function ($scope, $rootScope, $location, Auth, User) {
		if (Auth.signedIn()) {
			$location.path('/');
		}

		$scope.$on('$firebaseSimpleLogin:login', function() {
			$location.path('/');
		});

		$scope.login = function() {
			Auth.login($scope.user).then(function() {
				if ($rootScope.previousPage) {
					$location.path($rootScope.previousPage);
				} else {
					$location.path('/');
				}
			}, function(error) {
				$scope.error = Auth.handleError(error);
			});
		};

		$scope.register = function() {
			Auth.register($scope.user).then(function(authUser) {
				User.create(authUser, authUser.id);
				Auth.login($scope.user);
				$location.path('/');
			}, function(error) {
				$scope.error = Auth.handleError(error);
			});
		};

		$scope.recoverPassword = function () {
			Auth.recoverPassword($scope.user).then(function() {
				$scope.success = true;
				$scope.error = false;
			}, function(error) {
				$scope.success = false;
				$scope.error = Auth.handleError(error);
			});
		};
	});
