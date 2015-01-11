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
    state: 'Free',
    actor: undefined,
    actions: []
  };

  $scope.setActor = function ()
  {
    $scope.packData.actor = user;
    $scope.packData.state = 'Waiting for a result';
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Action');
    api.links.createU2B(user.id,'ACTOR',$scope.bud.id);
  };

  $scope.unsetActor = function ()
  {
    $scope.packData.actor = undefined;
    $scope.packData.state = 'Free';
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Action');
    api.links.deleteU2B(user.id,'ACTOR',$scope.bud.id);
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
