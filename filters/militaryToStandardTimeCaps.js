angular.module('conciergeMade').filter('militaryToStandardTimeCaps', function() {
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
        minutes += 'PM';
      } else if (hours === '12') {
        minutes += 'PM';
      } else {
        minutes += 'PM';
      }
    } else {
      hours = inputStr.slice(0, 1);
      if (hours === '0') {
        hours = '12';
        minutes = ' 00AM';
      } else {
        minutes = inputStr.slice(1, 3) + 'AM';
      }
    }
    return hours + ':' + minutes;
  };
});