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

  api.types = {
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
