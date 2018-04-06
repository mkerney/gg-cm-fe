angular.module('conciergeMade').directive('backX', function() {
  return {
    restrict: 'A',
    template: '<a href="javascript:history.back()"><img src="../../images/ic-times.png" alt=""></a>'
  };
});