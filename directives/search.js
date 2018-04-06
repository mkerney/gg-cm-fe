angular.module('conciergeMade').directive('search', function() {
  return {
    restrict: 'A',
    templateUrl: '/views/templates/search.html'
  };
})
.directive('searchFeatures', function() {
  return {
    restrict: 'A',
    templateUrl: '/views/templates/search-features.html'
  };
})
.directive('searchDistance', function() {
  return {
    restrict: 'A',
    templateUrl: '/views/templates/search-distance.html'
  };
});