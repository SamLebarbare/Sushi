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
/*!******************************!*\
  !*** ./modules/core-deps.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./common/common.js */ 1);
	__webpack_require__(/*! ./common/search-controller.js */ 2);
	__webpack_require__(/*! ./common/mailbox-controller.js */ 3);
	__webpack_require__(/*! ./common/mail-controller.js */ 4);
	__webpack_require__(/*! ./common/api-service.js */ 5);
	
	__webpack_require__(/*! ./dashboard/dashboard.js */ 6);
	
	__webpack_require__(/*! ./editor/editor.js */ 7);
	__webpack_require__(/*! ./editor/editor-controller.js */ 8);
	
	__webpack_require__(/*! ./home/home.js */ 9);
	__webpack_require__(/*! ./home/home-controller.js */ 10);
	__webpack_require__(/*! ./home/budgraph-factory.js */ 11);
	__webpack_require__(/*! ./home/budgraph-controller.js */ 12);
	__webpack_require__(/*! ./home/timeline-controller.js */ 13);
	
	__webpack_require__(/*! ./profile/profile.js */ 14);
	__webpack_require__(/*! ./profile/profile-controller.js */ 15);
	
	__webpack_require__(/*! ./viewer/viewer.js */ 16);
	__webpack_require__(/*! ./viewer/viewer-controller.js */ 17);
	__webpack_require__(/*! ./viewer/viewer-sharebox-controller.js */ 18);


/***/ },
/* 1 */
/*!**********************************!*\
  !*** ./modules/common/common.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Module definition for common components used by other all other app modules.
	 */
	
	angular.module('qibud.common', ['ui.bootstrap']);


