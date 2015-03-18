'use strict';

/**
 * Display created sushis
 */

angular.module('sushi.home').controller('MySushisCtrl',
function ($scope, $state, $filter, api)
{
  var user             = $scope.common.user;
  $scope.itemsByPage   = 10;
  $scope.displayedSushis = [];
  $scope.missions = [];
  $scope.displayedMissions = [];
  $scope.projects = [];
  $scope.displayedActions  = [];
  $scope.actions = [];
  $scope.displayedProjects = [];
  $scope.displayedFollows  = [];

  api.links.findU2B(user.id, 'CREATED').success(function (sushis)
  {
    $scope.sushis = sushis;
    $scope.displayedSushis = [].concat($scope.sushis);
  });

  api.links.findU2B(user.id, 'FOLLOW').success(function (sushis)
  {
    $scope.follows = sushis;
    $scope.displayedFollows = [].concat($scope.follows);
  });

  api.sushis.list().success(function (sushis)
  {
    var scope = $scope;
    angular.forEach (sushis, function (sushi){
      switch (sushi.type)
      {
        case 'Mission':
          scope.missions.push (sushi);
          scope.displayedMissions = [].concat(scope.missions);
        break;
        case 'Project':
          scope.projects.push (sushi);
          scope.displayedProjects = [].concat(scope.projects);
          break;
        case 'Action':
          scope.actions.push (sushi);
          scope.displayedActions = [].concat(scope.actions);
        break;
      }
    });
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
