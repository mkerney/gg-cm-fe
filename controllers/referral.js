angular.module('conciergeMade').controller('ReferralController', function($rootScope, $scope, $http, $state, $stateParams, $timeout, $window, $cookies) {
  $scope.googleMapsUrl='https://maps.googleapis.com/maps/api/js?key='+ $rootScope.googleMapsApiKey;
  $scope.travelMode = 'DRIVING';
  $scope.createInit = function(){
    $scope.dateOptions = {
      minDate: new Date()
    };
    $scope.today = new Date();
    $scope.popup1 = {
      opened: false
    };
    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };
    var req = {
      method: 'GET',
      url: $rootScope.apiUrl + '/venues/' + $stateParams.venue_id,
      headers: {}
    };
    $http(req)
    .then(function (res) {
      $scope.venue = res.data;
      $scope.referral={};
      $scope.referral.date = new Date();
      $scope.referral.reservationTimeAmOrPm='AM';
      $scope.calculateOpenTimes();
    },
    function (err) {
      console.log(err);
    });
  };

  $scope.printReferral = function(){
    window.print();
  };

  $scope.successInit = function(){
    if ($stateParams.sent === 'true'){
      $scope.status='sent';
    }else{
      $scope.status='saved';
    }
  };

  $scope.sendReferral = function(){
    if($scope.sendMethodEmail){
      $http.post($rootScope.apiUrl + '/referrals/email', {email:$scope.email, emailBody:$scope.referral.body, referralId:$stateParams.id, subject:$scope.subjectLineForEmail});
    }
    if($scope.sendMethodSMS){
      $http.post($rootScope.apiUrl + '/referrals/sms', {smsNumber:$scope.smsNumber, smsBody:$scope.referral.body, referralId:$stateParams.id})
      .then(function (res) {
        if (res.data !== 'OK'){
          $scope.errMessage = res.data.message;
        }else{
          $state.go('referral.success', {sent:true});
        }
      });
    }
  };

  $scope.validateNumbers = function(number){
    var regexExp = /^\+?\d+$/;
    if (number === '' || number === '+' || regexExp.test(number) ) {
      $scope.numberValidate=true;
    }
    else{
      $scope.numberValidate=false;
    }
  };

  $scope.calculateOpenTimes = function(){
    if($scope.referral.date){
      $scope.amHours = [];
      $scope.pmHours = [];
      $scope.notOpeninAm = false;
      $scope.closedAllDay = false;
      $scope.notOpeninPm = false;
      var amHours = ['0000', '0030', '0100', '0130', '0200', '0230', '0300', '0330', '0400', '0430', '0500', '0530', '0600', '0630', '0700', '0730', '0800', '0830', '0900', '0930', '1000', '1030', '1100', '1130'];
      var pmHours = ['1200', '1230', '1300', '1330', '1400', '1430', '1500', '1530', '1600', '1630', '1700', '1730', '1800', '1830', '1900', '1930', '2000', '2030', '2100', '2130', '2200', '2230', '2300', '2330'];
      $scope.referral.reservationTimeAmOrPm = 'AM';
      var day = $scope.referral.date.getDay();
      var dateHours = _.filter($scope.venue.storeHours, function (dayHours) {
        return dayHours.open.day === day;
      });
      if (dateHours.length === 0){
        $scope.closedAllDay = true;
        return;
      }
      dateHours.forEach(function(hourObj){
        _.filter(amHours, function (hour) {
          if(hour > hourObj.close.time || hour < hourObj.open.time){
            return false;
          }else{
            $scope.amHours.push(hour);
          }
        });
        _.filter(pmHours, function (hour) {
          if(hour > hourObj.close.time || hour < hourObj.open.time){
            return false;
          }else{
            $scope.pmHours.push(hour);
          }
        });
      });
      if ($scope.amHours.length === 0){
        $scope.notOpeninAm = true;
      }else if ($scope.pmHours.length === 0) {
        $scope.notOpeninPm = true;
      }
    }
  };

  $scope.calculateOpenTimeReferral = function (referral) {
    var venue = referral.venueId;
    var date = new Date(referral.date);
    var day = date.getDay();
    $scope.daysHours = _.filter(venue.storeHours, function (dayHours) {
      return dayHours.open.day === day;
    });
  };

  $scope.changeTravelMode = function(mode){
    $scope.travelMode = mode;
  };

  $scope.getReferralInfo = function(){
    var req = {
      method: 'GET',
      url: $rootScope.apiUrl + '/referrals/' + $stateParams.id,
      headers: {
        'Authorization': ''
      },
    };
    return $http(req)
    .then(function(res){
      $scope.referral = res.data;
      $scope.calculateOpenTimeReferral($scope.referral);
    },
    function(err){
      console.log(err);
    });
  };

  $scope.printInit = function(){
    $scope.getReferralInfo()
    .then(function(){
      // $timeout(function(){
      //   window.print();
      // }, 2500);
    },
    function(err){
      console.log(err);
    });
  };

  $scope.sendInit = function(){
    $scope.sendMethodEmail = false;
    $scope.sendMethodSMS = false;
    $scope.getReferralInfo()
    .then(function(){
      $scope.referral.subjectLineForEmail = 'Referral for ' + $scope.referral.venueId.name + ' Restaurant';
      $scope.referral.body = 'Dear Guest,\nAttached to this message is the referral link.';
    },
    function(err){
      console.log(err);
    });
  };

  $scope.postReferral = function(itineraryId){
    var req = {
      method: 'POST',
      url: $rootScope.apiUrl + '/referrals/',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imptb25hNzg5IiwiaWF0IjoxNDc1NjgwNTQxLCJleHAiOjE0NzU3NjY5NDF9.LlkyaZPaSnwQP4jgpEAO1jm4gUr4Hk2SJ5K_lhNQGMI'
      },
      data: $scope.referral
    };
    $http(req)
    .then(function(res){
      var req = {
        method: 'DELETE',
        url: $rootScope.apiUrl + '/itineraries/' + itineraryId,
        headers: {
          'Authorization': ''
        }
      };
      $http(req)
      .then(function(){
        $state.go('referral.detail', {id: res.data._id});
        $rootScope.$broadcast('update-itinerary-icon');
      });
    },
    function(err){
      console.log('err');
      console.log(err);
    });
  };

  $scope.addReferral = function(){
    if ($scope.referral.reservationTime){
      $scope.referral.reservationTime = $scope.referral.reservationTime + ' ' + $scope.referral.reservationTimeAmOrPm;
    }
    $scope.referral.venueId = $stateParams.venue_id;

    if($stateParams.itineraryReferral === 'true'){
      var userId = $cookies.get('userId');
      var req = {
        method: 'GET',
        url: $rootScope.apiUrl + '/itineraries/user/' + userId
      };
      $http(req)
      .then(function (res) {
        if(res.data){
          var itineraryId = res.data._id;
          $scope.stopList = res.data.plan;
          $scope.referral.placesOfInterest = [];
          $scope.stopList.forEach(function(stop){
            if (stop.mainDestination !== true){
              $scope.referral.placesOfInterest.push(stop.venueId._id);
            }
          });
          $scope.postReferral(itineraryId);
        }
      },
      function (err) {
        console.log(err);
      });
    }else{
      $scope.postReferral();
    }

  };

  $scope.findReferralHeight = function () {
    $timeout(function () {
      $scope.referralFormHeight = $window.innerHeight - 50;
    }, 100);
  };

  $scope.findReferralHeight();
  angular.element($window).bind('resize', function () {
    $scope.findReferralHeight();
  });

});
