'use strict';

angular.module('qibud.viewer').controller('ShareboxCtrl', function ($scope, $modalInstance, users) {

  $scope.users = users;
  $scope.selectedUsers = [];

  $scope.addUser = function (user) {
    $scope.selectedUsers.push(user);
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selectedUsers);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
