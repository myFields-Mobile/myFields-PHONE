angular.module('starter.controllers')

.controller('InspectionsCtrl', function($scope, $ionicPopup, InspectionService) {
  $scope.inspections = [];
  $scope.doRefresh = doRefresh;

  init();
  function init() {
    InspectionService.GetAssignedInspections()
      .then(
        function(success) {
          $scope.inspections = success;
        },
        function(fail) {
          $scope.inspections = fail;

          if(fail.length > 0) {
            $ionicPopup.alert({
              title: 'There was an error connecting',
              template: 'You may not be connected to the internet'
            });
          }
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
  }

  function doRefresh() {
    init();
  }
});
