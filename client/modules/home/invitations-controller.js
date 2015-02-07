'use strict';

/**
 * Home controller simply lists all the buds from everyone on the front page.
 */

angular.module('qibud.home').controller('InvitationsCtrl',
function ($scope, $state, $filter, api)
{
  var user             = $scope.common.user;
  $scope.itemsByPage   = 10;
  $scope.displayedBuds = [];

  api.links.findU2B(user.id, 'INVITED').success(function (buds)
  {
    $scope.buds = buds;
    $scope.displayedBuds = [].concat($scope.buds);
  });


  // subscribe to websocket events to receive new buds, comments, etc.
  api.buds.created.subscribe($scope, function (bud)
  {
    // only add the bud if we don't have it already in the buds list to avoid dupes
    if (!_.some($scope.buds, function (b)
    {
      return b.id === bud.id;
    }))
    {
      $scope.buds.unshift(bud);
      $scope.displayedBuds = [].concat($scope.buds);
    }
  });

});
