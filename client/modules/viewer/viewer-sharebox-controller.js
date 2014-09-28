'use strict';

angular.module('qibud.viewer').controller('ShareboxCtrl', function ($scope, $modalInstance, users) {

  $scope.users = users;
  $scope.selectedUsers = [];

  $scope.addUser = function (user) {
    $scope.selectedUsers.push(user);
    _.remove($scope.users, function(u) { return u.id === user.id; });
  };

  $scope.rmUser = function (user) {
    $scope.users.push(user);
    _.remove($scope.selectedUsers, function(u) { return u.id === user.id; });
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selectedUsers);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
