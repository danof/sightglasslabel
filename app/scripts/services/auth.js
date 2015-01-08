'use strict';

/**
 * @ngdoc service
 * @name sightglasslabelApp.auth
 * @description
 * # auth
 * Factory in the sightglasslabelApp.
 */
angular.module('sightglasslabelApp')
	.factory('Auth', function($firebaseSimpleLogin, FIREBASE_URL, $rootScope) {
		var ref = new Firebase(FIREBASE_URL);

		var auth = $firebaseSimpleLogin(ref);

		var Auth = {
			register: function(user) {
				return auth.$createUser(user.email, user.password);
			},
			signedIn: function() {
				return auth.user !== null;
			},
			login: function (user) {
				return auth.$login('password', user);
			},
			logout: function() {
				auth.$logout();
			},
			recoverPassword: function (user) {
				return auth.$sendPasswordResetEmail(user.email);
			},
			changePassword: function (user) {
				return auth.$changePassword(user.email, user.oldPassword, user.newPassword);
			},
			handleError: function (error) {
				var errorCode;
				switch(error.code) {
					case 'EMAIL_TAKEN':
						errorCode = 'The specified email address is already in use.';
						break;
					case 'INVALID_EMAIL':
						errorCode = 'The specified email address is incorrect.';
						break;
					case 'INVALID_PASSWORD':
						errorCode = 'The specified password is incorrect.';
						break;
					case 'INVALID_USER':
						errorCode = 'The specified user does not exist.';
						break;
					case 'UNKNOWN_ERROR':
						errorCode = 'An unknown error occurred.';
						break;
					default:
						errorCode = 'An unknown error occurred.';
						break;
				}
				return errorCode;
			}
		};

		$rootScope.signedIn = function() {
			return Auth.signedIn();
		};

		return Auth;
	});
