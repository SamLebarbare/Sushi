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
          .state('home', {
            title: 'Dashboard',
            breadcrumb: {
              class: 'highlight',
              text: 'Dashboard',
              stateName: 'home'
            },
            url: "/home",
            templateUrl: 'modules/home/home.html',
            controller: 'HomeCtrl'
      });
    });
