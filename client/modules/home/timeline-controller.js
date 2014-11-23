'use strict';

/**
 *
 */

angular.module('qibud.home').controller('TimelineCtrl',
function ($scope, $state, api, budGraph)
{
  var user       = $scope.common.user;

  api.events.list().success(function (events)
  {
    $scope.events = events;
  });
});
