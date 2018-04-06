var app = angular.module('conciergeMade', ['ui.router', 'ui.bootstrap', 'ngMap', 'rzModule', 'ngAnimate', 'smoothScroll', 'wu.masonry', 'ngCookies']);

angular.module('conciergeMade')
.run(function($http, $rootScope, $cookies) {
  $http.get('/__/env.json')
  .then(function(response) {
    $rootScope.apiUrl = response.data.apiUrl;
    $rootScope.googleMapsApiKey = response.data.googleMapsApiKey;
    $rootScope.currentLocationLat = 40.7589;
    $rootScope.currentLocationLng = 73.9851;
  })
  .then(function(){
    if ($cookies.get('userId') === undefined){
      console.log($rootScope.apiUrl + '/users')
      $http.get($rootScope.apiUrl + '/users')
      .then(function(dbUsers){
        if (dbUsers.data.length === 0){
          $http.post($rootScope.apiUrl + '/users', {"email": "shamoon@develop.io", "username": "shamoons", "password": "password", "firstName": "Shammon", "lastName": "Siddiqui", "type": "Conceirge"})
          .then(function(dbUser){
            $cookies.put('userId', dbUser._id) 
          })
        }else {
          $cookies.put('userId', dbUsers.data[0]._id) 
        }
      })
    }
  })
})