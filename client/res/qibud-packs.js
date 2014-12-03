/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);

	__webpack_require__(22);
	__webpack_require__(23);
	__webpack_require__(24);

	__webpack_require__(25);
	__webpack_require__(26);
	__webpack_require__(27);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Bud Team
	 */

	angular
	    .module('qibud.org.teams', [
	      'ui.router',
	      'ui.bootstrap',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	      $stateProvider
	          .state('bud.viewer.Team', {
	            url: '/team',
	            views: {
	              'summary':{
	                templateUrl: 'budPacks/qibud-org-teams/view.html',
	                controller: 'TeamViewerCtrl'
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Team',
	              stateName: 'bud.viewer.Team'
	            },
	          })
	          .state('bud.editor.Team', {
	            url: '/team',
	            views: {
	              'summary':{
	                controller: 'TeamEditorCtrl',
	                templateUrl: 'budPacks/qibud-org-teams/edit.html'
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Team Editor',
	              stateName: 'bud.editor.Team'
	            },
	          });
	    });


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.teams').controller('TeamEditorCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  var user        = $scope.common.user;
	  $scope.packData = {
	    members : []
	  };
	  $scope.users    = [];

	  api.users.list().success(function (users)
	  {
	    $scope.users = users;

	    api.buds.budPacksData.get($scope.editedBud.id, 'Team')
	      .success(function (packData)
	      {

	        if(packData.members) {
	          $scope.packData = packData;
	          console.log('packdata found:' + packData);
	          $scope.packData.members.forEach (function (user){
	            _.remove($scope.users, function(u) { return u.id === user.id; });
	          });
	        } else {
	          api.buds.budPacksData.create($scope.editedBud.id, $scope.packData, 'Team');
	        }
	      })
	      .error(function ()
	      {
	        console.log('error while loading packdata');
	      });
	  });

	  $scope.addUser = function (user) {
	    $scope.packData.members.push(user);
	    _.remove($scope.users, function(u) { return u.id === user.id; });
	    api.buds.budPacksData.set($scope.editedBud.id, $scope.packData, 'Team');
	    api.links.createU2B(user.id,'MEMBER',$scope.editedBud.id);
	  };

	  $scope.rmUser = function (user) {
	    $scope.users.push(user);
	    _.remove($scope.packData.members, function(u) { return u.id === user.id; });
	    api.buds.budPacksData.set($scope.editedBud.id, $scope.packData, 'Team');
	    api.links.deleteU2B(user.id,'MEMBER',$scope.editedBud.id);
	  };


	});


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.teams').controller('TeamViewerCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  var user       = $scope.common.user;
	  $scope.packData = {
	    members : []
	  };
	  api.buds.budPacksData.get($scope.bud.id, 'Team')
	    .success(function (packData)
	    {
	      if(packData.members) {
	        console.log('packdata loaded');
	        $scope.packData = packData;
	      }

	    });

	});


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Bud mission
	 */

	angular
	    .module('qibud.org.missions', [
	      'ui.router',
	      'ui.bootstrap',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	      $stateProvider
	          .state('bud.viewer.Mission', {
	            url: '/mission',
	            views: {
	              'summary':{
	                templateUrl: 'budPacks/qibud-org-missions/view.html',
	                controller: 'MissionViewerCtrl'
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Mission',
	              stateName: 'bud.viewer.Mission'
	            },
	          })
	          .state('bud.editor.Mission', {
	            url: '/mission',
	            views: {
	              'summary':{
	                controller: 'MissionEditorCtrl',
	                templateUrl: 'budPacks/qibud-org-missions/edit.html',
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Mission Editor',
	              stateName: 'bud.editor.Mission'
	            },
	          });
	    });


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.missions').controller('MissionEditorCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  var user        = $scope.common.user;
	  $scope.packData = {

	  };

	});


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.missions').controller('MissionViewerCtrl',
	function ($scope, $state, $stateParams, api)
	{
	  console.log("MissionViewerCtrl start...");
	  var user       = $scope.common.user;
	  $scope.packData = {
	  };

	  api.buds.budPacksData.get($scope.bud.id, 'Mission')
	    .success(function (packData)
	    {

	    });

	});


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Bud Idea
	 */

	angular
	    .module('qibud.org.ideas', [
	      'ui.router',
	      'ui.bootstrap',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	      $stateProvider
	          .state('bud.viewer.Idea', {
	            url: '/idea',
	            views: {
	              'summary':{
	                templateUrl: 'budPacks/qibud-org-ideas/view.html',
	                controller: 'IdeaViewerCtrl'
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Idea',
	              stateName: 'bud.viewer.Idea'
	            },
	          })
	          .state('bud.editor.Idea', {
	            url: '/idea',
	            views: {
	              'summary':{
	                controller: 'IdeaEditorCtrl',
	                templateUrl: 'budPacks/qibud-org-ideas/edit.html',
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Idea Editor',
	              stateName: 'bud.editor.Idea'
	            },
	          });
	    });


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.ideas').controller('IdeaEditorCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  var user        = $scope.common.user;
	  $scope.packData = {
	    
	  };

	});


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.ideas').controller('IdeaViewerCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  var user       = $scope.common.user;
	  $scope.packData = {
	  };

	  api.buds.budPacksData.get($scope.bud.id, 'Idea')
	    .success(function (packData)
	    {

	    });

	});


/***/ }
/******/ ])