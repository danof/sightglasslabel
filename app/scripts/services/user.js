'use strict';

/**
 * @ngdoc service
 * @name sightglasslabelApp.user
 * @description
 * # user
 * Factory in the sightglasslabelApp.
 */
angular.module('sightglasslabelApp')
	.factory('User', function ($firebase, FIREBASE_URL, $rootScope) {
		
		function setCurrentUser (id) {
			$rootScope.currentUser = User.findById(id);
		}
		
		var ref = new Firebase(FIREBASE_URL+'users');
		
		var users = $firebase(ref);
		
		var User = {
			create: function (authUser, id) {
				users[id] = {
					id: authUser.id,
					email: authUser.email,
					$priority: authUser.uid
				};
				
				users.$save(id);
			},
			findById: function (id) {
				if (id) {
					return users.$child(id);
				}
			},
			getCurrent: function () {
				return $rootScope.currentUser;
			},
			signedIn: function () {
				return $rootScope.currentUser !== undefined;
			}
		};
		
		$rootScope.$on('$firebaseSimpleLogin:login', function(e, authUser) {
			var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));
			query.$on('loaded', function() {
				setCurrentUser(query.$getIndex()[0]);
			});
		});
		
		$rootScope.$on('$firebaseSimpleLogin:logout', function() {
			delete $rootScope.currentUser;
		});
		
		return User;
	});

