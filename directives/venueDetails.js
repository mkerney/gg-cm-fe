angular.module('conciergeMade')
.directive('venueDetails', function() {
  return {
    restrict: 'A',
    scope: {
      detailsView: '=detailsView',
      venue: '=venue'
    },
    templateUrl: '/views/templates/venue.html'
  };
});