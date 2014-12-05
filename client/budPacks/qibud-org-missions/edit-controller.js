'use strict';

/**
 * __
 */

angular.module('qibud.org.missions').controller('MissionEditorCtrl',
function ($scope, $state, $stateParams, $location, api)
{
  console.log("MissionEditorCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Waiting for projects',
    projects: [],
    team: null
  };

  api.buds.budPacksData.get($scope.editedBud.id, 'Mission')
    .success(function (packData)
    {

      if(packData.state) {
        $scope.packData = packData;
        console.log('packdata found:' + packData);
      } else {
        api.buds.budPacksData.create($scope.editedBud.id, $scope.packData, 'Mission');
      }
    })
    .error(function ()
    {
      console.log('error while loading packdata');
    });

});
