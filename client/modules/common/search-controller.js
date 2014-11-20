
angular.module('qibud.common').controller('SearchCtrl',
function ($scope, api) {
  $scope.results = {};
  $scope.search = function(query) {
    if(query) {
      api.buds.search(query).success(function (results) {
        if(results.hits){
          if(results.hits.total > 0) {
            $scope.results = results.hits.hits.map(function(item){
              return item;
            });
          } else {
            $scope.results = {}
          }
        }
      });
    }
  };
});
