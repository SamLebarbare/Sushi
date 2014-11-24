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
