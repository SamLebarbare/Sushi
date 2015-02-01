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
  __webpack_require__.p = './res/';
  /******/
  /******/
  // Load entry module and return exports
  /******/
  return __webpack_require__(0);  /******/
}([
  function (module, exports, __webpack_require__) {
    eval('__webpack_require__(22);\n__webpack_require__(23);\n\n__webpack_require__(24);\n__webpack_require__(25);\n\n__webpack_require__(26);\n__webpack_require__(27);\n\n__webpack_require__(28);\n__webpack_require__(29);\n\n__webpack_require__(30);\n__webpack_require__(31);\n\n__webpack_require__(32);\n__webpack_require__(33);\n\n__webpack_require__(34);\n__webpack_require__(35);\n\n__webpack_require__(36);\n__webpack_require__(37);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/packs-deps.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/packs-deps.js?');  /***/
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
  ,
  ,
  ,
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * Bud Team\r\n */\r\n\r\nangular\r\n    .module(\'qibud.org.teams\', [\r\n      \'ui.router\',\r\n      \'ui.bootstrap\',\r\n      \'qibud.common\'\r\n    ])\r\n    .config(function ($stateProvider, $urlRouterProvider) {\r\n      $stateProvider\r\n          .state(\'bud.viewer.Team\', {\r\n            url: \'/team\',\r\n            views: {\r\n              \'summary\':{\r\n                templateUrl: \'budPacks/qibud-org-teams/view.html\',\r\n                controller: \'TeamViewerCtrl\'\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Team\',\r\n              stateName: \'bud.viewer.Team\'\r\n            },\r\n          })\r\n          .state(\'bud.editor.Team\', {\r\n            url: \'/team\',\r\n            views: {\r\n              \'summary\':{\r\n                controller: \'TeamEditorCtrl\',\r\n                templateUrl: \'budPacks/qibud-org-teams/edit.html\'\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Team Editor\',\r\n              stateName: \'bud.editor.Team\'\r\n            },\r\n          });\r\n    });\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-teams/pack.js\n ** module id = 22\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-teams/pack.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * __\r\n */\r\n\r\nangular.module(\'qibud.org.teams\').controller(\'TeamViewerCtrl\',\r\nfunction ($scope, $state, $stateParams, $location, api)\r\n{\r\n  var user       = $scope.common.user;\r\n  $scope.users    = [];\r\n  $scope.packData = {\r\n    members : []\r\n  };\r\n  $scope.canEditTeam = function () {\r\n    return $scope.bud.creator.id === user.id;\r\n  };\r\n  $scope.addUser = function (user) {\r\n    $scope.packData.members.push(user);\r\n    _.remove($scope.users, function(u) { return u.id === user.id; });\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Team\');\r\n    api.links.createU2B(user.id,\'MEMBER\',$scope.bud.id);\r\n  };\r\n\r\n  $scope.rmUser = function (user) {\r\n    $scope.users.push(user);\r\n    _.remove($scope.packData.members, function(u) { return u.id === user.id; });\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Team\');\r\n    api.links.deleteU2B(user.id,\'MEMBER\',$scope.bud.id);\r\n  };\r\n\r\n  var afterLoad = function (done) {\r\n    api.users.list().success(function (users)\r\n    {\r\n      $scope.users = users;\r\n\r\n      api.buds.budPacksData.get($scope.bud.id, \'Team\')\r\n      .success(function (packData)\r\n      {\r\n\r\n        if(packData.members) {\r\n          $scope.packData = packData;\r\n          console.log(\'packdata found:\' + packData);\r\n          $scope.packData.members.forEach (function (user){\r\n            _.remove($scope.users, function(u) { return u.id === user.id; });\r\n          });\r\n        } else {\r\n          api.buds.budPacksData.create($scope.bud.id, $scope.packData, \'Team\');\r\n        }\r\n        done ();\r\n      })\r\n      .error(function ()\r\n      {\r\n        console.log(\'error while loading packdata\');\r\n        done ();\r\n      });\r\n    });\r\n  };\r\n\r\n  $scope.load (afterLoad);\r\n});\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-teams/view-controller.js\n ** module id = 23\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-teams/view-controller.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * Bud mission\r\n */\r\n\r\nangular\r\n    .module(\'qibud.org.missions\', [\r\n      \'ui.router\',\r\n      \'ui.bootstrap\',\r\n      \'qibud.common\'\r\n    ])\r\n    .config(function ($stateProvider, $urlRouterProvider) {\r\n      $stateProvider\r\n          .state(\'bud.viewer.Mission\', {\r\n            url: \'/mission\',\r\n            views: {\r\n              \'summary\':{\r\n                templateUrl: \'budPacks/qibud-org-missions/view.html\',\r\n                controller: \'MissionViewerCtrl\'\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Mission\',\r\n              stateName: \'bud.viewer.Mission\'\r\n            }\r\n          })\r\n          .state(\'bud.editor.Mission\', {\r\n            url: \'/mission\',\r\n            views: {\r\n              \'summary\':{\r\n                controller: \'MissionViewerCtrl\',\r\n                templateUrl: \'budPacks/qibud-org-missions/view.html\',\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Mission Editor\',\r\n              stateName: \'bud.editor.Mission\'\r\n            }\r\n          });\r\n    });\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-missions/pack.js\n ** module id = 24\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-missions/pack.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * __\r\n */\r\n\r\nangular.module(\'qibud.org.missions\').controller(\'MissionViewerCtrl\',\r\nfunction ($scope, $state, $stateParams, api)\r\n{\r\n  console.log("MissionViewerCtrl start...");\r\n  var user        = $scope.common.user;\r\n  $scope.packData = {\r\n    state: \'Waiting\',\r\n    projects: [],\r\n    team: null\r\n  };\r\n  var afterLoad = function (done) {\r\n    api.buds.budPacksData.get($scope.bud.id, \'Mission\')\r\n    .success(function (packData)\r\n      {\r\n        if(packData.state) {\r\n          $scope.packData = packData;\r\n          console.log(\'packdata found:\' + packData);\r\n          api.buds.childrenByType ($scope.bud.id, \'Project\')\r\n          .success(function (projects)\r\n            {\r\n              $scope.packData.projects = projects;\r\n              if(projects.length > 0)\r\n              {\r\n                $scope.packData.state = \'Started\';\r\n                var scope = $scope;\r\n                angular.forEach(projects, function (project) {\r\n                  if(project.dataCache.state === \'Ended\') {\r\n                    scope.packData.state = \'Ended\';\r\n                  } else {\r\n                    scope.packData.state = \'Started\';\r\n                  }\r\n                });\r\n              } else {\r\n                $scope.packData.state = \'Waiting\';\r\n              }\r\n              api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Mission\');\r\n              done ();\r\n            });\r\n      } else {\r\n        api.buds.budPacksData.create($scope.bud.id, $scope.packData, \'Mission\');\r\n        done ();\r\n      }\r\n    })\r\n    .error(function ()\r\n    {\r\n      console.log(\'error while loading packdata\');\r\n      done ();\r\n    });\r\n  };\r\n\r\n  $scope.load (afterLoad);\r\n});\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-missions/view-controller.js\n ** module id = 25\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-missions/view-controller.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * Bud project\r\n */\r\n\r\nangular\r\n    .module(\'qibud.org.projects\', [\r\n      \'ui.router\',\r\n      \'ui.bootstrap\',\r\n      \'qibud.common\'\r\n    ])\r\n    .config(function ($stateProvider, $urlRouterProvider) {\r\n      $stateProvider\r\n          .state(\'bud.viewer.Project\', {\r\n            url: \'/project\',\r\n            views: {\r\n              \'summary\':{\r\n                templateUrl: \'budPacks/qibud-org-projects/view.html\',\r\n                controller: \'ProjectViewerCtrl\'\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Project\',\r\n              stateName: \'bud.viewer.Project\'\r\n            }\r\n          })\r\n          .state(\'bud.editor.Project\', {\r\n            url: \'/project\',\r\n            views: {\r\n              \'summary\':{\r\n                controller: \'ProjectViewerCtrl\',\r\n                templateUrl: \'budPacks/qibud-org-projects/view.html\',\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Project Editor\',\r\n              stateName: \'bud.editor.Project\'\r\n            }\r\n          });\r\n    });\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-projects/pack.js\n ** module id = 26\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-projects/pack.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * __\r\n */\r\n\r\nangular.module(\'qibud.org.projects\').controller(\'ProjectViewerCtrl\',\r\nfunction ($scope, $state, $stateParams, api)\r\n{\r\n  console.log("ProjectViewerCtrl start...");\r\n  var user        = $scope.common.user;\r\n  $scope.packData = {\r\n    state: \'Waiting\',\r\n    actions: []\r\n  };\r\n  var afterLoad = function (done) {\r\n    api.buds.budPacksData.get($scope.bud.id, \'Project\')\r\n    .success(function (packData)\r\n  {\r\n    if(packData.state) {\r\n      $scope.packData = packData;\r\n      console.log(\'packdata found:\' + packData);\r\n      api.buds.childrenByType ($scope.bud.id, \'Action\')\r\n      .success(function (actions)\r\n        {\r\n          $scope.packData.actions = actions;\r\n          if(actions.length > 0)\r\n          {\r\n            $scope.packData.state = \'Started\';\r\n            var scope = $scope;\r\n            angular.forEach(actions, function (action) {\r\n              if(action.dataCache.state === \'Ended\') {\r\n                scope.packData.state = \'Ended\';\r\n              } else {\r\n                scope.packData.state = \'Started\';\r\n              }\r\n            });\r\n          } else {\r\n            $scope.packData.state = \'Waiting\';\r\n          }\r\n          api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Project\');\r\n          done ();\r\n        });\r\n      } else {\r\n        api.buds.budPacksData.create($scope.bud.id, $scope.packData, \'Project\');\r\n        done ();\r\n      }\r\n    })\r\n    .error(function ()\r\n    {\r\n      console.log(\'error while loading packdata\');\r\n      done ();\r\n    });\r\n  };\r\n\r\n  $scope.load (afterLoad);\r\n\r\n\r\n});\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-projects/view-controller.js\n ** module id = 27\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-projects/view-controller.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * Bud project\r\n */\r\n\r\nangular\r\n    .module(\'qibud.org.actions\', [\r\n      \'ui.router\',\r\n      \'ui.bootstrap\',\r\n      \'qibud.common\'\r\n    ])\r\n    .config(function ($stateProvider, $urlRouterProvider) {\r\n      $stateProvider\r\n          .state(\'bud.viewer.Action\', {\r\n            url: \'/action\',\r\n            views: {\r\n              \'summary\':{\r\n                templateUrl: \'budPacks/qibud-org-actions/view.html\',\r\n                controller: \'ActionViewerCtrl\'\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Action\',\r\n              stateName: \'bud.viewer.Action\'\r\n            }\r\n          })\r\n          .state(\'bud.editor.Action\', {\r\n            url: \'/action\',\r\n            views: {\r\n              \'summary\':{\r\n                controller: \'ActionViewerCtrl\',\r\n                templateUrl: \'budPacks/qibud-org-actions/view.html\',\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Action Editor\',\r\n              stateName: \'bud.editor.Action\'\r\n            }\r\n          });\r\n    });\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-actions/pack.js\n ** module id = 28\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-actions/pack.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * __\r\n */\r\n\r\nangular.module(\'qibud.org.actions\').controller(\'ActionViewerCtrl\',\r\nfunction ($scope, $state, $stateParams, api)\r\n{\r\n  console.log("ActionViewerCtrl start...");\r\n  var user        = $scope.common.user;\r\n  $scope.packData = {\r\n    state: \'Free\',\r\n    actor: undefined\r\n  };\r\n\r\n  var afterLoad = function (done) {\r\n    api.buds.budPacksData.get($scope.bud.id, \'Action\')\r\n    .success(function (packData)\r\n      {\r\n        if(packData.state) {\r\n          $scope.packData = packData;\r\n          console.log(\'packdata found:\' + packData);\r\n          api.buds.childrenByType ($scope.bud.id, \'Result\')\r\n          .success(function (results)\r\n        {\r\n          if(results.length > 0)\r\n          {\r\n            var scope = $scope;\r\n            angular.forEach(results, function (result) {\r\n              api.buds.budPacksData.get(result.id, \'Result\')\r\n              .success(function (data) {\r\n                if(data.state === \'Success\') {\r\n                  scope.packData.state = \'Ended\';\r\n                  api.buds.budPacksData.set($scope.bud.id, scope.packData, \'Action\');\r\n                }\r\n              });\r\n            });\r\n          } else {\r\n            done ();\r\n          }\r\n        });\r\n      } else {\r\n        api.buds.budPacksData.create($scope.bud.id, $scope.packData, \'Action\');\r\n        done ();\r\n      }\r\n    })\r\n    .error(function ()\r\n    {\r\n      console.log(\'error while loading packdata\');\r\n      done ();\r\n    });\r\n  };\r\n\r\n  $scope.isActor = function ()\r\n  {\r\n    if ($scope.packData.actor !== undefined) {\r\n      if($scope.packData.actor === user) {\r\n        return true;\r\n      } else {\r\n        return false;\r\n      }\r\n    } else {\r\n      return false;\r\n    }\r\n  }\r\n\r\n  $scope.isCreator = function ()\r\n  {\r\n    if ($scope.bud.creator !== undefined) {\r\n      if($scope.bud.creator === user) {\r\n        return true;\r\n      } else {\r\n        return false;\r\n      }\r\n    } else {\r\n      return false;\r\n    }\r\n  }\r\n\r\n  $scope.isActorOrCreator = function ()\r\n  {\r\n    return ($scope.isActor() || $scope.isCreator());\r\n  }\r\n\r\n  $scope.setActor = function ()\r\n  {\r\n    $scope.packData.actor = user;\r\n    $scope.packData.state = \'Waiting\';\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Action\');\r\n    api.links.createU2B(user.id,\'ACTOR\',$scope.bud.id);\r\n    $scope.load ();\r\n  };\r\n\r\n  $scope.unsetActor = function ()\r\n  {\r\n    $scope.packData.actor = undefined;\r\n    $scope.packData.state = \'Free\';\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Action\');\r\n    api.links.deleteU2B(user.id,\'ACTOR\',$scope.bud.id);\r\n    $scope.load ();\r\n  };\r\n\r\n  $scope.load (afterLoad);\r\n});\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-actions/view-controller.js\n ** module id = 29\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-actions/view-controller.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * Bud project\r\n */\r\n\r\nangular\r\n    .module(\'qibud.org.issues\', [\r\n      \'ui.router\',\r\n      \'ui.bootstrap\',\r\n      \'qibud.common\'\r\n    ])\r\n    .config(function ($stateProvider, $urlRouterProvider) {\r\n      $stateProvider\r\n          .state(\'bud.viewer.Issue\', {\r\n            url: \'/Issue\',\r\n            views: {\r\n              \'summary\':{\r\n                templateUrl: \'budPacks/qibud-org-issues/view.html\',\r\n                controller: \'IssueViewerCtrl\'\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Issue\',\r\n              stateName: \'bud.viewer.Issue\'\r\n            }\r\n          });\r\n    });\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-issues/pack.js\n ** module id = 30\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-issues/pack.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * __\r\n */\r\n\r\nangular.module(\'qibud.org.issues\').controller(\'IssueViewerCtrl\',\r\nfunction ($scope, $state, $stateParams, api)\r\n{\r\n  console.log("IssueViewerCtrl start...");\r\n  var user        = $scope.common.user;\r\n  $scope.packData = {\r\n    state: \'Free\',\r\n    actor: undefined\r\n  };\r\n\r\n  var afterLoad = function (done) {\r\n    api.buds.budPacksData.get($scope.bud.id, \'Issue\')\r\n    .success(function (packData)\r\n      {\r\n        if(packData.state) {\r\n          $scope.packData = packData;\r\n          console.log(\'packdata found:\' + packData);\r\n          api.buds.childrenByType ($scope.bud.id, \'Result\')\r\n          .success(function (results)\r\n        {\r\n          if(results.length > 0)\r\n          {\r\n            var scope = $scope;\r\n            angular.forEach(results, function (result) {\r\n              api.buds.budPacksData.get(result.id, \'Result\')\r\n              .success(function (data) {\r\n                if(data.state === \'Success\') {\r\n                  scope.packData.state = \'Ended\';\r\n                  api.buds.budPacksData.set($scope.bud.id, scope.packData, \'Issue\');\r\n                }\r\n                done ();\r\n              });\r\n            });\r\n          } else {\r\n            done ();\r\n          }\r\n        });\r\n      } else {\r\n        api.buds.budPacksData.create($scope.bud.id, $scope.packData, \'Issue\');\r\n        done ();\r\n      }\r\n    })\r\n    .error(function ()\r\n    {\r\n      console.log(\'error while loading packdata\');\r\n      done ();\r\n    });\r\n  };\r\n\r\n  $scope.isActor = function ()\r\n  {\r\n    if ($scope.packData.actor !== undefined) {\r\n      if($scope.packData.actor === user) {\r\n        return true;\r\n      } else {\r\n        return false;\r\n      }\r\n    } else {\r\n      return false;\r\n    }\r\n  }\r\n\r\n  $scope.isCreator = function ()\r\n  {\r\n    if ($scope.bud.creator !== undefined) {\r\n      if($scope.bud.creator === user) {\r\n        return true;\r\n      } else {\r\n        return false;\r\n      }\r\n    } else {\r\n      return false;\r\n    }\r\n  }\r\n\r\n  $scope.isActorOrCreator = function ()\r\n  {\r\n    return ($scope.isActor() || $scope.isCreator());\r\n  }\r\n\r\n  $scope.setActor = function ()\r\n  {\r\n    $scope.packData.actor = user;\r\n    $scope.packData.state = \'Assigned\';\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Issue\');\r\n    api.links.createU2B(user.id,\'ACTOR\',$scope.bud.id);\r\n    $scope.load ();\r\n  };\r\n\r\n  $scope.unsetActor = function ()\r\n  {\r\n    $scope.packData.actor = undefined;\r\n    $scope.packData.state = \'Free\';\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Issue\');\r\n    api.links.deleteU2B(user.id,\'ACTOR\',$scope.bud.id);\r\n    $scope.load ();\r\n  };\r\n\r\n  $scope.load (afterLoad);\r\n});\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-issues/view-controller.js\n ** module id = 31\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-issues/view-controller.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n/**\r\n * Bud Idea\r\n */\r\n\r\nangular\r\n    .module(\'qibud.org.ideas\', [\r\n      \'ui.router\',\r\n      \'ui.bootstrap\',\r\n      \'qibud.common\'\r\n    ])\r\n    .config(function ($stateProvider, $urlRouterProvider) {\r\n      $stateProvider\r\n          .state(\'bud.viewer.Idea\', {\r\n            url: \'/idea\',\r\n            views: {\r\n              \'summary\':{\r\n                templateUrl: \'budPacks/qibud-org-ideas/view.html\',\r\n                controller: \'IdeaViewerCtrl\'\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Idea\',\r\n              stateName: \'bud.viewer.Idea\'\r\n            },\r\n          })\r\n          .state(\'bud.editor.Idea\', {\r\n            url: \'/idea\',\r\n            views: {\r\n              \'summary\':{\r\n                controller: \'IdeaEditorCtrl\',\r\n                templateUrl: \'budPacks/qibud-org-ideas/edit.html\',\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Idea Editor\',\r\n              stateName: \'bud.editor.Idea\'\r\n            },\r\n          });\r\n    });\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-ideas/pack.js\n ** module id = 32\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-ideas/pack.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * __\r\n */\r\n\r\nangular.module(\'qibud.org.ideas\').controller(\'IdeaViewerCtrl\',\r\nfunction ($scope, $state, $stateParams, $location, api)\r\n{\r\n  var user       = $scope.common.user;\r\n  $scope.packData = {\r\n    state: \'Waiting\'\r\n  };\r\n  var afterLoad = function (done) {\r\n    api.buds.budPacksData.get($scope.bud.id, \'Idea\')\r\n    .success(function (packData)\r\n      {\r\n        if(packData.state) {\r\n          $scope.packData = packData;\r\n          console.log(\'packdata found:\' + packData);\r\n          if ($scope.bud.sponsors) {\r\n            if ($scope.bud.sponsors.length > 0){\r\n              $scope.packData.state = \'Sponsored\';\r\n              api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Idea\');\r\n            }\r\n          } else {\r\n            $scope.packData.state = \'Waiting\';\r\n            api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Idea\');\r\n          }\r\n          done ();\r\n        } else {\r\n          api.buds.budPacksData.create($scope.bud.id, $scope.packData, \'Idea\');\r\n          done ();\r\n        }\r\n      })\r\n      .error(function ()\r\n    {\r\n      console.log(\'error while loading packdata\');\r\n      done ();\r\n    });\r\n\r\n    api.buds.sponsorsChanged.subscribe($scope, function (bud) {\r\n      if ($scope.bud.id === bud.id)\r\n      {\r\n        if (bud.sponsors.length > 0) {\r\n          $scope.packData.state = \'Sponsored\';\r\n          api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Idea\');\r\n        } else {\r\n          $scope.packData.state = \'Waiting\';\r\n          api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Idea\');\r\n        }\r\n      }\r\n    });\r\n  };\r\n\r\n  $scope.load (afterLoad);\r\n\r\n\r\n\r\n\r\n});\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-ideas/view-controller.js\n ** module id = 33\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-ideas/view-controller.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * Bud result\r\n */\r\n\r\nangular\r\n    .module(\'qibud.org.results\', [\r\n      \'ui.router\',\r\n      \'ui.bootstrap\',\r\n      \'qibud.common\'\r\n    ])\r\n    .config(function ($stateProvider, $urlRouterProvider) {\r\n      $stateProvider\r\n          .state(\'bud.viewer.Result\', {\r\n            url: \'/result\',\r\n            views: {\r\n              \'summary\':{\r\n                templateUrl: \'budPacks/qibud-org-results/view.html\',\r\n                controller: \'ResultViewerCtrl\'\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Result\',\r\n              stateName: \'bud.viewer.Result\'\r\n            }\r\n          })\r\n          .state(\'bud.editor.Result\', {\r\n            url: \'/result\',\r\n            views: {\r\n              \'summary\':{\r\n                controller: \'ResultViewerCtrl\',\r\n                templateUrl: \'budPacks/qibud-org-results/view.html\',\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Result Editor\',\r\n              stateName: \'bud.editor.Result\'\r\n            }\r\n          });\r\n    });\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-results/pack.js\n ** module id = 34\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-results/pack.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * __\r\n */\r\n\r\nangular.module(\'qibud.org.results\').controller(\'ResultViewerCtrl\',\r\nfunction ($scope, $state, $stateParams, api)\r\n{\r\n  console.log("ResultViewerCtrl start...");\r\n  var user        = $scope.common.user;\r\n  $scope.packData = {\r\n    state: \'Undefined\',\r\n    actor: undefined\r\n  };\r\n\r\n  var afterLoad = function (done) {\r\n    api.buds.budPacksData.get($scope.bud.id, \'Result\')\r\n    .success(function (packData)\r\n      {\r\n        if(packData.state) {\r\n          $scope.packData = packData;\r\n          console.log(\'packdata found:\' + packData);\r\n        } else {\r\n          api.buds.budPacksData.create($scope.bud.id, $scope.packData, \'Result\');\r\n        }\r\n        done ();\r\n      })\r\n      .error(function ()\r\n    {\r\n      console.log(\'error while loading packdata\');\r\n      done ();\r\n    });\r\n  };\r\n\r\n  $scope.load (afterLoad);\r\n  $scope.setSuccess = function ()\r\n  {\r\n    $scope.packData.state = \'Success\';\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Result\');\r\n    if($scope.bud.parentBud) {\r\n      api.buds.budPacksData.get($scope.bud.parentBud.id, \'Action\')\r\n      .success(function (packData) {\r\n        packData.state = \'Ended\';\r\n        api.buds.budPacksData.set($scope.bud.parentBud.id, packData, \'Action\');\r\n      });\r\n\r\n    }\r\n  };\r\n\r\n  $scope.setFailed = function ()\r\n  {\r\n    $scope.packData.state = \'Failed\';\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Result\');\r\n  };\r\n\r\n  $scope.isActor = function ()\r\n  {\r\n    if ($scope.packData.actor !== undefined) {\r\n      if($scope.packData.actor === user) {\r\n        return true;\r\n      } else {\r\n        return false;\r\n      }\r\n    } else {\r\n      return false;\r\n    }\r\n  }\r\n\r\n  $scope.isCreator = function ()\r\n  {\r\n    if ($scope.bud.creator !== undefined) {\r\n      if($scope.bud.creator === user) {\r\n        return true;\r\n      } else {\r\n        return false;\r\n      }\r\n    } else {\r\n      return false;\r\n    }\r\n  }\r\n\r\n  $scope.isActorOrCreator = function ()\r\n  {\r\n    return ($scope.isActor() || $scope.isCreator());\r\n  }\r\n\r\n  $scope.setActor = function ()\r\n  {\r\n    $scope.packData.actor = user;\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Result\');\r\n    api.links.createU2B(user.id,\'ACTOR\',$scope.bud.id);\r\n  };\r\n\r\n  $scope.unsetActor = function ()\r\n  {\r\n    $scope.packData.actor = undefined;\r\n    api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Result\');\r\n    api.links.deleteU2B(user.id,\'ACTOR\',$scope.bud.id);\r\n  };\r\n\r\n});\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-results/view-controller.js\n ** module id = 35\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-results/view-controller.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n/**\r\n * Bud Info\r\n */\r\n\r\nangular\r\n    .module(\'qibud.org.infos\', [\r\n      \'ui.router\',\r\n      \'ui.bootstrap\',\r\n      \'qibud.common\'\r\n    ])\r\n    .config(function ($stateProvider, $urlRouterProvider) {\r\n      $stateProvider\r\n          .state(\'bud.viewer.Info\', {\r\n            url: \'/idea\',\r\n            views: {\r\n              \'summary\':{\r\n                templateUrl: \'budPacks/qibud-org-infos/view.html\',\r\n                controller: \'InfoViewerCtrl\'\r\n              }\r\n            },\r\n            breadcrumb: {\r\n              class: \'highlight\',\r\n              text: \'Bud Info\',\r\n              stateName: \'bud.viewer.Info\'\r\n            },\r\n          });\r\n    });\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-infos/pack.js\n ** module id = 36\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-infos/pack.js?');  /***/
  },
  function (module, exports, __webpack_require__) {
    eval('\'use strict\';\r\n\r\n/**\r\n * __\r\n */\r\n\r\nangular.module(\'qibud.org.infos\').controller(\'InfoViewerCtrl\',\r\nfunction ($scope, $state, $stateParams, $location, api)\r\n{\r\n  var user       = $scope.common.user;\r\n  $scope.packData = {\r\n    state: \'Unshared\'\r\n  };\r\n  var afterLoad = function (done) {\r\n    api.buds.budPacksData.get($scope.bud.id, \'Info\')\r\n    .success(function (packData)\r\n      {\r\n        if(packData.state) {\r\n          $scope.packData = packData;\r\n          console.log(\'packdata found:\' + packData);\r\n          if ($scope.shareCount > 0) {\r\n            $scope.packData.state = \'Shared\';\r\n          } else {\r\n            $scope.packData.state = \'Unshared\';\r\n          }\r\n          if ($scope.bud.sponsors) {\r\n            if ($scope.bud.sponsors.length > 0){\r\n              $scope.packData.state = \'Relevant\';\r\n            }\r\n          }\r\n          api.buds.budPacksData.set($scope.bud.id, $scope.packData, \'Info\');\r\n          done ();\r\n        } else {\r\n          api.buds.budPacksData.create($scope.bud.id, $scope.packData, \'Info\');\r\n          done ();\r\n        }\r\n      })\r\n      .error(function ()\r\n    {\r\n      console.log(\'error while loading packdata\');\r\n      done ();\r\n    });\r\n\r\n    api.buds.sharesChanged.subscribe($scope, function (bud) {\r\n      if ($scope.bud.id === bud.id)\r\n      {\r\n        $scope.load (afterLoad);\r\n      }\r\n    });\r\n\r\n    api.buds.sponsorsChanged.subscribe($scope, function (bud) {\r\n      if ($scope.bud.id === bud.id)\r\n      {\r\n        $scope.load (afterLoad);\r\n      }\r\n    });\r\n  };\r\n\r\n  $scope.load (afterLoad);\r\n\r\n\r\n\r\n\r\n});\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./client/budPacks/qibud-org-infos/view-controller.js\n ** module id = 37\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./client/budPacks/qibud-org-infos/view-controller.js?');  /***/
  }  /******/
]));