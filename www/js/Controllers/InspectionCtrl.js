angular.module('starter.controllers')

.controller('InspectionCtrl', function($scope, $stateParams, $ionicPopup, InspectionService) {
  $scope.inspection = {};
  $scope.callNumber = callNumber;
  $scope.map;

  init();

  function init() {
    var inspectionId = $stateParams.inspectionId;
    InspectionService.GetInspection(inspectionId)
      .then(
        function(success) {
          $scope.inspection = success;
        },
        function(failure) {
          $ionicPopup.alert({
            title: 'The given inspection was not found',
            template: 'Please restart the application to refresh'
          });
        })
      .finally(createGoogleMap);
  }

  function callNumber(number) {
    window.open('tel:' + number, '_system', 'location=yes');
  }

  function createGoogleMap() {
    var mapOptions = {
      center: getBoundaryCenter($scope.inspection.Field.Boundary.boundary[0]),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    $scope.map = new google.maps.Map(document.getElementById("field-map"), mapOptions);

    $scope.inspection.Field.Boundary.boundary.forEach(function(boundary, index) {
      var strokeColor = "#96281B";
      var fillColor = "#FF0000";

      if(index == 0) {
        fillColor = "#26A65B";
        strokeColor = "#1BA39C";
      }

      var polygon = new google.maps.Polygon({
        paths: getBoundaryPaths(boundary),
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35
      });

      polygon.setMap($scope.map);
    });
  }

  function getBoundaryPaths(boundary) {
    var paths = [];
    boundary.forEach(function(point) {
      paths.push(new google.maps.LatLng(point.x, point.y));
    });
    return paths;
  }

  function getBoundaryCenter(boundary) {
    var lowX = 1000000000, highX = -1*lowX, lowY = lowX, highY = highX;

    boundary.forEach(function(point) {
      if(point.x < lowX)
        lowX = point.x;
      if(point.x > highX)
        highX = point.x;
      if(point.y < lowY)
        lowY = point.y;
      if(point.y > highY)
        highY = point.y;
    });

    return new google.maps.LatLng(
      lowX + ((highX - lowX) / 2),
      lowY + ((highY - lowY) / 2)
    );
  }
});
