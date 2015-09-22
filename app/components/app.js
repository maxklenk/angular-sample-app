'use strict';

angular
  .module('sampleApp', [
    'sampleApp.config',
    'sampleApp.templates',

    'ui.router',
    'angulartics',
    'tandibar/ng-rollbar',
    'angulartics.google.analytics'
  ])

  // Track Errors (Rollbar)
  .config(function(RollbarProvider, ENV) {
    // report errors on deployed systems
    if (ENV.name !== 'development') {
      RollbarProvider.init({
        accessToken: 'XXX',
        captureUncaught: true,
        payload: {
          environment: ENV.name,
          client: {
            javascript: {
              source_map_enabled: true,
              code_version: ENV.version,
              guess_uncaught_frames: true
            }
          }
        }
      });
    }
  })

  // Track pages (Google Analytics)
  .config(function($analyticsProvider) {
    // turn off automatic tracking
    $analyticsProvider.virtualPageviews(false);
  })
  .run(function($rootScope, $location, $analytics) {
    $rootScope.$on('$stateChangeSuccess', function() {
      $analytics.pageTrack($location.path());
    });
  });
