'use strict';

/**
 * __
 */

angular.module('qibud.org.ideas').controller('IdeaViewerCtrl',
function ($scope, $state, $stateParams, $location, api)
{
  var user       = $scope.common.user;
  $scope.packData = {
    state: 'Waiting'
  };
  var afterLoad = function () {
    api.buds.budPacksData.get($scope.bud.id, 'Idea')
    .success(function (packData)
      {
        if(packData.state) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);
          if ($scope.bud.sponsors) {
            if ($scope.bud.sponsors.length > 0){
              $scope.packData.state = 'Sponsored';
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
            }          
          } else {
            $scope.packData.state = 'Waiting';
            api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
          }
        } else {
          api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Idea');
        }
      })
      .error(function ()
    {
      console.log('error while loading packdata');
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
