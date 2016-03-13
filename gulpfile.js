// gulp-modular configuration
var argv = require('yargs').argv;
var gulp = require('gulp');
var gulpModular = require('gulp-modular');
var gulpModularKarma = require('gulp-modular-karma');
var gulpModularRelease = require('gulp-modular-release');
var runSequence = require('run-sequence');
var fs = require('fs');

var getPackageJson = function() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

var version = getPackageJson().version;
var versionLocal = version + '-local';

// environments allow to use different configurations for development and production
// * specify your dynamic variables
// * reference them using env.VARIABLE in your config object
var environments = {
  development: {
    rev: false,
    uglify: false,
    deployBranch: undefined,
    index: {
      APP: 'sampleApp',
      STOMT: 'angular-sample-app',
      VERSION: versionLocal,
      BASE: '/'
    },
    constants: {
      ENV: {
        name: 'development',
        version: version + '-local',
        html5Mode: true,
        apiEndpoint: 'http://rest.local.com'
      }
    }
  },
  production: {
    rev: true,
    uglify: true,
    deployBranch: 'gh-pages',
    index: {
      APP: 'sampleApp',
      STOMT: 'angular-sample-app',
      VERSION: version,
      BASE: '/angular-sample-app/'
    },
    constants: {
      ENV: {
        name: 'production',
        version: version,
        html5Mode: true,
        apiEndpoint: 'https://rest.domain.com'
      }
    }
  }
};

/// START: SET ENVIRONMENT FLAG
var env = environments.development;
for (var index in environments) {
  if (!!argv[index]) {
    env = environments[index];
  }
}
/// END: SET ENVIRONMENT FLAG


