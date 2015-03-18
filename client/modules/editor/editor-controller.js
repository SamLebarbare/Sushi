'use strict';

/**
 * Editor controller provide a good way to edit/write sushis
 */

angular.module('sushi.editor').controller('EditorCtrl',
function ($scope, $state, $stateParams, $modal, $location, api)
{
  var user       = $scope.common.user;

  if($stateParams.sushiId)
  {
    api.sushis.view($stateParams.sushiId).success(function (sushi)
    {
      $scope.editedSushi = sushi;
      $scope.sushiBox = {
        title: sushi.title,
        content: sushi.content,
        privacy: sushi.privacy,
        type : sushi.type,
        disabled: false,
        action: 'update'
      };

      $scope.setType(sushi.type);
    });
  }
  else
  {
    $scope.sushiBox  = {
      title: null,
      content: null,
      type: 'Sushi',
      disabled: false,
      privacy: 'Private',
      action: 'create'
    };
  }

  if($stateParams.parentSushiId)
  {
    api.sushis.view($stateParams.parentSushiId).success(function (sushi)
    {
      $scope.parentSushi = sushi;
    });

    $scope.sushiBox.action = 'subsushi';
  }

  if($stateParams.content)
  {
    $scope.sushiBox.content = $stateParams.content;
  }

  $scope.editorOptions = {uiColor: '#000000'};

  // add sushi creation functions to scope
  $scope.createSushi = function ($event)
  {

    // don't let the user type in blank lines or submit empty/whitespace only sushi, or type in something when sushi is being created
    if (!$scope.sushiBox.content.length || $scope.sushiBox.disabled)
    {
      $event.preventDefault();
      return;
    }

    var modalInstance = $modal.open ({
      templateUrl: 'evolvebox.html',
      controller: 'EvolveCtrl',
      size: 'lg',
      resolve: {
        availableTypes: function () {
          return $scope.common.availableTypes;
        }
      }
    });

    var createSubSushi = function (selectedType)
    {
      // disable the sushi box and push the new sushi to server
      $scope.sushiBox.disabled = true;
      api.sushis.createSub($scope.parentSushi.id,{
        title: $scope.sushiBox.title,
        content: $scope.sushiBox.content,
        privacy: $scope.sushiBox.privacy,
        type   : $scope.sushiBox.type
      })
      .success(function (sushiId)
        {
          // clear the sushi box and enable it
          $scope.sushiBox.title = '';
          $scope.sushiBox.content = '';
          $scope.sushiBox.disabled = false;

          console.info ('subsushi created');
          if (selectedType !== null) {//evolve if needed
            api.sushis.evolve(sushiId, selectedType).success(function () {
              console.info ('sushi evolve in ' + selectedType);
              $state.go('sushi.viewer',{sushiId : sushiId},{ reload: true });
            });
          } else {
            $state.go('sushi.viewer',{sushiId : sushiId},{ reload: true });
          }
        })
        .error(function ()
        {
          // don't clear the sushi box but enable it so the user can re-try
          $scope.sushiBox.disabled = false;
        });
    };

    var createSushi = function (selectedType) {
      // disable the sushi box and push the new sushi to server
      $scope.sushiBox.disabled = true;
      api.sushis.create({
        title: $scope.sushiBox.title,
        content: $scope.sushiBox.content,
        privacy: $scope.sushiBox.privacy,
        type   : $scope.sushiBox.type
      })
      .success(function (sushiId)
          {
            // clear the sushi box and enable it
            $scope.sushiBox.title = '';
            $scope.sushiBox.content = '';
            $scope.sushiBox.disabled = false;

            console.info ('sushi created');
            if (selectedType !== null) {//evolve if needed
              api.sushis.evolve(sushiId, selectedType).success(function () {
                console.info ('sushi evolve in ' + selectedType);
                $state.go('sushi.viewer',{sushiId : sushiId},{ reload: true });
              });
            } else {
              $state.go('sushi.viewer',{sushiId : sushiId},{ reload: true });
            }
        })
        .error(function ()
        {
          // don't clear the sushi box but enable it so the user can re-try
          $scope.sushiBox.disabled = false;
        });
    };

    modalInstance.result.then(function (selectedType) {
      if ($scope.parentSushi) {
        createSubSushi (selectedType);
      } else {
        createSushi (selectedType);
      }

    }, function () {
      if ($scope.parentBub) {
        createSubSushi (null);
      } else {
        createSushi (null);
      }
    });
  };


  $scope.updateSushi = function ($event)
  {
    // don't let the user type in blank lines or submit empty/whitespace only sushi, or type in something when sushi is being created
    if (!$scope.sushiBox.content.length || $scope.sushiBox.disabled)
    {
      $event.preventDefault();
      return;
    }

    // disable the sushi box and push the new sushi to server
    $scope.sushiBox.disabled = true;

    $scope.editedSushi.title   = $scope.sushiBox.title;
    $scope.editedSushi.content = $scope.sushiBox.content;
    $scope.editedSushi.privacy = $scope.sushiBox.privacy;

    api.sushis.update($scope.editedSushi).success(function (sushi)
    {
      //redirect
      $state.go('sushi.viewer', {sushiId: $scope.editedSushi.id},{ reload: true });
    })
    .error(function ()
    {
      // don't clear the sushi box but enable it so the user can re-try
      $scope.sushiBox.disabled = false;
    });
  };



  // subscribe to websocket events to receive new sushis, comments, etc.
  api.sushis.created.subscribe($scope, function (sushi)
  {

  });

});
