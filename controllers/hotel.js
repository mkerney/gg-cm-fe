angular.module('conciergeMade').controller('HotelController', function($scope, $stateParams, $http, $rootScope) {
  $scope.hotelDetailsInit = function(){
    $scope.detail = true;
    var req = {
      method: 'GET',
      url: $rootScope.apiUrl + '/hotels/' + $stateParams.hotel_id,
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imptb25hNzg5IiwiaWF0IjoxNDc1NjgwNTQxLCJleHAiOjE0NzU3NjY5NDF9.LlkyaZPaSnwQP4jgpEAO1jm4gUr4Hk2SJ5K_lhNQGMI',
        'Content-Type': undefined
      }
    };
    $scope.hotel = {};
    $http(req)
    .then(function(res){
      $scope.hotel = res.data;
    }, 
    function(err){
      console.log(err);
    });
  };
});