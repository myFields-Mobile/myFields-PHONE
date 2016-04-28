angular.module('starter.controllers')

.controller('AccountCtrl', function($scope, $stateParams, $window) {
  // alert('account');
  $scope.currentUser = JSON.parse($window.localStorage.currentUser);
  console.log($scope.currentUser);
});
