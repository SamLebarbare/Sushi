'use strict';

/**
 * __
 */

angular.module('qibud.org.actions').controller('ActionViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("ActionViewerCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Free',
    actor: undefined
  };

  var afterLoad = function (done) {
    //Parent state apply
    $scope.startParentIfNeeded ('Project');

    //Inner state management
    $scope.getPackData(function (packData)
    {
      if(packData.state) {
        $scope.packData = packData;
        console.log('packdata found:' + packData);
        if($scope.packData.state === 'Ended') {
          $scope.endPackData ($scope.packData, done);
        }
      } else {
        $scope.createPackData ($scope.packData, done);
      }
    });
  };

  $scope.load (afterLoad);
});
