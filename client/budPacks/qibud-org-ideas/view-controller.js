'use strict';

/**
 * __
 */

angular.module('qibud.org.ideas').controller('IdeaViewerCtrl',
function ($scope, $state, $stateParams, $location, api)
{
  var user       = $scope.common.user;
  $scope.packData = {
  };

  api.buds.budPacksData.get($scope.bud.id, 'Idea')
    .success(function (packData)
    {

    });

});
