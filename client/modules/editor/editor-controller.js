'use strict';

/**
 * Editor controller provide a good way to edit/write buds
 */

angular.module('qibud.editor').controller('EditorCtrl',
function ($scope, $state, $stateParams, $modal, $location, api)
{
  var user       = $scope.common.user;

  if($stateParams.budId)
  {
    api.buds.view($stateParams.budId).success(function (bud)
    {
      $scope.editedBud = bud;
      $scope.budBox = {
        title: bud.title,
        content: bud.content,
        privacy: bud.privacy,
        type : bud.type,
        disabled: false,
        action: 'update'
      };

      $scope.setType(bud.type);
    });
  }
  else
  {
    $scope.budBox  = {
      title: null,
      content: null,
      type: 'Bud',
      disabled: false,
      privacy: 'Private',
      action: 'create'
    };
  }

  if($stateParams.parentBudId)
  {
    api.buds.view($stateParams.parentBudId).success(function (bud)
    {
      $scope.parentBud = bud;
    });

    $scope.budBox.action = 'subbud';
  }

  if($stateParams.content)
  {
    $scope.budBox.content = $stateParams.content;
  }

  $scope.editorOptions = {uiColor: '#000000'};

  $scope.setType = function (type) {
    if(type === 'Bud') {
      $state.go('bud.editor');
    } else {
      $state.go('bud.editor.' + type);
    }
  };

  // add bud creation functions to scope
  $scope.createBud = function ($event)
  {

    // don't let the user type in blank lines or submit empty/whitespace only bud, or type in something when bud is being created
    if (!$scope.budBox.content.length || $scope.budBox.disabled)
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

    var createSubBud = function (selectedType)
    {
      // disable the bud box and push the new bud to server
      $scope.budBox.disabled = true;
      api.buds.createSub($scope.parentBud.id,{
        title: $scope.budBox.title,
        content: $scope.budBox.content,
        privacy: $scope.budBox.privacy,
        type   : $scope.budBox.type
      })
      .success(function (budId)
        {
          // clear the bud box and enable it
          $scope.budBox.title = '';
          $scope.budBox.content = '';
          $scope.budBox.disabled = false;

          console.info ('subbud created');
          if (selectedType !== null) {//evolve if needed
            api.buds.evolve(budId, selectedType).success(function () {
              console.info ('bud evolve in ' + selectedType);
              $state.go('bud.viewer.' + selectedType ,{budId : budId},{ reload: true });
            });
          } else {
            $state.go('bud.viewer',{budId : budId},{ reload: true });
          }
        })
        .error(function ()
        {
          // don't clear the bud box but enable it so the user can re-try
          $scope.budBox.disabled = false;
        });
    };

    var createBud = function (selectedType) {
      // disable the bud box and push the new bud to server
      $scope.budBox.disabled = true;
      api.buds.create({
        title: $scope.budBox.title,
        content: $scope.budBox.content,
        privacy: $scope.budBox.privacy,
        type   : $scope.budBox.type
      })
      .success(function (budId)
          {
            // clear the bud box and enable it
            $scope.budBox.title = '';
            $scope.budBox.content = '';
            $scope.budBox.disabled = false;

            console.info ('bud created');
            if (selectedType !== null) {//evolve if needed
              api.buds.evolve(budId, selectedType).success(function () {
                console.info ('bud evolve in ' + selectedType);
                $state.go('bud.viewer.' + selectedType ,{budId : budId},{ reload: true });
              });
            } else {
              $state.go('bud.viewer',{budId : budId},{ reload: true });
            }
        })
        .error(function ()
        {
          // don't clear the bud box but enable it so the user can re-try
          $scope.budBox.disabled = false;
        });
    };

    modalInstance.result.then(function (selectedType) {
      if ($scope.parentBud.id) {
        createSubBud (selectedType);
      } else {
        createBud (selectedType);
      }

    }, function () {
      if ($scope.parentBud.id) {
        createSubBud (null);
      } else {
        createBud (null);
      }
    });
  };


  $scope.updateBud = function ($event)
  {
    // don't let the user type in blank lines or submit empty/whitespace only bud, or type in something when bud is being created
    if (!$scope.budBox.content.length || $scope.budBox.disabled)
    {
      $event.preventDefault();
      return;
    }

    // disable the bud box and push the new bud to server
    $scope.budBox.disabled = true;

    $scope.editedBud.title   = $scope.budBox.title;
    $scope.editedBud.content = $scope.budBox.content;
    $scope.editedBud.privacy = $scope.budBox.privacy;
    $scope.editedBud.type    = $scope.budBox.type === 'Bud' ?
                                '' : $scope.budBox.type;




    api.buds.update($scope.editedBud).success(function (bud)
    {
      //redirect
      $state.go('bud.viewer', {budId: $scope.editedBud.id},{ reload: true });
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
