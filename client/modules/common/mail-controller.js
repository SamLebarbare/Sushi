
angular.module('qibud.common').controller('MailConverterCtrl',
function ($scope, $modalInstance, email) {

  $scope.email = email;

  $scope.ok = function () {
    $modalInstance.close($scope.selectedUsers);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
