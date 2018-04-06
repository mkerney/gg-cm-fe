angular.module('conciergeMade').filter('numberToDay', function() {
  return function(input) {
    if (!input) {
      return;
    }
    if (input === 0) {
      return 'Sun';
    } else if (input === 1) {
      return 'Mon';
    } else if (input === 2) {
      return 'Tue';
    } else if (input === 3) {
      return 'Wed';
    } else if (input === 4) {
      return 'Thu';
    } else if (input === 5) {
      return 'Fri';
    } else if (input === 6) {
      return 'Sat';
    }
  };
});