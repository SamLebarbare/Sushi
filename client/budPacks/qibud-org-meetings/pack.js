'use strict';

/**
 * Bud Meeting
 */

angular
    .module('sushi.org.meetings', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Meeting', {
            url: '/Meeting',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-meetings/view.html',
                controller: 'MeetingViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Meeting',
              stateName: 'bud.viewer.Meeting'
            },
          });
    });
