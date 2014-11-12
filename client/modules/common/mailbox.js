
angular.module('qibud.common').controller('Mailbox',
function ($scope, $modal, api)
{
  $scope.emails = {};
  api.mailboxes.get().success(function (emails) {
    $scope.emails = emails;
  });
});
