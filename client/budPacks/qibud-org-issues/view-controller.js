'use strict';

/**
 * __
 */

angular.module('qibud.org.issues').controller('IssueViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("IssueViewerCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Free',
    actor: undefined,
    actions: []
  };

  var afterLoad = function (done) {
    api.buds.budPacksData.get($scope.bud.id, 'Issue')
    .success(function (packData)
      {
        if(packData.state) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);
          api.buds.childrenByType ($scope.bud.id, 'Result')
          .success(function (results)
          {
            if(results.length > 0)
            {
              var scope = $scope;
              angular.forEach(results, function (result) {
                api.buds.budPacksData.get(result.id, 'Result')
                .success(function (data) {
                  if(data.state === 'Success') {
                    scope.packData.state = 'Ended';
                    api.buds.budPacksData.set($scope.bud.id, scope.packData, 'Issue');
                  }
                  done ();
                });
              });
            } else {
              done ();
            }
          });

          api.buds.childrenByType ($scope.bud.id, 'Action')
          .success(function (actions)
          {
            $scope.packData.state = 'ActionsInProgress';
            $scope.packData.actions = actions;

            if($scope.packData.actions.length > 0) {
              var ended = true;
              angular.forEach ($scope.packData.actions, function (action) {
                console.log ('a');
                if(action.dataCache.state !== 'Ended') {
                  $scope.packData.state = 'ActionsInProgress';
                  api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Issue');
                  ended = false;
                  done ();
                }
              });
              if(ended) {
                $scope.packData.state = 'Ended';
                api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Issue');
                done ();
              }
            }
          });
          done ();
      } else {
        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Issue');
        done ();
      }
    })
    .error(function ()
    {
      console.log('error while loading packdata');
      done ();
    });
  };

  $scope.load (afterLoad);
});
