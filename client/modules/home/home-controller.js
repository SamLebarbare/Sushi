'use strict';

/**
 * Home controller simply lists all the sushis from everyone on the front page.
 */

angular.module('sushi.home').controller('HomeCtrl',
function ($scope, $state, $filter, api)
{
  var user             = $scope.common.user;
  $scope.itemsByPage   = 10;
  $scope.displayedSushis = [];

  api.sushis.list().success(function (sushis)
  {
    $scope.sushis = sushis;
    $scope.displayedSushis = [].concat($scope.sushis);
  });


  // subscribe to websocket events to receive new sushis, comments, etc.
  api.sushis.created.subscribe($scope, function (sushi)
  {
    // only add the sushi if we don't have it already in the sushis list to avoid dupes
    if (!_.some($scope.sushis, function (b)
    {
      return b.id === sushi.id;
    }))
    {
      $scope.sushis.unshift(sushi);
      $scope.displayedSushis = [].concat($scope.sushis);
    }
  });

});
