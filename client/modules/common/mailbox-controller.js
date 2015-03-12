
angular.module('sushi.common').controller('MailboxCtrl',
function ($scope, $modal, api)
{
  $scope.emails = {};
  api.mailboxes.get().success(function (emails) {
    $scope.emails = emails;
  });

  $scope.openEmail = function (email) {
    var modalInstance = $modal.open({
      templateUrl: 'mail.html',
      controller: 'MailConverterCtrl',
      size: 'lg',
      resolve: {
        email: function () {
          return email;
        }
      }
    });

    modalInstance.result.then(function (budId) {
      //view bud

    }, function () {
      //dismiss
    });
  };
});
