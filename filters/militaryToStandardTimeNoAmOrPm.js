angular.module('conciergeMade').filter('militaryToStandardTimeNoAmOrPm', function() {
  return function(input) {
    var hours, inputStr, minutes;
    if (!input) {
      return;
    }
    inputStr = input.toString();
    if (inputStr.length > 3) {
      minutes = inputStr.slice(2, 4);
      hours = inputStr.slice(0, 2);
      if (hours === '00'){
        hours = '12';
      }
      else if (hours > 12) {
        hours -= 12;
      }
    } else {
      hours = inputStr.slice(0, 1);
      if (hours === '0') {
        hours = '12';
        minutes = ' 00';
      }
    }
    return hours + ':' + minutes;
  };
});