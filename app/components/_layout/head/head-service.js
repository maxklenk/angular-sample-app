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
