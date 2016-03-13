describe('Service: Head', function() {

  //////////////////////////////////
  //      SETUP / INJECTION       //
  //////////////////////////////////

  beforeEach(module('sampleApp'));

  // get the service to test
  var Head;
  beforeEach(inject(function(_Head_) {
    Head = _Head_;
  }));

  //////////////////////////////////
  //          UNIT TESTS          //
  //////////////////////////////////

  // metadata
  it('should give access to the metadata.', function() {
    var metadata = Head.metadata;

    // validate result
    expect(metadata).toEqual({});
  });

});
