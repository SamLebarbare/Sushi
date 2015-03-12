'use strict';

angular.module('sushi.viewer').controller('AssignboxCtrl', function ($scope, $modalInstance, users, actor) {

  $scope.users = users;
  $scope.selectedUser = actor;

  $scope.assignUser = function (user) {
    if ($scope.selectedUser) {
      $scope.users.push($scope.selectedUser);
    }
    $scope.selectedUser = user;
    _.remove($scope.users, function(u) { return u.id === user.id; });
  };

  $scope.unassignUser = function (user) {
    $scope.users.push(user);
    $scope.selectedUser = undefined;
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selectedUser);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
