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
    actor: undefined,
    team: undefined
  };
  var afterLoad = function (done) {
    api.buds.budPacksData.get($scope.bud.id, 'Mission')
    .success(function (packData)
      {
        if(packData.state) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);
          api.buds.parentByType ($scope.bud.id, 'Team')
           .success(function (teams) {
             if(teams.length > 0) {
              $scope.packData.team = teams[0];
             }
           });
          api.buds.childrenByType ($scope.bud.id, 'Project')
          .success(function (projects)
            {
              $scope.packData.projects = projects;
              if(projects.length > 0)
              {
                $scope.packData.state = 'Started';
                var scope = $scope;
                angular.forEach(projects, function (project) {
                  if(project.dataCache.state === 'Ended') {
                    scope.packData.state = 'Ended';
                  } else {
                    scope.packData.state = 'Started';
                  }
                });
              } else {
                $scope.packData.state = 'Waiting';
              }
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Mission');
              done ();
            });
      } else {
        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Mission');
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

  $scope.isActor = function ()
  {
    if ($scope.packData.actor !== undefined) {
      if($scope.packData.actor.id === user.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  $scope.isCreator = function ()
  {
    if ($scope.bud.creator !== undefined) {
      if($scope.bud.creator.id === user.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  $scope.isActorOrCreator = function ()
  {
    return ($scope.isActor() || $scope.isCreator());
  }

  $scope.setActor = function ()
  {
    $scope.packData.actor = user;
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Mission');
    api.links.createU2B(user.id,'ACTOR',$scope.bud.id);
    $scope.load ();
  };

  $scope.unsetActor = function ()
  {
    $scope.packData.actor = undefined;
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Mission');
    api.links.deleteU2B(user.id,'ACTOR',$scope.bud.id);
    $scope.load ();
  };
});
