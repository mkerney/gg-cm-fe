angular.module('conciergeMade').directive('selectionButtons', function() {
  return {
    restrict: 'A',
    scope: {
      selections: '=selections'
    },
    template: '<div class="row-fluid text-center"><ul class="nav nav-pills"><li role="presentation" ng-repeat="selection in selections"><a>{{selection.attribute}}</a></li></ul></div>'
  };
});