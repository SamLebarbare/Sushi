'use strict';

angular.module('sushi.viewer').controller('SendByMailCtrl', function ($scope, $modalInstance) {

  $scope.to = null;

  $scope.ok = function () {
    $modalInstance.close($scope.to);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