/***/ },
/* 2 */
/*!*********************************************!*\
  !*** ./modules/common/search-controller.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	
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


/***/ },
/* 3 */
/*!**********************************************!*\
  !*** ./modules/common/mailbox-controller.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	
	angular.module('qibud.common').controller('MailboxCtrl',
	function ($scope, $modal, api)
	{
	  $scope.emails = {};
	  api.mailboxes.get().success(function (emails) {
	    $scope.emails = emails;
	  });
	
	  $scope.openEmail = function (email) {
	    var modalInstance = $modal.open({
	      templateUrl: 'mail.html',
	      controller: 'MailConverterCtrl',
	      size: 'lg',
	      resolve: {
	        email: function () {
	          return email;
	        }
	      }
	    });
	
	    modalInstance.result.then(function (budId) {
	      //view bud
	
	    }, function () {
	      //dismiss
	    });
	  };
	});


/***/ },
/* 4 */
/*!*******************************************!*\
  !*** ./modules/common/mail-controller.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	
	angular.module('qibud.common').controller('MailConverterCtrl',
	function ($scope, $modalInstance, email) {
	
	  $scope.email = email;
	
	  $scope.ok = function () {
	    $modalInstance.close($scope.selectedUsers);
	  };
	
	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	});


/***/ },
/* 5 */
/*!***************************************!*\
  !*** ./modules/common/api-service.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Service for providing access the backend API via HTTP and WebSockets.
	 */
	
	angular.module('qibud.common').factory('api', function ($rootScope, $http, $window) {
	
	  var apiBase = 'api' /* base /api uri */,
	      token = ($window.sessionStorage.token || $window.localStorage.token),
	      headers = {Authorization: 'Bearer ' + token},
	      wsHost = ($window.document.location.origin || ($window.location.protocol + '//' + $window.location.host)).replace(/^http/, 'ws'),
	      api = {events: {}};
	
	  // initiate the websocket connection to the host
	  var ws = api.ws = new WebSocket(wsHost + '?access_token=' + token);
	  $window.setInterval(function () {
	    ws.send('ping');
	  }, 1000 * 25); // keep-alive signal (needed for heroku)
	
	  // utilize jQuery's callbacks as an event system
	  function event() {
	    var callbacks = $.Callbacks();
	    return {
	      subscribe: function ($scope, fn) {
	        if (fn) {
	          // unsubscribe from event on controller destruction to prevent memory leaks
	          $scope.$on('$destroy', function () {
	            callbacks.remove(fn);
	          });
	        } else {
	          fn = $scope;
	        }
	        callbacks.add(fn);
	      },
	      unsubscribe: callbacks.remove,
	      publish: callbacks.fire
	    };
	  }
	
	  // websocket connected disconnected events
	  api.connected = event();
	  ws.onopen = function () {
	    api.connected.publish.apply(this, arguments);
	    $rootScope.$apply();
	  };
	
	  api.disconnected = event();
	  ws.onclose = function () {
	    api.disconnected.publish.apply(this, arguments);
	    $rootScope.$apply();
	  };
	
	  // api http endpoints and websocket events
	  api.buds = {
	    search: function (query) {
	      return $http({method: 'GET', url: apiBase + '/buds/search/'+ query,headers: headers});
	    },
	    childrenByType: function (budId,type) {
	      return $http({method: 'GET', url: apiBase + '/buds/'+ budId + '/child/' + type, headers: headers});
	    },
	    list: function () {
	      return $http({method: 'GET', url: apiBase + '/buds', headers: headers});
	    },
	    view: function (budId) {
	      return $http({method: 'GET', url: apiBase + '/buds/' + budId + '/view', headers: headers});
	    },
	    update: function (bud) {
	      return $http({method: 'PUT', url: apiBase + '/buds/' + bud.id + '/update', data: bud, headers: headers});
	    },
	    updated: event(),
	    delete: function (budId) {
	      return $http({method: 'DELETE', url: apiBase + '/buds/' + budId, headers: headers});
	    },
	    create: function (bud) {
	      return $http({method: 'POST', url: apiBase + '/buds', data: bud, headers: headers});
	    },
	    createSub: function (parentBudId, bud) {
	      return $http({method: 'POST', url: apiBase + '/buds/' + parentBudId, data: bud, headers: headers});
	    },
	    created: event(),
	    evolve: function (bud, type) {
	      return $http({method: 'PUT', url: apiBase + '/buds/' + bud.id + '/evolve/' + type, data: bud, headers: headers});
	    },
	    evolved: event(),
	    follow : function(bud) {
	      return $http({method: 'PUT', url: apiBase + '/buds/' + bud.id + '/follow', data: bud, headers: headers});
	    },
	    unfollow : function(bud) {
	      return $http({method: 'PUT', url: apiBase + '/buds/' + bud.id + '/unfollow', data: bud, headers: headers});
	    },
	    followersChanged: event(),
	    sponsor : function(bud) {
	      return $http({method: 'PUT', url: apiBase + '/buds/' + bud.id + '/sponsor', data: bud, headers: headers});
	    },
	    unsponsor : function(bud) {
	      return $http({method: 'PUT', url: apiBase + '/buds/' + bud.id + '/unsponsor', data: bud, headers: headers});
	    },
	    sponsorsChanged: event(),
	    support : function(bud, value) {
	      return $http({method: 'PUT', url: apiBase + '/buds/' + bud.id + '/support/' + value, data: bud, headers: headers});
	    },
	    unsupport : function(bud) {
	      return $http({method: 'PUT', url: apiBase + '/buds/' + bud.id + '/unsupport', data: bud, headers: headers});
	    },
	    supportersChanged: event(),
	    share : function(bud, users) {
	      return $http({method: 'PUT', url: apiBase + '/buds/' + bud.id + '/share', data: users, headers: headers});
	    },
	    budPacksData: {
	      create : function (budId, packData, type) {
	        return $http({method: 'POST', url: apiBase + '/buds/' + budId + '/packdata/' + type, data: packData, headers: headers});
	      },
	      get: function (budId, type) {
	        return $http({method: 'GET', url: apiBase + '/buds/' + budId + '/packdata/' + type, headers: headers});
	      },
	      set: function (budId, packData, type) {
	        return $http({method: 'PUT', url: apiBase + '/buds/' + budId + '/packdata/' + type, data: packData, headers: headers});
	      },
	      created: event(),
	      updated: event()
	    },
	    comments: {
	      create: function (budId, comment) {
	        return $http({method: 'POST', url: apiBase + '/buds/' + budId + '/comments', data: comment, headers: headers});
	      },
	      created: event()
	    }
	  };
	
	  api.qi = {
	    updated: event()
	  };
	
	  api.mailboxes = {
	    get: function () {
	      return $http({method: 'GET', url: apiBase + '/user/mailboxes/emails', headers: headers});
	    },
	    incoming: event()
	  };
	
	  api.links = {
	    createB2B : function (budId, type, budId2) {
	      return $http({method: 'POST', url: apiBase + '/links/b2b/' + budId + '/' + type + '/' + budId2, headers: headers});
	    },
	    createB2U : function (budId, type, userId) {
	      return $http({method: 'POST', url: apiBase + '/links/b2u/' + budId + '/' + type + '/' + userId, headers: headers});
	    },
	    createU2B : function (userId, type, budId) {
	      return $http({method: 'POST', url: apiBase + '/links/u2b/' + userId + '/' + type + '/' + budId, headers: headers});
	    },
	    deleteU2B : function (userId, type, budId) {
	      return $http({method: 'DELETE', url: apiBase + '/links/u2b/' + userId + '/' + type + '/' + budId, headers: headers});
	    },
	    findU2B : function (userId, type) {
	      return $http({method: 'GET', url: apiBase + '/links/u2b/' + userId + '/' + type, headers: headers});
	    }
	  };
	
	  api.users = {
	    list: function () {
	      return $http({method: 'GET', url: apiBase + '/users', headers: headers});
	    }
	  };
	
	  api.actors = {
	    list: function () {
	      return $http({method: 'GET', url: apiBase + '/actors', headers: headers});
	    }
	  };
	
	  api.events = {
	    list: function () {
	      return $http({method: 'GET', url: apiBase + '/events', headers: headers});
	    }
	  };
	
	  api.types = {
	    get: function (type) {
	      return $http({method: 'GET', url: apiBase + '/types/' + type, headers: headers})
	    },
	    list: function () {
	      return $http({method: 'GET', url: apiBase + '/types', headers: headers});
	    }
	  };
	
	  api.debug = {
	    clearDatabase: function () {
	      return $http({method: 'POST', url: apiBase + '/debug/clearDatabase', headers: headers});
	    }
	  };
	
	  // websocket data event (which transmits json-rpc payloads)
	  function index(obj, i) {
	    return obj[i];
	  } // convert dot notation string into an actual object index
	  ws.onmessage = function (event /* websocket event object */) {
	    var data = JSON.parse(event.data /* rpc event object (data) */);
	    if (!data.method) {
	      throw 'Malformed event data received through WebSocket. Received event data object was: ' + data;
	    } else if (!data.method.split('.').reduce(index, api)) {
	      throw 'Undefined event type received through WebSocket. Received event data object was: ' + data;
	    }
	    data.method.split('.').reduce(index, api).publish(data.params);
	    $rootScope.$apply();
	  };
	
	  return api;
	});


