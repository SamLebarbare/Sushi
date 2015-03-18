'use strict';

/**
 * Viewer controller provide a good way to read sushis
 */

angular.module('sushi.viewer').controller('ViewerCtrl',
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

  // Helpers for sushi packs

  $scope.endPackData = function (packData, callback)
  {
    api.sushis.sushiPacksData.end($scope.sushi.id, packData, $scope.sushi.type)
    .success (function () {
      if(callback) {
        callback();
      }
    });
  };

  $scope.savePackData = function (packData, callback)
  {
    api.sushis.sushiPacksData.set($scope.sushi.id, packData, $scope.sushi.type)
    .success (function () {
      if(callback) {
        callback();
      }
    });
  };

  $scope.getPackData = function (callback)
  {
    api.sushis.sushiPacksData.get($scope.sushi.id, $scope.sushi.type)
    .success (function (packData) {
      callback (packData);
    });
  };

  $scope.createPackData = function (packData, callback)
  {
    api.sushis.sushiPacksData.create($scope.sushi.id, packData, $scope.sushi.type)
    .success (function () {
      if(callback) {
        callback();
      }
    });
  };

  $scope.startParentIfNeeded = function (type) {
    if($scope.sushi.parentSushi !== undefined) {
      var parentSushiId = $scope.sushi.parentSushi.id;
      api.sushis.sushiPacksData.get($scope.sushi.parentSushi.id, type)
      .success (function (packData) {
        if (packData.state == 'Waiting') {
          packData.state = 'Started';
          api.sushis.sushiPacksData.set(parentSushiId, packData, type);
        }
      });
    }
  };

  $scope.getParentPackData = function (type, callback) {
    if($scope.sushi.parentSushi !== undefined) {
      var parentSushiId = $scope.sushi.parentSushi.id;
      api.sushis.sushiPacksData.get($scope.sushi.parentSushi.id, type)
      .success (function (packData) {
        callBack (packData);
      });
    } else {
      callBack (null);
    }
  };



  $scope.isActor = function ()
  {
    if ($scope.sushi.dataCache.actor !== undefined) {
      if($scope.sushi.dataCache.actor.id === user.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  $scope.isCreator = function ()
  {
    if ($scope.sushi.creator !== undefined) {
      if($scope.sushi.creator.id === user.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  $scope.isActorOrCreator = function ()
  {
    return ($scope.isActor() || $scope.isCreator());
  };

  $scope.setActor = function ($event, newState, packData, callback)
  {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }

    $scope.actionInProgress = true;

    packData.actor = user;
    packData.state = newState;
    $scope.savePackData (packData, function () {
      api.links.createU2B(user.id,'ACTOR',$scope.sushi.id)
      .success (function () {
        $scope.actionInProgress = false;
        callback ();
      });
    });
  };

  $scope.assignActor = function ($event, newState, packData, callback)
  {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }

    $scope.actionInProgress = true;

    $scope.assign (function (actor) {
      packData.actor = actor;
      packData.state = newState;
      api.links.createU2B(actor.id,'ACTOR', $scope.sushi.id);
      $scope.savePackData (packData, function () {
        $scope.actionInProgress = false;
        callback ();
      });
    });
  };

  $scope.unsetActor = function ($event, newState, packData, callback)
  {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }

    $scope.actionInProgress = true;
    api.links.deleteU2B(packData.actor.id,'ASSIGNED',$scope.sushi.id);
    api.links.deleteU2B(packData.actor.id,'ACTOR',$scope.sushi.id);
    packData.actor = undefined;
    packData.state = newState;
    $scope.savePackData (packData, function () {
      $scope.actionInProgress = false;
      callback ();
    });
  };

  $scope.subscribeAll = function () {
    api.sushis.comments.created.subscribe($scope, function (comment) {
      // only add the comment if we don't have it already in the sushi's comments list to avoid dupes
      if ($scope.sushi && !_.some($scope.sushi.comments, function (c)
      {
        return c.id === comment.id;
      }))
      {
        $scope.sushi.comments.push(comment);
      }
    });

    api.sushis.updated.subscribe($scope, function (sushi) {
      if ($scope.sushi.id === sushi.id)
      {
        $scope.load ();
      }
    });

    api.sushis.evolved.subscribe($scope, function (sushi) {
      if ($scope.sushi.id === sushi.id)
      {
        $scope.load ();
      }
    });

    api.qi.updated.subscribe($scope, function (sushi) {
      if ($scope.sushi.id === sushi.id)
      {
        $scope.load ();
      }
    });

    api.sushis.sharesChanged.subscribe($scope, function (sushi) {
      if ($scope.sushi.id === sushi.id)
      {
        $scope.load ();
      }
    });

    api.sushis.followersChanged.subscribe($scope, function (sushi) {
      if ($scope.sushi.id === sushi.id)
      {
        $scope.sushi.followers = sushi.followers;
        $scope.followersCount = sushi.followers.length;
        if(sushi.followers.indexOf(user.id)!== -1)
        {
          $scope.follower = true;
        }
        else
        {
          $scope.follower = false;
        }
      }
    });

    api.sushis.supportersChanged.subscribe($scope, function (sushi) {
      if ($scope.sushi.id === sushi.id)
      {
        $scope.sushi.supporters = sushi.supporters;
        $scope.supportersCount = sushi.supporters.length;

        if(sushi.supporters.indexOf(user.id) !== -1)
        {
          $scope.supporter = true;
        }
        else
        {
          $scope.supporter = false;
        }
      }
    });

    api.sushis.sponsorsChanged.subscribe($scope, function (sushi) {
      if ($scope.sushi.id === sushi.id)
      {
        $scope.sushi.sponsors = sushi.sponsors;
        $scope.sponsorsCount = sushi.sponsors.length;
        if(sushi.sponsors.indexOf(user.id) !== -1)
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

  $scope.$watch('files', function () {
    $scope.upload ($scope.files);
  });

  $scope.upload = function (files)
  {
    api.sushis.upload($scope.sushi.id, files);
  };

  $scope.removeAttachment = function (file)
  {
    api.sushis.unload($scope.sushi.id, file.name);
  };

  //Init view
  $scope.init = function (sushi) {
    sushi.commentBox = {message: '', disabled: false};
    sushi.comments   = sushi.comments || [];

    $scope.sushi = sushi;
    if(sushi.followers)
    {
      $scope.followersCount = sushi.followers.length;
      if(sushi.followers.indexOf(user.id)!== -1)
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

    if(sushi.sponsors)
    {
      $scope.sponsorsCount = sushi.sponsors.length;
      if(sushi.sponsors.indexOf(user.id)!== -1)
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

    if(sushi.supporters)
    {
      $scope.supportersCount = sushi.supporters.length;
      if(sushi.supporters.indexOf(user.id)!== -1)
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

    if(sushi.shares)
    {
      $scope.shareCount = sushi.shares.length;
    } else {
      $scope.shareCount = 0;
    }
  };
  // retrieve one sushi from server
  $scope.load = function (callback)
  {
    console.info ('loading...');
    $scope.actionInProgress = true;
    $scope.ready = false;
    api.sushis.view($stateParams.sushiId).success(function (sushi)
    {
      console.info ('init...');
      $scope.init (sushi);
      console.info ('subscribe...');
      $scope.subscribeAll ();
      $scope.ready = true;
      console.info ('load sushipack view...');
      $scope.showType ($scope.sushi.type, false);
      console.info ('loaded!');

      if (callback) {
        console.info ('calling sushipack...')
        callback(function () {
          $scope.actionInProgress = false;
          console.info ('Sushipack loaded!');
        });
      } else {
        $scope.actionInProgress = false;
        console.info ('Sushipack loaded!');
      }

    });
  }


  //Sushi (re)loader
  $scope.load();

  $scope.showType = function (type, reload) {
    if (type != 'Sushi') {
      $state.go('sushi.viewer.' + type, $state.params, { reload: reload });
    } else {
      $state.go('sushi.viewer',$state.params, { reload: reload });
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
      api.sushis.sendByMail ($scope.sushi.id, to)
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
      api.sushis.evolve($scope.sushi.id, selectedType).success(function () {
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
    if(!$scope.sushi) {
      return false;
    }

    if($scope.sushi.typeInfo.evolve === true && $scope.sushi.creator.id === user.id) {
      return true;
    } else {
      return false;
    }
  }

  $scope.edit = function () {
    $state.go('sushi.editor',{sushiId : $scope.sushi});
  };

  $scope.canEdit = function ()
  {
    if(!$scope.sushi) {
      return false;
    }

    if($scope.sushi.creator.id === user.id) {
      return true;
    } else {
      return false;
    }
  }

  $scope.editSubSushi = function () {
    $state.go('sushi.editor',{parentSushi : $scope.sushi});
  };

  $scope.sushiify = function (content) {
    $state.go('sushi.editor',{parentSushi : $scope.sushi, content: content});
  };

  $scope.delete = function () {
    api.sushis.delete($scope.sushi.id).success(function (){
      $state.go('home.sushilist');
    });
  };

  $scope.canDelete = function () {
    if(!$scope.sushi) {
      return false;
    }
    var goodUser = ($scope.sushi.creator.id == $scope.common.user.id);
    var noSubSushis = (!$scope.sushi.subSushis || $scope.sushi.subSushis.length == 0);
    return goodUser && noSubSushis;
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
            return $scope.sushi.shares;
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
        api.sushis.share($scope.sushi, actors).success(function (sushi) {
          console.info ('shared!');
        });

      }, function () {
        //dismiss
      });
    });
  };

  $scope.assign = function (callback) {
    api.actors.list().success(function (actors)
    {
      var modalInstance = $modal.open({
        templateUrl: 'assignbox.html',
        controller: 'AssignboxCtrl',
        size: 'lg',
        resolve: {
          users: function () {
            return actors.users;
          },
          actor: function () {
            return $scope.sushi.dataCache.actor;
          }
        }
      });

      modalInstance.result.then(function (actor) {
        if($scope.sushi.dataCache.actor) {
          api.links.deleteU2B($scope.dataCache.actor.id,'ASSIGNED',$scope.sushi.id);
        }
        //assign actor to sushi ->
        api.links.createU2B(actor.id,'ASSIGNED',$scope.sushi.id);
        callback (actor);
      }, function () {
        //dismiss
      });
    });
  };

  $scope.canShare = function ()
  {
    var sharable = false;
    if(!$scope.sushi) {
      return sharable;
    }

    var creatorId = $scope.sushi.creator.id;

    //TODO: Add a watch on privacy changes check actor
    switch($scope.sushi.privacy)
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


  $scope.followSushi = function ($event)
  {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }

    $scope.actionInProgress = true;
    if(!$scope.follower)
    {
      api.sushis.follow($scope.sushi)
        .success(function (sushiId)
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
      api.sushis.unfollow($scope.sushi)
        .success(function (sushiId)
        {
          $scope.actionInProgress = false;
        })
        .error(function ()
        {
          $scope.actionInProgress = false;
        });
    }
  }

  $scope.supportSushi = function ($event)
  {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }

    $scope.actionInProgress = true;

    if(!$scope.supporter)
    {
      api.sushis.support($scope.sushi, $scope.supportValue)
        .success(function (sushiId)
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
      api.sushis.unsupport($scope.sushi)
        .success(function (sushiId)
        {
          $scope.actionInProgress = false;
        })
        .error(function ()
        {
          $scope.actionInProgress = false;
        });
    }
  }

  $scope.sponsorSushi = function ($event)
  {
    if ($scope.actionInProgress)
    {
      $event.preventDefault();
      return;
    }
    $scope.actionInProgress = true;

    if(!$scope.sponsorer)
    {
      api.sushis.sponsor($scope.sushi)
        .success(function (sushiId)
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
      api.sushis.unsponsor($scope.sushi)
        .success(function (sushiId)
        {
          $scope.actionInProgress = false;
        })
        .error(function ()
        {
          $scope.actionInProgress = false;
        });
    }
  }

  $scope.createComment = function ($event, sushi)
  {
    // submit the message in the comment box only if user hits 'Enter (keycode 13)'
    if ($event.keyCode !== 13)
    {
      return;
    }

    // don't let the user type in blank lines or submit empty/whitespace only comment, or type in something when comment is being created
    if (!sushi.commentBox.message.length || sushi.commentBox.disabled) {
      $event.preventDefault();
      return;
    }

    // disable the comment box and push the new comment to server
    sushi.commentBox.disabled = true;
    //follow sushi automaticly
    if (!$scope.follower) {
      console.log ('follow');
      $scope.followSushi ();
    }
    api.sushis.comments.create(sushi.id, {message: sushi.commentBox.message})
        .success(function (commentId)
        {
          // only add the comment if we don't have it already in the sushi's comments list to avoid dupes
          if (!_.some(sushi.comments, function (c) {
            return c.id === commentId;
          }))
          {
            sushi.comments.push({
              id: commentId,
              from: user,
              message: sushi.commentBox.message,
              createdTime: new Date()
            });
          }

          // clear the comment field and enable it
          sushi.commentBox.message  = '';
          sushi.commentBox.disabled = false;
        })
        .error(function ()
        {
          // don't clear the comment box but enable it so the user can re-try
          sushi.commentBox.disabled = false;
        });

    // prevent default 'Enter' button behavior (create new line) as we want 'Enter' button to do submission
    $event.preventDefault();
  };

});
