'use strict';

/**
 * __
 */

 angular.module('qibud.org.regions').controller('RegionViewerCtrl',
 function ($scope, $state, $stateParams, $location, api)
{
  var user       = $scope.common.user;
  $scope.packData = {
    state: 'New'
  };

  var afterLoad = function (done) {
    $scope.getPackData (function (packData)
    {
      if(packData.state) {
        $scope.packData = packData;
        done ();
      } else {
        $scope.createPackData ($scope.packData, done);
      }
    });
  };

  $scope.load (afterLoad);

});
