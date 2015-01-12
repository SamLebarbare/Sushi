'use strict';

/**
 * __
 */

angular.module('qibud.org.projects').controller('ProjectViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("ProjectViewerCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Waiting',
    actions: []
  };

  api.buds.budPacksData.get($scope.bud.id, 'Project')
    .success(function (packData)
    {
      if(packData.state) {
        $scope.packData = packData;
        console.log('packdata found:' + packData);
        api.buds.childrenByType ($scope.bud.id, 'Action')
          .success(function (actions)
          {
            $scope.packData.actions = actions;
            if(actions.length > 0)
            {
              $scope.packData.state = 'Started';
              var scope = $scope;
              angular.forEach(actions, function (action) {
                api.buds.budPacksData.get(action._id, 'Action')
                .success(function (data) {
                  if(data.state === 'Ended') {
                    scope.packData.state = 'Ended';
                  } else {
                    scope.packData.state = 'Started';
                  }
                });
              });
              api.buds.budPacksData.set($scope.bud.id, scope.packData, 'Project');
            } else {
              $scope.packData.state = 'Waiting';
            }
            api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Project');
          });
      } else {
        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Project');
      }
    })
    .error(function ()
    {
      console.log('error while loading packdata');
    });

});
