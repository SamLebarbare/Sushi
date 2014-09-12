'use strict';

/**
 * Editor controller provide a good way to edit/write buds
 */

angular.module('qibud.editor').controller('EditorCtrl', function ($scope, $location, api)
{
  var user       = $scope.common.user;
  $scope.budBox  = {title: null, content: null, disabled: false};
  $scope.editorOptions = {uiColor: '#000000'};

  // add bud creation functions to scope
  $scope.createBud = function ($event)
  {
    // don't let the user type in blank lines or submit empty/whitespace only bud, or type in something when bud is being created
    if (!$scope.budBox.content.length || $scope.budBox.disabled)
    {
      $event.preventDefault();
      return;
    }

    // disable the bud box and push the new bud to server
    $scope.budBox.disabled = true;
    api.buds.create({title: $scope.budBox.title, content: $scope.budBox.content})
        .success(function (budId)
        {
          // only add the bud if we don't have it already in the buds list to avoid dupes
          if (!_.some($scope.buds, function (b)
          {
            return b.id === budId;
          }))
          {

          }

          // clear the bud box and enable it
          $scope.budBox.title = '';
          $scope.budBox.message = '';
          $scope.budBox.disabled = false;
          //redirect
          $location.path('/viewer/' + budId);
        })
        .error(function ()
        {
          // don't clear the bud box but enable it so the user can re-try
          $scope.budBox.disabled = false;
        });
  };

  // subscribe to websocket events to receive new buds, comments, etc.
  api.buds.created.subscribe($scope, function (bud)
  {

  });

});
