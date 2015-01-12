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
/*!********************************!*\
  !*** ./budPacks/packs-deps.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./qibud-org-teams/pack.js */ 19);
	__webpack_require__(/*! ./qibud-org-teams/edit-controller.js */ 20);
	__webpack_require__(/*! ./qibud-org-teams/view-controller.js */ 21);
	
	__webpack_require__(/*! ./qibud-org-missions/pack.js */ 22);
	__webpack_require__(/*! ./qibud-org-missions/edit-controller.js */ 23);
	__webpack_require__(/*! ./qibud-org-missions/view-controller.js */ 24);
	
	__webpack_require__(/*! ./qibud-org-projects/pack.js */ 25);
	__webpack_require__(/*! ./qibud-org-projects/edit-controller.js */ 26);
	__webpack_require__(/*! ./qibud-org-projects/view-controller.js */ 27);
	
	__webpack_require__(/*! ./qibud-org-actions/pack.js */ 28);
	__webpack_require__(/*! ./qibud-org-actions/edit-controller.js */ 29);
	__webpack_require__(/*! ./qibud-org-actions/view-controller.js */ 30);
	
	__webpack_require__(/*! ./qibud-org-ideas/pack.js */ 31);
	__webpack_require__(/*! ./qibud-org-ideas/edit-controller.js */ 32);
	__webpack_require__(/*! ./qibud-org-ideas/view-controller.js */ 33);
	
	__webpack_require__(/*! ./qibud-org-results/pack.js */ 43);
	__webpack_require__(/*! ./qibud-org-results/edit-controller.js */ 44);
	__webpack_require__(/*! ./qibud-org-results/view-controller.js */ 45);


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
/*!******************************************!*\
  !*** ./budPacks/qibud-org-teams/pack.js ***!
  \******************************************/
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
/*!*****************************************************!*\
  !*** ./budPacks/qibud-org-teams/edit-controller.js ***!
  \*****************************************************/
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
/*!*****************************************************!*\
  !*** ./budPacks/qibud-org-teams/view-controller.js ***!
  \*****************************************************/
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
/*!*********************************************!*\
  !*** ./budPacks/qibud-org-missions/pack.js ***!
  \*********************************************/
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
/* 23 */
/*!********************************************************!*\
  !*** ./budPacks/qibud-org-missions/edit-controller.js ***!
  \********************************************************/
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
/* 24 */
/*!********************************************************!*\
  !*** ./budPacks/qibud-org-missions/view-controller.js ***!
  \********************************************************/
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
	    state: 'Waiting',
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
	            } else {
	              $scope.packData.state = 'Waiting';
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
/* 25 */
/*!*********************************************!*\
  !*** ./budPacks/qibud-org-projects/pack.js ***!
  \*********************************************/
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
/* 26 */
/*!********************************************************!*\
  !*** ./budPacks/qibud-org-projects/edit-controller.js ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * __
	 */
	
	angular.module('qibud.org.projects').controller('ProjectEditorCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  console.log("ProjectEditorCtrl start...");
	
	
	});


/***/ },
/* 27 */
/*!********************************************************!*\
  !*** ./budPacks/qibud-org-projects/view-controller.js ***!
  \********************************************************/
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
	    state: 'Waiting',
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
	              var scope = $scope;
	              angular.forEach(actions, function (action) {
	                api.buds.budPacksData.get(action._id, 'Action')
	                .success(function (data) {
	                  if(data.state === 'Ended') {
	                    scope.packData.state = 'Ended';
	                  } else {
	                    scope.packData.state = 'Started';
	                  }
	                });
	              });
	              api.buds.budPacksData.set($scope.bud.id, scope.packData, 'Project');
	            } else {
	              $scope.packData.state = 'Waiting';
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
/* 28 */
/*!********************************************!*\
  !*** ./budPacks/qibud-org-actions/pack.js ***!
  \********************************************/
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
/* 29 */
/*!*******************************************************!*\
  !*** ./budPacks/qibud-org-actions/edit-controller.js ***!
  \*******************************************************/
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
/* 30 */
/*!*******************************************************!*\
  !*** ./budPacks/qibud-org-actions/view-controller.js ***!
  \*******************************************************/
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
	    state: 'Free',
	    actor: undefined
	  };
	
	  $scope.isActor = function ()
	  {
	    if ($scope.packData.actor !== undefined) {
	      if($scope.packData.actor === user) {
	        return true;
	      } else {
	        return false;
	      }
	    } else {
	      return false;
	    }
	  }
	
	  $scope.isCreator = function ()
	  {
	    if ($scope.bud.creator !== undefined) {
	      if($scope.bud.creator === user) {
	        return true;
	      } else {
	        return false;
	      }
	    } else {
	      return false;
	    }
	  }
	
	  $scope.isActorOrCreator = function ()
	  {
	    return (isActor() || isCreator());
	  }
	
	  $scope.setActor = function ()
	  {
	    $scope.packData.actor = user;
	    $scope.packData.state = 'Waiting';
	    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Action');
	    api.links.createU2B(user.id,'ACTOR',$scope.bud.id);
	  };
	
	  $scope.unsetActor = function ()
	  {
	    $scope.packData.actor = undefined;
	    $scope.packData.state = 'Free';
	    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Action');
	    api.links.deleteU2B(user.id,'ACTOR',$scope.bud.id);
	  };
	
	  api.buds.budPacksData.get($scope.bud.id, 'Action')
	    .success(function (packData)
	    {
	      if(packData.state) {
	        $scope.packData = packData;
	        console.log('packdata found:' + packData);
	        api.buds.childrenByType ($scope.bud.id, 'Result')
	          .success(function (results)
	          {
	            if(results.length > 0)
	            {
	              var scope = $scope;
	              angular.forEach(results, function (result) {
	                api.buds.budPacksData.get(result._id, 'Result')
	                  .success(function (data) {
	                    if(data.state === 'Success') {
	                      scope.packData.state = 'Ended';
	                      api.buds.budPacksData.set($scope.bud.id, scope.packData, 'Action');
	                    }
	                  });
	              });
	            }
	          });
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
/* 31 */
/*!******************************************!*\
  !*** ./budPacks/qibud-org-ideas/pack.js ***!
  \******************************************/
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
/* 32 */
/*!*****************************************************!*\
  !*** ./budPacks/qibud-org-ideas/edit-controller.js ***!
  \*****************************************************/
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
/* 33 */
/*!*****************************************************!*\
  !*** ./budPacks/qibud-org-ideas/view-controller.js ***!
  \*****************************************************/
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
	    state: 'Waiting for feedback'
	  };
	
	  api.buds.budPacksData.get($scope.bud.id, 'Idea')
	  .success(function (packData)
	  {
	    if(packData.state) {
	      $scope.packData = packData;
	      console.log('packdata found:' + packData);
	      if ($scope.bud.sponsors.length > 0) {
	        $scope.packData.state = 'Sponsored';
	        api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
	      } else {
	        $scope.packData.state = 'Waiting for feedback';
	        api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
	      }
	    } else {
	      api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Idea');
	    }
	  })
	  .error(function ()
	  {
	    console.log('error while loading packdata');
	  });
	
	  api.buds.sponsorsChanged.subscribe($scope, function (bud) {
	    if ($scope.bud.id === bud.id)
	    {
	      if (bud.sponsors.length > 0) {
	        $scope.packData.state = 'Sponsored';
	        api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
	      } else {
	        $scope.packData.state = 'Waiting for feedback';
	        api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
	      }
	    }
	  });
	
	});


