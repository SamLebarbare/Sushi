'use strict';

/**
 * Home controller simply lists all the buds from everyone on the front page.
 */

angular.module('qibud.home').controller('HomeCtrl',
function ($scope, $state, api, budGraph)
{
  var user       = $scope.common.user;
  var cy; // maybe you want a ref to cy
  // (usually better to have the srv as intermediary)

  var budsById = {};
  // retrieve buds from server
  api.buds.list().success(function (buds)
  {
    buds.forEach(function (bud)
    {
      bud.commentBox = {message: '', disabled: false};
      bud.comments   = bud.comments || [];
    });

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

  $scope.onWeightChange = function(bud){
     budGraph.setBudWeight( bud.id, bud.qi );
  };

  budGraph.onWeightChange(function(id, weight){
    budsById[id].qi = weight;

    $scope.$apply();
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

  api.buds.comments.created.subscribe($scope, function (comment) {
    var bud = _.find($scope.buds, function (bud)
    {
      return bud.id === comment.budId;
    });

    // only add the comment if we don't have it already in the bud's comments list to avoid dupes
    if (bud && !_.some(bud.comments, function (c)
    {
      return c.id === comment.id;
    }))
    {
      bud.comments.push(comment);
    }
  });

});
