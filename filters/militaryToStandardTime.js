angular.module('conciergeMade').filter('militaryToStandardTime', function() {
  return function(input) {
    var hours, inputStr, minutes;
    if (!input) {
      return;
    }
    inputStr = input.toString();
    if (inputStr.length > 3) {
      minutes = inputStr.slice(2, 4);
      hours = inputStr.slice(0, 2);
      if (hours > 12) {
        hours -= 12;
        minutes += ' pm';
      } else if (hours === '12') {
        minutes += ' pm';
      } else {
        minutes += ' am';
      }
    } else {
      hours = inputStr.slice(0, 1);
      if (hours === '0') {
        hours = '12';
        minutes = ' 00am';
      } else {
        minutes = inputStr.slice(1, 3) + ' am';
      }
    }
    return hours + ':' + minutes;
  };
});