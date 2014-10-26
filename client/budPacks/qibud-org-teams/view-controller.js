'use strict';

/**
 * __
 */

angular.module('qibud.org.teams').controller('TeamViewerCtrl',
function ($scope, $state, $stateParams, $location, api)
{
  var user       = $scope.common.user;
  $scope.packData = {
    members : []
  };
  api.buds.packdatas.get($scope.bud.id, 'team')
    .success(function (packData)
    {
      if(packData.members) {
        console.log('packdata loaded');
        $scope.packData = packData;
      }

    });

});
