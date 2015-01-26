'use strict';

/**
 * Home controller simply lists all the buds from everyone on the front page.
 */

angular.module('qibud.home').controller('HomeCtrl',
function ($scope, $state, $filter, api, budGraph)
{
  var user       = $scope.common.user;
  $scope.itemsByPage = 25;
  $scope.displayedBuds1 = [];
  $scope.displayedBuds2 = [];

  api.buds.list().success(function (buds)
  {
    $scope.buds = buds;
    $scope.displayedBuds2 = [].concat($scope.buds);
    api.links.findU2B(user.id, 'ACTOR').success(function (buds)
    {
      buds.forEach(function (bud)
      {
        _.remove($scope.buds, function(b) { return b.id === bud._id; });
      });

      $scope.budsActingOn = buds;
      $scope.displayedBuds1 = [].concat($scope.budsActingOn);
    });
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
    }
  });

});