var config = {

  /***** General *****/

  //// task `build` executes the following tasks (if activated): `index`, `images`, `statics`
  build: {
    //  dest: 'dist/', // point to the distribution folder
    //  bowerjson: 'bower.json', // path to the bower.json file
    uglify: env.uglify, // minifies and compresses generated files
    rev: env.rev, // append random revision postfixes to generated files
    //  bowerDebug: false, // prints gulp pipes from included bower files
    //  sourceMapPath: '.' // default (relative) path to place sourcemaps
    //  cdn: env.index.CDN
  },

  //// task `index` automatically injects files and variables into the index file
  index: env.index,

  //// task [`clean`] provides removal of build artifacts
  clean: {
    //  dest: 'dist/' // glob pointing to all build artifacts
  },

  /***** Management and Processing of Dependencies *****/

  //// [`bower`] registers tasks `bower:install` and `bower:prune` for package management by bower
  bower: null,

  //// task [`bowerFonts`] collects fonts from bower dependencies and stores them in a dedicated distribution folder
  //bowerFonts: {
  //  dest: 'dist/fonts/' // destination of the font files
  //},

  //// task [`bowerScripts`] collects scripts from bower dependencies stores them in a dedicated distribution folder
  bowerScripts: {
    //  dest: 'dist/js/' // destination of the concat file `vendor.js` (and associated sourcemaps file)
  },

  //// task [`bowerStyles`] collects styles from bower dependencies and stores them in a dedicated distribution folder
  bowerStyles: {
    //  dest: 'dist/css/' // destination of the concat file `vendor.css` (and associated sourcemaps file)
  },

  /***** Processing of User Space *****/

  //// task [`statics`] collects all "static" files and stores them in a dedicated distribution folder
  statics: {
    //  src: ['app/.htaccess', 'app/favicon.ico', 'app/robots.txt'], // glob that points to all static files
    //  dest: 'dist/' // destination of the static files
  },

  //// task [`images`] collects, flattens and minifies graphics
  images: {
    //  src: 'app/components/**/*.{png,jpg,jpeg,gif,svg,ico}', // glob that points to all images
    //  dest: 'dist/images/' // destination of the image files
  },

  //// task [`fonts`] collects fonts and stores them in a dedicated distribution folder
  fonts: {
    //  src: 'app/fonts/**/*.{otf,eot,svg,ttf,woff}', // glob that points to all fonts
    //  dest: 'dist/fonts/' // destination of the font files
  },

  //// task [`scripts`] collects scripts, runs several transformations and concatenates everything
  scripts: {
    src: ['app/components/**/*.js', '!app/components/**/*_test.js'], // glob that points to all scripts (except tests)
    //  dest: 'dist/js/', // destination of the concat file `scripts.js` (and associated sourcemaps file)
    //  ng2html: { // adds ng2html and saves all html partials right into the AngularJS $templateCache
    //    src: 'app/components/**/*.html', // glob that points to all partials
    //    prefix: 'components/', // prefix of the URL path
    //    name: 'app.templates' // the module name that contains the partials
    //  },
    ngConstant: { // adds ngConstant to dynamically add variables to your AngularJS app
      constants: env.constants, // the object that contains the variables
      name: 'app.config' // the module name that contains the variables
    }
  },

  //// task [`styles`] collects styles (.scss), runs several transformations and concatenates everything
  styles: {
    src: 'app/scss/style.scss', // root SCSS file (imports are inside)
    files: 'app/**/*.scss', // all SCSS files that have to be watched for changes
    //  dest: 'dist/css/' // destination of the concat file `style.css` (and associated sourcemaps file)
  },

  /***** Serving *****/

  //// [`serve`] registers tasks `browserSync` to serve the app and `watch` to reload the app on detected file changes
  serve: {
    //  root: 'dist/', // the root of the local server
    //  port: 3000, // the port of the local server
    //  proxy: undefined, // host of locally served app that should be proxied to allow livereload
    //  watch: true // deactivates watches and automatic browser reloading
  },

  /***** Deployment *****/

  //// task [`gitDeploy`] deploys to a specific branch in your git repository
  gitDeploy: {
    //  src: 'dist/', // the local root of the deploy repo
    branch: env.deployBranch // specifies git repository branch to deploy to
  },

  //// task [`mavenInstall`] allows to install maven packages locally
  //mavenInstall: {
  //  src: '.', root of the maven package
  //  config: {} // the maven package config
  //},

  //// task [`mavenDeploy`] allows to add maven packages to a remote server
  //mavenDeploy: {
  //  src: '.', root of the maven package
  //  config: {}, // the maven package config
  //  repo: {} // the remove maven package repository
  //},

  /***** Testing *****/

  //// task [`jshint`] lints code with respect to your `.jshintrc` files
  jshint: {
    //  src: 'app/components/**/*.js' // glob specifying what to lint
  },

  //// task ['karma'] performs unit tests on project
  karma: {
    src : __dirname + '/karma.conf.js',
    //  browsers: ['PhantomJS', 'Firefox', 'Chrome']
  },

  //// task [`release`] creates a new release
  release: {
    //  versionNumber: argv.v, // the version number of the new release
    //  bumpFiles: ['./package.json', './bower.json'], // write version number to these files
    //  changelogFile: './CHANGELOG.md', // generate changelog in this file
    //  conventionalChangelog: 'angular', // choose preset style like: : 'angular', 'atom', 'eslint', 'jscs', 'jshint'
    //  commitMessage: 'bump version number ' + argv.v, // message of bump commit
    //  tagPrefix: '', // define a prefix like 'v' for the git tag
    //  masterBranch: 'master', // the projects master branch
    //  developBranch: 'develop', // the projects develop branch
    //  releaseBranch: 'release/' + argv.v // the release branch created while releasing
    //  push: false // push changes after release
  }

};

// start gulp modular and pass in config
gulpModular(gulp, config);
gulpModularKarma(gulp, config);
gulpModularRelease(gulp, config);


// gulp deploy
// build project and push result to server
gulp.task('deploy', function() {
  runSequence('clean', 'git-deploy');
});
