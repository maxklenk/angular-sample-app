# angular-sample-app [![Dependency Status](https://gemnasium.com/maxklenk/angular-sample-app.svg)](https://gemnasium.com/maxklenk/angular-sample-app) [![Build Status](https://travis-ci.org/maxklenk/angular-sample-app.svg?branch=master)](https://travis-ci.org/maxklenk/angular-sample-app) [![Circle CI](https://circleci.com/gh/maxklenk/angular-sample-app.svg?style=svg)](https://circleci.com/gh/maxklenk/angular-sample-app)

AngularJS seed app with an optimized build system to get started right away.

## Development

Install global dependencies...
```
sudo npm install -g gulp
sudo npm install -g bower
```

...and the project specific dependencies.
```
npm install
bower install
```

By running gulp commands inside the vm you are able to build, test and deploy the application.
```
gulp              # build the webapp (for local usage) and proxies it to :9001 for live reload
gulp test         # test the webapp with unit tests
gulp git-deploy --production   # deploy the webapp to a remote server
```
You can define the used environment by adding:
```
--development # (default) local
--production  # production configuration, deploys to branch gh-pages
```

Release:
Before releasing always check:
- `gulp jshint` runs without problems
- `gulp test` runs without failing tests

Then release using:
```
gulp release
```
The code will be tested and deployed from the CI, just lean back and enjoy.


## App Structure

### Folders

```
.publish  # gets generated in deployment process to create deployment branch 
app       # contains the source code of the webapp
  bower_components  # javascript dependencies of the frontend
  components        # different parts of the webapp
    _blocks             # directives which are used all over the system
    _lang               # translation files
    _layout             # basic page layout
    _validators         # custom input validators
    ...
  fonts             # custom icon fonts in different formats
  scss              # basic style configurations which are used in the entire webapp
coverage  # gets generated while unit testing to access coverage reports in html
dist      # gets generated in build process webservers or gulp server show its content
node_modules  # build dependencies
```
