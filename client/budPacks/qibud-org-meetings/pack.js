'use strict';

/**
 * Bud Meeting
 */

angular
    .module('qibud.org.meetings', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Meeting', {
            url: '/Meeting',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-meetings/view.html',
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
