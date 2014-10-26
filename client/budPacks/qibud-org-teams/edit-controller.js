'use strict';

/**
 * __
 */

angular.module('qibud.org.teams').controller('TeamEditorCtrl',
function ($scope, $state, $stateParams, $location, api)
{
  var user        = $scope.common.user;
  $scope.packData = {
    members : []
  };
  $scope.users    = [];

  api.users.list().success(function (users)
  {
    $scope.users = users;

    api.buds.packdatas.get($scope.editedBud.id, 'team')
      .success(function (packData)
      {

        if(packData.members) {
          $scope.packData = packData;
          console.log('packdata found:' + packData);
          $scope.packData.members.forEach (function (user){
            _.remove($scope.users, function(u) { return u.id === user.id; });
          });
        } else {
          api.buds.packdatas.create($scope.editedBud.id, $scope.packData, 'team');
        }
      })
      .error(function ()
      {
        console.log('error while loading packdata');
      });
  });

  $scope.addUser = function (user) {
    $scope.packData.members.push(user);
    _.remove($scope.users, function(u) { return u.id === user.id; });
    api.buds.packdatas.set($scope.editedBud.id, $scope.packData, 'team');
  };

  $scope.rmUser = function (user) {
    $scope.users.push(user);
    _.remove($scope.packData.members, function(u) { return u.id === user.id; });
    api.buds.packdatas.set($scope.editedBud.id, $scope.packData, 'team');

  };


});
