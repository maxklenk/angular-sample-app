'use strict';

var version = '0.0.0';

var argv = require('yargs').argv;
var gulp = require('gulp');
var modular = require('gulp-modular');
var runSequence = require('run-sequence');

// gulp-modular tasks
var tasks = [
  'clean',

  'fonts',
  'bowerFonts',

  'sass',
  'styles',
  'bowerStyles',

  'scripts',
  'bowerScripts',
  'configScripts',

  'partials',
  'images',
  'statics',
  'index',

  'karma',
  'jshint',

  'browserSync',
  'watch',

  'gitDeploy',
  'bower'
];

var environments = {
  development: {
    rev: false,
    uglify: false,
    deployBranch: false,
    constants: {
      ENV: {
        name: 'development',
        version: version + '-local',
        html5Mode: true,
        apiEndpoint: 'http://rest.stomt'
      }
    }
  },
  testing: {
    rev: true,
    uglify: true,
    deployBranch: 'deploy/test',
    constants: {
      ENV: {
        name: 'testing',
        version: version + '-' + Math.floor((Math.random() * 1000000)),
        html5Mode: true,
        apiEndpoint: 'https://test.rest.stomt.com'
      }
    }
  },
  production: {
    rev: true,
    uglify: true,
    deployBranch: 'deploy/production',
    constants: {
      ENV: {
        name: 'production',
        version: version,
        html5Mode: true,
        apiEndpoint: 'https://rest.stomt.com'
      }
    }
  }
};

// ENVIRONMENT FLAG
var env = environments.development;
for (var index in environments) {
  if (!!argv[index]) {
    env = environments[index];
  }
}

// ANGULAR MODULE NAMES
var appName      = 'sampleApp';
var configName   = 'sampleApp.config';
var templateName = 'sampleApp.templates';

// BASES AND PATHS
//
var bases = {
  app: 'app/',
  dist: 'dist/'
};

var app = {
  config: 'env_config.json',
  js: [
    bases.app + 'components/app.js',
    bases.app + 'components/**/*.js',
    '!' + bases.app + 'components/**/*_test.js'
  ],
  scss: bases.app + '/scss/style.scss',
  scssAll: [bases.app + '/scss/**/*.scss', bases.app + 'components/**/*.scss'],
  alljs: [
    bases.app + 'components/**/*.js', // app
    '*.js',                           // config
    'gulp_tasks/*.js'                 // gulp tasks
    //'e2e/**/*.js'                   // e2e tests
  ],
  index: bases.app + 'index.html',
  fonts: bases.app + 'fonts/*',
  images: bases.app + 'components/**/*.{png,jpg,jpeg,gif,svg,ico}',
  views: bases.app + 'components/**/*.html',
  statics: [
    bases.app + 'favicon*',
    bases.app + 'robots.txt',
    bases.app + 'google*.html',
  ]
};

var dist = {
  js: bases.dist + 'js/',
  css: bases.dist + 'css/',
  fonts: bases.dist + 'fonts/',
  images: bases.dist + 'images/'
};

// place sourcemap file next to the transpiled file
var sourceMapsPath = '.';

// SERVING CONFIG
//
var port = 3000;
var testingPort = 9002;

var config = {
  env: env,
  bases: bases,
  debug: false,
  bowerjson: 'bower.json',
  app: app,
  dist: dist,
  sourceMapsPath: sourceMapsPath,
  dirname: __dirname,
  port: port,
  testingPort: testingPort,
  appName: appName,
  configName: configName,
  templateName: templateName
};

modular(gulp, tasks, config);

// gulp deploy
// build project and push result to server
gulp.task('deploy', function() {
  runSequence('clean', 'git-deploy');
});

// gulp check
// runs all kinds of checks
gulp.task('check', function() {
  runSequence('jshint', 'karma');
});
