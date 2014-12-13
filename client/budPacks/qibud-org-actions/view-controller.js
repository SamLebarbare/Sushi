'use strict';

/**
 * __
 */

angular.module('qibud.org.actions').controller('ActionViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("ActionViewerCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'free',
    actions: []
  };

  api.buds.budPacksData.get($scope.bud.id, 'Action')
    .success(function (packData)
    {
      if(packData.state) {
        $scope.packData = packData;
        console.log('packdata found:' + packData);
      } else {
        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Action');
      }
    })
    .error(function ()
    {
      console.log('error while loading packdata');
    });

});
