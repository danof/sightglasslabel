'use strict';

/**
 * @ngdoc service
 * @name sightglasslabelApp.label
 * @description
 * # Label
 * Factory in the sightglasslabelApp.
 */
angular.module('sightglasslabelApp')
	.factory('Label', function ($firebase, FIREBASE_URL, User) {
		var ref = new Firebase(FIREBASE_URL + 'labels');
		
		var labels = $firebase(ref);
		
		var Label = {
			all: labels,
			create: function (label) {
				if (User.signedIn()) {
					var user = User.getCurrent();
					
					label.userId = user.id;
					label.timestamp = Firebase.ServerValue.TIMESTAMP;
					
					return labels.$add(label).then(function(ref) {
						var labelId = ref.name();
						
						user.$child('labels').$child(labelId).$set(labelId);
						
						return labelId;
					});
				}
			},
			update: function (label, labelId) {
				return labels.$child(labelId).$update({measurements: label.measurements, name: label.name, timestamp: Firebase.ServerValue.TIMESTAMP});
			},
			find: function (labelId) {
				return labels.$child(labelId);
			},
			delete: function (labelId) {
				if (User.signedIn()) {
					var label = Label.find(labelId);
					
					label.$on('loaded', function() {
						var user = User.findById(label.userId);
						
						labels.$remove(labelId).then(function() {
							user.$child('labels').$remove(labelId);
						});
					});
				}
			}
		};
		
		return Label;
	});

