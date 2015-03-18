'use strict';

/**
 * Service for providing access the backend API via HTTP and WebSockets.
 */

angular.module('sushi.common').factory('api', function ($rootScope, $http, $window, $upload) {

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

  api.userupdate = event();

  // api http endpoints and websocket events
  api.sushis = {
    search: function (query) {
      return $http({method: 'GET', url: apiBase + '/sushis/search/'+ query,headers: headers});
    },
    childrenByType: function (sushiId,type) {
      return $http({method: 'GET', url: apiBase + '/sushis/'+ sushiId + '/child/' + type, headers: headers});
    },
    parentByType: function (sushiId,type) {
      return $http({method: 'GET', url: apiBase + '/sushis/'+ sushiId + '/parent/' + type, headers: headers});
    },
    list: function () {
      return $http({method: 'GET', url: apiBase + '/sushis', headers: headers});
    },
    view: function (sushiId) {
      return $http({method: 'GET', url: apiBase + '/sushis/' + sushiId + '/view', headers: headers});
    },
    update: function (sushi) {
      return $http({method: 'PUT', url: apiBase + '/sushis/' + sushi.id + '/update', data: sushi, headers: headers});
    },
    updated: event(),
    delete: function (sushiId) {
      return $http({method: 'DELETE', url: apiBase + '/sushis/' + sushiId, headers: headers});
    },
    create: function (sushi) {
      return $http({method: 'POST', url: apiBase + '/sushis', data: sushi, headers: headers});
    },
    createSub: function (parentSushiId, sushi) {
      return $http({method: 'POST', url: apiBase + '/sushis/' + parentSushiId, data: sushi, headers: headers});
    },
    created: event(),
    evolve: function (sushiId, type) {
      return $http({method: 'PUT', url: apiBase + '/sushis/' + sushiId + '/evolve/' + type, headers: headers});
    },
    evolved: event(),
    follow : function(sushi) {
      return $http({method: 'PUT', url: apiBase + '/sushis/' + sushi.id + '/follow', data: sushi, headers: headers});
    },
    unfollow : function(sushi) {
      return $http({method: 'PUT', url: apiBase + '/sushis/' + sushi.id + '/unfollow', data: sushi, headers: headers});
    },
    followersChanged: event(),
    sponsor : function(sushi) {
      return $http({method: 'PUT', url: apiBase + '/sushis/' + sushi.id + '/sponsor', data: sushi, headers: headers});
    },
    unsponsor : function(sushi) {
      return $http({method: 'PUT', url: apiBase + '/sushis/' + sushi.id + '/unsponsor', data: sushi, headers: headers});
    },
    sponsorsChanged: event(),
    support : function(sushi) {
      return $http({method: 'PUT', url: apiBase + '/sushis/' + sushi.id + '/support', data: sushi, headers: headers});
    },
    unsupport : function(sushi) {
      return $http({method: 'PUT', url: apiBase + '/sushis/' + sushi.id + '/unsupport', data: sushi, headers: headers});
    },
    supportersChanged: event(),
    share : function(sushi, users) {
      return $http({method: 'PUT', url: apiBase + '/sushis/' + sushi.id + '/share', data: users, headers: headers});
    },
    sharesChanged: event(),
    sushiPacksData: {
      create : function (sushiId, packData, type) {
        return $http({method: 'POST', url: apiBase + '/sushis/' + sushiId + '/packdata/' + type, data: packData, headers: headers});
      },
      get: function (sushiId, type) {
        return $http({method: 'GET', url: apiBase + '/sushis/' + sushiId + '/packdata/' + type, headers: headers});
      },
      set: function (sushiId, packData, type) {
        return $http({method: 'PUT', url: apiBase + '/sushis/' + sushiId + '/packdata/' + type, data: packData, headers: headers});
      },
      end: function (sushiId, packData, type) {
        return $http({method: 'PUT', url: apiBase + '/sushis/' + sushiId + '/packdata/' + type + '/end', data: packData, headers: headers});
      },
      created: event(),
      updated: event(),
      ended: event()
    },
    comments: {
      create: function (sushiId, comment) {
        return $http({method: 'POST', url: apiBase + '/sushis/' + sushiId + '/comments', data: comment, headers: headers});
      },
      created: event()
    },
    sendByMail: function (sushiId, to) {
      return $http({method: 'POST', url: apiBase + '/sushis/' + sushiId + '/mailto/' + to, headers: headers});
    },
    unload: function (sushiId, fileId) {
      return $http({method: 'DELETE', url: apiBase + '/sushis/' + sushiId + '/attachments/' + fileId, headers: headers});
    },
    upload: function (sushiId, files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          $upload.upload({
            url: apiBase + '/sushis/' + sushiId + '/attachments',
            file: files,
            headers: headers
          });
        }
      }
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
    createB2B : function (sushiId, type, sushiId2) {
      return $http({method: 'POST', url: apiBase + '/links/b2b/' + sushiId + '/' + type + '/' + sushiId2, headers: headers});
    },
    createB2U : function (sushiId, type, userId) {
      return $http({method: 'POST', url: apiBase + '/links/b2u/' + sushiId + '/' + type + '/' + userId, headers: headers});
    },
    createU2B : function (userId, type, sushiId) {
      return $http({method: 'POST', url: apiBase + '/links/u2b/' + userId + '/' + type + '/' + sushiId, headers: headers});
    },
    deleteU2B : function (userId, type, sushiId) {
      return $http({method: 'DELETE', url: apiBase + '/links/u2b/' + userId + '/' + type + '/' + sushiId, headers: headers});
    },
    findU2B : function (userId, type) {
      return $http({method: 'GET', url: apiBase + '/links/u2b/' + userId + '/' + type, headers: headers});
    }
  };

  api.users = {
    list: function () {
      return $http({method: 'GET', url: apiBase + '/users', headers: headers});
    },
    get: function (userId) {
      return $http({method: 'GET', url: apiBase + '/users/' + userId, headers: headers});
    },
  };

  api.actors = {
    list: function (includeMe) {
      var me = false;
      if(includeMe) {
        me = includeMe;
      }
      return $http({method: 'GET', url: apiBase + '/actors/' + me, headers: headers});
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
