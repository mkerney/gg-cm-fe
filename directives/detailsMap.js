angular.module('conciergeMade').directive('detailsMap', function() {
  return {
    restrict: 'A',
    scope: {
      venue: '=venue'
    },
    templateUrl: '/views/templates/detailsMap.html',
    controller: function($scope, $rootScope) {
      $scope.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=' + $rootScope.googleMapsApiKey;
      $scope.showPlaceName = function() {
        $rootScope.$broadcast('marker-clicked', $scope.venue);
      };
    }
  };
});