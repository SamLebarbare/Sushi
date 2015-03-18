'use strict';

/**
 *
 */

angular.module('sushi.home').controller('TimelineCtrl',
function ($scope, $state, api, sushiGraph)
{
  var user       = $scope.common.user;

  api.events.list().success(function (events)
  {
    $scope.events = events;
  });
});
