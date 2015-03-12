'use strict';

/**
 * __
 */

angular.module('sushi.org.issues').controller('IssueViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("IssueViewerCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Free',
    actor: undefined,
    actions: []
  };

  var afterLoad = function (done) {
    $scope.getPackData (function (packData)
    {
      if(packData.state) {
        $scope.packData = packData;
        api.buds.childrenByType ($scope.bud.id, 'Action').success(function (actions) {
          $scope.packData.state = 'ActionsInProgress';
          $scope.packData.actions = actions;

          if($scope.packData.actions.length > 0) {
            var ended = true;
            angular.forEach ($scope.packData.actions, function (action) {
              console.log ('a');
              if(action.dataCache.state !== 'Ended') {
                $scope.packData.state = 'ActionsInProgress';
                ended = false;
                $scope.savePackData ($scope.packData, done);
              }
            });
            if(ended) {
              $scope.packData.state = 'Ended';
              $scope.endPackData ($scope.packData, done);
            }
          } else {
            $scope.savePackData ($scope.packData, done);
          }
        });
        done ();
      } else {
        $scope.createPackData ($scope.packData, done);
      }
    });
  };

  $scope.load (afterLoad);
});
