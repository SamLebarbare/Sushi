'use strict';

/**
 * Display created buds
 */

angular.module('sushi.home').controller('MyBudsCtrl',
function ($scope, $state, $filter, api)
{
  var user             = $scope.common.user;
  $scope.itemsByPage   = 10;
  $scope.displayedBuds = [];
  $scope.missions = [];
  $scope.displayedMissions = [];
  $scope.projects = [];
  $scope.displayedActions  = [];
  $scope.actions = [];
  $scope.displayedProjects = [];
  $scope.displayedFollows  = [];

  api.links.findU2B(user.id, 'CREATED').success(function (buds)
  {
    $scope.buds = buds;
    $scope.displayedBuds = [].concat($scope.buds);
  });

  api.links.findU2B(user.id, 'FOLLOW').success(function (buds)
  {
    $scope.follows = buds;
    $scope.displayedFollows = [].concat($scope.follows);
  });

  api.buds.list().success(function (buds)
  {
    var scope = $scope;
    angular.forEach (buds, function (bud){
      switch (bud.type)
      {
        case 'Mission':
          scope.missions.push (bud);
          scope.displayedMissions = [].concat(scope.missions);
        break;
        case 'Project':
          scope.projects.push (bud);
          scope.displayedProjects = [].concat(scope.projects);
          break;
        case 'Action':
          scope.actions.push (bud);
          scope.displayedActions = [].concat(scope.actions);
        break;
      }
    });
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
