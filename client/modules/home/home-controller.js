'use strict';

/**
 * Home controller simply lists all the buds from everyone on the front page.
 */

angular.module('qibud.home').controller('HomeCtrl', function ($scope, api)
{

  var user       = $scope.common.user;
  $scope.budBox  = {message: null, disabled: false};

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

  // add bud/comment creation functions to scope
  $scope.createBud = function ($event)
  {
    // don't let the user type in blank lines or submit empty/whitespace only bud, or type in something when bud is being created
    if (!$scope.budBox.message.length || $scope.budBox.disabled)
    {
      $event.preventDefault();
      return;
    }

    // disable the bud box and push the new bud to server
    $scope.budBox.disabled = true;
    api.buds.create({title: $scope.budBox.title, message: $scope.budBox.message})
        .success(function (budId)
        {
          // only add the bud if we don't have it already in the buds list to avoid dupes
          if (!_.some($scope.buds, function (b)
          {
            return b.id === budId;
          }))
          {
            $scope.buds.unshift(
            {
              id: budId,
              from: user,
              message: $scope.budBox.message,
              createdTime: new Date(),
              comments: [],
              commentBox: {message: '', disabled: false}
            });
          }

          // clear the bud box and enable it
          $scope.budBox.message = '';
          $scope.budBox.disabled = false;
        })
        .error(function ()
        {
          // don't clear the bud box but enable it so the user can re-try
          $scope.budBox.disabled = false;
        });
  };

  $scope.createComment = function ($event, bud)
  {
    // submit the message in the comment box only if user hits 'Enter (keycode 13)'
    if ($event.keyCode !== 13)
    {
      return;
    }

    // don't let the user type in blank lines or submit empty/whitespace only comment, or type in something when comment is being created
    if (!bud.commentBox.message.length || bud.commentBox.disabled) {
      $event.preventDefault();
      return;
    }

    // disable the comment box and push the new comment to server
    bud.commentBox.disabled = true;
    api.buds.comments.create(bud.id, {message: bud.commentBox.message})
        .success(function (commentId)
        {
          // only add the comment if we don't have it already in the bud's comments list to avoid dupes
          if (!_.some(bud.comments, function (c) {
            return c.id === commentId;
          }))
          {
            bud.comments.push({
              id: commentId,
              from: user,
              message: bud.commentBox.message,
              createdTime: new Date()
            });
          }

          // clear the comment field and enable it
          bud.commentBox.message  = '';
          bud.commentBox.disabled = false;
        })
        .error(function ()
        {
          // don't clear the comment box but enable it so the user can re-try
          bud.commentBox.disabled = false;
        });

    // prevent default 'Enter' button behavior (create new line) as we want 'Enter' button to do submission
    $event.preventDefault();
  };

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
