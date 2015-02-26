'use strict';

/**
 * __
 */

angular.module('qibud.org.missions').controller('MissionViewerCtrl',
function ($scope, $state, $stateParams, api)
{
  console.log("MissionViewerCtrl start...");
  var user        = $scope.common.user;
  $scope.packData = {
    state: 'Waiting',
    projects: [],
    actor: undefined,
    team: undefined
  };
  var afterLoad = function (done) {
    $scope.getPackData (function (packData)
    {
      if(packData.state) {
        $scope.packData = packData;
        api.buds.parentByType ($scope.bud.id, 'Team').success(function (teams) {
          if(teams.length > 0) {
            $scope.packData.team = teams[0];
          }
          api.buds.childrenByType ($scope.bud.id, 'Project').success(function (projects) {
            $scope.packData.projects = projects;
            if(projects.length > 0)
            {
              $scope.packData.state = 'Started';
              var scope = $scope;
              angular.forEach(projects, function (project) {
                if(project.dataCache.state === 'Ended') {
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
        });
      } else {
        $scope.createPackData ($scope.packData, done);
      }
    });
  };

  $scope.load (afterLoad);
});
