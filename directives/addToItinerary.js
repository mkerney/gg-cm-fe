angular.module('conciergeMade')
.directive('addToItinerary', function() {
  return {
    controller: function($rootScope, $scope, $http, $cookies,$timeout) {
      $scope.addToItinerary = function(venueId, inIterinary){
        if (inIterinary) {
          return;
        }
        var userId = $cookies.get('userId');
        var req = {
          method: 'GET',
          url: $rootScope.apiUrl + '/itineraries/user/' + userId
        };

        $http(req)
        .then(function (res) {
          var newList;
          if(!res.data){
            $scope.startIntinerary(venueId);
          } else {
            if(res.data.plan.length === 0){
              newList= true;
            }else{
              newList= false;
            }
            var itineraryId = res.data._id;
            $scope.addToIntinerary(venueId, itineraryId, newList);
          }
        },
        function (err) {
          console.log(err);
        });
        var element = document.getElementById("badgeAnimate");
        element.classList.add("badge-animate");
        $timeout(function(){
            element.classList.remove("badge-animate");
        }, 1000);
      };

      $scope.startIntinerary = function(venueId) {
        var userId = $cookies.get('userId');
        var req = {
          method: 'POST',
          url: $rootScope.apiUrl + '/itineraries/',
          data: { 
            'userId': userId,
            'plan': [
              {
                'venueId': venueId,
                'mainDestination': true
              }
            ]
          }
        };
        $http(req)
        .then(function () {
          $rootScope.$broadcast('venue-added-to-itinerary', $scope.venue);
        },
        function (err) {
          console.log(err);
        });
      };
      $scope.addToIntinerary = function(venueId, itineraryId, newList) {
        var req = {
          method: 'PUT',
          url: $rootScope.apiUrl + '/itineraries/' + itineraryId,
          data: { 
            'plan': [
              {
                'venueId': venueId,
                'mainDestination': newList
              }
            ]
          }
        };
        $http(req)
        .then(function () {
          $rootScope.$broadcast('venue-added-to-itinerary', $scope.venue);
        },
        function (err) {
          console.log(err);
        });
      };
    }
  };
});