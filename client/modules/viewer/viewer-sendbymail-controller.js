'use strict';

angular.module('qibud.viewer').controller('SendByMailCtrl', function ($scope, $modalInstance) {

  $scope.to = null;

  $scope.ok = function () {
    $modalInstance.close($scope.to);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
