'use strict';

/**
 * __
 */

angular.module('qibud.org.results').controller('ResultViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("ResultViewerCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Undefined',
    actor: undefined
  };

  var afterLoad = function () {
    api.buds.budPacksData.get($scope.bud.id, 'Result')
    .success(function (packData)
      {
        if(packData.state) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);
        } else {
          api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Result');
        }
      })
      .error(function ()
    {
      console.log('error while loading packdata');
    });
  };

  $scope.load (afterLoad);
  $scope.setSuccess = function ()
  {
    $scope.packData.state = 'Success';
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
    if($scope.bud.parentBud) {
      api.buds.budPacksData.get($scope.bud.parentBud.id, 'Action')
      .success(function (packData) {
        packData.state = 'Ended';
        api.buds.budPacksData.set($scope.bud.parentBud.id, packData, 'Action');
      });

    }
  };

  $scope.setFailed = function ()
  {
    $scope.packData.state = 'Failed';
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
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
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
    api.links.createU2B(user.id,'ACTOR',$scope.bud.id);
  };

  $scope.unsetActor = function ()
  {
    $scope.packData.actor = undefined;
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
    api.links.deleteU2B(user.id,'ACTOR',$scope.bud.id);
  };

});
