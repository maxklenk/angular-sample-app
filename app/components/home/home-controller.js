'use strict';

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
