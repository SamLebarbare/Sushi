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
  $scope.mailSended = false;
  $scope.mailErrored = false;
  $scope.follower = false;
  $scope.actionInProgress = false;
  $scope.followersCount = 0;
  $scope.sponsorsCount = 0;
  $scope.supportersCount = 0;
  $scope.supportValue = 0;
  $scope.shareCount = 0;

  // Helpers for bud packs

  $scope.startParentIfNeeded = function (type) {
    if($scope.bud.parentBud !== undefined) {
      var parentBudId = $scope.bud.parentBud.id;
      api.buds.budPacksData.get($scope.bud.parentBud.id, type)
      .success (function (packData) {
        if (packData.state == 'Waiting') {
          packData.state = 'Started';
          api.buds.budPacksData.set(parentBudId, packData, type);
        }
      });
    }
  };

  $scope.getParentPackData = function (type, callback) {
    if($scope.bud.parentBud !== undefined) {
      var parentBudId = $scope.bud.parentBud.id;
      api.buds.budPacksData.get($scope.bud.parentBud.id, type)
      .success (function (packData) {
        callBack (packData);
      });
    } else {
      callBack (null);
    }
  };

  $scope.subscribeAll = function () {
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
        $scope.load ();
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
        $scope.load ();
      }
    });

    api.buds.sharesChanged.subscribe($scope, function (bud) {
      if ($scope.bud.id === bud.id)
      {
        $scope.load ();
      }
    });

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
  };

  //Init view
  $scope.init = function (bud) {
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
  };
  // retrieve one bud from server
  $scope.load = function (callback)
  {
    console.info ('loading...');
    $scope.actionInProgress = true;
    $scope.ready = false;
    api.buds.view($stateParams.budId).success(function (bud)
    {
      console.info ('init...');
      $scope.init (bud);
      console.info ('subscribe...');
      $scope.subscribeAll ();
      $scope.ready = true;
      console.info ('load budpack view...');
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


  //Bud (re)loader
  $scope.load();

  $scope.showType = function (type, reload) {
    if (type != 'Bud') {
      $state.go('bud.viewer.' + type, $state.params, { reload: reload });
    } else {
      $state.go('bud.viewer',$state.params, { reload: reload });
    }
  };

  $scope.sendByMail = function ($event) {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }
    $scope.actionInProgress = true;
    $scope.mailSended = false;
    $scope.mailErrored = false;
    
    var modalInstance = $modal.open ({
      templateUrl: 'sendbymail.html',
      controller: 'SendByMailCtrl',
      size: 'lg',
      resolve: {}
    });

    modalInstance.result.then(function (to) {
      //sendemail
      api.buds.sendByMail ($scope.bud.id, to)
      .success (function (){
        $scope.mailSended       = true;
        $scope.actionInProgress = false;
      })
      .error (function (){
        $scope.mailErrored      = true;
        $scope.actionInProgress = false;
      });
    }, function () {
      //dismiss
      $scope.actionInProgress = false;
    });
  };

  $scope.evolve = function ($event) {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }
    $scope.actionInProgress = true;

    var modalInstance = $modal.open ({
      templateUrl: 'evolvebox.html',
      controller: 'EvolveCtrl',
      size: 'lg',
      resolve: {
        availableTypes: function () {
          return $scope.common.availableTypes;
        }
      }
    });

    modalInstance.result.then(function (selectedType) {
      api.buds.evolve($scope.bud.id, selectedType).success(function () {
        $scope.actionInProgress = false;
      })
      .error(function ()
      {
        $scope.actionInProgress = false;
      });
    }, function () {
      //dismiss
      $scope.actionInProgress = false;
    });
  };

  $scope.canEvolve = function ()
  {
    if(!$scope.bud) {
      return false;
    }

    if($scope.bud.typeInfo.evolve === true && $scope.bud.creator.id === user.id) {
      return true;
    } else {
      return false;
    }
  }

  $scope.edit = function () {
    $state.go('bud.editor',{budId : $scope.bud});
  };

  $scope.canEdit = function ()
  {
    if(!$scope.bud) {
      return false;
    }

    if($scope.bud.creator.id === user.id) {
      return true;
    } else {
      return false;
    }
  }

  $scope.editSubBud = function () {
    $state.go('bud.editor',{parentBud : $scope.bud});
  };

  $scope.budify = function (content) {
    $state.go('bud.editor',{parentBud : $scope.bud, content: content});
  };

  $scope.delete = function () {
    api.buds.delete($scope.bud.id).success(function (){
      $state.go('home.budlist');
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
    //follow bud automaticly
    if (!$scope.follower) {
      console.log ('follow');
      $scope.followBud ();
    }
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

});
