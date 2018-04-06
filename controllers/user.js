angular.module('conciergeMade').controller('UserController', function($scope, $http, $stateParams, $rootScope) {
  var req = {
    method: 'GET',
    url: $rootScope.apiUrl + '/users/' + $stateParams.user_id,
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imptb25hNzg5IiwiaWF0IjoxNDc1NjgwNTQxLCJleHAiOjE0NzU3NjY5NDF9.LlkyaZPaSnwQP4jgpEAO1jm4gUr4Hk2SJ5K_lhNQGMI',
      'Content-Type': undefined
    }
  };
  $scope.user = {};
  $http(req)
  .then(function(res){
    $scope.user.firstName=res.data.firstName;
    $scope.user.lastName=res.data.lastName;
  }, 
  function(err){
    console.log(err);
  });
});