/***/ },
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */
/*!********************************************!*\
  !*** ./budPacks/qibud-org-results/pack.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Bud result
	 */
	
	angular
	    .module('qibud.org.results', [
	      'ui.router',
	      'ui.bootstrap',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	      $stateProvider
	          .state('bud.viewer.Result', {
	            url: '/result',
	            views: {
	              'summary':{
	                templateUrl: 'budPacks/qibud-org-results/view.html',
	                controller: 'ResultViewerCtrl'
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Result',
	              stateName: 'bud.viewer.Result'
	            }
	          })
	          .state('bud.editor.Result', {
	            url: '/result',
	            views: {
	              'summary':{
	                controller: 'ResultViewerCtrl',
	                templateUrl: 'budPacks/qibud-org-results/view.html',
	              }
	            },
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Result Editor',
	              stateName: 'bud.editor.Result'
	            }
	          });
	    });


/***/ },
/* 44 */
/*!*******************************************************!*\
  !*** ./budPacks/qibud-org-results/edit-controller.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * __
	 */
	
	angular.module('qibud.org.results').controller('ResultEditorCtrl',
	function ($scope, $state, $stateParams, $location, api)
	{
	  console.log("ResultEditorCtrl start...");
	
	
	});


/***/ },
/* 45 */
/*!*******************************************************!*\
  !*** ./budPacks/qibud-org-results/view-controller.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * __
	 */
	
	angular.module('qibud.org.results').controller('ResultViewerCtrl',
	function ($scope, $state, $stateParams, api)
	{
	  console.log("ResultViewerCtrl start...");
	  var user        = $scope.common.user;
	  $scope.packData = {
	    state: 'Undefined',
	    actor: undefined
	  };
	
	
	  $scope.setSuccess = function ()
	  {
	    $scope.packData.state = 'Success';
	    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
	    if($scope.bud.parentBud) {
	      api.buds.budPacksData.get($scope.bud.parentBud.id, 'Action')
	      .success(function (packData) {
	        packData.state = 'Ended';
	        api.buds.budPacksData.set($scope.bud.parentBud.id, packData, 'Action');
	      });
	
	    }
	  };
	
	  $scope.setFailed = function ()
	  {
	    $scope.packData.state = 'Failed';
	    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
	  };
	
	  $scope.isActor = function ()
	  {
	    if ($scope.packData.actor !== undefined) {
	      if($scope.packData.actor === user) {
	        return true;
	      } else {
	        return false;
	      }
	    } else {
	      return false;
	    }
	  }
	
	  $scope.isCreator = function ()
	  {
	    if ($scope.bud.creator !== undefined) {
	      if($scope.bud.creator === user) {
	        return true;
	      } else {
	        return false;
	      }
	    } else {
	      return false;
	    }
	  }
	
	  $scope.isActorOrCreator = function ()
	  {
	    return (isActor() || isCreator());
	  }
	
	  $scope.setActor = function ()
	  {
	    $scope.packData.actor = user;
	    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
	    api.links.createU2B(user.id,'ACTOR',$scope.bud.id);
	  };
	
	  $scope.unsetActor = function ()
	  {
	    $scope.packData.actor = undefined;
	    api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
	    api.links.deleteU2B(user.id,'ACTOR',$scope.bud.id);
	  };
	
	  api.buds.budPacksData.get($scope.bud.id, 'Result')
	    .success(function (packData)
	    {
	      if(packData.state) {
	        $scope.packData = packData;
	        console.log('packdata found:' + packData);
	      } else {
	        api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Result');
	      }
	    })
	    .error(function ()
	    {
	      console.log('error while loading packdata');
	    });
	
	});


/***/ }
/******/ ])
//# sourceMappingURL=qibud-packs.js.map