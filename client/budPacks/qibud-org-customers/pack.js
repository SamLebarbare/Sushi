'use strict';
/**
 * Bud Info
 */

angular
    .module('qibud.org.customers', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Customer', {
            url: '/customer',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-customers/view.html',
                controller: 'CustomerViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Customer',
              stateName: 'bud.viewer.Customer'
            },
          });
    });
