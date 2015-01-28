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
    actor: undefined
  };

  var afterLoad = function () {
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
              });
            });
          }
        });
      } else {
        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Issue');
      }
    })
    .error(function ()
    {
      console.log('error while loading packdata');
    });
  };

  $scope.isActor = function ()
  {
    if ($scope.packData.actor !== undefined) {
      if($scope.packData.actor === user) {
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
      if($scope.bud.creator === user) {
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
    $scope.packData.state = 'Assigned';
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Issue');
    api.links.createU2B(user.id,'ACTOR',$scope.bud.id);
    $scope.load ();
  };

  $scope.unsetActor = function ()
  {
    $scope.packData.actor = undefined;
    $scope.packData.state = 'Free';
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Issue');
    api.links.deleteU2B(user.id,'ACTOR',$scope.bud.id);
    $scope.load ();
  };

  $scope.load (afterLoad);
});
