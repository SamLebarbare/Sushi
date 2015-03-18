'use strict';

/**
 * Home controller simply lists all the sushis from everyone on the front page.
 */

angular.module('sushi.home').controller('SocialgraphCtrl',
function ($scope, $state, api, socialGraph)
{
  var user       = $scope.common.user;
  var cy; // maybe you want a ref to cy
  // (usually better to have the srv as intermediary)

  // retrieve actors from server
  api.actors.list(true).success(function (actors)
  {
    $scope.actors = actors;
    // you would probably want some ui to prevent use of sushisCtrl until cy is loaded
    socialGraph( $scope.actors ).then(function( sushisCy ){
      cy = sushisCy;
      // use this variable to hide ui until cy loaded if you want
      $scope.cyLoaded = true;
    });
  });


  socialGraph.onClick(function(id){
    
  });

});
