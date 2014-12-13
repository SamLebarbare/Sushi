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

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);

	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);

	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);

	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);

	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(15);


/***/ },
/* 1 */
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
/* 2 */
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
/* 3 */
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
/* 4 */
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
	            }
	          })
	          .state('bud.editor.Mission', {
	            url: '/mission',
	            views: {
	              'summary':{
	                controller: 'MissionViewerCtrl',
	                templateUrl: 'budPacks/qibud-org-missions/view.html',
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Mission Editor',
	              stateName: 'bud.editor.Mission'
	            }
	          });
	    });


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.missions').controller('MissionEditorCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  console.log("MissionEditorCtrl start...");


	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.missions').controller('MissionViewerCtrl',
	function ($scope, $state, $stateParams, api)
	{
	  console.log("MissionViewerCtrl start...");
	  var user        = $scope.common.user;
	  $scope.packData = {
	    state: 'Waiting for projects',
	    projects: [],
	    team: null
	  };

	  api.buds.budPacksData.get($scope.bud.id, 'Mission')
	    .success(function (packData)
	    {
	      if(packData.state) {
	        $scope.packData = packData;
	        console.log('packdata found:' + packData);
	        api.buds.childrenByType ($scope.bud.id, 'Project')
	          .success(function (projects)
	          {
	            $scope.packData.projects = projects;
	            if(projects.length > 0)
	            {
	              $scope.packData.state = 'Started';
	            }

	            api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Mission');
	          });
	      } else {
	        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Mission');
	      }
	    })
	    .error(function ()
	    {
	      console.log('error while loading packdata');
	    });

	});


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Bud project
	 */

	angular
	    .module('qibud.org.projects', [
	      'ui.router',
	      'ui.bootstrap',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	      $stateProvider
	          .state('bud.viewer.Project', {
	            url: '/project',
	            views: {
	              'summary':{
	                templateUrl: 'budPacks/qibud-org-projects/view.html',
	                controller: 'ProjectViewerCtrl'
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Project',
	              stateName: 'bud.viewer.Project'
	            }
	          })
	          .state('bud.editor.Project', {
	            url: '/project',
	            views: {
	              'summary':{
	                controller: 'ProjectViewerCtrl',
	                templateUrl: 'budPacks/qibud-org-projects/view.html',
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Project Editor',
	              stateName: 'bud.editor.Project'
	            }
	          });
	    });


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.missions').controller('ProjectEditorCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  console.log("ProjectEditorCtrl start...");


	});


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.projects').controller('ProjectViewerCtrl',
	function ($scope, $state, $stateParams, api)
	{
	  console.log("ProjectViewerCtrl start...");
	  var user        = $scope.common.user;
	  $scope.packData = {
	    state: 'Waiting for actions',
	    actions: []
	  };

	  api.buds.budPacksData.get($scope.bud.id, 'Project')
	    .success(function (packData)
	    {
	      if(packData.state) {
	        $scope.packData = packData;
	        console.log('packdata found:' + packData);
	        api.buds.childrenByType ($scope.bud.id, 'Action')
	          .success(function (actions)
	          {
	            $scope.packData.actions = actions;
	            if(actions.length > 0)
	            {
	              $scope.packData.state = 'Started';
	            }
	            api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Project');
	          });
	      } else {
	        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Project');
	      }
	    })
	    .error(function ()
	    {
	      console.log('error while loading packdata');
	    });

	});


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Bud project
	 */

	angular
	    .module('qibud.org.actions', [
	      'ui.router',
	      'ui.bootstrap',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	      $stateProvider
	          .state('bud.viewer.Action', {
	            url: '/action',
	            views: {
	              'summary':{
	                templateUrl: 'budPacks/qibud-org-actions/view.html',
	                controller: 'ActionViewerCtrl'
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Action',
	              stateName: 'bud.viewer.Action'
	            }
	          })
	          .state('bud.editor.Action', {
	            url: '/action',
	            views: {
	              'summary':{
	                controller: 'ActionViewerCtrl',
	                templateUrl: 'budPacks/qibud-org-actions/view.html',
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Action Editor',
	              stateName: 'bud.editor.Action'
	            }
	          });
	    });


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.actions').controller('ActionEditorCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  console.log("ActionEditorCtrl start...");


	});


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * __
	 */

	angular.module('qibud.org.actions').controller('ActionViewerCtrl',
	function ($scope, $state, $stateParams, api)
	{
	  console.log("ActionViewerCtrl start...");
	  var user        = $scope.common.user;
	  $scope.packData = {
	    state: 'free',
	    actions: []
	  };

	  api.buds.budPacksData.get($scope.bud.id, 'Action')
	    .success(function (packData)
	    {
	      if(packData.state) {
	        $scope.packData = packData;
	        console.log('packdata found:' + packData);
	      } else {
	        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Action');
	      }
	    })
	    .error(function ()
	    {
	      console.log('error while loading packdata');
	    });

	});


/***/ },
/* 13 */
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
/* 14 */
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
/* 15 */
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