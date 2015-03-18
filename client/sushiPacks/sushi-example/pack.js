'use strict';
/**
 * products
 */

angular
    .module('sushi.org.products', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('sushi.viewer.Product', {
            url: '/product',
            views: {
              'summary':{
                templateUrl: 'sushiPacks/sushi-org-products/view.html',
                controller: 'ProductViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Product',
              stateName: 'sushi.viewer.Product'
            },
          });
    });
