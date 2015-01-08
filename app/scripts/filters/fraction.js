'use strict';

/**
 * @ngdoc filter
 * @name sightglasslabelApp.filter:fraction
 * @function
 * @description
 * # fraction
 * Filter in the sightglasslabelApp.
 */
angular.module('sightglasslabelApp')
  .filter('fraction', function () {
    return function (input, units) {
			
			if (input === 0) {
				return '–';
				
			} else if (units === 'standard') {
			
				var wholeNumber = Math.floor(input);
				var decimal = input - wholeNumber;
				
				if (decimal > 0) {
					var f = new Fraction(decimal);
					
					if (wholeNumber > 0) {
						return wholeNumber + '-' + f.numerator + '/' + f.denominator + '"';
					} else {
						return f.numerator + '/' + f.denominator + '"';
					}
				} else {
					return input + '"';
				}
			
			} else if (units === 'metric') {
				return Math.round(input * 10) / 10 + ' cm';
			}
		};
  });
