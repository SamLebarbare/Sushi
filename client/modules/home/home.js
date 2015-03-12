'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('sushi.home', [
      'ui.router',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
      .state('home.budlist', {
        title: 'Bud list',
        breadcrumb: {
          class: 'highlight',
          text: 'Bud list',
          stateName: 'home.budlist'
        },
        url: "/list",
        templateUrl: 'modules/home/home-list.html',
        controller: 'HomeCtrl'
      })
      .state('home.mybuds', {
        title: 'My Buds',
        breadcrumb: {
          class: 'highlight',
          text: 'My buds',
          stateName: 'home.mybuds'
        },
        url: "/mybuds",
        templateUrl: 'modules/home/mybuds-list.html',
        controller: 'MyBudsCtrl'
      })
      .state('home.invitations', {
        title: 'Invitations',
        breadcrumb: {
          class: 'highlight',
          text: 'Invitations list',
          stateName: 'home.invitations'
        },
        url: "/invitations",
        templateUrl: 'modules/home/invitations-list.html',
        controller: 'InvitationsCtrl'
      })
      .state('home.assignments', {
        title: 'Assignments',
        breadcrumb: {
          class: 'highlight',
          text: 'Assignments list',
          stateName: 'home.assignments'
        },
        url: "/assignments",
        templateUrl: 'modules/home/assignments-list.html',
        controller: 'AssignmentsCtrl'
      })
      .state('home.budgraph', {
        title: 'Bud Graph',
        breadcrumb: {
          class: 'highlight',
          text: 'Bud Graph',
          stateName: 'home.budgraph'
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
