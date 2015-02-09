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
      .state('home.budlist', {
        title: 'Bud list',
        breadcrumb: {
          class: 'highlight',
          text: 'Bud list',
          stateName: 'bud.home.list'
        },
        url: "/list",
        templateUrl: 'modules/home/home-list.html',
        controller: 'HomeCtrl'
      })
      .state('home.invitations', {
        title: 'Invitations',
        breadcrumb: {
          class: 'highlight',
          text: 'Invitations list',
          stateName: 'bud.home.list'
        },
        url: "/invitations",
        templateUrl: 'modules/home/invitations-list.html',
        controller: 'InvitationsCtrl'
      })
      .state('home.budgraph', {
        title: 'Bud Graph',
        breadcrumb: {
          class: 'highlight',
          text: 'Bud Graph',
          stateName: 'bud.home.budgraph'
        },
        url: "/budgraph",
        templateUrl: 'modules/home/home-budgraph.html',
        controller: 'BudgraphCtrl'
      })
      .state('home.socialgraph', {
        title: 'Social Graph',
        breadcrumb: {
          class: 'highlight',
          text: 'Social Graph',
          stateName: 'bud.home.socialgraph'
        },
        url: "/socialgraph",
        templateUrl: 'modules/home/home-socialgraph.html',
        controller: 'SocialgraphCtrl'
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
