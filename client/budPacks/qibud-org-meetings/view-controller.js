'use strict';

/**
 * __
 */

angular.module('qibud.org.meetings').controller('MeetingViewerCtrl',
function ($scope, $state, $stateParams, $location, api)
{
  var user       = $scope.common.user;
  $scope.itemsByPage   = 10;
  $scope.displayedBuds = [];
  $scope.displayedBuds4Meeting = [];
  $scope.users    = [];
  $scope.packData = {
    participations : [],
    buds: [],
    state: 'Waiting'
  };

  $scope.startMeeting = function () {
    $scope.packData.state = 'Started';
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Meeting');
    $scope.load (afterLoad);
  };

  $scope.finishMeeting = function () {
    $scope.packData.state = 'Finished';
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Meeting');
    var scope = $scope;
    scope.packData.participations.forEach ( function (p) {
      api.links.deleteU2B(p.user.id,'INVITED',scope.bud.id);
    });
    $scope.load (afterLoad);
  };

  $scope.addBudToMeeting = function (bud) {
    $scope.packData.buds.push (bud);
    $scope.displayedBuds4Meeting = [].concat($scope.packData.buds);
    _.remove($scope.buds, function(b) { return b.id === bud.id; });
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Meeting');
  };

  $scope.removeBudFromMeeting = function (bud) {
    _.remove($scope.packData.buds, function(b) { return b.id === bud.id; });
    $scope.displayedBuds4Meeting = [].concat($scope.packData.buds);
    $scope.buds.push (bud);
    $scope.displayedBuds4Meeting = [].concat($scope.packData.buds);
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Meeting');
  };

  $scope.canSetParticipantState = function (participantId) {
    return participantId === user.id;
  };

  $scope.setParticipantState = function (userId, state) {
    var participation = _.find($scope.packData.participations, function(p) { return p.user.id === userId; });
    participation.state = state;
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Meeting');
    $scope.load (afterLoad);
  };

  $scope.canEditMeeting = function () {
    return $scope.bud.creator.id === user.id;
  };

  $scope.addUser = function (user) {
    var participation = {
      state: 'Waiting',
      user: user
    };
    $scope.packData.participations.push(participation);
    _.remove($scope.users, function(u) { return u.id === user.id; });
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Meeting');
    api.links.createU2B(user.id,'INVITED',$scope.bud.id);
  };

  $scope.rmUser = function (user) {
    $scope.users.push(user);
    _.remove($scope.packData.participations, function(p) { return p.user.id === user.id; });
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Meeting');
    api.links.deleteU2B(user.id,'INVITED',$scope.bud.id);
  };

  var afterLoad = function (done) {
    api.users.list().success(function (users)
    {
      $scope.users = users;

      api.buds.budPacksData.get($scope.bud.id, 'Meeting')
      .success(function (packData)
      {

        if(packData.state) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);
          $scope.packData.participations.forEach (function (user){
            _.remove($scope.users, function(u) { return u.id === user.id; });
          });
          $scope.displayedBuds4Meeting = [].concat($scope.packData.buds);
          api.buds.list().success(function (buds)
          {
            $scope.buds = buds;
            _.remove($scope.buds, function(b) { return b.id === $scope.bud.id; });
            $scope.packData.buds.forEach (function (bud){
              _.remove($scope.buds, function(b) { return b.id === bud.id; });
            });
            $scope.displayedBuds = [].concat($scope.buds);
          });
        } else {
          api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Meeting');
        }
        done ();
      })
      .error(function ()
      {
        console.log('error while loading packdata');
        done ();
      });
    });
  };

  $scope.load (afterLoad);

  // subscribe to websocket events to receive new buds, comments, etc.
  api.buds.created.subscribe($scope, function (bud)
  {
    // only add the bud if we don't have it already in the buds list to avoid dupes
    if (!_.some($scope.buds, function (b)
    {
      return b.id === bud.id;
    }))
    {
      $scope.buds.unshift(bud);
      $scope.displayedBuds = [].concat($scope.buds);
    }
  });
});
