'use strict';

/**
 * Home controller simply lists all the buds from everyone on the front page.
 */

angular.module('qibud.home').controller('HomeCtrl',
function ($scope, api)
{
  var user       = $scope.common.user;
  $scope.budBox  = {content: null, disabled: false};

  // retrieve buds from server
  api.buds.list().success(function (buds)
  {
    buds.forEach(function (bud)
    {
      bud.commentBox = {message: '', disabled: false};
      bud.comments   = bud.comments || [];
    });

    $scope.buds = buds;
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
      bud.comments = [];
      bud.commentBox = {message: '', disabled: false};
      $scope.buds.unshift(bud);
    }
  });

  api.buds.comments.created.subscribe($scope, function (comment) {
    var bud = _.find($scope.buds, function (bud)
    {
      return bud.id === comment.budId;
    });

    // only add the comment if we don't have it already in the bud's comments list to avoid dupes
    if (bud && !_.some(bud.comments, function (c)
    {
      return c.id === comment.id;
    }))
    {
      bud.comments.push(comment);
    }
  });
  
});
