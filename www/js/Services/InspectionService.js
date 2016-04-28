angular.module('starter.services')

.service('InspectionService', function($http, $window, $q, $cordovaNetwork, globalVars) {
  var CONSTANTS = {
    INSPECTIONS_KEY: 'InspectionsKey',
    INSPECTIONS_API_ENDPOINT: 'https://myfields-locationfinder.rhcloud.com/api/inspection'
  };

  var init = function(tpl) {
    return;
  };

  var GetAssignedInspections = function() {
    return $q(function(resolve, reject) {
      if(!globalVars.isOnline) {
        var locallyStoredInspections = JSON.parse($window.localStorage[CONSTANTS.INSPECTIONS_KEY]);
        if(locallyStoredInspections !== 'undefined') {
          reject(locallyStoredInspections);
        } else {
          reject([]);
        }
      } else {
        $http
          .get(CONSTANTS.INSPECTIONS_API_ENDPOINT)
          .success(function (data, status, headers, config) {
            $window.localStorage[CONSTANTS.INSPECTIONS_KEY] = JSON.stringify(data);
            resolve(data);
          })
          .error(function(error) {
            if(error.message == "No token provided.") {
              reject([]);
            }
            reject(error);
          });
      }
    });
  };

  var GetInspection = function(inspectionId) {
    return $q(function(resolve, reject) {
      var inspections = JSON.parse($window.localStorage[CONSTANTS.INSPECTIONS_KEY]);

      inspections.forEach(function(inspection) {
        if(inspection.id == inspectionId)
          resolve(inspection);
      });

      reject(null);
    });
  };

  return {
    init: init,
    GetAssignedInspections: GetAssignedInspections,
    GetInspection: GetInspection
  };
})
