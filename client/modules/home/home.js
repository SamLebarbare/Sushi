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
      .state('home.sushilist', {
        title: 'Sushi list',
        breadcrumb: {
          class: 'highlight',
          text: 'Sushi list',
          stateName: 'home.sushilist'
        },
        url: "/list",
        templateUrl: 'modules/home/home-list.html',
        controller: 'HomeCtrl'
      })
      .state('home.mysushis', {
        title: 'My Sushis',
        breadcrumb: {
          class: 'highlight',
          text: 'My sushis',
          stateName: 'home.mysushis'
        },
        url: "/mysushis",
        templateUrl: 'modules/home/mysushis-list.html',
        controller: 'MySushisCtrl'
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
      .state('home.sushigraph', {
        title: 'Sushi Graph',
        breadcrumb: {
          class: 'highlight',
          text: 'Sushi Graph',
          stateName: 'home.sushigraph'
        },
        url: "/sushigraph",
        templateUrl: 'modules/home/home-sushigraph.html',
        controller: 'SushigraphCtrl'
      })
      .state('home.socialgraph', {
        title: 'Social Graph',
        breadcrumb: {
          class: 'highlight',
          text: 'Social Graph',
          stateName: 'sushi.home.socialgraph'
        },
        url: "/socialgraph",
        templateUrl: 'modules/home/home-socialgraph.html',
        controller: 'SocialgraphCtrl'
      })
      .state('home.timeline', {
        title: 'Sushi Timeline',
        breadcrumb: {
          class: 'highlight',
          text: 'Sushi Timeline',
          stateName: 'sushi.home.timeline'
        },
        url: "/timeline",
        templateUrl: 'modules/home/home-timeline.html',
        controller: 'TimelineCtrl'
      });
    });
