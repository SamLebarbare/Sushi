'use strict';

/**
 * __
 */

angular.module('qibud.org.missions').controller('MissionViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("MissionViewerCtrl start...");
  var user       = $scope.common.user;
  $scope.packData = {
  };

  api.buds.budPacksData.get($scope.bud.id, 'Mission')
    .success(function (packData)
    {

    });

});
