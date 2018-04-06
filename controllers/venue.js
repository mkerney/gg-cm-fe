angular.module('conciergeMade').controller('VenueController', function ($stateParams, $scope, $state, $http, $rootScope, $window, smoothScroll, NgMap, $timeout, $uibModal, $cookies) {
  $scope.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=' + $rootScope.googleMapsApiKey;
  $scope.$on('marker-clicked', function () {
    $scope.venue.showPlaceName = !$scope.venue.showPlaceName;
  });
  $scope.openFilterModal = function(){
    var filterModal = $uibModal.open({
      size: 'lg',
      controller: 'FilterController',
      windowTemplateUrl: '/node_modules/angular-ui-bootstrap/template/modal/window.html',
      templateUrl: '/views/templates/filter.html',
      resolve: {
        items: function () {
          return $scope.venues;
        }
      }
    });

    filterModal.opened.then(function () {
      $scope.activeClass = true;
    });
    filterModal.closed.then(function () {
      $scope.activeClass = false;
    });
  };
  $scope.showPlaceNameAndHighlightFeed = function (venue) {
    _.each($scope.venues, function (venue) {
      venue.showPlaceName = false;
    });
    venue.showPlaceName = !venue.showPlaceName;
    var venueElement = document.getElementById('venue_' + venue._id);
    smoothScroll(venueElement, {
      containerId: 'tabletLeft',
      offset: 250,
      easing: 'easeInQuad'
    });

  };
  $scope.calculateOpenNow = function (venue) {
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours().toString();
    var minutes = date.getMinutes();
    if (minutes < 10){
      minutes = '0' + minutes.toString();
    }else{
      minutes = minutes.toString();
    }
    var fullTime = hour + minutes;
    var todaysHours = _.filter(venue.storeHours, function (dayHours) {
      return dayHours.open.day === day;
    });
    var openNowArr = _.filter(todaysHours, function (todaysHour) {
      return parseInt(todaysHour.open.time) < parseInt(fullTime) && parseInt(todaysHour.close.time) > parseInt(fullTime);
    });
    var nextOpenToday = _.filter(todaysHours, function (todaysHour) {
      return parseInt(todaysHour.open.time) > parseInt(fullTime);
    });
    if (openNowArr.length > 0) {
      venue.openNow = true;
      venue.openHourNow = openNowArr[0].open.time;
      venue.closeHourNow = openNowArr[0].close.time;
    } else {
      venue.openNow = false;
      if (nextOpenToday.length > 0) {
        venue.nextOpenDay = ' Reopens Today at ';
        venue.nextOpenTime = nextOpenToday[0].open.time;
      }
    }
  };

  $scope.feedInit = function () {
    NgMap.getMap('iPadFeedMap').then(function (map) {
      $timeout(function () {
        google.maps.event.trigger(map, 'resize');
      }, 1);
    })
    .catch(function (err) {
      console.log(err);
    });
    $scope.venues = [];
    $scope.priceLevelMin = $stateParams.priceLevelMin || 1;
    $scope.priceLevelMax = $stateParams.priceLevelMax || 4;
    if ($stateParams.favorites === 'true') {
      $scope.favoritesView = true;
    } else {
      $scope.favoritesView = false;
    }
    // if ($stateParams.filter === 'true') {
    //   $scope.filterView = true;
    // } else {
    //   $scope.filterView = false;
    // }
    $scope.getVenues();
  };

  $scope.$on('filterApplied', function (event, options) {
    //jshint unused:false
    $scope.getVenues(options);
  });

  $scope.getVenues = function(filterOptions) {
    var filterQuery = '?';
    if (filterOptions){
      if (filterOptions.priceLevelMin !== '0') {
        filterQuery += 'priceMin=' + filterOptions.priceLevelMin + '&';
      }
      if (filterOptions.priceLevelMax !== '0') {
        filterQuery += 'priceMax=' + filterOptions.priceLevelMax + '&';
      }
      if (filterOptions.milesAway){
        filterQuery += 'distance=' + filterOptions.milesAway + '&';
      }
      if (filterOptions.features){
        if (filterOptions.features.length > 0){
          filterQuery += 'features=';
          filterQuery += filterOptions.features;
        }
      }
    }
    var req = {
      method: 'GET',
      url: $rootScope.apiUrl + '/venues' + filterQuery,
      headers: {
        'Authorization': '',
        'Content-Type': undefined
      }
    };
    $http(req)
    .then(function (res) {
      $scope.venues = res.data;
      $scope.venues.forEach(function (value) {
        $scope.calculateOpenNow(value);
        $scope.venue = value;
        $scope.reviews = value.reviews;
        $scope.feedView = true;
        $scope.totalScore = 0;
        value.reviews.forEach($scope.calculatePercentScore);
      });
      var userId = $cookies.get('userId');
      var req = {
        method: 'GET',
        url: $rootScope.apiUrl + '/itineraries/user/' + userId,
        headers: {
          'Authorization': '',
        }
      };
      $http(req)
      .then(function (res) {
        if(res.data){
          $scope.stopList = res.data.plan;
          $scope.venues.forEach(function(venue){
            $scope.stopList.forEach(function(stop){
              if (stop.venueId._id === venue._id){
                venue.inIterinary = true;
              }
            });
          });
        }
      },
      function (err) {
        console.log(err);
      });
    },
    function (err) {
      console.log(err);
    });
  };

  // $scope.filter = function () {
  //   return 'venue.name' === 'Johnston - Homenick Restaurant';
  // };

  $scope.detailsInit = function () {
    $scope.overview = true;
    $scope.detailsView = true;
    var req = {
      method: 'GET',
      url: $rootScope.apiUrl + '/venues/' + $stateParams.venue_id,
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imptb25hNzg5IiwiaWF0IjoxNDc1MTU0Mjk3LCJleHAiOjE0NzUyNDA2OTd9.WqB3fBWpFxG18UaPVlpmyKRvX0TlC75hsvEKO4Oczj4',
        'Content-Type': undefined
      }
    };
    $http(req)
    .then(function (res) {
      $scope.venue = res.data;
      $scope.venue.showPlaceName = false;
      $scope.reviews = res.data.reviews;
      $scope.totalScore = 0;
      $scope.reviews.forEach($scope.calculatePercentScore); 
    },
    function (err) {
      console.log(err);
    });
  };


  $scope.calculatePercentScore = function(review) {
    if (review.googleUserName){
      review.percentScore = (parseInt(review.overall) * 10);
    }else{
      review.percentScore = ((parseInt(review.overall) + parseInt(review.ambiance) + parseInt(review.food) + parseInt(review.value) + parseInt(review.service))/5)*10;
    }
    $scope.totalScore += review.percentScore; 
    $scope.venue.averageScore = ($scope.totalScore/$scope.reviews.length).toFixed(0);
  }; 

  $scope.reviewInit = function () {
    $scope.tagSelection = false;
    var req = {
      method: 'GET',
      url: $rootScope.apiUrl + '/venues/' + $stateParams.venue_id,
      headers: {
        'Authorization': '',
      }
    };
    $http(req)
    .then(function (res) {
      $scope.venue = res.data;
      var req = {
        method: 'GET',
        url: $rootScope.apiUrl + '/venueTypes/' + $scope.venue.venueTypeId._id,
        headers: {
          'Authorization': '',
        }
      };
      $http(req)
      .then(function (res) {
        $scope.features = res.data.venueAttributeId;
      },
      function (err) {
        console.log(err);
      });
    },
    function (err) {
      console.log(err);
    });
    $scope.slider1 = {
      options: {
        floor: 1,
        ceil: 10,
        step: 1, 
        showSelectionBar: true,
        showTicks: true,
        translate: function(value) {
          if(value === 1) {
              return "<div class=\"rz-tooltip\"><div class=\"b-poor text-center\">Terrible</div><div class=\"b-poor-1 text-center\">1</div></div>";
          }
          if(value === 2) {
              return "<div class=\"rz-tooltip\"><div class=\"poor text-center\">Far below average</div><div class=\"poor-2 text-center\">2</div></div>";
          }
          if(value === 3) {
              return "<div class=\"rz-tooltip\"><div class=\"above-poor text-center\">Well below average</div><div class=\"text-center\">3</div></div>";
          }
          if(value === 4) {
              return '<div class=\'rz-tooltip\'><div class=\'b-average text-center\'>Below Average</div><div class=\'text-center\'>4</div></div>';
          }
          if(value === 5) {
              return '<div class=\'rz-tooltip\'><div class=\'average text-center\'>Average</div><div class=\'text-center\'>5</div></div>';
          }
          if(value === 6) {
              return '<div class=\'rz-tooltip\'><div class=\'a-average text-center\'>Above Average</div><div class=\'text-center\'>6</div></div>';
          }
          if(value === 7) {
              return "<div class=\"rz-tooltip\"><div class=\"f-a-average text-center\">Well Above Average</div><div class=\"text-center\">7</div></div>";
          }
          if(value === 8) {
              return "<div class=\"rz-tooltip\"><div class=\"good text-center\">Far Above Average</div><div class=\"text-center\">8</div></div>";
          }
          if(value === 9) {
              return "<div class=\"rz-tooltip\"><div class=\"better text-center\">Great</div><div class=\"text-center\">9</div></div>";
          }
          if(value === 10) {
              return "<div class=\"rz-tooltip\"><div class=\"excellent text-center\">Outstanding</div><div class=\"excellent-10 text-center\">10</div></div>";
          }
          }
          }
          };
    $scope.slider2 = {
      options: {
        floor: 1,
        ceil: 10,
        step: 1, 
        showSelectionBar: true,
        showTicks: true,
        translate: function(value) {
          if(value === 1) {
              return "<div class=\"rz-tooltip\"><div class=\"b-poor text-center\">Terrible</div><div class=\"b-poor-1 text-center\">1</div></div>";
          }
          if(value === 2) {
              return "<div class=\"rz-tooltip\"><div class=\"poor text-center\">Far below average</div><div class=\"poor-2 text-center\">2</div></div>";
          }
          if(value === 3) {
              return "<div class=\"rz-tooltip\"><div class=\"above-poor text-center\">Well below average</div><div class=\"text-center\">3</div></div>";
          }
          if(value === 4) {
              return "<div class=\"rz-tooltip\"><div class=\"b-average text-center\">Below Average</div><div class=\"text-center\">4</div></div>";
          }
          if(value === 5) {
              return "<div class=\"rz-tooltip\"><div class=\"average text-center\">Average</div><div class=\"text-center\">5</div></div>";
          }
          if(value === 6) {
              return "<div class=\"rz-tooltip\"><div class=\"a-average text-center\">Above Average</div><div class=\"text-center\">6</div></div>";
          }
          if(value === 7) {
              return "<div class=\"rz-tooltip\"><div class=\"f-a-average text-center\">Well Above Average</div><div class=\"text-center\">7</div></div>";
          }
          if(value === 8) {
              return "<div class=\"rz-tooltip\"><div class=\"good text-center\">Far Above Average</div><div class=\"text-center\">8</div></div>";
          }
          if(value === 9) {
              return "<div class=\"rz-tooltip\"><div class=\"better text-center\">Great</div><div class=\"text-center\">9</div></div>";
          }
          if(value === 10) {
              return "<div class=\"rz-tooltip\"><div class=\"excellent text-center\">Outstanding</div><div class=\"excellent-10 text-center\">10</div></div>";
          }
        }
      }
    };
    $scope.slider3 = {
      options: {
        floor: 1,
        ceil: 10,
        step: 1, 
        showSelectionBar: true,
        showTicks: true,
        translate: function(value) {
          if(value === 1) {
              return "<div class=\"rz-tooltip\"><div class=\"b-poor text-center\">Terrible</div><div class=\"b-poor-1 text-center\">1</div></div>";
          }
          if(value === 2) {
              return "<div class=\"rz-tooltip\"><div class=\"poor text-center\">Far below average</div><div class=\"poor-2 text-center\">2</div></div>";
          }
          if(value === 3) {
              return "<div class=\"rz-tooltip\"><div class=\"above-poor text-center\">Well below average</div><div class=\"text-center\">3</div></div>";
          }
          if(value === 4) {
              return '<div class=\'rz-tooltip\'><div class=\'b-average text-center\'>Below Average</div><div class=\'text-center\'>4</div></div>';
          }
          if(value === 5) {
              return '<div class=\'rz-tooltip\'><div class=\'average text-center\'>Average</div><div class=\'text-center\'>5</div></div>';
          }
          if(value === 6) {
              return '<div class=\'rz-tooltip\'><div class=\'a-average text-center\'>Above Average</div><div class=\'text-center\'>6</div></div>';
          }
          if(value === 7) {
              return "<div class=\"rz-tooltip\"><div class=\"f-a-average text-center\">Well Above Average</div><div class=\"text-center\">7</div></div>";
          }
          if(value === 8) {
              return "<div class=\"rz-tooltip\"><div class=\"good text-center\">Far Above Average</div><div class=\"text-center\">8</div></div>";
          }
          if(value === 9) {
              return "<div class=\"rz-tooltip\"><div class=\"better text-center\">Great</div><div class=\"text-center\">9</div></div>";
          }
          if(value === 10) {
              return "<div class=\"rz-tooltip\"><div class=\"excellent text-center\">Outstanding</div><div class=\"excellent-10 text-center\">10</div></div>";
          }
        }
      }
    };
    $scope.slider4 = {
      options: {
        floor: 1,
        ceil: 10,
        step: 1, 
        showSelectionBar: true,
        showTicks: true,
        translate: function(value) {
          if(value === 1) {
              return "<div class=\"rz-tooltip\"><div class=\"b-poor text-center\">Terrible</div><div class=\"b-poor-1 text-center\">1</div></div>";
          }
          if(value === 2) {
              return "<div class=\"rz-tooltip\"><div class=\"poor text-center\">Far below average</div><div class=\"poor-2 text-center\">2</div></div>";
          }
          if(value === 3) {
              return "<div class=\"rz-tooltip\"><div class=\"above-poor text-center\">Well below average</div><div class=\"text-center\">3</div></div>";
          }
          if(value === 4) {
              return '<div class=\'rz-tooltip\'><div class=\'b-average text-center\'>Below Average</div><div class=\'text-center\'>4</div></div>';
          }
          if(value === 5) {
              return '<div class=\'rz-tooltip\'><div class=\'average text-center\'>Average</div><div class=\'text-center\'>5</div></div>';
          }
          if(value === 6) {
              return '<div class=\'rz-tooltip\'><div class=\'a-average text-center\'>Above Average</div><div class=\'text-center\'>6</div></div>';
          }
          if(value === 7) {
              return "<div class=\"rz-tooltip\"><div class=\"f-a-average text-center\">Well Above Average</div><div class=\"text-center\">7</div></div>";
          }
          if(value === 8) {
              return "<div class=\"rz-tooltip\"><div class=\"good text-center\">Far Above Average</div><div class=\"text-center\">8</div></div>";
          }
          if(value === 9) {
              return "<div class=\"rz-tooltip\"><div class=\"better text-center\">Great</div><div class=\"text-center\">9</div></div>";
          }
          if(value === 10) {
              return "<div class=\"rz-tooltip\"><div class=\"excellent text-center\">Outstanding</div><div class=\"excellent-10 text-center\">10</div></div>";
          }
        }
      }
    };
    $scope.slider5 = {
      options: {
        floor: 1,
        ceil: 10,
        step: 1, 
        showSelectionBar: true,
        showTicks: true,
        translate: function(value) {
          if(value === 1) {
              return "<div class=\"rz-tooltip\"><div class=\"b-poor text-center\">Terrible</div><div class=\"b-poor-1 text-center\">1</div></div>";
          }
          if(value === 2) {
              return "<div class=\"rz-tooltip\"><div class=\"poor text-center\">Far below average</div><div class=\"poor-2 text-center\">2</div></div>";
          }
          if(value === 3) {
              return "<div class=\"rz-tooltip\"><div class=\"above-poor text-center\">Well below average</div><div class=\"text-center\">3</div></div>";
          }
          if(value === 4) {
              return "<div class=\"rz-tooltip\"><div class=\"b-average text-center\">Below Average</div><div class=\"text-center\">4</div></div>";
          }
          if(value === 5) {
              return "<div class=\"rz-tooltip\"><div class=\"average text-center\">Average</div><div class=\"text-center\">5</div></div>";
          }
          if(value === 6) {
              return "<div class=\"rz-tooltip\"><div class=\"a-average text-center\">Above Average</div><div class=\"text-center\">6</div></div>";
          }
          if(value === 7) {
              return "<div class=\"rz-tooltip\"><div class=\"f-a-average text-center\">Well Above Average</div><div class=\"text-center\">7</div></div>";
          }
          if(value === 8) {
              return "<div class=\"rz-tooltip\"><div class=\"good text-center\">Far Above Average</div><div class=\"text-center\">8</div></div>";
          }
          if(value === 9) {
              return "<div class=\"rz-tooltip\"><div class=\"better text-center\">Great</div><div class=\"text-center\">9</div></div>";
          }
          if(value === 10) {
              return "<div class=\"rz-tooltip\"><div class=\"excellent text-center\">Outstanding</div><div class=\"excellent-10 text-center\">10</div></div>";
          }
        }
      }
    };
    $scope.review = {
      food: 8,
      service: 8,
      value: 8,
      ambiance: 8,
      overall: 8,
      venueId: $stateParams.venue_id
    };
  };
  $scope.findReviewHeight = function () {
    $timeout(function () {
      $scope.reviewFormHeight = $window.innerHeight - 50;
    }, 100);
  };
  $scope.findReviewHeight();
  angular.element($window).bind('resize', function () {
    $scope.findReviewHeight();
  });
  $scope.publishReview = function () {
    $scope.review.userId = '57fd4a5ce08b24b38653d3fe';
    var req = {
      method: 'POST',
      url: $rootScope.apiUrl + '/reviews/',
      headers: {
        'Authorization': '',
      },
      data: $scope.review
    };
    $http(req)
    .then(function () {
      $state.go('venues.details', {venue_id: $stateParams.venue_id});
    },
    function (err) {
      console.log(err);
    });
  };

  $scope.photosInit = function () {
    var req = {
      method: 'GET',
      url: $rootScope.apiUrl + '/venues/' + $stateParams.venue_id,
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imptb25hNzg5IiwiaWF0IjoxNDc1MTU0Mjk3LCJleHAiOjE0NzUyNDA2OTd9.WqB3fBWpFxG18UaPVlpmyKRvX0TlC75hsvEKO4Oczj4',
        'Content-Type': undefined
      }
    };
    $http(req)
    .then(function (res) {
      $scope.venue = res.data;
      $scope.photos = res.data.pictures;
    },
    function (err) {
      console.log(err);
    });
  };

  $scope.showFavorites = function () {
    if ($scope.favoritesView === false) {
      $scope.favoritesView = true;
      $state.go('venues.feed', {'favorites': 'true'});
    } else {
      $scope.favoritesView = false;
      $state.go('venues.feed', {'favorites': 'false'});
    }
  };

  $scope.toggleTagSelection = function(){
    $scope.tagSelection = !$scope.tagSelection;
  };
  // $scope.resetFilter = function () {
  //   $scope.filterView = false;
  //   $scope.filterPage.features = false;
  //   $scope.filterPage.main = true;
  // };

  /*--  Bootstrap Collapse for Open Time  --*/
  $scope.isCollapsed = false;


  /*--  Fixed the Filter Container on Scroll  --*/
  angular.element(document.querySelector('div#tabletLeft')).on('scroll', function () {
    if (this.scrollTop > 38) {
      angular.element(this).addClass('fixed');
    }
    if (this.scrollTop < 38) {
      angular.element(this).removeClass('fixed');
    }
  });
  angular.element($window).on('scroll', function () {
    if ($window.pageYOffset > 38) {
      angular.element(document.querySelector('body')).addClass('fixed');
    }
    if ($window.pageYOffset < 38) {
      angular.element(document.querySelector('body')).removeClass('fixed');
    }
  });

  /*--  Setting the Dynamic Heigh of the Feed and Profile Contents  --*/
  $scope.findWindowHeight = function () {
    $timeout(function () {
      var windowWidth = $window.innerWidth;
      if (windowWidth > 767) {
        var windowHeight = $window.innerHeight;
        $scope.feedActualHeight = windowHeight - 50;
        $scope.profileActualHeight = windowHeight - 114;
      } else {
        $scope.feedActualHeight = 'auto';
        $scope.profileActualHeight = 'auto';
      }
    }, 100);
  };
  $scope.findWindowHeight();
  angular.element($window).bind('resize', function () {
    $scope.findWindowHeight();
  });
});