/***/ },
/* 6 */
/*!****************************************!*\
  !*** ./modules/dashboard/dashboard.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	angular.module('qibud.dashboard',[]).controller('DashboardCtrl', ['$scope', '$cookieStore', DashboardCtrl]);
	function DashboardCtrl($scope, $cookieStore) {
	    /**
	     * Sidebar Toggle & Cookie Control
	     *
	     */
	
	    var mobileView = 992;
	    $scope.getWidth = function() { return window.innerWidth; };
	
	    $scope.$watch($scope.getWidth, function(newValue, oldValue)
	    {
	        if(newValue >= mobileView)
	        {
	            if(angular.isDefined($cookieStore.get('toggle')))
	            {
	                if($cookieStore.get('toggle') == false)
	                {
	                    $scope.toggle = false;
	                }
	                else
	                {
	                    $scope.toggle = true;
	                }
	            }
	            else
	            {
	                $scope.toggle = true;
	            }
	        }
	        else
	        {
	            $scope.toggle = false;
	        }
	
	    });
	
	    $scope.toggleSidebar = function()
	    {
	        $scope.toggle = ! $scope.toggle;
	
	        $cookieStore.put('toggle', $scope.toggle);
	    };
	
	    window.onresize = function() { $scope.$apply(); };
	}


/***/ },
/* 7 */
/*!**********************************!*\
  !*** ./modules/editor/editor.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Editor module for buds
	 */
	
	angular
	    .module('qibud.editor', [
	      'ui.router',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	      $stateProvider
	          .state('bud.editor', {
	            title: 'Qibud Editor',
	            url: "/editor/:budId/:parentBudId/:content",
	            breadcrumb: {
	              class: 'highlight',
	              text: 'Bud Editor',
	              stateName: 'bud.editor'
	            },
	            templateUrl: 'modules/editor/editor.html',
	            controller: 'EditorCtrl'
	      });
	    });


