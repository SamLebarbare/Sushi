'use strict';

/**
 * Viewer controller provide a good way to read buds
 */

angular.module('qibud.viewer').controller('ViewerCtrl', function ($scope, $stateParams, api)
{

  var user       = $scope.common.user;
  console.log ('viewer');
  // retrieve one bud from server
  api.buds.view($stateParams.budId).success(function (bud)
  {
    bud.commentBox = {message: '', disabled: false};
    bud.comments   = bud.comments || [];
    $scope.bud = bud;
  });

  $scope.canShare = function ()
  {
    var sharable = false;
    var creatorId = $scope.bud.creator.id;

    //TODO: Add a watch on privacy changes check actor
    switch($scope.bud.privacy)
    {
      case 'Private':
        if(creatorId === user.id)
        {
          sharable = true;
        }
      break;
      case 'Private2Share':
        if(creatorId === user.id)
        {
          sharable = true;
        }
      break;
    case 'Free2Share':
        sharable = true;
      break;
    }

    return sharable;
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

  api.buds.comments.created.subscribe($scope, function (comment) {
    // only add the comment if we don't have it already in the bud's comments list to avoid dupes
    if ($scope.bud && !_.some($scope.bud.comments, function (c)
    {
      return c.id === comment.id;
    }))
    {
      bud.comments.push(comment);
    }
  });

  api.buds.updated.subscribe($scope, function (bud) {
    if ($scope.bud && c.id === bud.id)
    {
      $scope.bud = bud;
    }
  });

});
