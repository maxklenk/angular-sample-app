'use strict';

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