/***/ },
/* 8 */
/*!*********************************************!*\
  !*** ./modules/editor/editor-controller.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Editor controller provide a good way to edit/write buds
	 */
	
	angular.module('qibud.editor').controller('EditorCtrl',
	function ($scope, $state, $stateParams, $location, api)
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
	
	      //redirect
	      $state.go('bud.viewer',{budId : budId},{ reload: true });
	    })
	    .error(function ()
	    {
	      // don't clear the bud box but enable it so the user can re-try
	      $scope.budBox.disabled = false;
	    });
	  };
	
	  $scope.createSubBud = function ($event)
	  {
	    // don't let the user type in blank lines or submit empty/whitespace only bud, or type in something when bud is being created
	    if (!$scope.budBox.content.length || $scope.budBox.disabled)
	    {
	      $event.preventDefault();
	      return;
	    }
	
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
	
	      //redirect
	      $state.go('bud.viewer',{budId : budId});
	    })
	    .error(function ()
	    {
	      // don't clear the bud box but enable it so the user can re-try
	      $scope.budBox.disabled = false;
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


/***/ },
/* 9 */
/*!******************************!*\
  !*** ./modules/home/home.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Home module for displaying home page content.
	 */
	
	angular
	    .module('qibud.home', [
	      'ui.router',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	      $stateProvider
	      .state('home.stickers', {
	        title: 'Dashboard',
	        breadcrumb: {
	          class: 'highlight',
	          text: 'Bud stickers',
	          stateName: 'bud.home.stickers'
	        },
	        url: "/stickers",
	        templateUrl: 'modules/home/home-stickers.html',
	        controller: 'HomeCtrl'
	      })
	      .state('home.budgraph', {
	        title: 'Bud Graph',
	        breadcrumb: {
	          class: 'highlight',
	          text: 'Bud Graph',
	          stateName: 'bud.home.budgraph'
	        },
	        url: "/graph",
	        templateUrl: 'modules/home/home-budgraph.html',
	        controller: 'BudgraphCtrl'
	      })
	      .state('home.timeline', {
	        title: 'Bud Timeline',
	        breadcrumb: {
	          class: 'highlight',
	          text: 'Bud Timeline',
	          stateName: 'bud.home.timeline'
	        },
	        url: "/timeline",
	        templateUrl: 'modules/home/home-timeline.html',
	        controller: 'TimelineCtrl'
	      });
	    });


/***/ },
/* 10 */
/*!*****************************************!*\
  !*** ./modules/home/home-controller.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Home controller simply lists all the buds from everyone on the front page.
	 */
	
	angular.module('qibud.home').controller('HomeCtrl',
	function ($scope, $state, api, budGraph)
	{
	  var user       = $scope.common.user;
	  api.buds.list().success(function (buds)
	  {
	    buds.forEach(function (bud)
	    {
	      if(bud.type || bud.type !== 'Bud') {
	        api.types.get (bud.type).success (function (typeInfo) {
	          bud.typeInfo = typeInfo;
	        });
	      }
	      bud.commentBox = {message: '', disabled: false};
	      bud.comments   = bud.comments || [];
	    });
	
	    $scope.buds = buds;
	
	    api.links.findU2B(user.id, 'ACTOR').success(function (buds)
	    {
	      buds.forEach(function (bud)
	      {
	        _.remove($scope.buds, function(b) { return b.id === bud._id; });
	        if(bud.type || bud.type !== 'Bud') {
	          api.types.get (bud.type).success (function (typeInfo) {
	            bud.typeInfo = typeInfo;
	          });
	        }
	        bud.commentBox = {message: '', disabled: false};
	        bud.comments   = bud.comments || [];
	      });
	
	      $scope.budsActingOn = buds;
	    });
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


/***/ },
/* 11 */
/*!******************************************!*\
  !*** ./modules/home/budgraph-factory.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Home module for displaying home page content.
	 */
	
	angular
	    .module('qibud.home')
	    .factory('budGraph', [ '$q', function( $q ) {
	      var cy;
	      var budGraph = function(buds) {
	        var deferred = $q.defer();
	
	        // put buds model in cy.js
	        var eles = [];
	        for( var i = 0; i < buds.length; i++ ){
	
	          eles.push({
	            group: 'nodes',
	            data: {
	              id: buds[i].id,
	              weight: 20,
	              label: buds[i].type,
	              name: '[' + buds[i].type + ']' + buds[i].title,
	              faveColor: '#30426a',
	              faveShape: buds[i].type == 'Team' ? 'octagon' : 'roundrectangle'
	            }
	          });
	        }
	
	        for( var i = 0; i < buds.length; i++ ){
	          if(buds[i].subBuds) {
	            for( var s = 0; s < buds[i].subBuds.length; s++ ) {
	              eles.push({
	                group: 'edges',
	                data: {
	                  source: buds[i].id,
	                  target: buds[i].subBuds[s].id,
	                  faveColor: '#30426a',
	                  strength: 1
	                }
	              });
	            }
	          }
	
	        }
	
	        $(function(){ // on dom ready
	
	          cy = cytoscape({
	            container: $('#cy')[0],
	
	            style: cytoscape.stylesheet()
	              .selector('node')
	                .css({
	                  'shape': 'data(faveShape)',
	                  'width': 'mapData(weight, 10, 10, 10, 10)',
	                  'content': 'data(name)',
	                  'text-valign': 'center',
	                  'text-outline-width': 2,
	                  'background-color': 'data(faveColor)',
	                  'color': '#fff',
	                  'box-shadow': '0 10px 18px rgba(0,0,0,.22),0 14px 45px rgba(0,0,0,.25)'
	                })
	              .selector(':selected')
	                .css({
	                  'border-width': 3,
	                  'border-color': '#333'
	                })
	              .selector('edge')
	                .css({
	                  'opacity': 0.666,
	                  'width': 'mapData(strength, 35, 50, 2, 6)',
	                  'target-arrow-shape': 'triangle',
	                  'source-arrow-shape': 'circle',
	                  'line-color': 'data(faveColor)',
	                  'source-arrow-color': 'data(faveColor)',
	                  'target-arrow-color': 'data(faveColor)'
	                })
	              .selector('.faded')
	                .css({
	                  'opacity': 0.25,
	                  'text-opacity': 0
	                }),
	
	            layout: {
	              name: 'cose',
	              padding: 10
	            },
	
	            elements: eles,
	
	            ready: function() {
	              deferred.resolve( this );
	
	              cy.on('cxtdrag', 'node', function(e){
	                var node = this;
	                var dy = Math.abs( e.cyPosition.x - node.position().x );
	                var weight = Math.round( dy*2 );
	
	                node.data('weight', weight);
	
	                fire('onWeightChange', [ node.id(), node.data('weight') ]);
	              });
	
	              cy.on('tap', 'node', function(e){
	                var node = this;
	                fire('onClick', [ node.id() ]);
	              });
	
	
	            }
	          });
	
	        }); // on dom ready
	
	        return deferred.promise;
	      };
	
	      budGraph.listeners = {};
	
	      function fire(e, args){
	        var listeners = budGraph.listeners[e];
	
	        for( var i = 0; listeners && i < listeners.length; i++ ){
	          var fn = listeners[i];
	
	          fn.apply( fn, args );
	        }
	      }
	
	      function listen(e, fn){
	        var listeners = budGraph.listeners[e] = budGraph.listeners[e] || [];
	
	        listeners.push(fn);
	      }
	
	      budGraph.setBudWeight = function(id, weight){
	        cy.$('#' + id).data('weight', weight);
	      };
	
	      budGraph.onWeightChange = function(fn){
	        listen('onWeightChange', fn);
	      };
	
	      budGraph.onClick = function(fn){
	        listen('onClick', fn);
	      };
	
	      return budGraph;
	
	    }]);


/***/ },
/* 12 */
/*!*********************************************!*\
  !*** ./modules/home/budgraph-controller.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

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
	    buds.forEach (function (bud) {
	      if(bud.type !== 'Bud') {
	        api.buds.budPacksData.get(bud.id, bud.type)
	        .success(function (data) {
	          bud.state = data.state;
	        });
	      }
	    });
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
	
	});


/***/ },
/* 13 */
/*!*********************************************!*\
  !*** ./modules/home/timeline-controller.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 *
	 */
	
	angular.module('qibud.home').controller('TimelineCtrl',
	function ($scope, $state, api, budGraph)
	{
	  var user       = $scope.common.user;
	
	  api.events.list().success(function (events)
	  {
	    $scope.events = events;
	  });
	});


/***/ },
/* 14 */
/*!************************************!*\
  !*** ./modules/profile/profile.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Profile module for user profile and related content.
	 */
	
	angular
	    .module('qibud.profile', [
	      'ui.router',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	      $stateProvider
	          .state('bud.profile', {
	            url: "/profile",
	            title: 'User Profile',
	            breadcrumb: {
	              class: 'highlight',
	              text: 'User Profile',
	              stateName: 'bud.profile'
	            },
	            templateUrl: 'modules/profile/profile.html',
	            controller: 'ProfileCtrl'
	      });
	    });


