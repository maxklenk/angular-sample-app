;(function() {
"use strict";

'use strict';

angular
  .module('sampleApp', [
    'app.config',
    'app.templates',

    'ui.router',
    'angulartics',
    'tandibar/ng-rollbar',
    'angulartics.google.analytics'
  ])

  // Track Errors (Rollbar)
  .config(["RollbarProvider", "ENV", function(RollbarProvider, ENV) {
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
  }])

  // Track pages (Google Analytics)
  .config(["$analyticsProvider", function($analyticsProvider) {
    // turn off automatic tracking
    $analyticsProvider.virtualPageviews(false);
  }])
  .run(["$rootScope", "$location", "$analytics", function($rootScope, $location, $analytics) {
    $rootScope.$on('$stateChangeSuccess', function() {
      $analytics.pageTrack($location.path());
    });
  }]);
}());

;(function() {
"use strict";

'use strict';

angular
  .module('sampleApp')
  .controller('HeaderCtrl', HeaderCtrl);

function HeaderCtrl() {
  //var vm = this;

  activate();

  ////////////

  function activate() {}

}
}());

;(function() {
"use strict";

'use strict';

angular
  .module('sampleApp')
  .service('Head', Head);

function Head() {

  var service = {
    metadata: {},
    updatePage: updatePage,
    updateNotFound: updateNotFound,
    updateMoved: updateMoved
  };
  return service;

  ////////////////

  function resetMetadata() {
    // tags
    service.metadata.pageTitle =  'stomt.com';
    //metadata.canonicalUrl =  'https://www.stomt.com';
    service.metadata.tags =  {};

    // prerender
    service.metadata.statusCode =  200;
    service.metadata.redirect =  null;
  }

  function updatePage(page) {
    resetMetadata();

    // tags
    service.metadata.pageTitle = page.title;
    service.metadata.tags = {
      description: page.description
    };
  }

  function updateNotFound() {
    resetMetadata();

    // tags
    service.metadata.pageTitle = 'Page does not exist';
    service.metadata.tags = {
      description: 'Not Found - 404'
    };

    // prerender
    service.metadata.statusCode = 404;
  }

  function updateMoved(redirect) {
    resetMetadata();

    // tags
    service.metadata.pageTitle = 'The page has been moved';
    service.metadata.tags = {
      description: 'Moved - 301'
    };

    // prerender
    service.metadata.statusCode = 301;
    service.metadata.redirect = redirect;
  }
}
}());

;(function() {
"use strict";

'use strict';

HeadCtrl.$inject = ["Head"];
angular
  .module('sampleApp')
  .controller('HeadCtrl', HeadCtrl);

function HeadCtrl(Head) {
  var vm = this;

  vm.metadata = Head.metadata;

  activate();

  ////////////

  function activate() {}

}
}());

;(function() {
"use strict";

(function(module) {
try {
  module = angular.module('app.templates');
} catch (e) {
  module = angular.module('app.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/_layout/header/header.html',
    '<a href="" ui-sref="app.home">Home</a>');
}]);
})();
}());

;(function() {
"use strict";

(function(module) {
try {
  module = angular.module('app.templates');
} catch (e) {
  module = angular.module('app.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/_layout/footer/footer.html',
    '<footer>2015 - angular sample app</footer>');
}]);
})();
}());

;(function() {
"use strict";

'use strict';

HomeCtrl.$inject = ["Head"];
angular
  .module('sampleApp')
  .controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Head) {
  var vm = this;

  vm.name = 'Peter';

  activate();

  ////////////

  function activate() {
    Head.updatePage({
      title: 'Homepage',
      description: 'Entry point into app'
    });
  }

}
}());

;(function() {
"use strict";

(function(module) {
try {
  module = angular.module('app.templates');
} catch (e) {
  module = angular.module('app.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/home/home.html',
    '<h1 class="flaticon-orientation51">Welcome {{homeCtrl.name}}</h1><a href="https://github.com/maxklenk/angular-sample-app" title="fork on Github"><img src="https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Fork"></a> <img src="images/logo.png">');
}]);
})();
}());

;(function() {
"use strict";

'use strict';

statesConfiguration.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "ENV"];
http401Interceptor.$inject = ["$q", "$location"];
checkAuth.$inject = ["$rootScope", "$state"];
angular
  .module('sampleApp')
  .config(statesConfiguration)
  .run(checkAuth);

/* @ngInject */
function statesConfiguration($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, ENV) {

  $stateProvider

    // landing (login/register)
    .state('landing', {
      url: '/landing',
      requireAuth: false,
      views: {
        container: {
          templateUrl: 'components/landing/landing.html',
          controller: 'LandingCtrl',
          controllerAs: 'landingCtrl'
        }
      }
    })


    ////////////
    // IN APP //
    ////////////
    .state('app', {
      abstract: true,
      views: {
        header: {
          templateUrl: 'components/_layout/header/header.html',
          controller: 'HeaderCtrl',
          controllerAs: 'headerCtrl'
        },
        footer: {
          templateUrl: 'components/_layout/footer/footer.html'
        }
      }
    })

    // home
    .state('app.home', {
      url: '/',
      requireAuth: true,
      views: {
        'container@': {
          templateUrl: 'components/home/home.html',
          controller: 'HomeCtrl',
          controllerAs: 'homeCtrl'
        }
      }
    });

  /* @ngInject */
  $urlRouterProvider.otherwise(function() {
    // UserService & $state not available during .config(), inject them (manually) later

    // requesting unknown page unequal to '/'
    // var path = $location.path();
    // if (path !== '/') {
    //   $injector.get('$state').go('404');
    //   return path; // this trick allows to show the error page on unknown address
    // }

    // go to '/' and check logged in status there
    return '/';
  });

  $locationProvider
    .html5Mode(ENV.html5Mode)
    .hashPrefix('!');

  $httpProvider.interceptors.push(http401Interceptor);
}

// go to index.login when response 401 arrives
/* @ngInject */
function http401Interceptor($q, $location) {
  return {
    responseError: function(rejection) {
      /* istanbul ignore else */
      if (rejection.status === 401) {
        if ($location.path() !== '/index') {
          $location.path('/index'); //.search('returnTo', $location.path());
        }
      }
      return $q.reject(rejection);
    }
  };
}

// go to landing if not logged in
/* @ngInject */
function checkAuth($rootScope, $state) {
  $rootScope.$on('$stateChangeStart',
    function(event, toState) {

      // auth required for next page? if so, check auth
      if (toState.requireAuth && !isLoggedIn()) {
        event.preventDefault();

        $state.go('landing');

        // avoid access to landing if logged in
      } else if (toState.name === 'landing' && isLoggedIn()) {
        event.preventDefault();
        $state.go('app.home');
      }
    });
}

function isLoggedIn() {
  return true;
}
}());

;(function() {
"use strict";

angular.module("app.config", [])

.constant("ENV", {
	"name": "development",
	"version": "0.0.0-local",
	"html5Mode": true,
	"apiEndpoint": "http://rest.local.com"
})

;
}());

//# sourceMappingURL=scripts.js.map
