'use strict';

/**
 * __
 */

angular.module('qibud.org.missions').controller('MissionViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("MissionViewerCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Waiting',
    projects: [],
    team: null
  };

  api.buds.budPacksData.get($scope.bud.id, 'Mission')
    .success(function (packData)
    {
      if(packData.state) {
        $scope.packData = packData;
        console.log('packdata found:' + packData);
        api.buds.childrenByType ($scope.bud.id, 'Project')
          .success(function (projects)
          {
            $scope.packData.projects = projects;
            if(projects.length > 0)
            {
              $scope.packData.state = 'Started';
            } else {
              $scope.packData.state = 'Waiting';
            }

            api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Mission');
          });
      } else {
        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Mission');
      }
    })
    .error(function ()
    {
      console.log('error while loading packdata');
    });

});