/***/ },
/* 15 */
/*!***********************************************!*\
  !*** ./modules/profile/profile-controller.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Profile controller gives the user the means to view/edit their public profile info.
	 */
	
	angular.module('qibud.profile').controller('ProfileCtrl', function ($scope) {
	  // 'common' variable is always added to the root scope and it contains common things like user info, common functions etc.
	  $scope.user = $scope.common.user /* this is not needed actually. we can always directly use {{common.user}} variable directly in any view */;
	});


/***/ },
/* 16 */
/*!**********************************!*\
  !*** ./modules/viewer/viewer.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Editor module for buds
	 */
	
	angular
	    .module('qibud.viewer', [
	      'ui.router',
	      'ui.bootstrap',
	      'qibud.common'
	    ])
	    .config(function ($stateProvider, $urlRouterProvider) {
	
	      var types  = ['Team'];
	      var states = [];
	      var availableViews = {};
	
	      availableViews['@'] = {
	        controller: 'ViewerCtrl',
	        templateUrl: 'modules/viewer/viewer.html',
	      };
	
	
	      states.push({
	        name: 'bud.viewer',
	        sticky: true,
	        url: '/viewer/:budId',
	        views: availableViews,
	        breadcrumb: {
	          class: 'highlight',
	          text: 'Bud Viewer',
	          stateName: 'bud.viewer'
	        } });
	
	      angular.forEach(states, function(state) { $stateProvider.state(state); });
	    });


