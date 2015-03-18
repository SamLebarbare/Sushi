'use strict';

/**
 * Home controller simply lists all the sushis from everyone on the front page.
 */

angular.module('sushi.home').controller('SushigraphCtrl',
function ($scope, $state, api, sushiGraph)
{
  var user       = $scope.common.user;
  var cy; // maybe you want a ref to cy
  // (usually better to have the srv as intermediary)

  var sushisById = {};
  // retrieve sushis from server
  api.sushis.list().success(function (sushis)
  {
    $scope.sushis = sushis;
    for( var i = 0; i < $scope.sushis.length; i++ ){
      var p = $scope.sushis[i];

      sushisById[ p.id ] = p;
    }

    // you would probably want some ui to prevent use of sushisCtrl until cy is loaded
    sushiGraph( $scope.sushis ).then(function( sushisCy ){
      cy = sushisCy;
      // use this variable to hide ui until cy loaded if you want
      $scope.cyLoaded = true;
    });
  });


  sushiGraph.onClick(function(id){
    $state.go('sushi.viewer',{sushiId : id});
  });

  // subscribe to websocket events to receive new sushis, comments, etc.
  api.sushis.created.subscribe($scope, function (sushi)
  {
    // only add the sushi if we don't have it already in the sushis list to avoid dupes
    if (!_.some($scope.sushis, function (b)
    {
      return b.id === sushi.id;
    }))
    {
      sushi.comments = [];
      sushi.commentBox = {message: '', disabled: false};
      $scope.sushis.unshift(sushi);
    }
  });

});
