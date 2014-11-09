'use strict';

/**
 * Editor module for buds
 */

angular
    .module('qibud.viewer', [
      'ui.router',
      'ui.bootstrap',
      'monospaced.elastic',
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
