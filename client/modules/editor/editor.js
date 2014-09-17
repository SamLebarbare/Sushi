'use strict';

/**
 * Editor module for buds
 */

angular
    .module('qibud.editor', [
      'ui.router',
      'monospaced.elastic',
      'ngCkeditor',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('editor', {
            title: 'Qibud Editor',
            url: "/editor/:budId",
            templateUrl: 'modules/editor/editor.html',
            controller: 'EditorCtrl'
      });
    });
