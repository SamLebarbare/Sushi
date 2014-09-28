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
      $stateProvider
          .state('editor', {
            title: 'Qibud Editor',
            url: "/editor/:budId",
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Editor',
              stateName: 'editor'
            },
            templateUrl: 'modules/editor/editor.html',
            controller: 'EditorCtrl'
      });
    });
