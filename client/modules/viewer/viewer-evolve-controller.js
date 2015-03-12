'use strict';

angular.module('sushi.viewer').controller('EvolveCtrl', function ($scope, $modalInstance, availableTypes) {

  $scope.availableTypes = availableTypes;
  $scope.selectedType = 'Bud';

  $scope.setSelected = function (type) {
    $scope.selectedType = type;
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selectedType);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
