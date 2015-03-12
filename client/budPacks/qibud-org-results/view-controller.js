'use strict';

/**
 * __
 */

angular.module('sushi.org.results').controller('ResultViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Undefined',
    actor: undefined
  };

  var afterLoad = function (done) {
    api.buds.budPacksData.get($scope.bud.id, 'Result')
    .success(function (packData)
      {
        if(packData.state) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);
        } else {
          api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Result');
        }
        done ();
      })
      .error(function ()
    {
      console.log('error while loading packdata');
      done ();
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
      api.buds.budPacksData.get($scope.bud.parentBud.id, 'Issue')
      .success(function (packData) {
        packData.state = 'Ended';
        api.buds.budPacksData.set($scope.bud.parentBud.id, packData, 'Issue');
      });
    }
  };

  $scope.setFailed = function ()
  {
    $scope.packData.state = 'Failed';
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
    if($scope.bud.parentBud) {
      api.buds.budPacksData.get($scope.bud.parentBud.id, 'Action')
      .success(function (packData) {
        api.links.deleteU2B(packData.actor.id,'ASSIGNED',$scope.bud.parentBud.id);
        api.links.deleteU2B(packData.actor.id,'ACTOR',$scope.bud.parentBud.id);
        packData.actor = undefined;
        packData.state = 'Free';
        api.buds.budPacksData.set($scope.bud.parentBud.id, packData, 'Action');
      });
      api.buds.budPacksData.get($scope.bud.parentBud.id, 'Issue')
      .success(function (packData) {
        api.links.deleteU2B(packData.actor.id,'ASSIGNED',$scope.bud.parentBud.id);
        api.links.deleteU2B(packData.actor.id,'ACTOR',$scope.bud.parentBud.id);
        packData.actor = undefined;
        packData.state = 'Free';
        api.buds.budPacksData.set($scope.bud.parentBud.id, packData, 'Issue');
      });

    }
  };

});
