'use strict';

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
