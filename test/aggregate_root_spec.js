require('jsclass');
JS.require('JS.Class');

var should = require("chai").should(),
    Event = require("../lib/robolympics/core/event"),
    test = require("./test_utils.js");

describe('AggregateRoot', function () {

  describe('#new', function () {
    it("should expose it's arguments as properties", function () {
      var aggregateId = "xyz";
      var sut = test.TestAggregate.new({aggregateId:aggregateId});
      sut.should.have.property("aggregateId", aggregateId);
    });

    it("should generate an aggregate id when omitted", function () {
      var sut = test.TestAggregate.new();
      sut.should.have.property("aggregateId");
    });
  });

  describe('#initialize', function () {
    it("should not expose it's arguments as properties", function () {
      var aggregateId = "xyz";
      var sut = new test.TestAggregate({aggregateId:aggregateId});
      sut.should.not.have.property("aggregateId");
    });
  });

  describe("applying events", function () {
    var sut, aggregateId;

    beforeEach(function () {
      aggregateId = "xyz";
      sut = test.TestAggregate.new({aggregateId:aggregateId});
    });

    it("should generate an event with the correct aggregateId", function () {
      sut.generateEvent("some value");
      sut.uncommittedEvents.should.have.lengthOf(1);
      sut.uncommittedEvents[0].should.have.property("aggregateId", aggregateId);
    });

    it("should generate an event without a payload", function () {
      sut.generateEventWithoutPayload();
      sut.uncommittedEvents.should.have.lengthOf(1);
    });

    it("should start with sequence number 1", function() {
      sut.generateEvent("some value");
      sut.uncommittedEvents[0].should.have.property("sequenceNumber", 1);
    });

    it("should increment sequence numbers", function() {
      sut.generateEvent("some value");
      sut.generateEvent("another value");
      sut.uncommittedEvents[0].should.have.property("sequenceNumber", 1);
      sut.uncommittedEvents[1].should.have.property("sequenceNumber", 2);
    });

  });

  describe("loading from history", function () {

    it("should continue sequence numbering when history is loaded", function() {
      var sut = test.TestAggregate.loadFromHistory([new Event("TestCreatedEvent", {payload: {aggregateId: "xyz", sequenceNumber: 1, name: "TestCreatedEvent"}})]);
      sut.generateEvent("some value");
      sut.uncommittedEvents[0].should.have.property("sequenceNumber", 2);
    });

    it("should give an error when trying to load from history without events", function() {
      (function(){
        test.TestAggregate.loadFromHistory();
      }).should.throw("Empty events");
    });

    it("should give an error when trying to load from history with an empty events array", function() {
      (function(){
        test.TestAggregate.loadFromHistory([]);
      }).should.throw("Empty events");
    });

    it("should work with our own event objects, don't depend on other code");

  });

});