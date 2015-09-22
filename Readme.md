# angular-sample-app

















## Install Development Environment

### Homestead

#### Configuration

Setup Homestead as described in the backend project. Link the web frontend in your `Homestead.yaml`:
```
folders:
    - map: ~/dev/stomt/web
      to: /home/vagrant/web
      
sites:
    - map: dist.stomt
      to: /home/vagrant/web/dist
    - map: stomt
      to: /home/vagrant/web/dist
```
Link the new domains (`stomt`, `dist.stomt`) in your local `hosts` file to the IP 192.168.10.10.


#### LiveReload

Homestead serves the dist folder on http://stomt and http://dist.stomt , to enable livereload via Browsersync access the app on port 9001. [http://www.browsersync.io/](Browsersync) can be configured using port 3001 instead.


#### html5mode

To enable html5mode for the webapp edit the nginx configuration of `dist.stomt`:
Replace the location part of `sudo nano /etc/nginx/sites-available/dist.stomt` with:
```
location / {
       try_files $uri $uri/ /index.html;
    }
```

#### start homestead

Then start and enter the VM and execute everything else inside of Homestead.
```
vagrant up
vagrant ssh
cd web
```

Read on in section [Development](#development).


### Linux/Fedora
https://getfedora.org/ -> Workstation

Caution! Install the software with root rights!
```
su
yum install -y nodejs npm
npm install -g gulp bower
gedit /etc/hosts
paste: 127.0.0.1 dist.stomt
save
service network restart
exit
```

Read on in section [Development](#development).


### Windows

First, read about the diffrent parts of yeoman
http://yeoman.io/gettingstarted.html

Make sure npm is installed. npm is the package manager for Node.js(http://nodejs.org/) and comes bundled with it.

Add to your hosts-file (E.g. C:/Windows/System32/drivers/etc/hosts)
```127.0.0.1 dist.stomt```
This is neccessary for a cleaner 3rd-Party-OAUTH-Plugin-integration like Facebook Connect

```cd project-folder```

Read on in section [Development](#development).


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
gulp          # build the webapp (for local usage) and proxies it to :9001 for live reload
gulp test     # test the webapp with unit tests
gulp deploy   # deploy the webapp to a remote server (requires --testing or --production)
```
You can define the used environment by adding:
```
--development # (default) local backend on http://rest.stomt is used, does not deploy
--testing     # test server https://test.rest.stomt.com is used, deploys to branch deploy/test
--production  # stabel server https:://rest.stomt.com is used, deploys to branch deploy/production
```

Release:
(before releasing make sure `gulp check` runs without error and `gulp deploy --testing` deploys a working solution to https://test.stomt.com) 
```
git tag       # determine which was the last tag to know the next on (eg. 1.3.5)
git flow release start 1.3.5
# update version number in bower.json, package.json and gulpfile.js
git commit -am 'bump version number 1.3.5'
git flow release finish 1.3.5
git push      # push develop branch
git checkout master
git push      # push master branch
git push --tags
git checkout develop
```
The the code can be compiled `gulp deploy --production` and has to be manually deployed on forge.

## App Structure

### Folders

```
.cordova  # required for phonegap builds (currently not used)
.idea     # IDE configurations
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
  images            # all static images used in the webapp
  scss              # basic style configurations which are used in the entire webapp
coverage  # gets generated while unit testing to access coverage reports in html
dist      # gets generated in build process webservers or gulp server show its content
e2e       # definition of e2e tests (currently not used)
gulp_tasks    # reusable tasks of the build process
node_modules  # build dependencies
www           # phonegap build folder (currently not used)
```

### Lifecycle

In addition to the common AngularJS live cycle the files in our app are used in the following way:

1. `app/index.html` loads scripts and compiled css
2. `app/components/app.js` activates dependencies and configures them
3. `app/comonents/_layout/...` elements present on every site get set up
4. `app/components/_layout/base-controller.js` this controller is available from nealy everywhere in the application, it should be as slim as possible
5. `app/components/routes.js` defines the available routes to loads the requests view and controller
6. The view, its subviews, controllers and other dependencies get loaded.

### Components

Our application is separated in multiple components. Each components solves a specific task and may have sub-components.
They follow a strict naming convention for directory, file and factory/service/controller names.
Directory names: `COMPONENT/SUBCOMPONENT` eg. `app/components/stomt/create/`
File names: `COMPONENT-[SUBCOMPONENT]-factory/service/controller[_test].js` eg. `stomt-create-service_test.js`

We will have a look at the stomt component to get to know how a single component is structured:

* `stomt-factory.js` A factory is a angular resource which defines how to query data from the backend
* `stomt-service.js` The service accesses the factory and provides additional functions to modify entities. Even all services in AngularJS are singletons services should be seed as static classes which provide static functions. 
* `stomt-service_text.js` Services should be tested to check thate they produce the expected results and to ensure to write clean, atomic, testable code

Sub-components are most often specific small parts of the view. In this sample the visual appearance and possible interactions with a single stomt item:

* `item/stomt-item.html` The html layout, it accesses the view model of its controller and should not contain any logic except directives like `ng-if`, `ng-show`, `ng-class` and `ng-repeat`.
* `item/stomt-item.scss` Contains the styles for only this component. Colors, sizes and other variables should be configured in `scss/foundation/_config.scss` and be referenced in the components.
* `item/stomt-item-controller.js` The controller connects the view to the services by accessing state variables and requesting the corresponding server data form the services. It may contain simple functions but most functions should only be references to functions provide by services.



## GIT COMMITTING GUIDELINES

We follow [git-flow](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/) to automate our git branching workflow. Please read their documentation and install the library to have the git subcommands.

Our branches:
* `master` current stable and released version
* `deploy/production` compiled version of the master branch [www.stomt.com](https://www.stomt.com/)
* `develop` fully functional code which could be released at any time
* `deploy/test` compiles version of the develop branch [test.stomt.com](https://test.stomt.com/)
* `feature/XYZ` functionality in development, the branch contains only relevant code changes for a single feature to allow easy code review by others.


## Testing

### Unit Tests

```karma.conf.js``` contains the configuration for running unit tests. We are focusing on testing services and try to reach a high coverage for them, controllers should not contain complex logic and directives usually require to much work to test. 

To execute the unit tests the following commands are available:

```
gulp test         # executes tests in PhantomJS
gulp test:watch   # executes tests in PhantomJS and reruns them whenever files change
gulp test:all     # executes tests in PhantomJS, Firefox and Chrome
```

### e2e Tests (currently not used)

To run e2e Tests using protractor a selenium server has to be installed (https://github.com/angular/protractor#appendix-a-setting-up-a-standalone-selenium-server)

```protractor.conf.js``` contains the configuration for running unit tests.

To run all tests stored in ```test/e2e/**/*.js``` enter ```gulp e2e```.


## Phonegap (currently not used)
The App can be build and downloaded on https://build.phonegap.com/

Install Phonegap globally:
```sudo npm install -g phonegap```

Register with build.phonegap:
```phonegap remote login -u [USER] -p [PASSWORD]```

Create a build of the WebApp:
```grunt phonegap```

Start the remote build of the app:
```phonegap remote build android```

You can now download the new build app on https://build.phonegap.com/apps
