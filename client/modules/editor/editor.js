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
          .state('bud.editor', {
            title: 'Qibud Editor',
            url: "/editor?budId&parentBud",
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Editor',
              stateName: 'bud.editor'
            },
            templateUrl: 'modules/editor/editor.html',
            controller: 'EditorCtrl'
      });
    });
