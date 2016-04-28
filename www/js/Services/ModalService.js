angular.module('starter.services',[])

.service('ModalService', function($ionicModal, $rootScope, $http, $window, $ionicPopup) {
  var init = function(tpl) {
    var promise;
    $scope = $rootScope.$new();

    promise = $ionicModal.fromTemplateUrl(tpl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
    });

    $scope.loginData = {};

    $scope.login = function() {
      $scope.modal.show();
    };

    $scope.doLogin = function() {
      if(!$scope.loginData.email || !$scope.loginData.password) {
        $ionicPopup.alert({
           title: 'Missing Fields',
           template: 'Please fill in all fields.'
         });
         return;
      }

      $http
        .post('https://myfields-locationfinder.rhcloud.com/api/authenticate', $scope.loginData)
        .success(function (data, status, headers, config) {
          var isInspector = false;
          data.user.UserTypes.forEach(function(userType) {
            if(userType.title.toLowerCase() == "inspector") {
              isInspector = true;
            }
          });

          if(!isInspector) {
            $ionicPopup.alert({
               title: 'Access Denied',
               template: 'You do not have the inspector role.'
             });
             return;
          }

          $window.localStorage.currentUser = JSON.stringify(data.user);
          $window.localStorage.token = data.token;
          $scope.loginData = {};
          $scope.modal.hide();
        })
        .error(function (data, status, headers, config) {
          delete $window.localStorage.token;
          delete $window.localStorage.currentUser;

          $ionicPopup.alert({
             title: 'Authentication Failed',
             template: data.message
           });
        });
    };

    return promise;
  }

  return {
    init: init
  }
})
