'use strict';

/**
 * Editor module for sushis
 */

angular
    .module('sushi.viewer', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
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
        name: 'sushi.viewer',
        sticky: true,
        url: '/viewer/:sushiId',
        views: availableViews,
        breadcrumb: {
          class: 'highlight',
          text: 'Sushi Viewer',
          stateName: 'sushi.viewer'
        } });

      angular.forEach(states, function(state) { $stateProvider.state(state); });
    });
