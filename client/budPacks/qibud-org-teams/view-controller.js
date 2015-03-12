'use strict';

/**
 * __
 */

angular.module('sushi.org.teams').controller('TeamViewerCtrl',
function ($scope, $state, $stateParams, $location, api)
{
  var user       = $scope.common.user;
  $scope.users    = [];
  $scope.packData = {
    members : [],
    missions: [],
  };
  $scope.canEditTeam = function () {
    return $scope.bud.creator.id === user.id;
  };
  $scope.addUser = function (user) {
    $scope.packData.members.push(user);
    _.remove($scope.users, function(u) { return u.id === user.id; });
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Team');
    api.links.createU2B(user.id,'MEMBER',$scope.bud.id);
  };

  $scope.rmUser = function (user) {
    $scope.users.push(user);
    _.remove($scope.packData.members, function(u) { return u.id === user.id; });
    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Team');
    api.links.deleteU2B(user.id,'MEMBER',$scope.bud.id);
  };

  var afterLoad = function (done) {
    api.users.list().success(function (users)
    {
      $scope.users = users;

      api.buds.budPacksData.get($scope.bud.id, 'Team')
      .success(function (packData)
      {

        api.buds.childrenByType ($scope.bud.id, 'Mission')
        .success(function (missions)
        {
          $scope.packData.missions = missions;
        });

        if(packData.members) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);
          $scope.packData.members.forEach (function (user){
            _.remove($scope.users, function(u) { return u.id === user.id; });
          });
        } else {
          api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Team');
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
});
