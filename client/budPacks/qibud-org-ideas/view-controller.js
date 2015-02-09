'use strict';

/**
 * __
 */

angular.module('qibud.org.ideas').controller('IdeaViewerCtrl',
function ($scope, $state, $stateParams, $location, api)
{
  var user       = $scope.common.user;
  $scope.packData = {
    state: 'Waiting',
    selectedBud: null
  };
  var afterLoad = function (done) {
    api.buds.budPacksData.get($scope.bud.id, 'Idea')
    .success(function (packData)
      {

        var trySetEnded = function () {
          if($scope.packData.selectedBud) {
            if($scope.packData.selectedBud.dataCache.state === 'Ended') {
              $scope.packData.state = 'Primed';
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
              done ();
            }
          }
        };

        if(packData.state) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);
          if ($scope.bud.sponsors) {
            if ($scope.bud.sponsors.length > 0){
              $scope.packData.state = 'Sponsored';
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
            }
            done ();
          } else {
            $scope.packData.state = 'Waiting';
            api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
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

          done ();
        } else {
          api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Idea');
          done ();
        }
      })
      .error(function ()
    {
      console.log('error while loading packdata');
      done ();
    });

    api.buds.sponsorsChanged.subscribe($scope, function (bud) {
      if ($scope.bud.id === bud.id)
      {
        if (bud.sponsors.length > 0) {
          $scope.packData.state = 'Sponsored';
          api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
        } else {
          $scope.packData.state = 'Waiting';
          api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
        }
      }
    });
  };

  $scope.load (afterLoad);




});
