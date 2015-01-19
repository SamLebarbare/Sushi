'use strict';

/**
 * Home controller simply lists all the buds from everyone on the front page.
 */

angular.module('qibud.home').controller('HomeCtrl',
function ($scope, $state, api, budGraph)
{
  var user       = $scope.common.user;
  api.buds.list().success(function (buds)
  {
    buds.forEach(function (bud)
    {
      if(bud.type || bud.type !== 'Bud') {
        api.types.get (bud.type).success (function (typeInfo) {
          bud.typeInfo = typeInfo;
        });
      }
      bud.commentBox = {message: '', disabled: false};
      bud.comments   = bud.comments || [];
    });

    $scope.buds = buds;

    api.links.findU2B(user.id, 'ACTOR').success(function (buds)
    {
      buds.forEach(function (bud)
      {
        _.remove($scope.buds, function(b) { return b.id === bud._id; });
        if(bud.type || bud.type !== 'Bud') {
          api.types.get (bud.type).success (function (typeInfo) {
            bud.typeInfo = typeInfo;
          });
        }
        bud.commentBox = {message: '', disabled: false};
        bud.comments   = bud.comments || [];
      });

      $scope.budsActingOn = buds;
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
