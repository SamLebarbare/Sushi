'use strict';

/**
 * Home controller simply lists all the buds from everyone on the front page.
 */

angular.module('qibud.home').controller('BudgraphCtrl',
function ($scope, $state, api, budGraph)
{
  var user       = $scope.common.user;
  var cy; // maybe you want a ref to cy
  // (usually better to have the srv as intermediary)

  var budsById = {};
  // retrieve buds from server
  api.buds.list().success(function (buds)
  {
    $scope.buds = buds;
    for( var i = 0; i < $scope.buds.length; i++ ){
      var p = $scope.buds[i];

      budsById[ p.id ] = p;
    }

    // you would probably want some ui to prevent use of budsCtrl until cy is loaded
    budGraph( $scope.buds ).then(function( budsCy ){
      cy = budsCy;
      // use this variable to hide ui until cy loaded if you want
      $scope.cyLoaded = true;
    });
  });


  budGraph.onClick(function(id){
    $state.go('bud.viewer',{budId : id});
  });

  // subscribe to websocket events to receive new buds, comments, etc.
  api.buds.created.subscribe($scope, function (bud)
  {
    // only add the bud if we don't have it already in the buds list to avoid dupes
    if (!_.some($scope.buds, function (b)
    {
      return b.id === bud.id;
    }))
    {
      bud.comments = [];
      bud.commentBox = {message: '', disabled: false};
      $scope.buds.unshift(bud);
    }
  });

});
