'use strict';

/**
 * Profile controller gives the user the means to view/edit their public profile info.
 */

angular.module('sushi.profile').controller('ProfileCtrl', function ($scope) {
  $scope.user = $scope.common.user;
});
