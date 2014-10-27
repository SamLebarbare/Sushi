'use strict';

/**
 * Viewer controller provide a good way to read buds
 */

angular.module('qibud.viewer').controller('ViewerCtrl',
function ($scope, $state, $stateParams, $modal, api)
{

  var user       = $scope.common.user;
  $scope.ready = false;
  $scope.actionInProgress = false;
  $scope.followersCount = 0;
  $scope.sponsorsCount = 0;
  $scope.supportersCount = 0;
  $scope.supportValue = 0;
  // retrieve one bud from server
  api.buds.view($stateParams.budId).success(function (bud)
  {
    bud.commentBox = {message: '', disabled: false};
    bud.comments   = bud.comments || [];
    $scope.bud = bud;
    if(bud.followers)
    {
        $scope.followersCount = bud.followers.length;
        if(bud.followers.indexOf(user.id)!== -1)
        {
          $scope.follower = true;
        }
        else
        {
          $scope.follower = false;
        }
    }
    else
    {
      $scope.follower = false;
    }

    if(bud.sponsors)
    {
      $scope.sponsorsCount = bud.sponsors.length;
      if(bud.sponsors.indexOf(user.id)!== -1)
      {
        $scope.sponsorer = true;
      }
      else
      {
        $scope.sponsorer = false;
      }
    }
    else
    {
      $scope.sponsorer = false;
    }

    if(bud.supporters)
    {
      $scope.supportersCount = bud.supporters.length;
      if(bud.supporters.indexOf(user.id)!== -1)
      {
        $scope.supporter = true;
      }
      else
      {
        $scope.supporter = false;
      }
    }
    else
    {
      $scope.supporter = false;
    }

    if (bud.type && bud.type !== 'bud') {
      $state.go('bud.viewer.' + bud.type);
    }
    $scope.ready = true;
  });

  $scope.editSubBud = function () {
    $state.go('bud.editor',{parentBud : $scope.bud});
  };

  $scope.budify = function (content) {
    $state.go('bud.editor',{parentBud : $scope.bud, content: content});
  };

  $scope.delete = function () {
    api.buds.delete($scope.bud.id).success(function (){
      $state.go('bud.home');
    });    
  };

  $scope.share = function () {
    api.users.list().success(function (users)
    {
      _.remove(users, function(u) { return u.id === user.id; });

      var modalInstance = $modal.open({
        templateUrl: 'sharebox.html',
        controller: 'ShareboxCtrl',
        size: 'lg',
        resolve: {
          users: function () {
            return users;
          }
        }
      });

      modalInstance.result.then(function (users) {
        //share to ->
        api.buds.share($scope.bud, users).success(function (bud) {

        });

      }, function () {
        //dismiss
      });
    });
  };

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


  $scope.followBud = function ($event)
  {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }

    $scope.actionInProgress = true;
    if(!$scope.follower)
    {
      api.buds.follow($scope.bud)
        .success(function (budId)
        {
          $scope.actionInProgress = false;
        })
        .error(function ()
        {
          $scope.actionInProgress = false;
        });
    }
    else
    {
      api.buds.unfollow($scope.bud)
        .success(function (budId)
        {
          $scope.actionInProgress = false;
        })
        .error(function ()
        {
          $scope.actionInProgress = false;
        });
    }
  }

  $scope.supportBud = function ($event)
  {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }

    $scope.actionInProgress = true;

    if(!$scope.supporter)
    {
      api.buds.support($scope.bud, $scope.supportValue)
        .success(function (budId)
        {
          $scope.actionInProgress = false;
        })
        .error(function ()
        {
          $scope.actionInProgress = false;
        });
    }
    else
    {
      api.buds.unsupport($scope.bud)
        .success(function (budId)
        {
          $scope.actionInProgress = false;
        })
        .error(function ()
        {
          $scope.actionInProgress = false;
        });
    }
  }

  $scope.sponsorBud = function ($event)
  {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }
    $scope.actionInProgress = true;

    if(!$scope.sponsorer)
    {
      api.buds.sponsor($scope.bud)
        .success(function (budId)
        {
          $scope.actionInProgress = false;
        })
        .error(function ()
        {
          $scope.actionInProgress = false;
        });
    }
    else
    {
      api.buds.unsponsor($scope.bud)
        .success(function (budId)
        {
          $scope.actionInProgress = false;
        })
        .error(function ()
        {
          $scope.actionInProgress = false;
        });
    }
  }

  api.buds.followersChanged.subscribe($scope, function (bud) {
    if ($scope.bud.id === bud.id)
    {
      $scope.bud.followers = bud.followers;
      $scope.followersCount = bud.followers.length;
      if(bud.followers.indexOf(user.id)!== -1)
      {
        $scope.follower = true;
      }
      else
      {
        $scope.follower = false;
      }
    }
  });

  api.buds.supportersChanged.subscribe($scope, function (bud) {
    if ($scope.bud.id === bud.id)
    {
      $scope.bud.supporters = bud.supporters;
      $scope.supportersCount = bud.supporters.length;

      if(bud.supporters.indexOf(user.id) !== -1)
      {
        $scope.supporter = true;
      }
      else
      {
        $scope.supporter = false;
      }
    }
  });

  api.buds.sponsorsChanged.subscribe($scope, function (bud) {
    if ($scope.bud.id === bud.id)
    {
      $scope.bud.sponsors = bud.sponsors;
      $scope.sponsorsCount = bud.sponsors.length;
      if(bud.sponsors.indexOf(user.id) !== -1)
      {
        $scope.sponsorer = true;
      }
      else
      {
        $scope.sponsorer = false;
      }
    }
  });

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
    if ($scope.bud.id === bud.id)
    {
      $scope.bud = bud;
    }
  });

  api.qi.updated.subscribe($scope, function (bud) {
    if ($scope.bud.id === bud.id)
    {
      $scope.bud.qi = bud.qi;
    }
  });

});
