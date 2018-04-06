angular.module('conciergeMade').controller('NavController', function($scope, $state, $rootScope, $stateParams, $http, $cookies) {
  $scope.printView = false;

  evaluatePrintView($state.current.name);
  $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    //jshint unused:false
    evaluatePrintView(toState.name);
    evaluateWebview($stateParams);
  });

  getItineraryStopList();

  $scope.$on('venue-added-to-itinerary', function () {
    getItineraryStopList();
  });

   $scope.$on('update-itinerary-icon', function () {
    getItineraryStopList();
  });

  function getItineraryStopList(){
    var userId = $cookies.get('userId');
    var req = {
      method: 'GET',
      url: $rootScope.apiUrl + '/itineraries/user/' + userId
    };
    $http(req)
    .then(function (res) {
      if(res.data){
        $scope.itineraryId = res.data._id;
        $scope.stopList = res.data.plan;
        $scope.itineraryStopNumber = res.data.plan.length;
      }else{
        $scope.itineraryStopNumber = 0;
      }
    },
    function (err) {
      console.log(err);
    });
  }


  function evaluatePrintView(stateName) {
    if(stateName === 'referral.print') {
      $scope.printView = true;
    } else {
      $scope.printView = false;
    }
  }

  function evaluateWebview($stateParams){
    if ($stateParams.webview === 'true'){
      $scope.webview = true;
    }
  }

  $scope.changeToMainDestination = function(stop, stopList, itineraryId){
    if (stop.mainDestination !== true){
      stopList.forEach(function(stop){
        stop.mainDestination = false;
      });
      stop.mainDestination = true;
    }
    var req = {
      method: 'POST',
      url: $rootScope.apiUrl + '/itineraries/' + itineraryId,
      data: { 
        'plan': stopList
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

  $scope.removeDestination = function(stop, stopList, itineraryId){
    var isMainDestination;
    if (stop.mainDestination === true){
      isMainDestination = true;
    }else{
      isMainDestination = false;
    }
    stopList = _.filter(stopList, function(oneStop){
      if (oneStop._id === stop._id){
        return false;
      }else{
        return true;
      }
    });
    if (isMainDestination === true && stopList.length > 0){
      stopList[0].mainDestination = true;
    }
    var req = {
      method: 'POST',
      url: $rootScope.apiUrl + '/itineraries/' + itineraryId,
      data: { 
        'plan': stopList
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

  $scope.createItineraryReferral = function(stopList){
    $scope.dropdownIsOpen = false;
    var mainDestination = _.filter(stopList, function(stop){
      if(stop.mainDestination === true){
        return true;
      }
    });
    $state.go('referral.create', {venue_id: mainDestination[0].venueId._id, itineraryReferral: true});
  };
});