/***/ },
/* 17 */
/*!*********************************************!*\
  !*** ./modules/viewer/viewer-controller.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Viewer controller provide a good way to read buds
	 */
	
	angular.module('qibud.viewer').controller('ViewerCtrl',
	function ($scope, $state, $stateParams, $modal, api)
	{
	
	  var user       = $scope.common.user;
	  $scope.typeInfo = null;
	  $scope.ready = false;
	  $scope.actionInProgress = false;
	  $scope.followersCount = 0;
	  $scope.sponsorsCount = 0;
	  $scope.supportersCount = 0;
	  $scope.supportValue = 0;
	  // retrieve one bud from server
	
	  $scope.load = function ()
	  {
	    $scope.ready = false;
	    api.buds.view($stateParams.budId).success(function (bud)
	    {
	      bud.commentBox = {message: '', disabled: false};
	      bud.comments   = bud.comments || [];
	
	      $scope.bud = bud;
	      $scope.showType ($scope.bud.type, false);
	      if(bud.followers)
	      {
	          $scope.followersCount = bud.followers.length;
	          if(bud.followers.indexOf(user.id)!== -1)
	          {
	            $scope.follower = true;
	          }
	          else
	          {
	            $scope.follower = false;
	          }
	      }
	      else
	      {
	        $scope.follower = false;
	      }
	
	      if(bud.sponsors)
	      {
	        $scope.sponsorsCount = bud.sponsors.length;
	        if(bud.sponsors.indexOf(user.id)!== -1)
	        {
	          $scope.sponsorer = true;
	        }
	        else
	        {
	          $scope.sponsorer = false;
	        }
	      }
	      else
	      {
	        $scope.sponsorer = false;
	      }
	
	      if(bud.supporters)
	      {
	        $scope.supportersCount = bud.supporters.length;
	        if(bud.supporters.indexOf(user.id)!== -1)
	        {
	          $scope.supporter = true;
	        }
	        else
	        {
	          $scope.supporter = false;
	        }
	      }
	      else
	      {
	        $scope.supporter = false;
	      }
	
	      $scope.ready = true;
	
	    });
	
	
	  }
	  //Init view
	  $scope.load();
	
	  $scope.showType = function (type, reload) {
	    if (type !== 'Bud') {
	      api.types.get (type).success (function (typeInfo) {
	        $scope.typeInfo = typeInfo;
	      });
	      $state.go('bud.viewer.' + type, $state.params, { reload: reload });
	    } else {
	      $state.go('bud.viewer',$state.params, { reload: reload });
	    }
	  };
	
	  $scope.evolve = function (type) {
	    api.buds.evolve($scope.bud, type).success(function () {
	
	    });
	
	  };
	
	  $scope.canEvolve = function ()
	  {
	    if(!$scope.bud) {
	      return false;
	    }
	
	    if($scope.bud.type === 'Bud' && $scope.bud.creator.id === user.id) {
	      return true;
	    } else {
	      return false;
	    }
	  }
	
	  $scope.editSubBud = function () {
	    $state.go('bud.editor',{parentBud : $scope.bud});
	  };
	
	  $scope.budify = function (content) {
	    $state.go('bud.editor',{parentBud : $scope.bud, content: content});
	  };
	
	  $scope.delete = function () {
	    api.buds.delete($scope.bud.id).success(function (){
	      $state.go('home.stickers');
	    });
	  };
	
	  $scope.share = function () {
	    api.actors.list().success(function (actors)
	    {
	      var modalInstance = $modal.open({
	        templateUrl: 'sharebox.html',
	        controller: 'ShareboxCtrl',
	        size: 'lg',
	        resolve: {
	          users: function () {
	            return actors.users;
	          },
	          teams: function () {
	            return actors.teams;
	          }
	        }
	      });
	
	      modalInstance.result.then(function (actors) {
	        //share to ->
	        api.buds.share($scope.bud, actors).success(function (bud) {
	
	        });
	
	      }, function () {
	        //dismiss
	      });
	    });
	  };
	
	  $scope.canShare = function ()
	  {
	    var sharable = false;
	    if(!$scope.bud) {
	      return sharable;
	    }
	
	    var creatorId = $scope.bud.creator.id;
	
	    //TODO: Add a watch on privacy changes check actor
	    switch($scope.bud.privacy)
	    {
	      case 'Private':
	        if(creatorId === user.id)
	        {
	          sharable = true;
	        }
	      break;
	      case 'Private2Share':
	        if(creatorId === user.id)
	        {
	          sharable = true;
	        }
	      break;
	    case 'Free2Share':
	        sharable = true;
	      break;
	    }
	
	    return sharable;
	  };
	
	
	  $scope.followBud = function ($event)
	  {
	    if ($scope.actionInProgress)
	    {
	      $event.preventDefault();
	      return;
	    }
	
	    $scope.actionInProgress = true;
	    if(!$scope.follower)
	    {
	      api.buds.follow($scope.bud)
	        .success(function (budId)
	        {
	          $scope.actionInProgress = false;
	        })
	        .error(function ()
	        {
	          $scope.actionInProgress = false;
	        });
	    }
	    else
	    {
	      api.buds.unfollow($scope.bud)
	        .success(function (budId)
	        {
	          $scope.actionInProgress = false;
	        })
	        .error(function ()
	        {
	          $scope.actionInProgress = false;
	        });
	    }
	  }
	
	  $scope.supportBud = function ($event)
	  {
	    if ($scope.actionInProgress)
	    {
	      $event.preventDefault();
	      return;
	    }
	
	    $scope.actionInProgress = true;
	
	    if(!$scope.supporter)
	    {
	      api.buds.support($scope.bud, $scope.supportValue)
	        .success(function (budId)
	        {
	          $scope.actionInProgress = false;
	        })
	        .error(function ()
	        {
	          $scope.actionInProgress = false;
	        });
	    }
	    else
	    {
	      api.buds.unsupport($scope.bud)
	        .success(function (budId)
	        {
	          $scope.actionInProgress = false;
	        })
	        .error(function ()
	        {
	          $scope.actionInProgress = false;
	        });
	    }
	  }
	
	  $scope.sponsorBud = function ($event)
	  {
	    if ($scope.actionInProgress)
	    {
	      $event.preventDefault();
	      return;
	    }
	    $scope.actionInProgress = true;
	
	    if(!$scope.sponsorer)
	    {
	      api.buds.sponsor($scope.bud)
	        .success(function (budId)
	        {
	          $scope.actionInProgress = false;
	        })
	        .error(function ()
	        {
	          $scope.actionInProgress = false;
	        });
	    }
	    else
	    {
	      api.buds.unsponsor($scope.bud)
	        .success(function (budId)
	        {
	          $scope.actionInProgress = false;
	        })
	        .error(function ()
	        {
	          $scope.actionInProgress = false;
	        });
	    }
	  }
	
	  api.buds.followersChanged.subscribe($scope, function (bud) {
	    if ($scope.bud.id === bud.id)
	    {
	      $scope.bud.followers = bud.followers;
	      $scope.followersCount = bud.followers.length;
	      if(bud.followers.indexOf(user.id)!== -1)
	      {
	        $scope.follower = true;
	      }
	      else
	      {
	        $scope.follower = false;
	      }
	    }
	  });
	
	  api.buds.supportersChanged.subscribe($scope, function (bud) {
	    if ($scope.bud.id === bud.id)
	    {
	      $scope.bud.supporters = bud.supporters;
	      $scope.supportersCount = bud.supporters.length;
	
	      if(bud.supporters.indexOf(user.id) !== -1)
	      {
	        $scope.supporter = true;
	      }
	      else
	      {
	        $scope.supporter = false;
	      }
	    }
	  });
	
	  api.buds.sponsorsChanged.subscribe($scope, function (bud) {
	    if ($scope.bud.id === bud.id)
	    {
	      $scope.bud.sponsors = bud.sponsors;
	      $scope.sponsorsCount = bud.sponsors.length;
	      if(bud.sponsors.indexOf(user.id) !== -1)
	      {
	        $scope.sponsorer = true;
	      }
	      else
	      {
	        $scope.sponsorer = false;
	      }
	    }
	  });
	
	  $scope.createComment = function ($event, bud)
	  {
	    // submit the message in the comment box only if user hits 'Enter (keycode 13)'
	    if ($event.keyCode !== 13)
	    {
	      return;
	    }
	
	    // don't let the user type in blank lines or submit empty/whitespace only comment, or type in something when comment is being created
	    if (!bud.commentBox.message.length || bud.commentBox.disabled) {
	      $event.preventDefault();
	      return;
	    }
	
	    // disable the comment box and push the new comment to server
	    bud.commentBox.disabled = true;
	    api.buds.comments.create(bud.id, {message: bud.commentBox.message})
	        .success(function (commentId)
	        {
	          // only add the comment if we don't have it already in the bud's comments list to avoid dupes
	          if (!_.some(bud.comments, function (c) {
	            return c.id === commentId;
	          }))
	          {
	            bud.comments.push({
	              id: commentId,
	              from: user,
	              message: bud.commentBox.message,
	              createdTime: new Date()
	            });
	          }
	
	          // clear the comment field and enable it
	          bud.commentBox.message  = '';
	          bud.commentBox.disabled = false;
	        })
	        .error(function ()
	        {
	          // don't clear the comment box but enable it so the user can re-try
	          bud.commentBox.disabled = false;
	        });
	
	    // prevent default 'Enter' button behavior (create new line) as we want 'Enter' button to do submission
	    $event.preventDefault();
	  };
	
	  api.buds.comments.created.subscribe($scope, function (comment) {
	    // only add the comment if we don't have it already in the bud's comments list to avoid dupes
	    if ($scope.bud && !_.some($scope.bud.comments, function (c)
	    {
	      return c.id === comment.id;
	    }))
	    {
	      $scope.bud.comments.push(comment);
	    }
	  });
	
	  api.buds.updated.subscribe($scope, function (bud) {
	    if ($scope.bud.id === bud.id)
	    {
	      $scope.bud = bud;
	    }
	  });
	
	  api.buds.evolved.subscribe($scope, function (bud) {
	    if ($scope.bud.id === bud.id)
	    {
	      $scope.showType(bud.type, true);
	    }
	  });
	
	  api.qi.updated.subscribe($scope, function (bud) {
	    if ($scope.bud.id === bud.id)
	    {
	      $scope.bud.qi = bud.qi;
	    }
	  });
	
	});


/***/ },
/* 18 */
/*!******************************************************!*\
  !*** ./modules/viewer/viewer-sharebox-controller.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	angular.module('qibud.viewer').controller('ShareboxCtrl', function ($scope, $modalInstance, users, teams) {
	
	  $scope.users = users;
	  $scope.teams = teams;
	  $scope.selectedUsers = [];
	
	  $scope.addUser = function (user) {
	    $scope.selectedUsers.push(user);
	    _.remove($scope.users, function(u) { return u.id === user.id; });
	  };
	
	  $scope.addTeam = function (team) {
	    angular.forEach(team.members, function (user) {
	      $scope.selectedUsers.push(user);
	      _.remove($scope.users, function(u) { return u.id === user.id; });
	    });
	  };
	
	  $scope.rmUser = function (user) {
	    $scope.users.push(user);
	    _.remove($scope.selectedUsers, function(u) { return u.id === user.id; });
	  };
	
	  $scope.ok = function () {
	    $modalInstance.close($scope.selectedUsers);
	  };
	
	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	});


/***/ }
/******/ ])
//# sourceMappingURL=qibud-mods.js.map