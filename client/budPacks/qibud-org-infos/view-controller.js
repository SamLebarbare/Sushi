'use strict';

/**
 * __
 */

angular.module('qibud.org.infos').controller('InfoViewerCtrl',
function ($scope, $state, $stateParams, $location, api)
{
  var user       = $scope.common.user;
  $scope.packData = {
    state: 'Unshared',
    selectedBud: null
  };
  var afterLoad = function (done) {
    api.buds.budPacksData.get($scope.bud.id, 'Info')
    .success(function (packData)
      {
        var trySetEnded = function () {
          if($scope.packData.selectedBud) {
            if($scope.packData.selectedBud.dataCache.state === 'Ended') {
              $scope.packData.state = 'Primed';
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Info');
              done ();
            }
          }
        };

        if(packData.state) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);

          if ($scope.shareCount > 0) {
            $scope.packData.state = 'Shared';
          } else {
            $scope.packData.state = 'Unshared';
          }
          if ($scope.bud.sponsors) {
            if ($scope.bud.sponsors.length > 0){
              $scope.packData.state = 'Relevant';
            }
          }

          api.buds.childrenByType ($scope.bud.id, 'Mission')
          .success(function (missions)
          {
            if(missions.length > 0)
            {
              $scope.packData.state = 'Selected';
              $scope.packData.selectedBud = missions[0];
              trySetEnded ();
            } else {
              api.buds.childrenByType ($scope.bud.id, 'Project')
              .success(function (projects)
              {
                if(projects.length > 0)
                {
                  $scope.packData.state = 'Selected';
                  $scope.packData.selectedBud = projects[0];
                  trySetEnded ();
                } else {
                  api.buds.childrenByType ($scope.bud.id, 'Action')
                  .success(function (actions)
                  {
                    if(actions.length > 0)
                    {
                      $scope.packData.state = 'Selected';
                      $scope.packData.selectedBud = actions[0];
                      trySetEnded ();
                    }
                  });
                }
              });
            }
          });
          api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Info');
          done ();
        } else {
          api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Info');
          done ();
        }
      })
      .error(function ()
    {
      console.log('error while loading packdata');
      done ();
    });

    api.buds.sharesChanged.subscribe($scope, function (bud) {
      if ($scope.bud.id === bud.id)
      {
        $scope.load (afterLoad);
      }
    });

    api.buds.sponsorsChanged.subscribe($scope, function (bud) {
      if ($scope.bud.id === bud.id)
      {
        $scope.load (afterLoad);
      }
    });
  };

  $scope.load (afterLoad);




});
