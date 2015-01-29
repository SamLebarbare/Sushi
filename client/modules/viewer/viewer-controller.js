'use strict';

/**
 * Viewer controller provide a good way to read buds
 */

angular.module('qibud.viewer').controller('ViewerCtrl',
function ($scope, $state, $stateParams, $modal, api)
{

  var user       = $scope.common.user;
  $scope.typeInfo = null;
  $scope.ready = false;
  $scope.actionInProgress = false;
  $scope.followersCount = 0;
  $scope.sponsorsCount = 0;
  $scope.supportersCount = 0;
  $scope.supportValue = 0;
  $scope.shareCount = 0;
  // retrieve one bud from server

  $scope.load = function (callback)
  {
    console.info ('loading...');
    $scope.actionInProgress = true;
    $scope.ready = false;
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

      if(bud.shares)
      {
        $scope.shareCount = bud.shares.length;
      } else {
        $scope.shareCount = 0;
      }

      $scope.ready = true;
      $scope.showType ($scope.bud.type, false);
      console.info ('loaded!');

      if (callback) {
        callback(function () {
          $scope.actionInProgress = false;
        });
      } else {
        $scope.actionInProgress = false;
      }

    });
  }
  //Init view
  $scope.load();

  $scope.showType = function (type, reload) {
    if (type != 'Bud') {
      $state.go('bud.viewer.' + type, $state.params, { reload: reload });
    } else {
      $state.go('bud.viewer',$state.params, { reload: reload });
    }
  };

  $scope.evolve = function ($event, type) {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }
    $scope.actionInProgress = true;

    api.buds.evolve($scope.bud, type).success(function () {
      $scope.actionInProgress = false;
    })
    .error(function ()
    {
      $scope.actionInProgress = false;
    });

  };

  $scope.canEvolve = function ()
  {
    if(!$scope.bud) {
      return false;
    }

    if($scope.bud.type === 'Bud' && $scope.bud.creator.id === user.id) {
      return true;
    } else {
      return false;
    }
  }

  $scope.edit = function () {
    $state.go('bud.editor',{budId : $scope.bud});
  };

  $scope.editSubBud = function () {
    $state.go('bud.editor',{parentBud : $scope.bud});
  };

  $scope.budify = function (content) {
    $state.go('bud.editor',{parentBud : $scope.bud, content: content});
  };

  $scope.delete = function () {
    api.buds.delete($scope.bud.id).success(function (){
      $state.go('home.stickers');
    });
  };

  $scope.canDelete = function () {
    if(!$scope.bud) {
      return false;
    }
    var goodUser = ($scope.bud.creator.id == $scope.common.user.id);
    var noSubBuds = (!$scope.bud.subBuds || $scope.bud.subBuds.length == 0);
    return goodUser && noSubBuds;
  }

  $scope.share = function () {
    api.actors.list().success(function (actors)
    {
      var modalInstance = $modal.open({
        templateUrl: 'sharebox.html',
        controller: 'ShareboxCtrl',
        size: 'lg',
        resolve: {
          shares: function () {
            return $scope.bud.shares;
          },
          users: function () {
            return actors.users;
          },
          teams: function () {
            return actors.teams;
          }
        }
      });

      modalInstance.result.then(function (actors) {
        //share to ->
        api.buds.share($scope.bud, actors).success(function (bud) {
          console.info ('shared!');
        });

      }, function () {
        //dismiss
      });
    });
  };

  $scope.canShare = function ()
  {
    var sharable = false;
    if(!$scope.bud) {
      return sharable;
    }

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
      $scope.bud.comments.push(comment);
    }
  });

  api.buds.updated.subscribe($scope, function (bud) {
    if ($scope.bud.id === bud.id)
    {
      $scope.bud = bud;
      if(bud.shares)
      {
        $scope.shareCount = bud.shares.length;
      }
    }
  });

  api.buds.evolved.subscribe($scope, function (bud) {
    if ($scope.bud.id === bud.id)
    {
      $scope.load ();
    }
  });

  api.qi.updated.subscribe($scope, function (bud) {
    if ($scope.bud.id === bud.id)
    {
      $scope.bud.qi = bud.qi;
    }
  });

});
