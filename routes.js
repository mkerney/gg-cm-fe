app.config(function($stateProvider, $urlRouterProvider, $locationProvider){


  $urlRouterProvider.otherwise('/venues/feed');

  $stateProvider
  .state('venues', {
    url: '/venues',
    abstract: true,
    template:'<div ui-view></div>'
  })
  .state('venues.feed', {
    url: '/feed?favorites&priceLevelMin&priceLevelMax',
    reloadOnSearch: false,
    templateUrl:'./views/venue/feed.html',
    controller: 'VenueController'
  })
  .state('venues.details', {
    url: '/:venue_id',
    templateUrl:'./views/venue/details.html',
    controller:'VenueController'
  })
  .state('venues.photos', {
    url: '/:venue_id/photos/',
    templateUrl:'./views/venue/photos.html',
    controller:'VenueController'
  })
  .state('venues.review', {
    url: '/:venue_id/review/',
    templateUrl:'./views/venue/review.html',
    controller:'VenueController'
  })
  .state('filter', {
    url: '/filter',
    abstract: true,
    template:'<div ui-view></div>'
  })
  .state('filter.main', {
    url: '/main',
    templateUrl:'./views/filter/main.html',
    controller:'VenueController'
  })
  .state('filter.distance', {
    url: '/distance',
    templateUrl:'./views/filter/distance.html',
    controller:'VenueController'
  })  
  .state('filter.cuisine', {
    url: '/cuisine',
    templateUrl:'./views/filter/cuisine.html',
    controller:'VenueController'
  })
    .state('filter.features', {
    url: '/filterFeatures',
    templateUrl:'./views/filter/features.html',
    controller:'VenueController'
  })
  .state('referral', {
    url: '/referral',
    abstract: true,
    template:'<div ui-view></div>'
  })
  .state('referral.create', {
    url: '/create/:venue_id?itineraryReferral',
    templateUrl:'./views/referral/create.html',
    controller:'ReferralController'
  })
  .state('referral.itineraryCreate', {
    url: '/itineraryCreate',
    templateUrl:'./views/referral/itineraryCreate.html',
    controller:'ReferralController'
  })
  .state('referral.itineraryStopList', {
    url: '/itineraryStopList',
    templateUrl:'./views/referral/itineraryStopList.html',
    controller:'ReferralController'
  })
  .state('referral.detail', {
    url: '/detail/:id?webview',
    templateUrl:'./views/referral/detail.html',
    controller:'ReferralController'
  })
  .state('referral.print', {
    url: '/print/:id',
    templateUrl:'./views/referral/print.html',
    controller:'ReferralController'
  })
  .state('referral.send', {
    url: '/send/:id',
    templateUrl:'./views/referral/send.html',
    controller:'ReferralController'
  })
  .state('referral.history', {
    url: '/history/:userId',
    templateUrl:'./views/referral/history.html',
    controller:'ReferralController'
  })
  .state('referral.success', {
    url: '/success?sent',
    templateUrl:'./views/referral/success.html',
    controller:'ReferralController'
  })
  .state('referral.save', {
    url: '/save/:id',
    templateUrl:'./views/referral/save.html',
    controller:'ReferralController'
  })
  .state('user', {
    url: '/user',
    abstract: true,
    template:'<div ui-view></div>'
  })
  .state('user.details', {
    url: '/details/:user_id',
    templateUrl:'./views/user/details.html',
    controller:'UserController'
  })
  .state('user.profile', {
    url: '/profile/:user_id',
    templateUrl:'./views/user/profile.html',
    controller:'UserController'
  })
  .state('user.about', {
    url: '/about/:user_id',
    templateUrl:'./views/user/about.html',
    controller:'UserController'
  })
  .state('user.notifications', {
    url: '/notifications/:user_id',
    templateUrl:'./views/user/notifications.html',
    controller:'UserController'
  })
  .state('user.addConcierge', {
    url: '/addConcierge/',
    templateUrl:'./views/user/addConcierge.html',
    controller:'UserController'
  })
  .state('hotel', {
    url: '/hotel',
    abstract: true,
    template:'<div ui-view></div>'
  })
  .state('hotel.details', {
    url: '/details/:hotel_id',
    templateUrl:'./views/hotel/details.html',
    controller:'HotelController'
  });


  $locationProvider.html5Mode(true);
});
