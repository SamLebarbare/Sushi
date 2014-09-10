'use strict';

/**
 * Editor module for buds
 */

angular
    .module('qibud.editor', [
      'ui.router',
      'monospaced.elastic',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/home");
      $stateProvider
          .state('editor', {
            title: 'Qibud Editor',
            url: "/editor",
            templateUrl: 'modules/editor/editor.html',
            controller: 'EditorCtrl'
      });
    });
