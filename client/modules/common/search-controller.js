
angular.module('sushi.common').controller('SearchCtrl',
function ($scope, api) {
  $scope.results = [];
  $scope.displayedBuds = [];
  $scope.visible = false;
  $scope.update = function () {
    $scope.displayedBuds = [].concat($scope.results);
    console.log ($scope.displayedBuds);
    $scope.visible = true;
  };
  $scope.hide = function ()
  {
    $scope.visible = false;
  };

  $scope.show = function ()
  {
    $scope.visible = true;
  };
  $scope.search = function(query) {
    if(query) {
      api.buds.search(query).success(function (results) {
        if(results.hits){
          if(results.hits.total > 0) {
            $scope.results = results.hits.hits.map(function(item){
              return item;
            });
            $scope.update ();
          } else {
            $scope.results = {}
          }
        }
      });
    }
  };
});
