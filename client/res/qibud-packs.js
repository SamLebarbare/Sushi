/******/
(function (modules) {
  // webpackBootstrap
  /******/
  // The module cache
  /******/
  var installedModules = {};
  /******/
  /******/
  // The require function
  /******/
  function __webpack_require__(moduleId) {
    /******/
    /******/
    // Check if module is in cache
    /******/
    if (installedModules[moduleId])
      /******/
      return installedModules[moduleId].exports;
    /******/
    /******/
    // Create a new module (and put it into the cache)
    /******/
    var module = installedModules[moduleId] = {
        exports: {},
        id: moduleId,
        loaded: false
      };
    /******/
    /******/
    // Execute the module function
    /******/
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/
    // Flag the module as loaded
    /******/
    module.loaded = true;
    /******/
    /******/
    // Return the exports of the module
    /******/
    return module.exports;  /******/
  }
  /******/
  /******/
  /******/
  // expose the modules object (__webpack_modules__)
  /******/
  __webpack_require__.m = modules;
  /******/
  /******/
  // expose the module cache
  /******/
  __webpack_require__.c = installedModules;
  /******/
  /******/
  // __webpack_public_path__
  /******/
  __webpack_require__.p = '';
  /******/
  /******/
  // Load entry module and return exports
  /******/
  return __webpack_require__(0);  /******/
}([
  function (module, exports, __webpack_require__) {
    __webpack_require__(19);
    __webpack_require__(20);
    __webpack_require__(21);
    __webpack_require__(22);
    __webpack_require__(23);
    __webpack_require__(24);
    __webpack_require__(25);
    __webpack_require__(26);
    __webpack_require__(27);
    __webpack_require__(28);
    __webpack_require__(29);
    __webpack_require__(30);
    __webpack_require__(31);
    __webpack_require__(32);
    __webpack_require__(33);
    __webpack_require__(34);
    __webpack_require__(35);
    __webpack_require__(36);  /***/
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * Bud Team
	 */
    angular.module('qibud.org.teams', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ]).config([
      '$stateProvider',
      '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('bud.viewer.Team', {
          url: '/team',
          views: {
            'summary': {
              templateUrl: 'budPacks/qibud-org-teams/view.html',
              controller: 'TeamViewerCtrl'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Team',
            stateName: 'bud.viewer.Team'
          }
        }).state('bud.editor.Team', {
          url: '/team',
          views: {
            'summary': {
              controller: 'TeamEditorCtrl',
              templateUrl: 'budPacks/qibud-org-teams/edit.html'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Team Editor',
            stateName: 'bud.editor.Team'
          }
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.teams').controller('TeamEditorCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      'api',
      function ($scope, $state, $stateParams, $location, api) {
        var user = $scope.common.user;
        $scope.packData = { members: [] };
        $scope.users = [];
        api.users.list().success(function (users) {
          $scope.users = users;
          api.buds.budPacksData.get($scope.editedBud.id, 'Team').success(function (packData) {
            if (packData.members) {
              $scope.packData = packData;
              console.log('packdata found:' + packData);
              $scope.packData.members.forEach(function (user) {
                _.remove($scope.users, function (u) {
                  return u.id === user.id;
                });
              });
            } else {
              api.buds.budPacksData.create($scope.editedBud.id, $scope.packData, 'Team');
            }
          }).error(function () {
            console.log('error while loading packdata');
          });
        });
        $scope.addUser = function (user) {
          $scope.packData.members.push(user);
          _.remove($scope.users, function (u) {
            return u.id === user.id;
          });
          api.buds.budPacksData.set($scope.editedBud.id, $scope.packData, 'Team');
          api.links.createU2B(user.id, 'MEMBER', $scope.editedBud.id);
        };
        $scope.rmUser = function (user) {
          $scope.users.push(user);
          _.remove($scope.packData.members, function (u) {
            return u.id === user.id;
          });
          api.buds.budPacksData.set($scope.editedBud.id, $scope.packData, 'Team');
          api.links.deleteU2B(user.id, 'MEMBER', $scope.editedBud.id);
        };
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.teams').controller('TeamViewerCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      'api',
      function ($scope, $state, $stateParams, $location, api) {
        var user = $scope.common.user;
        $scope.packData = { members: [] };
        api.buds.budPacksData.get($scope.bud.id, 'Team').success(function (packData) {
          if (packData.members) {
            console.log('packdata loaded');
            $scope.packData = packData;
          }
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * Bud mission
	 */
    angular.module('qibud.org.missions', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ]).config([
      '$stateProvider',
      '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('bud.viewer.Mission', {
          url: '/mission',
          views: {
            'summary': {
              templateUrl: 'budPacks/qibud-org-missions/view.html',
              controller: 'MissionViewerCtrl'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Mission',
            stateName: 'bud.viewer.Mission'
          }
        }).state('bud.editor.Mission', {
          url: '/mission',
          views: {
            'summary': {
              controller: 'MissionViewerCtrl',
              templateUrl: 'budPacks/qibud-org-missions/view.html'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Mission Editor',
            stateName: 'bud.editor.Mission'
          }
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.missions').controller('MissionEditorCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      'api',
      function ($scope, $state, $stateParams, $location, api) {
        console.log('MissionEditorCtrl start...');
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.missions').controller('MissionViewerCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'api',
      function ($scope, $state, $stateParams, api) {
        console.log('MissionViewerCtrl start...');
        var user = $scope.common.user;
        $scope.packData = {
          state: 'Waiting',
          projects: [],
          team: null
        };
        api.buds.budPacksData.get($scope.bud.id, 'Mission').success(function (packData) {
          if (packData.state) {
            $scope.packData = packData;
            console.log('packdata found:' + packData);
            api.buds.childrenByType($scope.bud.id, 'Project').success(function (projects) {
              $scope.packData.projects = projects;
              if (projects.length > 0) {
                $scope.packData.state = 'Started';
                var scope = $scope;
                angular.forEach(projects, function (project) {
                  api.types.get('Project').success(function (typeInfo) {
                    project.typeInfo = typeInfo;
                  });
                  api.buds.budPacksData.get(project._id, 'Project').success(function (data) {
                    if (data.state === 'Ended') {
                      scope.packData.state = 'Ended';
                    } else {
                      scope.packData.state = 'Started';
                    }
                    project.state = data.state;
                  });
                });
              } else {
                $scope.packData.state = 'Waiting';
              }
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Mission');
            });
          } else {
            api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Mission');
          }
        }).error(function () {
          console.log('error while loading packdata');
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * Bud project
	 */
    angular.module('qibud.org.projects', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ]).config([
      '$stateProvider',
      '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('bud.viewer.Project', {
          url: '/project',
          views: {
            'summary': {
              templateUrl: 'budPacks/qibud-org-projects/view.html',
              controller: 'ProjectViewerCtrl'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Project',
            stateName: 'bud.viewer.Project'
          }
        }).state('bud.editor.Project', {
          url: '/project',
          views: {
            'summary': {
              controller: 'ProjectViewerCtrl',
              templateUrl: 'budPacks/qibud-org-projects/view.html'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Project Editor',
            stateName: 'bud.editor.Project'
          }
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.projects').controller('ProjectEditorCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      'api',
      function ($scope, $state, $stateParams, $location, api) {
        console.log('ProjectEditorCtrl start...');
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.projects').controller('ProjectViewerCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'api',
      function ($scope, $state, $stateParams, api) {
        console.log('ProjectViewerCtrl start...');
        var user = $scope.common.user;
        $scope.packData = {
          state: 'Waiting',
          actions: []
        };
        api.buds.budPacksData.get($scope.bud.id, 'Project').success(function (packData) {
          if (packData.state) {
            $scope.packData = packData;
            console.log('packdata found:' + packData);
            api.buds.childrenByType($scope.bud.id, 'Action').success(function (actions) {
              $scope.packData.actions = actions;
              if (actions.length > 0) {
                $scope.packData.state = 'Started';
                var scope = $scope;
                angular.forEach(actions, function (action) {
                  if (action.dataCache.state === 'Ended') {
                    scope.packData.state = 'Ended';
                  } else {
                    scope.packData.state = 'Started';
                  }
                });
              } else {
                $scope.packData.state = 'Waiting';
              }
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Project');
            });
          } else {
            api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Project');
          }
        }).error(function () {
          console.log('error while loading packdata');
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * Bud project
	 */
    angular.module('qibud.org.actions', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ]).config([
      '$stateProvider',
      '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('bud.viewer.Action', {
          url: '/action',
          views: {
            'summary': {
              templateUrl: 'budPacks/qibud-org-actions/view.html',
              controller: 'ActionViewerCtrl'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Action',
            stateName: 'bud.viewer.Action'
          }
        }).state('bud.editor.Action', {
          url: '/action',
          views: {
            'summary': {
              controller: 'ActionViewerCtrl',
              templateUrl: 'budPacks/qibud-org-actions/view.html'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Action Editor',
            stateName: 'bud.editor.Action'
          }
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.actions').controller('ActionEditorCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      'api',
      function ($scope, $state, $stateParams, $location, api) {
        console.log('ActionEditorCtrl start...');
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.actions').controller('ActionViewerCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'api',
      function ($scope, $state, $stateParams, api) {
        console.log('ActionViewerCtrl start...');
        var user = $scope.common.user;
        $scope.packData = {
          state: 'Free',
          actor: undefined
        };
        var afterLoad = function () {
          api.buds.budPacksData.get($scope.bud.id, 'Action').success(function (packData) {
            if (packData.state) {
              $scope.packData = packData;
              console.log('packdata found:' + packData);
              api.buds.childrenByType($scope.bud.id, 'Result').success(function (results) {
                if (results.length > 0) {
                  var scope = $scope;
                  angular.forEach(results, function (result) {
                    api.buds.budPacksData.get(result._id, 'Result').success(function (data) {
                      if (data.state === 'Success') {
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
          }).error(function () {
            console.log('error while loading packdata');
          });
        };
        $scope.isActor = function () {
          if ($scope.packData.actor !== undefined) {
            if ($scope.packData.actor === user) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        };
        $scope.isCreator = function () {
          if ($scope.bud.creator !== undefined) {
            if ($scope.bud.creator === user) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        };
        $scope.isActorOrCreator = function () {
          return $scope.isActor() || $scope.isCreator();
        };
        $scope.setActor = function () {
          $scope.packData.actor = user;
          $scope.packData.state = 'Waiting';
          api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Action');
          api.links.createU2B(user.id, 'ACTOR', $scope.bud.id);
          $scope.load();
        };
        $scope.unsetActor = function () {
          $scope.packData.actor = undefined;
          $scope.packData.state = 'Free';
          api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Action');
          api.links.deleteU2B(user.id, 'ACTOR', $scope.bud.id);
          $scope.load();
        };
        $scope.load(afterLoad);
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * Bud Idea
	 */
    angular.module('qibud.org.ideas', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ]).config([
      '$stateProvider',
      '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('bud.viewer.Idea', {
          url: '/idea',
          views: {
            'summary': {
              templateUrl: 'budPacks/qibud-org-ideas/view.html',
              controller: 'IdeaViewerCtrl'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Idea',
            stateName: 'bud.viewer.Idea'
          }
        }).state('bud.editor.Idea', {
          url: '/idea',
          views: {
            'summary': {
              controller: 'IdeaEditorCtrl',
              templateUrl: 'budPacks/qibud-org-ideas/edit.html'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Idea Editor',
            stateName: 'bud.editor.Idea'
          }
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.ideas').controller('IdeaEditorCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      'api',
      function ($scope, $state, $stateParams, $location, api) {
        var user = $scope.common.user;
        $scope.packData = {};
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.ideas').controller('IdeaViewerCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      'api',
      function ($scope, $state, $stateParams, $location, api) {
        var user = $scope.common.user;
        $scope.packData = { state: 'Waiting' };
        api.buds.budPacksData.get($scope.bud.id, 'Idea').success(function (packData) {
          if (packData.state) {
            $scope.packData = packData;
            console.log('packdata found:' + packData);
            if ($scope.bud.sponsors.length > 0) {
              $scope.packData.state = 'Sponsored';
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
            } else {
              $scope.packData.state = 'Waiting';
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
            }
          } else {
            api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Idea');
          }
        }).error(function () {
          console.log('error while loading packdata');
        });
        api.buds.sponsorsChanged.subscribe($scope, function (bud) {
          if ($scope.bud.id === bud.id) {
            if (bud.sponsors.length > 0) {
              $scope.packData.state = 'Sponsored';
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
            } else {
              $scope.packData.state = 'Waiting';
              api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Idea');
            }
          }
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * Bud result
	 */
    angular.module('qibud.org.results', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ]).config([
      '$stateProvider',
      '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('bud.viewer.Result', {
          url: '/result',
          views: {
            'summary': {
              templateUrl: 'budPacks/qibud-org-results/view.html',
              controller: 'ResultViewerCtrl'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Result',
            stateName: 'bud.viewer.Result'
          }
        }).state('bud.editor.Result', {
          url: '/result',
          views: {
            'summary': {
              controller: 'ResultViewerCtrl',
              templateUrl: 'budPacks/qibud-org-results/view.html'
            }
          },
          breadcrumb: {
            class: 'highlight',
            text: 'Bud Result Editor',
            stateName: 'bud.editor.Result'
          }
        });
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.results').controller('ResultEditorCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      'api',
      function ($scope, $state, $stateParams, $location, api) {
        console.log('ResultEditorCtrl start...');
      }
    ]);  /***/
  },
  function (module, exports, __webpack_require__) {
    'use strict';
    /**
	 * __
	 */
    angular.module('qibud.org.results').controller('ResultViewerCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'api',
      function ($scope, $state, $stateParams, api) {
        console.log('ResultViewerCtrl start...');
        var user = $scope.common.user;
        $scope.packData = {
          state: 'Undefined',
          actor: undefined
        };
        $scope.setSuccess = function () {
          $scope.packData.state = 'Success';
          api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
          if ($scope.bud.parentBud) {
            api.buds.budPacksData.get($scope.bud.parentBud.id, 'Action').success(function (packData) {
              packData.state = 'Ended';
              api.buds.budPacksData.set($scope.bud.parentBud.id, packData, 'Action');
            });
          }
        };
        $scope.setFailed = function () {
          $scope.packData.state = 'Failed';
          api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
        };
        $scope.isActor = function () {
          if ($scope.packData.actor !== undefined) {
            if ($scope.packData.actor === user) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        };
        $scope.isCreator = function () {
          if ($scope.bud.creator !== undefined) {
            if ($scope.bud.creator === user) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        };
        $scope.isActorOrCreator = function () {
          return isActor() || isCreator();
        };
        $scope.setActor = function () {
          $scope.packData.actor = user;
          api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
          api.links.createU2B(user.id, 'ACTOR', $scope.bud.id);
        };
        $scope.unsetActor = function () {
          $scope.packData.actor = undefined;
          api.buds.budPacksData.set($scope.bud.id, $scope.packData, 'Result');
          api.links.deleteU2B(user.id, 'ACTOR', $scope.bud.id);
        };
        api.buds.budPacksData.get($scope.bud.id, 'Result').success(function (packData) {
          if (packData.state) {
            $scope.packData = packData;
            console.log('packdata found:' + packData);
          } else {
            api.buds.budPacksData.create($scope.bud.id, $scope.packData, 'Result');
          }
        }).error(function () {
          console.log('error while loading packdata');
        });
      }
    ]);  /***/
  }  /******/
]));
//# sourceMappingURL=qibud-packs.js.map