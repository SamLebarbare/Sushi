'use strict';
/**
 * Bud Info
 */

angular
    .module('sushi.org.customers', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Customer', {
            url: '/customer',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-customers/view.html',
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
