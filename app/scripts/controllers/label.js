'use strict';

/**
 * @ngdoc function
 * @name sightglasslabelApp.controller:LabelCtrl
 * @description
 * # LabelCtrl
 * Controller of the sightglasslabelApp
 */
angular.module('sightglasslabelApp')
	.controller('LabelCtrl', function ($scope, $rootScope, $routeParams, $location, Label) {

		if ($routeParams.labelId && $rootScope.currentUser) { // if label id and current user is set - label is in edit mode
			$scope.labelId = $routeParams.labelId;
			var label = Label.find($scope.labelId);

			if ($rootScope.currentUser.id === label.userId) { // make sure current user is owner of this label
				$scope.name = label.name;
				$scope.units = label.units;
				$scope.measurements = label.measurements;
			} else { // kick them back to home screen if not
				$location.path('/');
			}
		} else if ($routeParams.labelId && !$rootScope.currentUser) { // if label id is set but user isn't logged in kick them to login screen
			$location.path('/login');
		} else { // this is a new label
			$scope.name = 'Untitled Label';
			$scope.measurements = [];
		}

		$scope.label = {};
		$scope.label.name = $scope.name;
		$scope.label.measurements = $scope.measurements;
		
		$scope.$watch('units', function(value) {
			if (value === 'standard') {
				$scope.volumeUnit = 'gal';
				$scope.label.units = $scope.units;
				$scope.measurementMin = 0;
				$scope.measurementMax = 18;
				$scope.measurementStep = 0.03125;
			} else if (value === 'metric') {
				$scope.volumeUnit = 'l';
				$scope.label.units = $scope.units;
				$scope.measurementMin = 0;
				$scope.measurementMax = 45;
				$scope.measurementStep = 0.1;
			}
			
			if (value && $scope.measurements.length === 0) {
				$scope.addMeasurement();
			}
		});
		
		$scope.addMeasurement = function() {
			var nextVolume = ($scope.units === 'standard') ? 1 : 2;
			var previousHeight = 0;
			if ($scope.measurements.length > 0) {
				nextVolume = ($scope.units === 'standard') ? $scope.measurements[$scope.measurements.length-1].volume+1 : $scope.measurements[$scope.measurements.length-1].volume+2;
				previousHeight = $scope.measurements[$scope.measurements.length-1].height;
			}
			$scope.measurements.push({volume:nextVolume, height:previousHeight});
			$scope.saved = false;
		};
		
		var measurementTimer;
		var measurementTimeout;
		
		$scope.increaseMeasurement = function(input) {
			var index = $scope.measurements.indexOf(input);
			
			var incrementMeasurement = function() {
				if ($scope.measurements[index].height >= $scope.measurementMax) {
					$scope.measurements[index].height = $scope.measurementMax;
				} else {
					$scope.measurements[index].height += $scope.measurementStep;
				}
			};
			
			incrementMeasurement();
			
			measurementTimeout = setTimeout(function() {
				measurementTimer = setInterval(function() {
					$scope.$apply(incrementMeasurement());
				}, 50);
			}, 400);

			$scope.saved = false;
		};

		$scope.decreaseMeasurement = function(input) {
			var index = $scope.measurements.indexOf(input);
			
			var decrementMeasurement = function() {
				if ($scope.measurements[index].height <= $scope.measurementMin) {
					$scope.measurements[index].height = $scope.measurementMin;
				} else {
					$scope.measurements[index].height -= $scope.measurementStep;
				}
			};
			
			decrementMeasurement();
			
			measurementTimeout = setTimeout(function() {
				measurementTimer = setInterval(function() {
					$scope.$apply(decrementMeasurement());
				}, 50);
			}, 400);

			$scope.saved = false;
		};
		
		$scope.stopMeasurementTimer = function() {
			clearTimeout(measurementTimeout);
			clearInterval(measurementTimer);
		};

		$scope.removeMeasurement = function() {
			$scope.measurements.pop();
			$scope.saved = false;
		};
		
		$scope.clearMeasurements = function() {
			$scope.measurements = [];
			$scope.units = '';
			$scope.saved = false;
		};

		$scope.saveLabel = function() {

			$scope.saved = false;
			$scope.saving = true;

			if ($scope.labelId) {
				Label.update($scope.label, $scope.labelId).then(function() {
					$scope.saved = true;
					$scope.saving = false;
				});
			} else {
				Label.create($scope.label).then(function(labelId) {
					$scope.labelId = labelId;
					$scope.saved = true;
					$scope.saving = false;
				});
			}
		};

		$scope.pdfLabel = function() {
			var startX = 1;
			var startY = 1;
			var width = 0.375;
			var height = 9;
			var maxHeight = $scope.measurements[$scope.measurements.length-1].height;
			var topBuffer = 0.125;

			var lineWidth = 0.007;
			var lineLength = 0.09375;
			var lineBuffer = 0.03125;

			var cropMarkLength = 0.125;
			var cropMarkBuffer = 0.0625;

			var fontSize = 8;
			var fontSizeUnits = fontSize/72;

			var doc = new jsPDF('p', 'in', 'letter');

			doc.setLineWidth(lineWidth);
			doc.setFontSize(fontSize);

			var cropMarkStartX1 = startX-cropMarkLength-cropMarkBuffer;
			var cropMarkStartX2 = startX-cropMarkBuffer;
			var cropMarkStartX3 = startX+width+cropMarkBuffer;
			var cropMarkStartX4 = startX+width+cropMarkBuffer+cropMarkLength;
			var cropMarkStartX5 = startX*2-cropMarkLength-cropMarkBuffer;
			var cropMarkStartX6 = startX*2-cropMarkBuffer;
			var cropMarkStartX7 = startX*2+width+cropMarkBuffer;
			var cropMarkStartX8 = startX*2+width+cropMarkBuffer+cropMarkLength;
			var cropMarkStartY1 = startY-cropMarkBuffer-cropMarkLength;
			var cropMarkStartY2 = startY-cropMarkBuffer;
			var cropMarkStartY3 = startY+height+cropMarkBuffer;
			var cropMarkStartY4 = startY+height+cropMarkBuffer+cropMarkLength;
			var cropMarkStartY5 = startY+height-maxHeight+height-topBuffer-cropMarkBuffer-cropMarkLength; // second set of top vertical crop marks
			var cropMarkStartY6 = startY+height-maxHeight+height-topBuffer-cropMarkBuffer; // second set of top vertical crop marks

			doc.setDrawColor(192,192,192);

			if (maxHeight < height) {
				doc.line(cropMarkStartX1, startY+height-maxHeight-topBuffer, cropMarkStartX2, startY+height-maxHeight-topBuffer);
				doc.line(cropMarkStartX3, startY+height-maxHeight-topBuffer, cropMarkStartX4, startY+height-maxHeight-topBuffer);
				doc.line(startX, cropMarkStartY1+height-maxHeight-topBuffer, startX, cropMarkStartY2+height-maxHeight-topBuffer);
				doc.line(startX+width, cropMarkStartY1+height-maxHeight-topBuffer, startX+width, cropMarkStartY2+height-maxHeight-topBuffer);
			} else {
				doc.line(cropMarkStartX1, startY, cropMarkStartX2, startY);
				doc.line(cropMarkStartX3, startY, cropMarkStartX4, startY);
				doc.line(startX, cropMarkStartY1, startX, cropMarkStartY2);
				doc.line(startX+width, cropMarkStartY1, startX+width, cropMarkStartY2);
			}

			doc.line(cropMarkStartX1, startY+height, cropMarkStartX2, startY+height);
			doc.line(cropMarkStartX3, startY+height, cropMarkStartX4, startY+height);
			doc.line(startX, cropMarkStartY3, startX, cropMarkStartY4);
			doc.line(startX+width, cropMarkStartY3, startX+width, cropMarkStartY4);

			// draw second set of crop marks
			if (maxHeight >= height) {
				doc.line(cropMarkStartX5, startY+height-maxHeight+height-topBuffer, cropMarkStartX6, startY+height-maxHeight+height-topBuffer);
				doc.line(cropMarkStartX7, startY+height-maxHeight+height-topBuffer, cropMarkStartX8, startY+height-maxHeight+height-topBuffer);
				doc.line(cropMarkStartX5, startY+height, cropMarkStartX6, startY+height);
				doc.line(cropMarkStartX7, startY+height, cropMarkStartX8, startY+height);
				doc.line(startX*2, cropMarkStartY5, startX*2, cropMarkStartY6);
				doc.line(startX*2+width, cropMarkStartY5, startX*2+width, cropMarkStartY6);
				doc.line(startX*2, cropMarkStartY3, startX*2, cropMarkStartY4);
				doc.line(startX*2+width, cropMarkStartY3, startX*2+width, cropMarkStartY4);
			}

			doc.setDrawColor(0,0,0);
			
			var first = true;
			
			for(var i=0; i<$scope.measurements.length; i++) {

				var interval = 0;
				var measurementY = startY+height-$scope.measurements[i].height;
				var measurementX = startX;
				
				if ($scope.measurements[i].height > 0) {
				
					if ($scope.measurements[i].height > height) {
						measurementY += height;
						measurementX = startX*2;
					}
	
					// draw main tick marks
					doc.line(measurementX, measurementY, measurementX+lineLength, measurementY);
	
					// add main volume numbers
					doc.text(measurementX+lineLength+lineBuffer, measurementY+fontSizeUnits/2, $scope.measurements[i].volume.toString());
	
					if ($scope.measurements[i].height === height) {
						measurementY += height;
						measurementX = startX*2;
	
						// draw main tick marks
						doc.line(measurementX, measurementY, measurementX+lineLength, measurementY);
	
						// add main volume numbers
						doc.text(measurementX+lineLength+lineBuffer, measurementY+fontSizeUnits/2, $scope.measurements[i].volume.toString());
					}
					
	
					// draw intervals between main tick marks
					if (i < $scope.measurements.length-1) {
						interval = ($scope.measurements[i+1].height-$scope.measurements[i].height)/4;
	
						for (var ii=1; ii<4; ii++) {
	
							// draw intervals before first tick mark
							if (first) {
								measurementY = startY+height-$scope.measurements[i].height+interval;
								
								while (measurementY < startY+height) {
									doc.line(startX, measurementY, startX+lineLength/2, measurementY);
									measurementY += interval;
								}
								
								first = false;
							}
	
							measurementY = startY+height-$scope.measurements[i].height-interval*ii;
	
							if (measurementY < startY) {
								measurementY += height;
								measurementX = startX*2;
							}
	
							doc.line(measurementX, measurementY, measurementX+lineLength/2, measurementY);
	
							if (measurementY === startY) {
								measurementY += height;
								measurementX = startX*2;
	
								doc.line(measurementX, measurementY, measurementX+lineLength/2, measurementY);
							}
						}
					}
				}
			}

			doc.save('my-label.pdf');
		};

});
