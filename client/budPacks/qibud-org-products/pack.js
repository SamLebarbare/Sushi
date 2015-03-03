'use strict';
/**
 * products
 */

angular
    .module('qibud.org.products', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Product', {
            url: '/product',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-products/view.html',
                controller: 'ProductViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Product',
              stateName: 'bud.viewer.Product'
            },
          });
    });
