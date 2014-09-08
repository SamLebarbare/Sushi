'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('qibud.home', [
      'ngRoute',
      'monospaced.elastic',
      'qibud.common'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            title: 'Qibud Home',
            templateUrl: 'modules/home/home.html',
            controller: 'HomeCtrl'
          });
    });
