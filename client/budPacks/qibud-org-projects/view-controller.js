'use strict';

/**
 * __
 */

angular.module('qibud.org.projects').controller('ProjectViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("ProjectViewerCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Waiting',
    actor: undefined,
    actions: []
  };
  var afterLoad = function (done) {
    //Parent state apply
    $scope.startParentIfNeeded ('Mission');

    //Inner state management
    $scope.getPackData (function (packData)
    {
      if(packData.state) {
        $scope.packData = packData;
        console.log('packdata found:' + packData);
        api.buds.childrenByType ($scope.bud.id, 'Action')
        .success(function (actions)
          {
            $scope.packData.actions = actions;
            if(actions.length > 0)
            {
              $scope.packData.state = 'Started';
              var scope = $scope;
              angular.forEach(actions, function (action) {
                if(action.dataCache.state === 'Ended') {
                  scope.packData.state = 'Ended';
                } else {
                  scope.packData.state = 'Started';
                }
              });
            } else {
              $scope.packData.state = 'Waiting';
            }
            if($scope.packData.state === 'Ended') {
              $scope.endPackData ($scope.packData, done);
            } else {
              $scope.savePackData ($scope.packData, done);
            }
          });
      } else {
        $scope.createPackData ($scope.packData, done);
      }
    });
  };

  $scope.load (afterLoad);
});
