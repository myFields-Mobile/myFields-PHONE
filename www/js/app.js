// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.value('globalVars', {
  isOnline: true
})

.run(function($ionicPlatform, $cordovaNetwork, $rootScope, globalVars) {
  $ionicPlatform.ready(function() {

    $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
      globalVars.isOnline = true;
    });
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
      globalVars.isOnline = false;
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function($rootScope, $q, $window, $injector) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if ($window.localStorage.token) {
          config.headers['x-access-token'] = $window.localStorage.token
        }
        return config;
      },
      responseError: function(error) {
        $injector.invoke(function($http, ModalService) {
          if(error.status === 403) {
            ModalService
              .init('templates/login.html')
              .then(function(modal) {
                modal.show();
              });
          }
        });
        return $q.reject(error);
      }
    };
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'templates/account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('app.inspections', {
      url: '/inspections',
      views: {
        'menuContent': {
          templateUrl: 'templates/inspections.html',
          controller: 'InspectionsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/inspections/:inspectionId',
    views: {
      'menuContent': {
        templateUrl: 'templates/inspection.html',
        controller: 'InspectionCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/inspections');
});
