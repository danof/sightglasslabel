'use strict';

/**
 * @ngdoc function
 * @name sightglasslabelApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the sightglasslabelApp
 */
angular.module('sightglasslabelApp')
	.controller('AccountCtrl', function ($scope, $rootScope, $location, Label, User, Auth) {
		
		if (!$rootScope.currentUser) { // if user isn't logged in kick them to login screen
			$location.path('/login');
		}

		$scope.user = $rootScope.currentUser;

		$scope.user.$on('loaded', function() {
			$scope.labels = {};

			angular.forEach($scope.user.labels, function(labelId) {
				$scope.labels[labelId] = Label.find(labelId);
			});
		});

		$scope.deleteLabel = function (labelId) {
			Label.delete(labelId);

			delete $scope.labels[labelId];
		};

		$scope.changePassword = function () {
			Auth.changePassword($scope.user).then(function() {
				$scope.success = true;
				$scope.error = false;
				$scope.user.oldPassword = '';
				$scope.user.newPassword = '';
			}, function(error) {
				$scope.success = false;
				$scope.error = Auth.handleError(error);
			});
		};
	});
