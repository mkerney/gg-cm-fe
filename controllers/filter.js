angular.module('conciergeMade').controller('FilterController', function ($scope, $rootScope, $http, $timeout, $uibModalInstance, NgMap) {
  $scope.filterInit = function () {
    $scope.fromHotel = true;
    $scope.fromOther = false;
    $scope.country = true;
    $scope.facilities = true;
    $scope.filter = {};
    $scope.filter.priceLevelMin = '1';
    $scope.filter.priceLevelMax = '4';
    $scope.filter.milesAway = 1;
    $scope.filterPage = {};
    $scope.filterPage.main = true;
    $scope.applyFilter();
    $scope.cuisines=['French', 'Italian', 'Chinese', 'Indian'];
    var req = {
      method: 'GET',
      url: $rootScope.apiUrl + '/venueAttributes',
      headers: {
        'Authorization': '',
      }
    };
    $http(req)
    .then(function (res) {
      $scope.featuresFacilities = res.data;
      $scope.featuresFacilities.forEach(function(feature){
        feature.filteringBy = false;
      });
      $scope.featuresAmbiance = [{attribute:'Romantic'},{attribute:'Hipster'},{attribute:'Trendy'},{attribute:'Intimate'},{attribute:'Casual'},{attribute:'Classy'},{attribute:'Touristy'}];
      $scope.featuresAmbiance.forEach(function(feature){
        feature.filteringBy = false;
      });
    },
    function (err) {
      console.log(err);
    });
    // $scope.featuresFacilities=[{name:'Free Wifi'},{name:'Street Parking'},{name:'Valet Parking'},{name:'Waiter Service'}]
    $scope.filter.features = []; 
    $scope.slider1 = {
      value: 6,
      options: {
        floor: 1,
        ceil: 9,
        showSelectionBar: true,
        showTicks: true,
        translate: function(value) {     
          if (value === 1) {
            return '15 min';
          }          
          if (value === 2) {
            return '30 min';
          }          
          if (value === 3) {
            return '45 min';
          }          
          if (value === 4) {
            return '1 hrs.';
          }          
          if (value === 5) {
            return '2 hrs.';
          }          
          if (value === 6) {
            return '3 hrs.';
          }          
          if (value === 7) {
            return '4 hrs.';
          }          
          if (value === 8) {
            return '5 hrs.';
          }          
          if (value === 9) {
            return '> 5 hrs.';
          }
        }
      }
    };
    $scope.slider2 = {
      minValue: 1,
      maxValue: 4,
      options: {
        floor: 1,
        ceil: 4,
        onChange: function() {
          console.log($scope.slider2.minValue + ' ' + $scope.slider2.maxValue);
          $scope.filter.priceLevelMax = $scope.slider2.maxValue;
          $scope.filter.priceLevelMin = $scope.slider2.minValue;
          $scope.applyFilter();
        },
        translate: function(value) {
          if (value === 1){
            return '$';
          }else if (value === 2){
            return '$$';
          }else if (value === 3){
            return '$$$';
          }else if (value === 4){
            return '$$$$';
          }
        }
      }
    };
    $scope.slider3 = {
      value: 6,
      options: {
        floor: 0,
        ceil: 10,
        showSelectionBar: true,
        showTicks: true,
        translate: function(value) {
          if (value === 0) {
            return '<1';
          }
          if (value === 1) {
            return '2';
          }          
          if (value === 2) {
            return '3';
          }          
          if (value === 3) {
            return '3.25';
          }          
          if (value === 4) {
            return '3.5';
          }          
          if (value === 5) {
            return '4';
          }          
          if (value === 6) {
            return '4.5';
          }          
          if (value === 7) {
            return '5';
          }          
          if (value === 8) {
            return '6';
          }          
          if (value === 9) {
            return '7';
          }          
          if (value === 10) {
            return '> 8';
          }
        }
      }
    };
    $scope.slider3 = {
      value: 6,
      options: {
        floor: 0,
        ceil: 10,
        showSelectionBar: true,
        showTicks: true,
        translate: function(value) {
          if (value === 0) {
            return "<1";
          }
          if (value === 1) {
            return "2";
          }          
          if (value === 2) {
            return "3";
          }          
          if (value === 3) {
            return "3.25";
          }          
          if (value === 4) {
            return "3.5";
          }          
          if (value === 5) {
            return "4";
          }          
          if (value === 6) {
            return "4.5";
          }          
          if (value === 7) {
            return "5";
          }          
          if (value === 8) {
            return "6";
          }          
          if (value === 9) {
            return "7";
          }          
          if (value === 10) {
            return "> 8";
          }
        }
      }
    };
    $timeout(function () {
      $scope.$broadcast('rzSliderForceRender');
    });
  };
  $scope.distanceInit = function(){
    NgMap.getMap('distanceFilterMap').then(function (map) {
      $timeout(function () {
        google.maps.event.trigger(map, 'resize');
      }, 1);
    });
  };
  $scope.addMiles = function(){
    $scope.filter.milesAway += 1;
    $scope.applyFilter();
  };
  $scope.subtractMiles = function(){
    if($scope.filter.milesAway !==1){
      $scope.filter.milesAway -= 1;
      $scope.applyFilter();
    }
  };
  $scope.addFeatureToFilterBy = function(feature) {
    if (feature.filteringBy){
      $scope.filter.features.push(feature._id);
    }else{
      $scope.filter.features = _.filter($scope.filter.features, function(featureId){
        if (featureId === feature._id){
          return false;
        }else{
          return true;
        }
      });
    }
  };
  $scope.clearFeaturesFilter = function(){
    $scope.filter.features = [];
    $scope.featuresFacilities.forEach(function(feature){
      feature.filteringBy = false;
    });
    $scope.featuresAmbiance.forEach(function(feature){
      feature.filteringBy = false;
    });
    $scope.applyFilter();
  };
  $scope.applyFilter = function () {
    $scope.filterView =  true;
    $rootScope.$broadcast('filterApplied', $scope.filter);
  };
  $scope.closeModal = function (){
    $uibModalInstance.close();
  };
});