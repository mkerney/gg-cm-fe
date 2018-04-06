angular.module('conciergeMade').directive('backChevron', function() {
  return {
    restrict: 'A',
    template: '<a href="javascript:history.back()"><img src="../../images/back-chevron.png" alt=""></a>'
  };
});