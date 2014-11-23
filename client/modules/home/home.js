'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('qibud.home', [
      'ui.router',
      'monospaced.elastic',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
      .state('bud.home', {
        title: 'Dashboard',
        breadcrumb: {
          class: 'highlight',
          text: 'Qibud',
          stateName: 'bud.home'
        },
        url: "/home",
        templateUrl: 'modules/home/home.html',
        controller: 'HomeCtrl'
      })
      .state('bud.home.budgraph', {
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
      .state('bud.home.timeline', {
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
